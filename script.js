// script.js - GOLDEN VERSION REFINED
document.addEventListener("DOMContentLoaded", () => {
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
                const hasVisitedSupport = localStorage.getItem('hasVisitedSupport');
                if (hasVisitedSupport === 'true') {
                    window.location.href = 'path-support.html';
                } else {
                    localStorage.setItem('hasVisitedSupport', 'true');
                    window.location.href = 'path-experience.html';
                }
            }, 600);
        });
    }

    // REGISTRATION SUBMISSION LOGIC (PARDON SCREEN WITH ANIMATED COUNTDOWN)
    window.handleRegistrationSubmission = function() {
        if (modal) modal.classList.remove('active');
    
        const mainNumber = document.getElementById('stencil-count');
        const actionPanel = document.getElementById('bottom-action-panel');
    
        if (actionPanel) {
            let totalHelped = parseInt(localStorage.getItem('totalHelped') || 0);
            totalHelped++;
            localStorage.setItem('totalHelped', totalHelped);
            const startVal = Math.max(0, 62220 - (totalHelped - 1));
            const finalCount = Math.max(0, 62220 - totalHelped);

            // Dynamic Random Digit Jumble/Cipher Shuffle Effect for Landing Page Stencil Number
            if (mainNumber) {
                let ticks = 0;
                const maxTicks = 24; // ~1.1s duration at 45ms per jumble step
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
                    <div style="margin-top: 10vh; text-align: center;">
                        <h2 style="color: #ffffff; font-size: 3rem; margin: 0 0 15px 0; font-weight: 900; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(0,0,0,0.9);">One more person joined the initiative.</h2>
                        <p style="color: #ccc; font-size: 1.5rem; margin-bottom: 50px; text-shadow: 0 2px 10px rgba(0,0,0,0.9); font-weight: 500;">Welcome to the Bristol network${nameGreeting}.</p>
                        <button id="btn-continue-hub" style="background: #005EB8; color: white; border: none; padding: 25px 80px; font-size: 1.6rem; border-radius: 18px; cursor: pointer; font-weight: 800; text-transform: uppercase; box-shadow: 0 10px 40px rgba(0,0,0,0.6); transition: transform 0.2s;">Continue &rarr;</button>
                    </div>
                `;
                
                document.getElementById('btn-continue-hub').addEventListener('click', () => {
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
                        window.location.href = 'path-yes.html';
                    }, 600);
                });
            }, 1750);
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
