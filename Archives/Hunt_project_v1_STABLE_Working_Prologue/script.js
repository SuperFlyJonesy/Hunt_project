// Global Reset
document.addEventListener('click', (e) => { 
    if(e.target.id === 'dev-reset') { 
        localStorage.removeItem('hasVisitedHub'); 
        window.location.href = 'index.html'; 
    } 
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. FADE PAGE IN SAFELY
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        setTimeout(() => overlay.classList.add('reveal'), 150); // Slight delay ensures CSS is ready
    }

    // 2. RETURNING USER BYPASS
    const hasVisited = localStorage.getItem('hasVisitedHub');
    const prologue = document.getElementById('prologue-lockdown');
    
    // If they are a returning user, instantly hide the prologue so they see the main site
    if (hasVisited === 'true' && prologue) {
        prologue.style.display = 'none';
    } else {
        // Only run prologue if not bypassed
        initPrologue();
    }

    // 3. SEAMLESS LINK ROUTING (Fade to black before leaving)
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only intercept internal relative links, not external ones like Bristol City Council
            if (href && !href.startsWith('http') && !href.startsWith('#') && !link.classList.contains('citation-link')) {
                e.preventDefault();
                if (overlay) {
                    overlay.classList.remove('reveal'); // Fade to black
                }
                setTimeout(() => { window.location.href = href; }, 800); // Wait for fade, then route
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

        // 3. Randomize Position
        currentStat.style.top = (Math.random() * 55 + 15) + 'vh'; // 15vh to 70vh
        currentStat.style.left = (Math.random() * 30 + 5) + 'vw'; // 5vw to 35vw

        // 4. Fade in entire current stat
        currentStat.style.opacity = '1';
        currentStat.querySelectorAll('.base-text').forEach(t => t.style.opacity = '1');
        currentStat.querySelectorAll('.highlight').forEach(h => {
            h.style.opacity = '1';
        });

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

    // Main UI Logic (Registering listeners here if not bypassed)
    const ctaYes = document.getElementById('cta-yes');
    const ctaSupport = document.getElementById('cta-support');
    const btnDonate = document.getElementById('btn-donate');
    const closeModal = document.getElementById('close-modal');
    const submitBtn = document.getElementById('submit-btn');
    const stencilCount = document.getElementById('stencil-count');

    // Initialize Bristol Count from localStorage
    let count = parseInt(localStorage.getItem('bristolCount')) || 62220;
    if(stencilCount) stencilCount.textContent = count;

    // Modal Handling
    const openModal = () => {
        modal.classList.add('active');
    };

    const hideModal = () => {
        modal.classList.remove('active');
    };

    if(ctaYes) ctaYes.addEventListener('click', openModal);
    if(ctaSupport) ctaSupport.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'path-support.html';
    });
    // Removed Donate button listener
    if(closeModal) closeModal.addEventListener('click', hideModal);

    // Submit Action
    if(submitBtn) submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const postcode = document.getElementById('postcode').value;

        if (!name || !email || !postcode) {
            alert('Please fill out all fields.');
            return;
        }

        const mainNumber = document.querySelector('.stencil-layer');
        if (mainNumber) {
            let currentCount = parseInt(mainNumber.innerText.replace(/,/g, ''));
            if (!isNaN(currentCount)) {
                currentCount--;
                mainNumber.innerText = currentCount;
                // Dramatic pop animation when the number drops
                mainNumber.style.transform = 'scale(1.1)';
                setTimeout(() => { mainNumber.style.transform = 'scale(1)'; }, 400);
                // Save to memory
                localStorage.setItem('hubCount', currentCount); 
                localStorage.setItem('hasVisitedHub', 'true');
            }
        }

        // Hide the modal immediately so they can see the number change
        hideModal();

        // Wait 2.5 seconds to watch the number, then fade to the hub
        setTimeout(() => {
            const overlay = document.querySelector('.page-transition-overlay');
            if (overlay) overlay.classList.remove('reveal'); // Trigger fade to black
            setTimeout(() => { window.location.href = 'path-yes.html'; }, 800);
        }, 2500);
    });
}
