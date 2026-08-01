// script.js - GOLDEN VERSION REFINED
document.addEventListener("DOMContentLoaded", () => {
    // 1. FADE PAGE IN SAFELY
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        setTimeout(() => overlay.classList.add('reveal'), 150);
    }

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

    // Initialize Bristol Count from localStorage
    let currentCount = parseInt(localStorage.getItem('currentCount')) || 62220;
    if(stencilCount) stencilCount.textContent = currentCount.toLocaleString();

    // Modal Handling
    if(ctaYes) ctaYes.addEventListener('click', () => modal.classList.add('active'));
    if(closeModal) closeModal.addEventListener('click', () => modal.classList.remove('active'));
    if(ctaSupport) ctaSupport.addEventListener('click', () => window.location.href = 'path-support.html');

    // REGISTRATION SUBMISSION LOGIC (PARDON SCREEN)
    window.handleRegistrationSubmission = function() {
        if (modal) modal.classList.remove('active');
    
        const mainNumber = document.getElementById('stencil-count');
        const actionPanel = document.getElementById('bottom-action-panel');
    
        if (mainNumber && actionPanel) {
            let startCount = parseInt(localStorage.getItem('currentCount') || 62220);
            let finalCount = startCount - 1;
            
            // FIX 3: Increment Community Impact counter
            let totalHelped = parseInt(localStorage.getItem('totalHelped') || 0);
            totalHelped++;
            localStorage.setItem('totalHelped', totalHelped);

            // Update Storage
            localStorage.setItem('currentCount', finalCount);
            localStorage.setItem('hasVisitedHub', 'true');

            let ticks = 0;
            const clockInterval = setInterval(() => {
                let randomTick = startCount - Math.floor(Math.random() * 99);
                mainNumber.innerText = randomTick.toLocaleString();
                ticks++;
                
                if (ticks >= 24) {
                    clearInterval(clockInterval);
                    mainNumber.innerText = finalCount.toLocaleString();
                    
                    mainNumber.style.transform = 'translateY(-8vh) scale(1.1)'; // Keep offset
                    setTimeout(() => { mainNumber.style.transform = 'translateY(-8vh) scale(1)'; }, 400);

                    // FIX 1: Inject Welcome Message (No container/box)
                    actionPanel.innerHTML = `
                        <div style="margin-top: 10vh; text-align: center;">
                            <h2 style="color: #ffffff; font-size: 3rem; margin: 0 0 15px 0; font-weight: 900; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(0,0,0,0.9);">One more person joined the initiative.</h2>
                            <p style="color: #ccc; font-size: 1.5rem; margin-bottom: 50px; text-shadow: 0 2px 10px rgba(0,0,0,0.9); font-weight: 500;">Welcome to the Bristol network, Jsondo.</p>
                            <button id="btn-continue-hub" style="background: #005EB8; color: white; border: none; padding: 25px 80px; font-size: 1.6rem; border-radius: 18px; cursor: pointer; font-weight: 800; text-transform: uppercase; box-shadow: 0 10px 40px rgba(0,0,0,0.6); transition: transform 0.2s;">Continue &rarr;</button>
                        </div>
                    `;
                    
                    document.getElementById('btn-continue-hub').addEventListener('click', () => {
                        window.location.href = 'path-yes.html';
                    });
                }
            }, 50);
        }
    };

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.handleRegistrationSubmission();
        });
    }

    if (quickJoin) {
        quickJoin.addEventListener('click', () => {
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

        // 3. Position Logic
        if (currentStatIndex === 0) {
            currentStat.style.top = '50%';
            currentStat.style.left = '50%';
            currentStat.style.transform = 'translate(-50%, -50%)';
        } else {
            currentStat.style.transform = 'none';
            currentStat.style.top = (Math.random() * 55 + 10) + 'vh';
            currentStat.style.left = Math.random() * (window.innerWidth - currentStat.offsetWidth - 80) + 40 + 'px';
        }

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
    prologue.addEventListener('click', () => {
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
    });
    
    // Start the loop
    playPrologueLoop();
}
