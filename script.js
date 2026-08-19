// script.js - GOLDEN VERSION REFINED
document.addEventListener("DOMContentLoaded", () => {
    // Floating Scroll Nav Controls
    initFloatingScrollControls();
    initScrollAnimations();
    initWhoWeAreDropdown();
    initAccordions();
    initHubSearch();
    initOnSiteVideoPlayer();
    initTileTooltips();

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
        const curtainTop = document.getElementById('curtain-top');
        const curtainBottom = document.getElementById('curtain-bottom');
        if(curtainTop && curtainBottom) {
            curtainTop.style.display = 'none';
            curtainBottom.style.display = 'none';
        }
    } else {
        initPrologue();
    }

    // 3. DEV RESET LOGIC
    document.addEventListener('click', (e) => { 
        if(e.target.id === 'dev-reset') { 
            localStorage.clear(); 
            window.location.href = 'index.html'; 
        } 
    });

    // 4. MAIN UI ELEMENTS
    const ctaYes = document.getElementById('cta-yes');
    const ctaSupport = document.getElementById('cta-support');
    const modal = document.getElementById('registration-modal');
    const closeModal = document.getElementById('close-modal');
    const regForm = document.getElementById('registration-form');
    const quickJoin = document.getElementById('test-quick-join');
    const stencilCount = document.getElementById('stencil-count');
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

    // Initialize Bristol Count from localStorage for landing page stencil
    const totalHelped = parseInt(localStorage.getItem('totalHelped')) || 0;
    const currentCount = Math.max(0, 62220 - totalHelped);
    if (stencilCount) {
        stencilCount.innerHTML = currentCount.toLocaleString().replace(/,/g, '<span class="small-comma">,</span>');
    }

    // Modal & Pathway Handling
    if(ctaYes) ctaYes.addEventListener('click', () => modal.classList.add('active'));
    if(closeModal) closeModal.addEventListener('click', () => modal.classList.remove('active'));
    if(ctaSupport) {
        ctaSupport.addEventListener('click', () => {
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
                window.location.href = 'path-experience.html';
            }, 600);
        });
    }

    // REGISTRATION SUBMISSION LOGIC (PARDON SCREEN WITH ANIMATED COUNTDOWN)
    window.handleRegistrationSubmission = function() {
        if (modal) modal.classList.remove('active');
    
        const mainNumber = document.getElementById('stencil-count');
        const actionPanel = document.getElementById('bottom-action-panel');
        const introBlock = document.getElementById('intro-block');
        const ctaYes = document.getElementById('cta-yes');
        const ctaSupport = document.getElementById('cta-support');
    
        if (actionPanel) {
            // Immediately lock down and fade out initial prompt & buttons to prevent confusion or double-clicking
            if (ctaYes) ctaYes.disabled = true;
            if (ctaSupport) ctaSupport.disabled = true;
            actionPanel.style.pointerEvents = 'none';

            if (introBlock) {
                introBlock.style.transition = 'opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease';
                introBlock.style.opacity = '0';
                introBlock.style.filter = 'blur(4px)';
                introBlock.style.transform = 'translateY(10px)';
            }

            let totalHelped = parseInt(localStorage.getItem('totalHelped') || 0);
            totalHelped++;
            localStorage.setItem('totalHelped', totalHelped);
            const startVal = Math.max(0, 62220 - (totalHelped - 1));
            const finalCount = Math.max(0, 62220 - totalHelped);

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

            const enteredName = document.getElementById('user-name')?.value?.trim() || 'Initiate Supporter';
            let registeredMembers = JSON.parse(localStorage.getItem('registeredMembers') || '[]');
            
            const isFirst10 = registeredMembers.length < 10;
            registeredMembers.push({
                name: enteredName,
                tier: 'Initiate Supporter',
                date: new Date().toLocaleDateString(),
                isFirst10: isFirst10
            });
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
                        const actionPanel = document.getElementById('bottom-action-panel');
                        const stencil = document.getElementById('stencil-count');
                        
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
                        document.body.style.transition = 'background-color 0.7s ease';
                        document.body.style.backgroundColor = '#ffffff';

                        setTimeout(() => {
                            window.location.href = 'path-community-reel.html';
                        }, 600);
                    });
                }
            }, 950);
        }
    };

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.handleRegistrationSubmission();
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
    const modal = document.getElementById('registration-modal');
    if (!prologue) return; // Failsafe
    
    const stats = prologue.querySelectorAll('.stat');
    let isPrologueActive = true;
    let currentStatIndex = 0;
    let loopTimeout;
    let shuffledDeck = [];
    const highlightColors = ['#f39c12', '#ff0f5b', '#2b6df2', '#00ffcc', '#9b59b6'];
    
    function playPrologueLoop() {
        if (!isPrologueActive || stats.length === 0) return;

        // 1. Reset all stats to hidden
        stats.forEach(stat => {
            stat.style.opacity = '0';
            stat.querySelectorAll('.base-text').forEach(t => t.style.opacity = '0');
            stat.querySelectorAll('.highlight').forEach(h => {
                h.style.opacity = '0';
            });
        });

        // 2. Select current stat and set new brand color
        const currentStat = stats[currentStatIndex];
        prologue.style.setProperty('--highlight-color', highlightColors[currentStatIndex % highlightColors.length]);

        // 3. Position Logic: Bounded random positioning across screen without edge clipping or prompt overlap
        const statW = currentStat.offsetWidth || 300;
        const statH = currentStat.offsetHeight || 80;

        const isMobile = window.innerWidth <= 600;
        const minMarginX = isMobile ? 15 : 40;
        const minMarginTop = isMobile ? 60 : 90;
        const minMarginBottom = isMobile ? 100 : 140;

        const minCenterX = minMarginX + (statW / 2);
        const maxCenterX = window.innerWidth - minMarginX - (statW / 2);

        const minCenterY = minMarginTop + (statH / 2);
        const maxCenterY = window.innerHeight - minMarginBottom - (statH / 2);

        let targetX, targetY;

        if (currentStatIndex === 0) {
            targetX = window.innerWidth / 2;
            targetY = window.innerHeight / 2;
        } else {
            targetX = (maxCenterX > minCenterX) 
                ? minCenterX + Math.random() * (maxCenterX - minCenterX)
                : window.innerWidth / 2;

            targetY = (maxCenterY > minCenterY)
                ? minCenterY + Math.random() * (maxCenterY - minCenterY)
                : window.innerHeight / 2;
        }

        currentStat.style.left = `${targetX}px`;
        currentStat.style.top = `${targetY}px`;
        currentStat.style.transform = 'translate(-50%, -50%)';

        // 4. Fade in entire current stat
        currentStat.style.opacity = '1';
        currentStat.querySelectorAll('.base-text').forEach(t => t.style.opacity = '1');
        currentStat.querySelectorAll('.highlight').forEach(h => h.style.opacity = '1');

        // 5. Sequence timings
        loopTimeout = setTimeout(() => {
            // Phase A: Base text starts fading
            currentStat.querySelectorAll('.base-text').forEach(t => t.style.opacity = '0');
            
            // Trigger Phase B almost immediately so they overlap smoothly
            setTimeout(() => {
                // Phase B: Pure, smooth, slow dissolve
                currentStat.querySelectorAll('.highlight').forEach(h => {
                    h.style.opacity = '0'; 
                });

                // Phase C: Next Slide Logic (No Repeats)
                setTimeout(() => {
                    // If the deck is empty, refill it with all available indexes and shuffle
                    if (shuffledDeck.length === 0) {
                        for (let i = 0; i < stats.length; i++) {
                            shuffledDeck.push(i);
                        }
                        // Fisher-Yates Shuffle
                        for (let i = shuffledDeck.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
                        }
                    }
                    
                    // Draw the next random, unplayed stat from the deck
                    currentStatIndex = shuffledDeck.pop();
                    playPrologueLoop();
                }, 2000); 
            }, 300); // Reduced from 1000ms down to 300ms for the early trigger
        }, 5000); // Keeps the initial reading time the same
    }
    
    // Wire up the click-to-continue event to hide the lockdown wrapper
    const dismissPrologue = () => {
        isPrologueActive = false;
        clearTimeout(loopTimeout);
        prologue.style.display = 'none';
        
        // Curtain Animation
        const curtainTop = document.getElementById('curtain-top');
        const curtainBottom = document.getElementById('curtain-bottom');
        if(curtainTop && curtainBottom) {
            curtainTop.style.transform = "translateY(-100%)";
            curtainBottom.style.transform = "translateY(100%)";
        }
    };

    prologue.addEventListener('click', dismissPrologue);
    prologue.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dismissPrologue();
        }
    });
    
    // Start the loop
    playPrologueLoop();
}

// 5. FLOATING SCROLL CONTROLS
function initFloatingScrollControls() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.endsWith('/index.html') || path.endsWith('index.html') || path.endsWith('/path-experience.html') || path.endsWith('path-experience.html') || path === '/' || path === '') {
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
    upBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'scroll-btn scroll-down';
    downBtn.id = 'scroll-down-btn';
    downBtn.setAttribute('aria-label', 'Scroll Down');
    downBtn.setAttribute('title', 'Scroll Down');
    downBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

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

    function smoothScrollBy(distance) {
        const startY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        
        // 1. Try native smooth scrollBy
        window.scrollBy({ top: distance, behavior: 'smooth' });

        // 2. Fail-safe animation fallback if native scroll didn't move
        setTimeout(() => {
            const currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (Math.abs(currentY - startY) < 2) {
                const targetY = Math.max(0, startY + distance);
                const duration = 300;
                const startTime = performance.now();

                function step(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = progress * (2 - progress);
                    const newY = startY + (distance * easeProgress);

                    window.scrollTo(0, newY);
                    if (document.documentElement) document.documentElement.scrollTop = newY;
                    if (document.body) document.body.scrollTop = newY;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                }
                requestAnimationFrame(step);
            }
        }, 50);
    }

    upBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollBy(-Math.round(window.innerHeight * 0.7));
    });

    downBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollBy(Math.round(window.innerHeight * 0.7));
    });
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

    const clearBtn = document.getElementById('clear-search-btn');
    const feedback = document.getElementById('search-feedback');
    const hubSections = document.querySelectorAll('.hub-section');

    // Comprehensive cross-page topic & keyword dictionary
    const PAGE_SEARCH_INDEX = {
        'path-government-help.html': 'pip personal independence payment access to work atw grants funding dwp benefits financial support disabled persons railcard bus pass tax relief work scheme allowance equipment assessment disability living allowance dla attendance allowance universal credit blue badge vat relief',
        'path-job-interviews.html': 'job interviews work employment workplace adjustments reasonable adjustments equality act 2010 disclosure access to work atw career hiring boss manager discrimination cv interview tips questions candidate employer rights',
        'path-workplace-tips.html': 'workplace tips colleagues managers employers meetings inclusive office background noise video calls captions on teams zoom google meet meeting room acoustics roger pen microphone access to work reasonable adjustments',
        'path-hearing-aids-access.html': 'hearing aids nhs hearing aids private hearing aids bolero bolero m70 bolero series nova nova m naida naida series naida p-70 up phonak oticon resound widex signia starkey bte behind the ear ric receiver in canal ite in the ear cic completely in canal itc in the canal baha bchd bone conduction cros bicros cochlear implant airpods airpods pro batteries size 312 size 13 size 10 size 675 zinc-air tubing earmoulds moulds wax guards domes cleaning hearing aids audiologist uhbw repairs replacement fitting hiss bristol st michaels southmead',
        'path-hearing-aids.html': 'hearing aids bte ite itc body worn earmoulds thintubes cleaning batteries induction loops bolero phonak naida',
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
        'path-my-journey.html': 'my journey first steps roadmap where to begin starting out path guide steps navigation advice',
        'path-nhs.html': 'bristol nhs foundation trust hospital gp referral southmead hospital bri bristol royal infirmary audiology clinic ent ear nose throat appointments st michaels hospital uhbw nbt',
        'path-family-guide.html': 'family guide supporting family relatives partners children home communication dinner table syndrome habits face to face speaking clearly living with hard of hearing',
        'path-awareness.html': 'awareness pace framework patience attention clarity ear contact communication tactics communication tips rules understanding deaf hard of hearing',
        'path-training.html': 'training workplace workshops staff training customer service business awareness workshops online in-person bristol jason member initiate cpd inclusion',
        'path-join-outreach.html': 'join outreach volunteer volunteers greeter session host hearing loop helper peer supporter listener ambassador application email helping community charity',
        'path-sponsor-us.html': 'sponsor us corporate sponsor funding corporate partnership community sponsor training sponsor access loop sponsor esg csr 250 500 1500 donation grant',
        'path-join-us.html': 'join us patreon patreon initiative membership subscription a pardon an initiate a hunter gold standard wall of honour credits roll 3 6 12 support initiative',
        'path-bear-pit.html': 'the bear pit community hub events upcoming meetups calendar auracast temple meads social media feeds instagram linkedin social group discussions',
        'path-support.html': 'support branch support hub resources for friends families businesses',
        'path-yes.html': 'initiate main hub main journey pathways directory'
    };

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();

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
                const baseHref = rawHref.split('#')[0].split('?')[0].toLowerCase();
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



