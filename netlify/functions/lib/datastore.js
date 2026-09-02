import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Default configuration constants
const DEFAULT_STARTING_TARGET = 62220;
const DEFAULT_QUALIFYING_MIN_CENTS = 100; // 100 cents = £1.00 / $1.00 minimum pledge
const MAX_AUDIT_LOG_ENTRIES = 500;

export function getStartingTarget() {
  const envVal = parseInt(process.env.STARTING_TARGET_COUNT || '', 10);
  return !isNaN(envVal) && envVal >= 0 ? envVal : DEFAULT_STARTING_TARGET;
}

export function getQualifyingMinCents() {
  const envVal = parseInt(process.env.QUALIFYING_TIER_MIN_CENTS || '', 10);
  return !isNaN(envVal) && envVal >= 0 ? envVal : DEFAULT_QUALIFYING_MIN_CENTS;
}

/**
 * Hash a Patreon Member ID for privacy preservation in audit logs and datastore
 * Follows UK GDPR data minimisation principles
 */
export function hashMemberId(memberId) {
  if (!memberId) return 'unknown_member';
  return crypto.createHash('sha256').update(String(memberId)).digest('hex').slice(0, 16);
}

/**
 * In-Memory & Local File Datastore Provider
 */
class LocalFileStore {
  constructor(filePath) {
    this.filePath = filePath || path.join(process.cwd(), '.data', 'counter_store.json');
    this.memoryState = null;
    this.initStore();
  }

  initStore() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(this.filePath)) {
        const initial = {
          startingTarget: getStartingTarget(),
          remainingCount: getStartingTarget(),
          countedMembers: {}, // memberIdHash -> { firstSeenAt, initialEventId, initialEventType }
          processedEvents: {}, // eventId -> processedAt
          auditLog: [],
          updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(this.filePath, JSON.stringify(initial, null, 2), 'utf8');
        this.memoryState = initial;
      } else {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.memoryState = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[LocalFileStore] Notice: Using in-memory fallback for store:', err.message);
      this.memoryState = {
        startingTarget: getStartingTarget(),
        remainingCount: getStartingTarget(),
        countedMembers: {},
        processedEvents: {},
        auditLog: [],
        updatedAt: new Date().toISOString()
      };
    }
  }

  resetForTesting(initialStarting) {
    const starting = initialStarting !== undefined ? initialStarting : getStartingTarget();
    this.memoryState = {
      startingTarget: starting,
      remainingCount: starting,
      countedMembers: {},
      processedEvents: {},
      auditLog: [],
      updatedAt: new Date().toISOString()
    };
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.memoryState, null, 2), 'utf8');
    } catch (e) {
      // ignore
    }
  }

  read() {
    if (this.memoryState) {
      return this.memoryState;
    }
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.memoryState = JSON.parse(raw);
        return this.memoryState;
      }
    } catch (err) {
      console.error('[LocalFileStore] Error reading file store:', err);
    }
    this.memoryState = {
      startingTarget: getStartingTarget(),
      remainingCount: getStartingTarget(),
      countedMembers: {},
      processedEvents: {},
      auditLog: [],
      updatedAt: new Date().toISOString()
    };
    return this.memoryState;
  }

  write(data) {
    data.updatedAt = new Date().toISOString();
    this.memoryState = data;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('[LocalFileStore] Error writing file store:', err);
      return true;
    }
  }
}

/**
 * Upstash Redis REST Datastore Provider
 */
class UpstashRedisStore {
  constructor(url, token) {
    this.url = url.replace(/\/$/, '');
    this.token = token;
  }

  async command(...args) {
    const res = await fetch(`${this.url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Upstash Redis error [${res.status}]: ${txt}`);
    }
    const data = await res.json();
    return data.result;
  }
}

// Master Unified Datastore Manager
export class Datastore {
  constructor(options = {}) {
    this.redisUrl = options.redisUrl || process.env.UPSTASH_REDIS_REST_URL;
    this.redisToken = options.redisToken || process.env.UPSTASH_REDIS_REST_TOKEN;
    this.localStorePath = options.localStorePath;
    this.mutexQueue = Promise.resolve();
    
    if (this.redisUrl && this.redisToken) {
      this.provider = 'redis';
      this.redis = new UpstashRedisStore(this.redisUrl, this.redisToken);
    } else {
      this.provider = 'local';
      this.local = new LocalFileStore(this.localStorePath);
    }
  }

  resetForTesting(initialStarting) {
    if (this.local) {
      this.local.resetForTesting(initialStarting);
    }
  }

  async getCounterState() {
    const starting = getStartingTarget();

    if (this.provider === 'redis') {
      try {
        const remainingStr = await this.redis.command('GET', 'hli:counter:remaining');
        let remaining = remainingStr !== null ? parseInt(remainingStr, 10) : starting;
        if (isNaN(remaining)) remaining = starting;

        const totalCounted = await this.redis.command('SCARD', 'hli:members:counted') || 0;
        const updatedAt = await this.redis.command('GET', 'hli:counter:updated_at') || new Date().toISOString();

        return {
          remaining: Math.max(0, remaining),
          starting,
          totalCounted: parseInt(totalCounted, 10) || 0,
          updatedAt
        };
      } catch (err) {
        console.error('[Datastore] Redis getCounterState error, falling back:', err);
      }
    }

    const state = this.local.read();
    return {
      remaining: Math.max(0, state.remainingCount ?? starting),
      starting: state.startingTarget ?? starting,
      totalCounted: Object.keys(state.countedMembers || {}).length,
      updatedAt: state.updatedAt || new Date().toISOString()
    };
  }

  async isEventProcessed(eventId) {
    if (!eventId) return false;
    if (this.provider === 'redis') {
      try {
        const exists = await this.redis.command('SISMEMBER', 'hli:events:processed', String(eventId));
        return exists === 1;
      } catch (err) {
        console.error('[Datastore] Redis isEventProcessed error:', err);
      }
    }
    const state = this.local.read();
    return Boolean(state.processedEvents && state.processedEvents[eventId]);
  }

  async isMemberCounted(memberId) {
    if (!memberId) return false;
    const memberHash = hashMemberId(memberId);
    if (this.provider === 'redis') {
      try {
        const exists = await this.redis.command('SISMEMBER', 'hli:members:counted', memberHash);
        return exists === 1;
      } catch (err) {
        console.error('[Datastore] Redis isMemberCounted error:', err);
      }
    }
    const state = this.local.read();
    return Boolean(state.countedMembers && state.countedMembers[memberHash]);
  }

  /**
   * Process a qualifying Patreon membership event with full transactional idempotency
   */
  async processPatreonEvent({ eventId, memberId, eventType, pledgeAmountCents, rawTierName }) {
    // Acquire mutex lock to ensure atomic concurrent execution in single-process or local environment
    const release = await this._acquireMutex();
    try {
      return await this._executeProcessPatreonEvent({ eventId, memberId, eventType, pledgeAmountCents, rawTierName });
    } finally {
      release();
    }
  }

  _acquireMutex() {
    let release;
    const nextPromise = new Promise(resolve => { release = resolve; });
    const currentPromise = this.mutexQueue;
    this.mutexQueue = currentPromise.then(() => nextPromise);
    return currentPromise.then(() => release);
  }

  async _executeProcessPatreonEvent({ eventId, memberId, eventType, pledgeAmountCents, rawTierName }) {
    const timestamp = new Date().toISOString();
    const minCents = getQualifyingMinCents();
    const memberHash = hashMemberId(memberId);
    const starting = getStartingTarget();

    // 1. Check if event was already processed (Delivery Idempotency)
    if (eventId && (await this.isEventProcessed(eventId))) {
      const state = await this.getCounterState();
      const audit = {
        timestamp,
        eventId: eventId || 'none',
        memberIdHash: memberHash,
        eventType,
        previousCount: state.remaining,
        newCount: state.remaining,
        status: 'IDEMPOTENT_IGNORED',
        reason: 'Duplicate delivery of already processed event ID'
      };
      await this.appendAuditLog(audit);
      return {
        success: true,
        changed: false,
        previousCount: audit.previousCount,
        newCount: audit.newCount,
        reason: 'DUPLICATE_EVENT_ID',
        audit
      };
    }

    // 2. Check if member was already counted previously (First-ever paid member rule)
    const alreadyCounted = await this.isMemberCounted(memberId);

    // 3. Check if membership qualifies (Paid threshold)
    const isPaidQualifying = typeof pledgeAmountCents === 'number' && pledgeAmountCents >= minCents;

    // Local file store transaction
    if (this.provider === 'local') {
      const state = this.local.read();
      const prevCount = state.remainingCount ?? starting;
      let newCount = prevCount;
      let status = 'PROCESSED';
      let reason = 'New qualifying paid member';
      let changed = false;

      if (eventId) {
        state.processedEvents[eventId] = timestamp;
      }

      if (alreadyCounted) {
        status = 'IDEMPOTENT_NO_CHANGE';
        reason = 'Member has already been counted towards the goal previously';
      } else if (!isPaidQualifying) {
        status = 'IGNORED_FREE_OR_LOW_TIER';
        reason = `Pledge amount (${pledgeAmountCents} cents) does not meet minimum qualifying threshold (${minCents} cents)`;
      } else {
        // Valid first-ever qualifying member!
        newCount = Math.max(0, prevCount - 1);
        state.remainingCount = newCount;
        state.countedMembers[memberHash] = {
          firstSeenAt: timestamp,
          initialEventId: eventId || 'direct',
          initialEventType: eventType,
          pledgeAmountCents,
          tierName: rawTierName || 'Standard Supporter'
        };
        changed = true;
      }

      const auditRecord = {
        timestamp,
        eventId: eventId || 'none',
        memberIdHash: memberHash,
        eventType: eventType || 'unknown',
        previousCount: prevCount,
        newCount,
        status,
        reason
      };

      state.auditLog.unshift(auditRecord);
      if (state.auditLog.length > MAX_AUDIT_LOG_ENTRIES) {
        state.auditLog = state.auditLog.slice(0, MAX_AUDIT_LOG_ENTRIES);
      }

      this.local.write(state);

      return {
        success: true,
        changed,
        previousCount: prevCount,
        newCount,
        status,
        reason,
        audit: auditRecord
      };
    }

    // Redis transaction
    try {
      const currentRemainingStr = await this.redis.command('GET', 'hli:counter:remaining');
      const prevCount = currentRemainingStr !== null ? parseInt(currentRemainingStr, 10) : starting;
      let newCount = prevCount;
      let status = 'PROCESSED';
      let reason = 'New qualifying paid member';
      let changed = false;

      if (eventId) {
        await this.redis.command('SADD', 'hli:events:processed', String(eventId));
      }

      if (alreadyCounted) {
        status = 'IDEMPOTENT_NO_CHANGE';
        reason = 'Member has already been counted towards the goal previously';
      } else if (!isPaidQualifying) {
        status = 'IGNORED_FREE_OR_LOW_TIER';
        reason = `Pledge amount (${pledgeAmountCents} cents) does not meet minimum qualifying threshold (${minCents} cents)`;
      } else {
        // Add to counted members set in Redis
        const added = await this.redis.command('SADD', 'hli:members:counted', memberHash);
        if (added === 1) {
          // Atomic decrement
          const decrResult = await this.redis.command('DECRBY', 'hli:counter:remaining', 1);
          newCount = Math.max(0, decrResult);
          if (decrResult < 0) {
            await this.redis.command('SET', 'hli:counter:remaining', '0');
            newCount = 0;
          }
          await this.redis.command('SET', 'hli:counter:updated_at', timestamp);
          changed = true;
        } else {
          status = 'IDEMPOTENT_NO_CHANGE';
          reason = 'Member was concurrently counted';
        }
      }

      const auditRecord = {
        timestamp,
        eventId: eventId || 'none',
        memberIdHash: memberHash,
        eventType: eventType || 'unknown',
        previousCount: prevCount,
        newCount,
        status,
        reason
      };

      await this.appendAuditLog(auditRecord);

      return {
        success: true,
        changed,
        previousCount: prevCount,
        newCount,
        status,
        reason,
        audit: auditRecord
      };
    } catch (err) {
      console.error('[Datastore] Redis processPatreonEvent error:', err);
      throw err;
    }
  }

  async appendAuditLog(auditRecord) {
    if (this.provider === 'redis') {
      try {
        await this.redis.command('LPUSH', 'hli:audit_log', JSON.stringify(auditRecord));
        await this.redis.command('LTRIM', 'hli:audit_log', 0, MAX_AUDIT_LOG_ENTRIES - 1);
        return;
      } catch (err) {
        console.error('[Datastore] Redis appendAuditLog error:', err);
      }
    }
    const state = this.local.read();
    state.auditLog = state.auditLog || [];
    state.auditLog.unshift(auditRecord);
    if (state.auditLog.length > MAX_AUDIT_LOG_ENTRIES) {
      state.auditLog = state.auditLog.slice(0, MAX_AUDIT_LOG_ENTRIES);
    }
    this.local.write(state);
  }

  async getAuditLogs(limit = 50) {
    const max = Math.min(limit, MAX_AUDIT_LOG_ENTRIES);
    if (this.provider === 'redis') {
      try {
        const rawList = await this.redis.command('LRANGE', 'hli:audit_log', 0, max - 1) || [];
        return rawList.map(item => (typeof item === 'string' ? JSON.parse(item) : item));
      } catch (err) {
        console.error('[Datastore] Redis getAuditLogs error:', err);
      }
    }
    const state = this.local.read();
    return (state.auditLog || []).slice(0, max);
  }

  async adjustCounterManual({ newCount, offset, reason, adminUser = 'Founder' }) {
    const timestamp = new Date().toISOString();
    const currentState = await this.getCounterState();
    const prevCount = currentState.remaining;
    let targetCount = prevCount;

    if (typeof newCount === 'number' && !isNaN(newCount)) {
      targetCount = Math.max(0, newCount);
    } else if (typeof offset === 'number' && !isNaN(offset)) {
      targetCount = Math.max(0, prevCount + offset);
    }

    if (this.provider === 'redis') {
      await this.redis.command('SET', 'hli:counter:remaining', targetCount.toString());
      await this.redis.command('SET', 'hli:counter:updated_at', timestamp);
    } else {
      const state = this.local.read();
      state.remainingCount = targetCount;
      this.local.write(state);
    }

    const audit = {
      timestamp,
      eventId: 'manual_adjustment',
      memberIdHash: adminUser,
      eventType: 'ADMIN_MANUAL_ADJUSTMENT',
      previousCount: prevCount,
      newCount: targetCount,
      status: 'ADMIN_OVERRIDE',
      reason: reason || 'Manual adjustment by authorized administrator'
    };

    await this.appendAuditLog(audit);
    return { success: true, previousCount: prevCount, newCount: targetCount, audit };
  }

  /**
   * Compare a list of active Patreon members from the Patreon API against stored records
   * Read-only reconciliation tool: does NOT automatically change the public counter
   */
  async reconcileMembers(patreonMembersList = []) {
    const state = await this.getCounterState();
    const countedSet = new Set();

    if (this.provider === 'redis') {
      try {
        const members = await this.redis.command('SMEMBERS', 'hli:members:counted') || [];
        members.forEach(m => countedSet.add(m));
      } catch (err) {
        console.error('[Datastore] Redis reconcile SMEMBERS error:', err);
      }
    } else {
      const localState = this.local.read();
      Object.keys(localState.countedMembers || {}).forEach(m => countedSet.add(m));
    }

    const minCents = getQualifyingMinCents();
    let qualifyingPatreonCount = 0;
    const uncountedQualifying = [];

    patreonMembersList.forEach(m => {
      const isQualifying = (m.currently_entitled_amount_cents || 0) >= minCents;
      if (isQualifying) {
        qualifyingPatreonCount++;
        const hash = hashMemberId(m.id);
        if (!countedSet.has(hash)) {
          uncountedQualifying.push({
            memberIdHash: hash,
            pledgeAmountCents: m.currently_entitled_amount_cents,
            tierTitle: m.tier_title || 'Unknown Tier'
          });
        }
      }
    });

    return {
      currentRemainingCount: state.remaining,
      startingTarget: state.starting,
      databaseCountedMembers: countedSet.size,
      patreonTotalMembersReceived: patreonMembersList.length,
      patreonQualifyingPaidMembers: qualifyingPatreonCount,
      uncountedInDatabaseCount: uncountedQualifying.length,
      uncountedMembersList: uncountedQualifying,
      requiresManualConfirmation: true
    };
  }

  /**
   * GDPR Data Subject Right to Erasure / Privacy Removal
   */
  async removeMemberGdpr(memberId) {
    const memberHash = hashMemberId(memberId);
    let removed = false;

    if (this.provider === 'redis') {
      const res = await this.redis.command('SREM', 'hli:members:counted', memberHash);
      removed = res === 1;
    } else {
      const state = this.local.read();
      if (state.countedMembers && state.countedMembers[memberHash]) {
        delete state.countedMembers[memberHash];
        this.local.write(state);
        removed = true;
      }
    }

    await this.appendAuditLog({
      timestamp: new Date().toISOString(),
      eventId: 'gdpr_erasure',
      memberIdHash: memberHash,
      eventType: 'GDPR_RIGHT_TO_ERASURE',
      previousCount: (await this.getCounterState()).remaining,
      newCount: (await this.getCounterState()).remaining,
      status: removed ? 'MEMBER_REMOVED' : 'MEMBER_NOT_FOUND',
      reason: 'Member identifier removed upon GDPR erasure request'
    });

    return { success: true, removed };
  }
}

export const datastore = new Datastore();
