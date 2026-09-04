// script.js - GOLDEN VERSION REFINED

// ==========================================================================
// 0. PERSISTENT ANALYTICS & VISIT TRACKING (PRESERVED ACROSS RESETS)
// ==========================================================================
function logSiteVisit() {
    try {
        const sessionKey = 'hli_visit_session_' + new Date().toISOString().slice(0, 10);
        let totalVisits = parseInt(localStorage.getItem('hli_total_visits') || '0', 10);
        
        if (isNaN(totalVisits) || totalVisits <= 0) {
            totalVisits = 1;
        } else if (!sessionStorage.getItem(sessionKey)) {
            totalVisits++;
        }
        
        localStorage.setItem('hli_total_visits', totalVisits.toString());
        sessionStorage.setItem(sessionKey, 'active');
    } catch (e) {}
}

// Log visit immediately
logSiteVisit();

// SAFE RESET APP SESSION (Preserves Cumulative Site Analytics & Founder Records)
window.resetAppSession = function() {
    try {
        const preserved = {
            totalVisits: localStorage.getItem('hli_total_visits'),
            registeredCount: localStorage.getItem('hli_registered_count'),
            totalHelped: localStorage.getItem('totalHelped'),
            registeredMembers: localStorage.getItem('registeredMembers'),
            hliMembers: localStorage.getItem('hli_registered_members'),
            founderOffset: localStorage.getItem('hli_founder_offset'),
            founderOverrideVisits: localStorage.getItem('hli_founder_override_visits')
        };

        localStorage.clear();
        sessionStorage.clear();

        if (preserved.totalVisits !== null) localStorage.setItem('hli_total_visits', preserved.totalVisits);
        if (preserved.registeredCount !== null) localStorage.setItem('hli_registered_count', preserved.registeredCount);
        if (preserved.totalHelped !== null) localStorage.setItem('totalHelped', preserved.totalHelped);
        if (preserved.registeredMembers !== null) localStorage.setItem('registeredMembers', preserved.registeredMembers);
        if (preserved.hliMembers !== null) localStorage.setItem('hli_registered_members', preserved.hliMembers);
        if (preserved.founderOffset !== null) localStorage.setItem('hli_founder_offset', preserved.founderOffset);
        if (preserved.founderOverrideVisits !== null) localStorage.setItem('hli_founder_override_visits', preserved.founderOverrideVisits);
    } catch (e) {}

    window.location.href = 'index.html';
};

// ==========================================================================
// 0A. UNACCEPTABLE & RUDE NAMES FILTER
// ==========================================================================
const UNACCEPTABLE_NAMES = [
    // Swear Words & Vulgarities
    'fuck', 'fucker', 'fucking', 'fuckoff', 'motherfucker', 'fuk', 'fck',
    'shit', 'shite', 'bullshit', 'sh!t',
    'bitch', 'bitches', 'bitching', 'b!tch',
    'cunt', 'cunts', 'c*nt',
    'dick', 'dickhead', 'dicks', 'd1ck',
    'cock', 'cocks', 'cocksucker',
    'pussy', 'pussies', 'p*ssy',
    'ass', 'asshole', 'arse', 'arsehole', 'a$$',
    'bastard', 'bastards', 'twat', 'twats', 'wanker', 'wankers', 'wank', 'prick', 'pricks', 'bollocks', 'tosser', 'bellend',
    'slut', 'sluts', 'whore', 'whores', 'skank', 'dipshit', 'jackass',
    
    // Slurs & Hate Speech
    'nigger', 'nigga', 'n1gger', 'negro',
    'faggot', 'fag', 'fags', 'dyke', 'tranny', 'shemale',
    'retard', 'retarded', 'spastic', 'spaz', 'mongoloid',
    'chink', 'gook', 'paki', 'kike', 'yid', 'gypsy',
    'nazi', 'hitler', 'adolf', 'kkk', 'jihad', 'terrorist', 'isis', 'taliban',
    
    // Sexual Terms & Explicit Content
    'penis', 'vagina', 'dildo', 'boobs', 'tits', 'titties', 'clit', 'porn', 'porno',
    'horny', 'orgasm', 'semen', 'cum', 'cumshot', 'jizz', 'blowjob', 'handjob', 'anal', 'masturbate', 'pedophile', 'pedo', 'paedo', 'rapist', 'rape',
    
    // Spam, Trolling & Mocking Placeholders
    'test', 'tester', 'testing', 'testuser', 'fake', 'fakeuser', 'nobody', 'noone', 'anonymous', 'anon',
    'null', 'undefined', 'asdf', 'qwerty', 'zxcv', 'admin', 'administrator', 'root', 'user', 'guest',
    'dummy', 'bot', 'scam', 'spam', 'idiot', 'moron', 'stupid', 'dumb', 'loser', 'clown', 'trash', 'garbage', 'poop', 'pee', 'fart', 'killer', 'murderer', 'suicide'
];

function validateInitiateName(rawName) {
    if (!rawName || typeof rawName !== 'string') {
        return { valid: false, message: 'Please enter your first name.' };
    }

    const trimmed = rawName.trim();
    if (trimmed.length < 2) {
        return { valid: false, message: 'Please enter a name with at least 2 letters.' };
    }

    if (trimmed.length > 40) {
        return { valid: false, message: 'Please enter a name under 40 characters.' };
    }

    // Only letters, spaces, hyphens, apostrophes (supports international characters)
    const validLettersRegex = /^[a-zA-Z\u00C0-\u024F\s'-]+$/;
    if (!validLettersRegex.test(trimmed)) {
        return { valid: false, message: 'Please use letters only (no numbers or special symbols).' };
    }

    // Leetspeak and symbol normalization
    const normalized = trimmed.toLowerCase()
        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
        .replace(/@/g, 'a')
        .replace(/\$/g, 's')
        .replace(/!/g, 'i')
        .replace(/[\s\-_'"`.*+]/g, '');

    // Check for repetitive spam (e.g. "aaaaa", "zzzz")
    if (/^(.)\1{3,}$/.test(normalized)) {
        return { valid: false, message: 'Please enter a real first name.' };
    }

    for (const badWord of UNACCEPTABLE_NAMES) {
        const cleanBad = badWord.toLowerCase().replace(/[\s\-_'"`.*+!$@0-9]/g, '');
        if (cleanBad.length >= 3 && (normalized === cleanBad || normalized.includes(cleanBad))) {
            return { valid: false, message: '⚠️ That name is unacceptable. Please enter a respectful first name.' };
        }
        if (cleanBad.length < 3 && normalized === cleanBad) {
            return { valid: false, message: '⚠️ That name is unacceptable. Please enter a respectful first name.' };
        }
    }

    return { valid: true, sanitizedName: trimmed };
}

function getBristolAnalytics() {
    const totalVisits = parseInt(localStorage.getItem('hli_total_visits') || '1', 10);
    const registeredCount = parseInt(localStorage.getItem('hli_registered_count') || localStorage.getItem('totalHelped') || '0', 10);
    const founderOffset = parseInt(localStorage.getItem('hli_founder_offset') || '0', 10);
    const remainingCount = Math.max(0, 62220 - registeredCount - founderOffset);
    return { totalVisits, registeredCount, founderOffset, remainingCount };
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener("DOMContentLoaded", () => {
    // Floating Scroll Controls (Right Side Middle)
    initFloatingScrollControls();
    // Floating Back to Top Button (Left Side Top - Appears on Long Pages)
    initBackToTopButton();
    initScrollAnimations();
    initWhoWeAreDropdown();
    initAccordions();
    initHubSearch();
    initOnSiteVideoPlayer();
    initTileTooltips();
    initFounderAdminControls();

    // 0. SYNTHETIC SOFT CLICK SOUND FOR TILE NAVIGATION (Subtle, warm, whisper-quiet tap)
    function playSoftClickSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(360, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.022);

            gain.gain.setValueAtTime(0.045, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.028);
        } catch (e) {}
    }

    // Attach soft click listener to all metro tiles and navigation buttons
    document.querySelectorAll('.metro-btn, .back-to-journey-btn, .ext-btn, #btn-support').forEach(tile => {
        tile.addEventListener('click', () => {
            playSoftClickSound();
        });
    });

    // 0B. INITIALIZE DEFAULT MUTE & VOLUME TOOLTIP SITE-WIDE
    initVolumeControlAndTooltip();

    // 1. FADE PAGE IN SAFELY
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        setTimeout(() => overlay.classList.add('reveal'), 150);
    }

    // Handle bfcache (Safari/Mobile back button)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && overlay) {
            overlay.classList.add('reveal');
        }
    });

    // 2. RETURNING USER BYPASS
    const hasVisited = localStorage.getItem('hasVisitedHub');
    const prologue = document.getElementById('prologue-lockdown');
    
    if (hasVisited === 'true' && prologue) {
        prologue.style.display = 'none';
        document.body.classList.remove('prologue-active');
    } else {
        initPrologue();
    }

    // 3. SAFE DEV RESET LISTENER
    document.addEventListener('click', (e) => { 
        if(e.target && e.target.id === 'dev-reset') { 
            e.preventDefault();
            window.resetAppSession(); 
        } 
    });

    // 4. MAIN UI ELEMENTS
    const ctaYes = document.getElementById('cta-yes');
    const ctaSupport = document.getElementById('cta-support');
    const modal = document.getElementById('registration-modal');
    const closeModal = document.getElementById('close-modal');
    const regForm = document.getElementById('registration-form');
    const userNameInput = document.getElementById('user-name');
    const nameValMsg = document.getElementById('name-validation-msg');
    const bypassGuestBtn = document.getElementById('btn-bypass-guest');
    const stencilCount = document.getElementById('stencil-count');
    const svgStencilText = document.getElementById('stencil-svg-text');
    if (stencilCount && svgStencilText) {
        svgStencilText.textContent = stencilCount.textContent.trim() || '62220';
        const stencilObserver = new MutationObserver(() => {
            svgStencilText.textContent = stencilCount.textContent.trim();
        });
        stencilObserver.observe(stencilCount, { childList: true, characterData: true, subtree: true });
    }
    const bgVideo = document.getElementById('bg-video');
    const videoToggle = document.getElementById('video-toggle');

    // Video Play/Pause Logic
    if (bgVideo && videoToggle) {
        videoToggle.addEventListener('click', () => {
            if (bgVideo.paused) {
                bgVideo.play();
                videoToggle.innerHTML = '<span class="icon">⏸</span>';
                videoToggle.setAttribute('aria-label', 'Pause Background Video');
            } else {
                bgVideo.pause();
                videoToggle.innerHTML = '<span class="icon">▶</span>';
                videoToggle.setAttribute('aria-label', 'Play Background Video');
            }
        });
    }

    // Initialize Bristol Count from persistent analytics for landing page stencil with live server sync
    if (stencilCount) {
        const stats = getBristolAnalytics();
        stencilCount.innerHTML = stats.remainingCount.toLocaleString().replace(/,/g, '<span class="small-comma">,</span>');
        stencilCount.setAttribute('aria-label', `Estimated ${stats.remainingCount.toLocaleString()} Bristol adults still to reach`);

        // Fetch server-backed counter asynchronously
        fetch('/api/counter')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && typeof data.remaining === 'number') {
                    const serverRem = Math.max(0, data.remaining);
                    localStorage.setItem('hli_server_remaining', serverRem.toString());
                    stencilCount.innerHTML = serverRem.toLocaleString().replace(/,/g, '<span class="small-comma">,</span>');
                    stencilCount.setAttribute('aria-label', `Estimated ${serverRem.toLocaleString()} Bristol adults still to reach`);
                }
            })
            .catch(err => {
                // Graceful fallback to cached analytics if server offline
                console.log('[HLI Counter] Running in offline / local cache mode.');
            });
    }

    // Modal & Pathway Handling
    if(ctaYes) {
        ctaYes.addEventListener('click', () => {
            if (modal) {
                modal.classList.add('active');
                if (nameValMsg) { nameValMsg.style.display = 'none'; nameValMsg.textContent = ''; }
                if (userNameInput) {
                    userNameInput.classList.remove('input-error');
                    setTimeout(() => userNameInput.focus(), 150);
                }
            }
        });
    }

    if(closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
    }

    if (bypassGuestBtn) {
        bypassGuestBtn.addEventListener('click', () => {
            window.handleBypassRegistration();
        });
    }

    if(ctaSupport) {
        ctaSupport.addEventListener('click', () => {
            transitionToPage('path-experience.html');
        });
    }

    // REGISTRATION SUBMISSION LOGIC (Only decrements on valid name submission)
    window.handleRegistrationSubmission = function(submittedName) {
        const mainNumber = document.getElementById('stencil-count');
        const actionPanel = document.getElementById('bottom-action-panel');
        const introBlock = document.getElementById('intro-block');
        const ctaYesBtn = document.getElementById('cta-yes');
        const ctaSupportBtn = document.getElementById('cta-support');

        if (modal) modal.classList.remove('active');

        if (actionPanel) {
            if (ctaYesBtn) ctaYesBtn.disabled = true;
            if (ctaSupportBtn) ctaSupportBtn.disabled = true;
            actionPanel.style.pointerEvents = 'none';

            if (introBlock) {
                introBlock.style.transition = 'opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease';
                introBlock.style.opacity = '0';
                introBlock.style.filter = 'blur(4px)';
                introBlock.style.transform = 'translateY(10px)';
            }

            // Increment registered count only now that a name is successfully logged
            let stats = getBristolAnalytics();
            let newRegistered = stats.registeredCount + 1;
            localStorage.setItem('hli_registered_count', newRegistered.toString());
            localStorage.setItem('totalHelped', newRegistered.toString());
            const finalCount = Math.max(0, 62220 - newRegistered - stats.founderOffset);

            // Dynamic Random Digit Jumble/Cipher Shuffle Effect for Landing Page Stencil Number
            if (mainNumber) {
                let ticks = 0;
                const maxTicks = 20; // ~900ms duration at 45ms per jumble step
                const jumbleInterval = setInterval(() => {
                    ticks++;
                    if (ticks < maxTicks) {
                        const randomDigits = Math.floor(10000 + Math.random() * 89999).toString();
                        const formattedJumble = randomDigits.slice(0, 2) + '<span class="small-comma">,</span>' + randomDigits.slice(2);
                        mainNumber.innerHTML = formattedJumble;
                    } else {
                        clearInterval(jumbleInterval);
                        mainNumber.innerHTML = finalCount.toLocaleString().replace(/,/g, '<span class="small-comma">,</span>');
                        mainNumber.classList.remove('soft-pulse');
                        void mainNumber.offsetWidth; // Force reflow
                        mainNumber.classList.add('soft-pulse');
                    }
                }, 45);
            }

            const enteredName = submittedName || 'Initiate Member';
            let registeredMembers = JSON.parse(localStorage.getItem('hli_registered_members') || localStorage.getItem('registeredMembers') || '[]');
            const isFirst10 = registeredMembers.length < 10;
            registeredMembers.push({
                name: enteredName,
                tier: 'Initiate Supporter',
                date: new Date().toLocaleDateString('en-GB'),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isFirst10: isFirst10
            });
            localStorage.setItem('hli_registered_members', JSON.stringify(registeredMembers));
            localStorage.setItem('registeredMembers', JSON.stringify(registeredMembers));
            localStorage.setItem('hasVisitedHub', 'true');

            const nameGreeting = enteredName ? `, ${enteredName}` : '';

            setTimeout(() => {
                actionPanel.innerHTML = `
                    <div id="welcome-confirmation" style="margin-top: 6vh; text-align: center; opacity: 0; transform: translateY(16px); transition: opacity 0.45s ease, transform 0.45s ease;">
                        <h2 style="color: #ffffff; font-size: clamp(1.8rem, 4.5vw, 3rem); margin: 0 0 14px 0; font-weight: 900; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(0,0,0,0.9);">One more person joined the initiative.</h2>
                        <p style="color: #cbd5e1; font-size: clamp(1.1rem, 2.2vw, 1.4rem); margin-bottom: 36px; text-shadow: 0 2px 10px rgba(0,0,0,0.9); font-weight: 500;">Welcome to the Bristol network${nameGreeting}.</p>
                        <button id="btn-continue-hub" style="background: #005EB8; color: white; border: none; padding: 22px 70px; font-size: 1.5rem; border-radius: 16px; cursor: pointer; font-weight: 800; text-transform: uppercase; box-shadow: 0 10px 40px rgba(0,0,0,0.6); transition: transform 0.2s, background-color 0.2s; pointer-events: auto;">Continue &rarr;</button>
                    </div>
                `;
                actionPanel.style.pointerEvents = 'auto';

                requestAnimationFrame(() => {
                    const confirmation = document.getElementById('welcome-confirmation');
                    if (confirmation) {
                        confirmation.style.opacity = '1';
                        confirmation.style.transform = 'translateY(0)';
                    }
                });
                
                const continueBtn = document.getElementById('btn-continue-hub');
                if (continueBtn) {
                    continueBtn.addEventListener('click', () => {
                        transitionToPage('path-community-reel.html');
                    });
                }
            }, 950);
        }
    };

    // BYPASS REGISTRATION (Browsing as guest / skip - does NOT decrement the counter)
    window.handleBypassRegistration = function() {
        if (modal) modal.classList.remove('active');
        localStorage.setItem('hasVisitedHub', 'true');
        transitionToPage('path-yes.html');
    };

    function transitionToPage(targetUrl) {
        const actionPanel = document.getElementById('bottom-action-panel');
        const stencil = document.getElementById('stencil-count');
        const flipWrapper = document.getElementById('flip-clock-wrapper');
        
        if (actionPanel) {
            actionPanel.style.transition = 'opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease';
            actionPanel.style.opacity = '0';
            actionPanel.style.filter = 'blur(6px)';
            actionPanel.style.transform = 'translateY(-15px)';
        }
        if (stencil) {
            stencil.style.transition = 'opacity 0.6s ease';
            stencil.style.opacity = '0';
        }
        if (flipWrapper) {
            flipWrapper.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            flipWrapper.style.opacity = '0';
            flipWrapper.style.transform = 'translate(-50%, -60%)';
        }
        document.body.style.transition = 'background-color 0.7s ease';
        document.body.style.backgroundColor = '#ffffff';

        setTimeout(() => {
            window.location.href = targetUrl;
        }, 600);
    }

    if (regForm && userNameInput) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawVal = userNameInput.value;
            const validation = validateInitiateName(rawVal);

            if (!validation.valid) {
                if (nameValMsg) {
                    nameValMsg.textContent = validation.message;
                    nameValMsg.style.display = 'flex';
                }
                userNameInput.classList.remove('input-error');
                void userNameInput.offsetWidth; // Force reflow
                userNameInput.classList.add('input-error');
                userNameInput.focus();
                return;
            }

            if (nameValMsg) {
                nameValMsg.style.display = 'none';
            }
            userNameInput.classList.remove('input-error');
            window.handleRegistrationSubmission(validation.sanitizedName);
        });

        userNameInput.addEventListener('input', () => {
            if (userNameInput.classList.contains('input-error')) {
                userNameInput.classList.remove('input-error');
                if (nameValMsg) nameValMsg.style.display = 'none';
            }
        });
    }

    // SEAMLESS ROUTING FOR ALL LINKS
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !link.classList.contains('citation-link') && !link.classList.contains('modal-link')) {
                e.preventDefault();
                if (overlay) overlay.classList.remove('reveal');
                setTimeout(() => { window.location.href = href; }, 800);
            }
        });
    });
});

function initPrologue() {
    const prologue = document.getElementById('prologue-lockdown');
    if (!prologue) return; // Failsafe

    // Load data from global PROLOGUE_MOMENTS or fallback
    const moments = (typeof window !== 'undefined' && window.PROLOGUE_MOMENTS) ? window.PROLOGUE_MOMENTS : [
        {
            id: "moment-1",
            index: 1,
            html: '<span class="base-text">By 2035, an estimated </span><strong class="highlight number-cyan">14.2 million</strong><span class="base-text"> UK adults will live with hearing loss.</span>',
            source: "RNID 2035 Projections",
            position: { desktop: { x: 38, y: 38 }, mobile: { x: 50, y: 36 } },
            stencil: { targetProgress: 0.0, scale: 18.0, translateYVh: -120, opacity: 0.0 },
            duration: 6200
        },
        {
            id: "moment-2",
            index: 2,
            html: '<span class="base-text">In Bristol, </span><strong class="highlight number-cyan">62,220</strong><span class="base-text"> adults are estimated to be affected today.</span>',
            source: "Bristol City Council JSNA",
            position: { desktop: { x: 62, y: 58 }, mobile: { x: 50, y: 56 } },
            stencil: { targetProgress: 0.20, scale: 6.5, translateYVh: -75, opacity: 0.10 },
            duration: 6500
        },
        {
            id: "moment-3",
            index: 3,
            html: '<span class="base-text">Projected to rise to </span><strong class="highlight number-amber">67,555</strong><span class="base-text"> over the next decade.</span>',
            source: "Bristol City Council JSNA",
            position: { desktop: { x: 64, y: 36 }, mobile: { x: 50, y: 38 } },
            stencil: { targetProgress: 0.40, scale: 3.8, translateYVh: -48, opacity: 0.32 },
            duration: 6000
        },
        {
            id: "moment-4",
            index: 4,
            html: '<span class="base-text">Severe hearing loss is an </span><strong class="highlight text-amber">invisible barrier</strong><span class="base-text">.</span>',
            source: "Bristol JSNA Estimates",
            position: { desktop: { x: 36, y: 62 }, mobile: { x: 50, y: 60 } },
            stencil: { targetProgress: 0.60, scale: 2.3, translateYVh: -30, opacity: 0.58 },
            duration: 6000
        },
        {
            id: "moment-5",
            index: 5,
            html: '<span class="base-text">Connecting NHS audiology, specialist technology, and </span><strong class="highlight text-cyan">welcoming local venues</strong><span class="base-text">.</span>',
            source: "Hearing Loss Initiative",
            position: { desktop: { x: 50, y: 44 }, mobile: { x: 50, y: 44 } },
            stencil: { targetProgress: 0.80, scale: 1.45, translateYVh: -18, opacity: 0.82 },
            duration: 6200
        },
        {
            id: "moment-6",
            index: 6,
            html: '<strong class="highlight-action">Step inside</strong><span class="base-text"> to explore Bristol\'s hearing loss network.</span>',
            source: "Hearing Loss Initiative",
            position: { desktop: { x: 50, y: 50 }, mobile: { x: 50, y: 50 } },
            stencil: { targetProgress: 1.0, scale: 1.0, translateYVh: -12, opacity: 1.0 },
            duration: 0
        }
    ];

    let currentMomentIndex = 0;
    let isPrologueActive = true;
    let loopTimeout = null;
    let animFrameId = null;

    // Continuous Automatic Camera Zoom Timeline
    const prologueStartTime = performance.now();
    const TOTAL_PROLOGUE_TIME = 32000; // 32s continuous total duration
    let continuousProgress = 0.0;
    let targetMomentProgress = 0.0;

    // DOM Elements
    const canvas = document.getElementById('prologue-canvas') || document.getElementById('ambient-canvas');
    const stage = document.getElementById('prologue-floating-stage');
    const skipBtn = document.getElementById('prologue-skip-btn');
    const clickPrompt = document.getElementById('prologue-click-prompt');
    const sourceWhisper = document.getElementById('prologue-source-whisper');
    const stencilMask = document.getElementById('prologue-stencil-mask');
    const stencilNumber = document.getElementById('prologue-stencil-number');

    // Sync live landing page number into prologue stencil
    const landingStencil = document.getElementById('stencil-count');
    if (landingStencil && stencilNumber) {
        stencilNumber.textContent = landingStencil.textContent.trim() || '62220';
    }

    // Set initial invisible, zoomed-out off-screen state
    if (stencilMask) {
        stencilMask.style.transform = 'translateY(-120vh) scale(18.0)';
        stencilMask.style.opacity = '0';
    }

    // Focal target coordinates for ambient glow
    let targetGlowX = window.innerWidth * 0.5;
    let targetGlowY = window.innerHeight * 0.5;
    let currentGlowX = targetGlowX;
    let currentGlowY = targetGlowY;

    // 1. Build Moment Elements
    if (stage) {
        stage.innerHTML = '';
        moments.forEach((m, idx) => {
            const p = document.createElement('p');
            p.id = `prologue-moment-${idx}`;
            p.className = 'prologue-moment';
            p.innerHTML = m.html;
            stage.appendChild(p);
        });
    }

    const momentElements = stage ? stage.querySelectorAll('.prologue-moment') : [];

    // 2. Play Moment
    function showMoment(index) {
        if (!isPrologueActive || !momentElements[index]) return;
        currentMomentIndex = index;
        const m = moments[index];
        const isMobile = window.innerWidth <= 600;
        const pos = (isMobile && m.position.mobile) ? m.position.mobile : m.position.desktop;

        // Clear any running timers
        if (loopTimeout) clearTimeout(loopTimeout);

        // Update target progress for continuous camera zoom
        if (m.stencil && typeof m.stencil.targetProgress === 'number') {
            targetMomentProgress = m.stencil.targetProgress;
        }

        // Hide other moments
        momentElements.forEach((el, idx) => {
            if (idx !== index) {
                el.classList.remove('visible');
                el.style.opacity = '0';
                el.querySelectorAll('.base-text').forEach(t => t.style.opacity = '0');
                el.querySelectorAll('.highlight, .highlight-action').forEach(h => h.style.opacity = '0');
            }
        });

        const activeEl = momentElements[index];

        // Apply spatial text positioning
        activeEl.style.left = `${pos.x}%`;
        activeEl.style.top = `${pos.y}%`;

        // Update ambient glow coordinates
        targetGlowX = (pos.x / 100) * window.innerWidth;
        targetGlowY = (pos.y / 100) * window.innerHeight;

        // Update footer prompt and source
        if (sourceWhisper) {
            sourceWhisper.textContent = `Source: ${m.source}`;
        }
        if (clickPrompt) {
            if (index === moments.length - 1) {
                clickPrompt.innerHTML = '[ Click or press Enter to enter site &rarr; ]';
                clickPrompt.style.opacity = '0.85';
            } else {
                clickPrompt.innerHTML = '[ Click anywhere to continue ]';
                clickPrompt.style.opacity = '0.5';
            }
        }

        // Fade in active moment
        activeEl.classList.add('visible');
        activeEl.style.opacity = '1';
        activeEl.querySelectorAll('.base-text').forEach(t => t.style.opacity = '1');
        activeEl.querySelectorAll('.highlight, .highlight-action').forEach(h => h.style.opacity = '1');

        // Auto-advance loop: Base text dissolves, number lingers longer
        if (m.duration > 0) {
            const dissolveDelay = Math.max(1000, m.duration - 2000);
            loopTimeout = setTimeout(() => {
                // Phase A: Base text dissolves first
                activeEl.querySelectorAll('.base-text').forEach(t => t.style.opacity = '0');

                // Phase B: Number stays illuminated and lingers for 1500ms
                setTimeout(() => {
                    activeEl.querySelectorAll('.highlight, .highlight-action').forEach(h => h.style.opacity = '0');

                    // Phase C: Transition to next moment
                    setTimeout(() => {
                        activeEl.classList.remove('visible');
                        if (currentMomentIndex < moments.length - 1) {
                            showMoment(currentMomentIndex + 1);
                        }
                    }, 450);
                }, 1500);
            }, dissolveDelay);
        }
    }

    function nextMoment() {
        if (loopTimeout) clearTimeout(loopTimeout);
        if (currentMomentIndex < moments.length - 1) {
            showMoment(currentMomentIndex + 1);
        } else {
            dismissPrologue();
        }
    }

        function prevMoment() {
        if (loopTimeout) clearTimeout(loopTimeout);
        if (currentMomentIndex > 0) {
            showMoment(currentMomentIndex - 1);
        }
    }

    // Mark prologue active on body to stage landing page text fade-in
    document.body.classList.add('prologue-active');

    // 3. Dismiss Prologue and Reveal Homepage with Eye-Blink Awakening
    const dismissPrologue = () => {
        if (!isPrologueActive) return;
        isPrologueActive = false;

        if (loopTimeout) clearTimeout(loopTimeout);
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }

        // Trigger graceful text fade-in on landing page
        document.body.classList.remove('prologue-active');

        // Ensure stencil matches landing page exact state
        if (stencilMask) {
            const isMobile = window.innerWidth <= 768;
            stencilMask.style.transform = `translateY(${isMobile ? -24 : -12}vh) scale(1)`;
            stencilMask.style.opacity = '1';
        }

        // Ensure background video plays seamlessly
        const bgVideo = document.getElementById('bg-video');
        if (bgVideo && bgVideo.paused) {
            bgVideo.play().catch(() => {});
        }

        // Softly fade out prologue lockdown container as numbers awake
        prologue.style.transition = 'opacity 0.45s ease';
        prologue.style.opacity = '0';
        setTimeout(() => {
            prologue.style.display = 'none';
        }, 500);
    };

    // 4. Interactive Event Listeners
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dismissPrologue();
        });
    }

    // Backdrop click advances
    prologue.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        nextMoment();
    });

    // Keyboard Navigation (Space, Enter, Arrows, Escape)
    const handleKeyNav = (e) => {
        if (!isPrologueActive) return;

        if (document.activeElement && document.activeElement.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
            return;
        }

        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            nextMoment();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevMoment();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            dismissPrologue();
        }
    };

    document.addEventListener('keydown', handleKeyNav);

    // Touch Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;

    prologue.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    prologue.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                nextMoment();
            } else {
                prevMoment();
            }
        }
    }, { passive: true });

    // 5. Continuous Visual Canvas Layer & Constant-Speed Logarithmic Camera Zoom Engine
    function initCanvasAnimation() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            if (!isPrologueActive) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        let step = 0;

        function draw() {
            if (!isPrologueActive) return;

            ctx.clearRect(0, 0, width, height);
            step += 0.015;

            // --- A. Steady Logarithmic Camera Dolly Zoom (Zero Jerking, Constant Perceptual Speed) ---
            const elapsed = performance.now() - prologueStartTime;
            const timeBasedProgress = Math.min(1.0, elapsed / TOTAL_PROLOGUE_TIME);
            const activeTarget = (currentMomentIndex === moments.length - 1)
                ? 1.0
                : Math.max(timeBasedProgress, targetMomentProgress);

            // Silky critically damped easing
            continuousProgress += (activeTarget - continuousProgress) * 0.022;

            // Smoothstep normalized factor
            const smoothP = continuousProgress * continuousProgress * (3 - 2 * continuousProgress);

            // Logarithmic zoom scale (constant physical speed across whole journey)
            const scale = Math.exp(Math.log(14.0) * (1 - smoothP) + Math.log(1.0) * smoothP);

            // Smooth vertical descent
            const isMobile = window.innerWidth <= 768;
            const targetY = isMobile ? -24 : -12;
            const startY = isMobile ? -100 : -95;
            const translateY = startY + (targetY - startY) * smoothP;

            // Opacity curve: 0% at start, gently rising into subtle dark shadow
            let opacity = 0.0;
            if (smoothP > 0.12) {
                opacity = Math.min(1.0, (smoothP - 0.12) / 0.88);
            }

            if (stencilMask) {
                stencilMask.style.transform = `translateY(${translateY.toFixed(2)}vh) scale(${scale.toFixed(3)})`;
                stencilMask.style.opacity = opacity.toFixed(4);
            }

            // --- B. Ambient Radial Glow (Tracks text focus) ---
            currentGlowX += (targetGlowX - currentGlowX) * 0.04;
            currentGlowY += (targetGlowY - currentGlowY) * 0.04;

            const glowGrad = ctx.createRadialGradient(currentGlowX, currentGlowY, 10, currentGlowX, currentGlowY, 260);
            glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
            glowGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.04)');
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, width, height);

            // --- C. Faint Flowing Acoustic Wave Filaments ---
            ctx.lineWidth = 1.1;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                const waveOffset = i * 0.9;
                const alpha = (0.08 - i * 0.022);
                ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;

                const centerY = height * 0.48 + Math.sin(step * 0.5 + i) * 20;

                for (let x = 0; x < width; x += 10) {
                    const distanceFactor = Math.sin((x / width) * Math.PI);
                    const y = centerY + Math.sin(x * 0.004 + step + waveOffset) * (28 * distanceFactor)
                                     + Math.cos(x * 0.0025 - step * 0.6) * (16 * distanceFactor);
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            animFrameId = requestAnimationFrame(draw);
        }

        animFrameId = requestAnimationFrame(draw);
    }

    // Initialize
    showMoment(0);
    initCanvasAnimation();
}



function initVolumeControlAndTooltip() {
    const audio = document.getElementById('bg-noise');
    const container = document.getElementById('volume-control-container');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');

    if (!container || !audio) return;

    // Create or locate tooltip element
    let tooltip = container.querySelector('.volume-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'volume-tooltip';
        container.appendChild(tooltip);
    }

    // Default to MUTE when arriving on page
    audio.muted = true;
    if (volumeIcon) volumeIcon.textContent = 'volume_off';

    function updateTooltipText() {
        if (!tooltip) return;
        if (audio.muted || audio.volume === 0) {
            tooltip.textContent = '🔊 Muted — Soothing White Noise Soundscape';
        } else {
            const pct = Math.round(audio.volume * 100);
            tooltip.textContent = `🔊 Playing: Soothing White Noise Soundscape (${pct}%)`;
        }
    }

    updateTooltipText();

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            updateTooltipText();
        });
    }
    if (volumeIcon) {
        volumeIcon.addEventListener('click', () => {
            setTimeout(updateTooltipText, 20);
        });
    }
}

// 6. SCROLL REVEAL ANIMATION ENGINE
function initScrollAnimations() {
    const targets = document.querySelectorAll('.animate-on-scroll, .card, .section-card, .info-card, .contact-card, .hearing-card, .quiz-card, .step-item, .resource-card, .content-card, .metro-btn, .venue-card, .story-card, .testimonial-card, .faq-card, .feature-card, .stat-card, .header-section, .journey-card');
    if ('IntersectionObserver' in window && targets.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    } else {
        targets.forEach(el => el.classList.add('animated'));
    }
}

// 7. TOP LEFT 'WHO WE ARE' DROPDOWN MENU
function initWhoWeAreDropdown() {
    const btn = document.getElementById('who-we-are-btn');
    const menu = document.getElementById('who-we-are-dropdown-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        menu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            btn.classList.remove('active');
            menu.classList.remove('active');
        }
    });
}

// 8. PROGRESSIVE DISCLOSURE ACCORDIONS
function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            if (item) {
                item.classList.toggle('active');
            }
        });
    });
}

// 9. HUB LIVE SEARCH FILTER (For path-yes.html and path-support.html)
function initHubSearch() {
    const searchInput = document.getElementById('hub-tile-search');
    if (!searchInput) return;

    // Prevent aggressive browser/credential manager autofill from inserting saved logins (e.g. Guest)
    searchInput.value = '';

    const clearBtn = document.getElementById('clear-search-btn');
    const feedback = document.getElementById('search-feedback');
    const hubSections = document.querySelectorAll('.hub-section');

    // Comprehensive cross-page topic & keyword dictionary
    const PAGE_SEARCH_INDEX = {
        'path-government-help.html': 'pip personal independence payment access to work atw grants funding dwp benefits financial support disabled persons railcard bus pass tax relief work scheme allowance equipment assessment disability living allowance dla attendance allowance universal credit blue badge vat relief',
        'path-job-interviews.html': 'job interviews work employment workplace adjustments reasonable adjustments equality act 2010 disclosure access to work atw career hiring boss manager discrimination cv interview tips questions candidate employer rights',
        'path-workplace-tips.html': 'workplace tips colleagues managers employers meetings inclusive office background noise video calls captions on teams zoom google meet meeting room acoustics roger pen microphone access to work reasonable adjustments',
        'path-hearing-aids-access.html': 'hearing aids nhs hearing aids private hearing aids bolero bolero m70 bolero series nova nova m naida naida series naida p-70 up phonak oticon resound widex signia starkey bte behind the ear ric receiver in canal ite in the ear cic completely in canal itc in the canal baha bchd bone conduction cros bicros cochlear implant airpods airpods pro batteries size 312 size 13 size 10 size 675 zinc-air tubing earmoulds moulds wax guards domes cleaning hearing aids audiologist uhbw repairs replacement fitting hiss bristol st michaels southmead postal batteries order batteries online batteries by post replacement tubes postal order uhbw form',
        'path-hearing-aids.html': 'hearing aids bte ite itc body worn earmoulds thintubes cleaning batteries induction loops bolero phonak naida postal batteries order tubes online uhbw postal form',
        'path-ear-care.html': 'ear care safety what not to put in ears cotton buds q-tips earwax wax removal microsuction water irrigation syringing olive oil ear drops sodium bicarbonate cleaning ears perforated eardrum ear canal itch itchy blocked ears audiologist ent',
        'path-assistive-technology.html': 'assistive technology assistive tech phonak roger roger pen roger select roger table mic wireless mic tv connector streamer streamers flashing doorbell vibrating alarm clock vibrating pad bellman symfon minikit fm system bluetooth le audio smart hearing gadgets alexa google loop system',
        'path-tinnitus.html': 'tinnitus ringing in ears buzzing clicking roaring sound therapy white noise pink noise brown noise masking pillow habituation trt tinnitus retraining therapy cbt cognitive behavioural therapy relaxation noise soothing sounds british tinnitus association',
        'path-mental-health.html': 'mental health hearing loss grief stages of grief denial anger bargaining depression acceptance listening fatigue isolation anxiety stress counselling talking therapies burnout exhaustion crying emotions loneliness stigma self-esteem',
        'path-hearing-tests.html': 'hearing tests audiometry pure tone audiometry pta audiogram tympanometry speech in noise speech discrimination bone conduction otoscopy tuning fork decibels db hz pitch volume hospital clinic screening referral ear exam uhbw southmead bri',
        'path-how-we-hear.html': 'how we hear ear anatomy outer ear middle ear inner ear pinna ear canal tympanic membrane eardrum ossicles malleus incus stapes hammer anvil stirrup cochlea organ of corti hair cells stereocilia auditory nerve sensorineural conductive mixed hearing loss high frequency low frequency decibels hz pitch volume frequency biology',
        'path-hearing-therapists.html': 'hearing therapists counselling auditory training lipreading lip reading coping strategies communication rehabilitation tinnitus therapy sensory support therapy communication tactics',
        'path-accessible-venues.html': 'bristol venues accessible venues hearing loop induction loop thekla bristol beacon bristol old vic watershed st georges hippodrome redgrave theatre tobacco factory arnolfini acoustic ratings map directory theatre cinema concerts live music accessibility',
        'path-support-group.html': 'support groups bristol support group meetups peer support coffee morning elmgrove centre cotham social gathering community meetings talk chat friendship',
        'path-community-stories.html': 'community stories initiate stories lived experience jason member initiate simon personal stories testimonials real experiences overcoming hearing loss journeys hope',
        'path-testimonials.html': 'testimonials reviews feedback what people say community feedback initiate reviews quotes praise',
        'path-resources.html': 'resources downloads pdf guides checklists patreon signup guide printable cards communication card links leaflets forms',
        'path-contacts.html': 'useful contacts directory telephone phone numbers emails cfd centre for deaf rnid sensory support nhs audiology bristol contact list emergency helplines chss',
        'path-tech.html': 'future tech auracast bluetooth le audio gene therapy ai noise reduction smart tech research advancements temple meads station trial innovations regenerative medicine',
        'path-it-goes-to-11.html': 'it goes to 11 decibels sound safety loudness loud music concerts earplugs hearing protection db chart noise damage prevention volume 85db safe exposure',
        'path-experience.html': 'hearing experience simulation what hearing loss sounds like simulator listening effort audio demo muffled sounds audio player whitenoise high frequency loss simulation',
        'path-hearing-quiz.html': 'hearing quiz self assessment am i hard of hearing questionnaire questions score checklist symptoms signs test',
        'path-nhs.html': 'bristol nhs foundation trust hospital gp referral southmead hospital bri bristol royal infirmary audiology clinic ent ear nose throat appointments st michaels hospital uhbw nbt',
        'path-family-guide.html': 'family guide supporting family relatives partners children home communication dinner table syndrome habits face to face speaking clearly living with hard of hearing',
        'path-awareness.html': 'awareness pace framework patience attention clarity eye contact communication tactics communication tips rules understanding hard of hearing elearning demo',
        'path-join-outreach.html': 'join outreach volunteer volunteers greeter session host hearing loop helper peer supporter listener ambassador application email helping community charity',
        'path-join-us.html': 'join us patreon patreon initiative membership subscription a pardon an initiate a hunter gold standard wall of honour credits roll 3 6 12 support initiative',
        'path-stay-connected.html': 'stay connected community hub events upcoming meetups calendar auracast temple meads social media feeds instagram linkedin social group discussions',
        'path-bear-pit.html': 'stay connected community hub events upcoming meetups calendar auracast temple meads social media feeds instagram linkedin social group discussions',
        'path-support.html': 'support branch support hub resources for friends families businesses',
        'path-yes.html': 'initiate main hub main journey pathways'
    };

    function performSearch() {
        let query = (searchInput.value || '').trim().toLowerCase();

        // BROWSER CREDENTIAL AUTOFILL SHIELD
        // If Chrome or a password manager silently injects 'guest' or saved credentials on load, clear it and show all tiles
        if (query === 'guest' || query === 'guest:' || query.startsWith('guest ')) {
            searchInput.value = '';
            query = '';
        }

        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? 'inline-flex' : 'none';
        }

        if (!query) {
            // Show all sections and tiles
            hubSections.forEach(section => {
                section.style.display = '';
                section.querySelectorAll('.metro-btn').forEach(tile => {
                    tile.style.display = '';
                });
            });
            if (feedback) feedback.style.display = 'none';
            return;
        }

        const queryTerms = query.split(/\s+/).filter(t => t.length > 0);
        let totalMatches = 0;

        hubSections.forEach(section => {
            const tiles = section.querySelectorAll('.metro-btn');
            let sectionMatches = 0;

            tiles.forEach(tile => {
                const text = (tile.textContent || '').toLowerCase();
                const rawHref = tile.getAttribute('href') || '';
                const baseHref = rawHref.split(/[?#]/)[0].toLowerCase();
                const aria = (tile.getAttribute('aria-label') || '').toLowerCase();
                const indexedKeywords = (PAGE_SEARCH_INDEX[baseHref] || '').toLowerCase();
                const combinedSearchCorpus = `${text} ${baseHref} ${aria} ${indexedKeywords}`;

                // Check if all query terms match the tile or its full page topic keywords
                const isMatch = queryTerms.every(term => combinedSearchCorpus.includes(term));

                if (isMatch) {
                    tile.style.display = '';
                    sectionMatches++;
                    totalMatches++;
                } else {
                    tile.style.display = 'none';
                }
            });

            section.style.display = sectionMatches > 0 ? '' : 'none';
        });

        if (feedback) {
            feedback.style.display = 'block';
            if (totalMatches === 0) {
                feedback.innerHTML = `
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; max-width: 480px; margin: 20px auto 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
                        <p style="color: #64748b; margin: 0 0 12px 0; font-size: 1rem;">No pathways found matching "<strong>${escapeHtml(query)}</strong>".</p>
                        <button type="button" id="reset-hub-search-btn" style="background: #1e293b; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; cursor: pointer; font-size: 0.9rem;">Clear Search</button>
                    </div>
                `;
                document.getElementById('reset-hub-search-btn')?.addEventListener('click', () => {
                    searchInput.value = '';
                    performSearch();
                    searchInput.focus();
                });
            } else {
                feedback.innerHTML = `<span style="display: inline-block; background: #f1f5f9; color: #475569; padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; border: 1px solid #e2e8f0;">Showing ${totalMatches} matching pathway${totalMatches > 1 ? 's' : ''}</span>`;
            }
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Active polling and event listeners to defeat delayed Chrome password manager injections
    const clearAutofillJunk = () => {
        if (searchInput.value.toLowerCase().includes('guest') || (searchInput.hasAttribute('readonly') && searchInput.value.length > 0)) {
            searchInput.value = '';
            performSearch();
        }
    };

    [40, 100, 250, 500, 1000, 1800].forEach(ms => setTimeout(clearAutofillJunk, ms));
    searchInput.addEventListener('change', clearAutofillJunk);
    searchInput.addEventListener('animationstart', (e) => {
        if (e.animationName && e.animationName.includes('autofill')) {
            clearAutofillJunk();
        }
    });

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            performSearch();
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            performSearch();
            searchInput.focus();
        });
    }
}

// 10. GLOBAL INTERACTIVE VIDEO EMBED LOADER & ON-SITE MODAL ENGINE
function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
}

function openVideoModal(videoId, videoTitle) {
    if (!videoId) return;
    let modal = document.getElementById('hli-video-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hli-video-modal';
        modal.className = 'hli-video-modal-backdrop';
        modal.innerHTML = `
            <div class="hli-video-modal-card" role="dialog" aria-modal="true" aria-labelledby="hli-video-modal-title">
                <div class="hli-video-modal-header">
                    <h3 id="hli-video-modal-title" class="hli-video-modal-title">
                        <span class="material-symbols-outlined" style="color: #ff0f5b;">play_circle</span>
                        <span id="hli-video-modal-title-text">Video Player</span>
                    </h3>
                    <button id="hli-video-modal-close-btn" class="hli-video-modal-close-btn" aria-label="Close Video">
                        <span class="material-symbols-outlined" style="font-size: 1.1rem;">close</span> Close
                    </button>
                </div>
                <div class="hli-video-modal-body" id="hli-video-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeVideoModal();
        });

        const closeBtn = modal.querySelector('#hli-video-modal-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

    const titleEl = modal.querySelector('#hli-video-modal-title-text');
    if (titleEl) titleEl.textContent = videoTitle || 'Initiative Video Player';

    const bodyEl = modal.querySelector('#hli-video-modal-body');
    if (bodyEl) {
        bodyEl.innerHTML = `
            <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1" 
                    title="${videoTitle || 'Initiative Video'}" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen 
                    referrerpolicy="strict-origin-when-cross-origin"></iframe>
        `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('hli-video-modal');
    if (!modal) return;
    modal.classList.remove('active');
    const bodyEl = modal.querySelector('#hli-video-modal-body');
    if (bodyEl) bodyEl.innerHTML = '';
    document.body.style.overflow = '';
}

function loadInteractiveVideo(containerId, videoId, title) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" 
                title="${title || 'Video Player'}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen 
                referrerpolicy="strict-origin-when-cross-origin" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe>
    `;
}

function initOnSiteVideoPlayer() {
    // Intercept any anchor link or preview item targeting YouTube
    document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"], .video-link-item, [data-video-id]').forEach(el => {
        el.addEventListener('click', (e) => {
            let targetHref = el.getAttribute('href');
            let videoId = el.getAttribute('data-video-id');
            let videoTitle = el.getAttribute('data-video-title') || el.innerText.trim();

            if (!videoId && targetHref) {
                videoId = extractYouTubeId(targetHref);
            }

            if (!videoId) {
                const childLink = el.querySelector('a[href*="youtube.com"], a[href*="youtu.be"]');
                if (childLink) {
                    videoId = extractYouTubeId(childLink.getAttribute('href'));
                    if (!videoTitle) videoTitle = childLink.innerText.trim();
                }
            }

            if (videoId) {
                e.preventDefault();
                e.stopPropagation();
                openVideoModal(videoId, videoTitle || 'Video Player');
            }
        });
    });
}

// 12. UNIVERSAL TILE ROLLOVER TOOLTIPS
function initTileTooltips() {
    let tooltip = document.getElementById('hli-tile-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'hli-tile-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tooltip);
    }

    const showTooltip = (el) => {
        const text = el.getAttribute('data-tooltip');
        if (!text) return;

        tooltip.textContent = text;
        tooltip.classList.add('show');
        tooltip.setAttribute('aria-hidden', 'false');

        const rect = el.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Position centered above the tile
        let top = rect.top - tooltipRect.height - 10;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // If too close to viewport top, flip below the tile
        if (top < 8) {
            top = rect.bottom + 10;
            tooltip.classList.add('flip-bottom');
        } else {
            tooltip.classList.remove('flip-bottom');
        }

        // Screen edge bounds
        if (left < 8) left = 8;
        if (left + tooltipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tooltipRect.width - 8;
        }

        tooltip.style.top = `${Math.round(top)}px`;
        tooltip.style.left = `${Math.round(left)}px`;
    };

    const hideTooltip = () => {
        if (tooltip) {
            tooltip.classList.remove('show');
            tooltip.setAttribute('aria-hidden', 'true');
        }
    };

    // Attach listeners to all elements with data-tooltip
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', () => showTooltip(el));
        el.addEventListener('mouseleave', hideTooltip);
        el.addEventListener('focus', () => showTooltip(el));
        el.addEventListener('blur', hideTooltip);
    });

    window.addEventListener('scroll', hideTooltip, { passive: true });
    window.addEventListener('resize', hideTooltip, { passive: true });
}

// 13. FOUNDER & PRODUCT LEAD ADMIN CONTROLS (JASON)
function initFounderAdminControls() {
    // Inject Founder Modal if not already present
    if (!document.getElementById('hli-founder-modal')) {
        const modalHtml = `
        <div id="hli-founder-modal" class="founder-admin-modal" role="dialog" aria-labelledby="founder-title">
            <div class="founder-admin-card">
                <div class="founder-admin-header">
                    <h3 id="founder-title" class="founder-admin-title">🛡️ Founder &amp; Product Lead Admin</h3>
                    <button type="button" class="founder-admin-close" id="founder-modal-close" aria-label="Close Admin">&times;</button>
                </div>
                
                <div id="founder-pin-gate" style="text-align: center; padding: 20px 0;">
                    <p style="color: #cbd5e1; margin-bottom: 15px; font-size: 0.95rem;">Enter Founder PIN to access live site records and adjustment controls:</p>
                    <input type="password" id="founder-pin-input" class="founder-input" placeholder="Enter PIN" style="max-width: 220px; margin: 0 auto 15px auto; text-align: center; letter-spacing: 4px; font-size: 1.2rem;">
                    <div>
                        <button type="button" id="founder-pin-btn" class="founder-btn-primary">Unlock Controls</button>
                    </div>
                    <div id="founder-pin-error" style="color: #ff4d4d; font-size: 0.85rem; margin-top: 10px; display: none;">⚠️ Incorrect PIN.</div>
                </div>

                <div id="founder-admin-content" style="display: none;">
                    <div class="founder-stat-grid">
                        <div class="founder-stat-box">
                            <div class="founder-stat-label">Total Site Visits</div>
                            <div class="founder-stat-value" id="admin-disp-visits">0</div>
                            <div class="founder-control-row">
                                <input type="number" id="admin-input-visits" class="founder-input" min="0">
                                <button type="button" id="admin-btn-save-visits" class="founder-btn-small">Set</button>
                            </div>
                        </div>

                        <div class="founder-stat-box">
                            <div class="founder-stat-label">Names Logged</div>
                            <div class="founder-stat-value" id="admin-disp-registered">0</div>
                            <div class="founder-control-row">
                                <input type="number" id="admin-input-registered" class="founder-input" min="0">
                                <button type="button" id="admin-btn-save-registered" class="founder-btn-small">Set</button>
                            </div>
                        </div>

                        <div class="founder-stat-box">
                            <div class="founder-stat-label">Remaining Bristol Count</div>
                            <div class="founder-stat-value" id="admin-disp-remaining">62,220</div>
                            <div class="founder-control-row">
                                <input type="number" id="admin-input-offset" class="founder-input" placeholder="Offset (+/-)">
                                <button type="button" id="admin-btn-save-offset" class="founder-btn-small">Adjust</button>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.9rem; font-weight: 700; color: #cbd5e1;">Logged Initiates Registry:</span>
                        <button type="button" id="admin-btn-export" class="founder-btn-small" style="background: #1b5e20;">📥 Export JSON</button>
                    </div>

                    <div class="founder-table-wrapper">
                        <table class="founder-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody id="founder-members-tbody">
                                <tr><td colspan="4" style="text-align: center; color: #94a3b8;">No names logged yet.</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="founder-actions-bar" style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: space-between; align-items: center;">
                        <button type="button" id="admin-btn-reset-session" class="founder-btn-secondary">🔄 Reset Session Flow</button>
                        <a href="path-branding.html" class="founder-btn-primary" style="background: #7B1FA2; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 10px; font-weight: 700; color: white;">
                            <span class="material-symbols-outlined" style="font-size: 1.1rem;">palette</span> 🎨 Brand &amp; Hex Palette Portal &rarr;
                        </a>
                        <button type="button" id="admin-btn-close" class="founder-btn-primary">Done</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modal = document.getElementById('hli-founder-modal');
    const closeBtn = document.getElementById('founder-modal-close');
    const doneBtn = document.getElementById('admin-btn-close');
    const pinGate = document.getElementById('founder-pin-gate');
    const adminContent = document.getElementById('founder-admin-content');
    const pinInput = document.getElementById('founder-pin-input');
    const pinBtn = document.getElementById('founder-pin-btn');
    const pinError = document.getElementById('founder-pin-error');

    function refreshAdminValues() {
        const stats = getBristolAnalytics();
        const dispVisits = document.getElementById('admin-disp-visits');
        const dispReg = document.getElementById('admin-disp-registered');
        const dispRem = document.getElementById('admin-disp-remaining');
        const inputVisits = document.getElementById('admin-input-visits');
        const inputReg = document.getElementById('admin-input-registered');
        const inputOffset = document.getElementById('admin-input-offset');
        const tbody = document.getElementById('founder-members-tbody');

        if (dispVisits) dispVisits.textContent = stats.totalVisits.toLocaleString();
        if (dispReg) dispReg.textContent = stats.registeredCount.toLocaleString();
        if (dispRem) dispRem.textContent = stats.remainingCount.toLocaleString();

        if (inputVisits) inputVisits.value = stats.totalVisits;
        if (inputReg) inputReg.value = stats.registeredCount;
        if (inputOffset) inputOffset.value = stats.founderOffset;

        const members = JSON.parse(localStorage.getItem('hli_registered_members') || localStorage.getItem('registeredMembers') || '[]');
        if (tbody) {
            if (members.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #94a3b8;">No names logged yet.</td></tr>';
            } else {
                tbody.innerHTML = members.map((m, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td style="font-weight: 700; color: #ffffff;">${escapeHtml(m.name)}</td>
                        <td>${m.date || 'N/A'}</td>
                        <td>${m.time || ''}</td>
                    </tr>
                `).join('');
            }
        }
    }

    function openFounderModal() {
        if (modal) {
            modal.classList.add('active');
            if (sessionStorage.getItem('hli_founder_unlocked') === 'true') {
                if (pinGate) pinGate.style.display = 'none';
                if (adminContent) adminContent.style.display = 'block';
                refreshAdminValues();
            } else {
                if (pinGate) pinGate.style.display = 'block';
                if (adminContent) adminContent.style.display = 'none';
                if (pinInput) { pinInput.value = ''; pinInput.focus(); }
            }
        }
    }

    function closeFounderModal() {
        if (modal) modal.classList.remove('active');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeFounderModal);
    if (doneBtn) doneBtn.addEventListener('click', closeFounderModal);

    if (pinBtn && pinInput) {
        const verifyPin = () => {
            if (pinInput.value.trim() === '1608') {
                sessionStorage.setItem('hli_founder_unlocked', 'true');
                if (pinError) pinError.style.display = 'none';
                if (pinGate) pinGate.style.display = 'none';
                if (adminContent) adminContent.style.display = 'block';
                refreshAdminValues();
            } else {
                if (pinError) pinError.style.display = 'block';
                pinInput.focus();
            }
        };
        pinBtn.addEventListener('click', verifyPin);
        pinInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') verifyPin(); });
    }

    // Save Controls
    const saveVisitsBtn = document.getElementById('admin-btn-save-visits');
    if (saveVisitsBtn) {
        saveVisitsBtn.addEventListener('click', () => {
            const val = parseInt(document.getElementById('admin-input-visits')?.value || '0', 10);
            if (!isNaN(val) && val >= 0) {
                localStorage.setItem('hli_total_visits', val.toString());
                refreshAdminValues();
                alert('Total visits record updated to ' + val);
            }
        });
    }

    const saveRegBtn = document.getElementById('admin-btn-save-registered');
    if (saveRegBtn) {
        saveRegBtn.addEventListener('click', () => {
            const val = parseInt(document.getElementById('admin-input-registered')?.value || '0', 10);
            if (!isNaN(val) && val >= 0) {
                localStorage.setItem('hli_registered_count', val.toString());
                localStorage.setItem('totalHelped', val.toString());
                refreshAdminValues();
                const stencil = document.getElementById('stencil-count');
                if (stencil) {
                    const stats = getBristolAnalytics();
                    stencil.innerHTML = stats.remainingCount.toLocaleString().replace(/,/g, '<span class="small-comma">,</span>');
                }
                alert('Registered count updated to ' + val);
            }
        });
    }

    const saveOffsetBtn = document.getElementById('admin-btn-save-offset');
    if (saveOffsetBtn) {
        saveOffsetBtn.addEventListener('click', () => {
            const val = parseInt(document.getElementById('admin-input-offset')?.value || '0', 10);
            if (!isNaN(val)) {
                localStorage.setItem('hli_founder_offset', val.toString());
                refreshAdminValues();
                const stencil = document.getElementById('stencil-count');
                if (stencil) {
                    const stats = getBristolAnalytics();
                    stencil.innerHTML = stats.remainingCount.toLocaleString().replace(/,/g, '<span class="small-comma">,</span>');
                }
                alert('Offset adjusted to ' + val);
            }
        });
    }

    const exportBtn = document.getElementById('admin-btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const stats = getBristolAnalytics();
            const members = JSON.parse(localStorage.getItem('hli_registered_members') || localStorage.getItem('registeredMembers') || '[]');
            const exportData = {
                initiative: 'Hearing Loss Initiative - Bristol',
                exportDate: new Date().toISOString(),
                stats: stats,
                members: members
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hli_records_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    const resetSessionBtn = document.getElementById('admin-btn-reset-session');
    if (resetSessionBtn) {
        resetSessionBtn.addEventListener('click', () => {
            if (confirm('Reset your current session test flow while preserving total visits and member records?')) {
                window.resetAppSession();
            }
        });
    }

    // Keyboard trigger: Ctrl+Shift+A or Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            openFounderModal();
        }
    });

    // Triple click trigger on top logos
    let logoClicks = 0;
    let logoTimer;
    document.querySelectorAll('#hli-logo, .hli-logo-top, .top-nav img').forEach(logo => {
        logo.addEventListener('click', () => {
            logoClicks++;
            clearTimeout(logoTimer);
            if (logoClicks >= 3) {
                logoClicks = 0;
                openFounderModal();
            } else {
                logoTimer = setTimeout(() => { logoClicks = 0; }, 1200);
            }
        });
    });

    // Global helper APIs
    window.hliAdmin = openFounderModal;
    window.hliFounder = {
        panel: openFounderModal,
        getStats: getBristolAnalytics,
        setVisits: (n) => {
            localStorage.setItem('hli_total_visits', parseInt(n, 10).toString());
            refreshAdminValues();
            console.log('HLI Visits set to:', n);
        },
        setRegistered: (n) => {
            localStorage.setItem('hli_registered_count', parseInt(n, 10).toString());
            localStorage.setItem('totalHelped', parseInt(n, 10).toString());
            refreshAdminValues();
            console.log('HLI Registered count set to:', n);
        },
        setOffset: (n) => {
            localStorage.setItem('hli_founder_offset', parseInt(n, 10).toString());
            refreshAdminValues();
            console.log('HLI Offset set to:', n);
        },
        getMembers: () => JSON.parse(localStorage.getItem('hli_registered_members') || '[]')
    };
}

// ==========================================================================
// SCROLL UTILITIES (ROBUST ACROSS ALL BROWSERS & WINDOWS WEBVIEWS)
// ==========================================================================
function robustScrollBy(distance) {
    const startY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // 1. Native smooth scroll attempt
    try {
        window.scrollBy({ top: distance, behavior: 'smooth' });
    } catch (e) {}

    // 2. Fail-safe animation fallback if native scroll didn't move
    setTimeout(() => {
        const currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (Math.abs(currentY - startY) < 3) {
            const targetY = Math.max(0, startY + distance);
            const duration = 280;
            const startTime = performance.now();

            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = progress * (2 - progress);
                const newY = Math.round(startY + (distance * ease));

                window.scrollTo(0, newY);
                if (document.documentElement) document.documentElement.scrollTop = newY;
                if (document.body) document.body.scrollTop = newY;

                if (progress < 1) {
                    const rAF = (typeof window !== 'undefined' && window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16));
                    rAF(step);
                }
            }
            const rAF = (typeof window !== 'undefined' && window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16));
            rAF(step);
        }
    }, 40);
}

function robustScrollToTop() {
    try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {}

    setTimeout(() => {
        const currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (currentY > 5) {
            const startY = currentY;
            const duration = 300;
            const startTime = performance.now();

            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = progress * (2 - progress);
                const newY = Math.round(startY * (1 - ease));

                window.scrollTo(0, newY);
                if (document.documentElement) document.documentElement.scrollTop = newY;
                if (document.body) document.body.scrollTop = newY;

                if (progress < 1) {
                    const rAF = (typeof window !== 'undefined' && window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16));
                    rAF(step);
                }
            }
            const rAF = (typeof window !== 'undefined' && window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16));
            rAF(step);
        }
    }, 40);
}

// ==========================================================================
// 1. FLOATING SCROLL CONTROLS (RIGHT SIDE MIDDLE - ALL DISPLAYS)
// ==========================================================================
function initFloatingScrollControls() {
    const path = (window.location.pathname || '').toLowerCase();
    const isLanding = path.endsWith('/index.html') || path.endsWith('index.html') || path === '/' || path === '' || (document.body && document.body.classList.contains('landing-page'));
    if (isLanding || path.endsWith('/path-experience.html') || path.endsWith('path-experience.html') || path.includes('path-it-goes-to-11')) {
        return;
    }
    if (document.body && (document.body.classList.contains('spinal-tap-theme') || document.body.classList.contains('landing-page'))) {
        return;
    }

    if (document.getElementById('floating-scroll-controls')) return;

    const container = document.createElement('div');
    container.className = 'floating-scroll-controls';
    container.id = 'floating-scroll-controls';
    container.setAttribute('aria-label', 'Page scroll controls');

    const upBtn = document.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'scroll-btn scroll-up';
    upBtn.id = 'scroll-up-btn';
    upBtn.setAttribute('aria-label', 'Scroll Up');
    upBtn.setAttribute('title', 'Scroll Up');
    upBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>`;

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'scroll-btn scroll-down';
    downBtn.id = 'scroll-down-btn';
    downBtn.setAttribute('aria-label', 'Scroll Down');
    downBtn.setAttribute('title', 'Scroll Down');
    downBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    container.appendChild(upBtn);
    container.appendChild(downBtn);

    const mount = () => {
        if (document.body && !document.getElementById('floating-scroll-controls')) {
            document.body.appendChild(container);
        }
    };

    if (document.body) {
        mount();
    } else {
        document.addEventListener('DOMContentLoaded', mount);
    }

    upBtn.addEventListener('click', (e) => {
        e.preventDefault();
        robustScrollBy(-Math.round(window.innerHeight * 0.75));
    });

    downBtn.addEventListener('click', (e) => {
        e.preventDefault();
        robustScrollBy(Math.round(window.innerHeight * 0.75));
    });
}

// ==========================================================================
// 2. FLOATING BACK TO TOP BUTTON (LEFT HAND SIDE TOP - APPEARS ON LONG PAGES)
// ==========================================================================
function initBackToTopButton() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.endsWith('/path-experience.html') || path.endsWith('path-experience.html')) {
        return;
    }

    if (document.getElementById('hli-back-to-top')) return;

    const btn = document.createElement('button');
    btn.id = 'hli-back-to-top';
    btn.type = 'button';
    btn.className = 'hli-back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top of page');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <span>Top</span>
    `;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        robustScrollToTop();
    });

    const mount = () => {
        if (document.body && !document.getElementById('hli-back-to-top')) {
            document.body.appendChild(btn);
            checkPageLength();
        }
    };

    if (document.body) {
        mount();
    } else {
        document.addEventListener('DOMContentLoaded', mount);
    }

    function checkPageLength() {
        const totalHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight || 0,
            document.documentElement.offsetHeight || 0
        );
        const viewportHeight = window.innerHeight || 800;
        const isLongPage = totalHeight > (viewportHeight + 150);

        if (isLongPage) {
            btn.style.display = 'inline-flex';
            btn.classList.add('visible');
        } else {
            btn.style.display = 'none';
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('resize', checkPageLength, { passive: true });
    window.addEventListener('scroll', checkPageLength, { passive: true });
    checkPageLength();
    setTimeout(checkPageLength, 350);
}

// ==========================================================================
// 3. GLOBAL SUBTLE SOCIAL CONNECT LINKS (INSTAGRAM, PATREON, LINKEDIN)
// ==========================================================================
function initGlobalSocialLinks() {
    const path = (window.location.pathname || '').toLowerCase();
    // Exclude path-it-goes-to-11 to preserve full-screen dial positioning
    if (path.includes('path-it-goes-to-11')) {
        return;
    }

    const footers = document.querySelectorAll('.hli-minimal-footer');
    if (!footers || footers.length === 0) return;

    footers.forEach(footer => {
        if (footer.querySelector('.hli-social-connect-bar')) return;

        const socialBar = document.createElement('div');
        socialBar.className = 'hli-social-connect-bar';
        socialBar.setAttribute('aria-label', 'Official Social and Community Links');
        socialBar.innerHTML = `
            <span class="hli-social-connect-label">Connect &amp; Support:</span>
            <a href="https://www.instagram.com/hearinglossinitiative/" target="_blank" rel="noopener noreferrer" class="hli-social-pill pill-instagram" title="Follow us on Instagram @hearinglossinitiative" aria-label="Follow us on Instagram @hearinglossinitiative">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
            </a>
            <a href="https://www.patreon.com/cw/hearinglossinitiative" target="_blank" rel="noopener noreferrer" class="hli-social-pill pill-patreon" title="Support our mission on Patreon" aria-label="Support our mission on Patreon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.001 23.476h4.89V.524H.001z"/></svg>
                <span>Patreon</span>
            </a>
            <a href="https://www.linkedin.com/company/hearing-loss-initiative/" target="_blank" rel="noopener noreferrer" class="hli-social-pill pill-linkedin" title="Connect with us on LinkedIn" aria-label="Connect with us on LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.8v-7.6h-2.8M7.86 6.5a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63a1.63 1.63 0 0 0 1.63-1.63c0-.9-.73-1.62-1.63-1.62Z"/></svg>
                <span>LinkedIn</span>
            </a>
        `;
        footer.insertBefore(socialBar, footer.firstChild);
    });
}

// ==========================================================================
// 4. MAIN PATHWAY THEMES (YES PATH & SUPPORT PATH DISTINCTION)
// ==========================================================================
function initMainPathwayThemes() {
    const path = (window.location.pathname || '').toLowerCase();
    const isYesPath = path.endsWith('/path-yes.html') || path.endsWith('path-yes.html');
    const isSupportPath = path.endsWith('/path-support.html') || path.endsWith('path-support.html');

    if (isYesPath) {
        document.body.classList.add('path-yes-page');
    } else if (isSupportPath) {
        document.body.classList.add('path-support-page');
    }
}

// Auto-initialize components
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initFloatingScrollControls();
        initBackToTopButton();
        initGlobalSocialLinks();
        initMainPathwayThemes();
    });
} else {
    initFloatingScrollControls();
    initBackToTopButton();
    initGlobalSocialLinks();
    initMainPathwayThemes();
}

