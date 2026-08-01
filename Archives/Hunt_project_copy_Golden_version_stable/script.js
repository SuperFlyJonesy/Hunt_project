// script.js - GOLDEN VERSION
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

    // REGISTRATION SUBMISSION LOGIC
    window.handleRegistrationSubmission = function() {
        if (modal) modal.classList.remove('active');
    
        const mainNumber = document.getElementById('stencil-count');
        const actionPanel = document.getElementById('bottom-action-panel');
    
        if (mainNumber && actionPanel) {
            let startCount = parseInt(localStorage.getItem('currentCount') || 62220);
            let finalCount = startCount - 1;
            
            // Update Storage
            localStorage.setItem('currentCount', finalCount);
            localStorage.setItem('hasVisitedHub', 'true');

            let ticks = 0;
            const clockInterval = setInterval(() => {
                // Rapid random fluctuations for dramatic effect
                let randomTick = startCount - Math.floor(Math.random() * 99);
                mainNumber.innerText = randomTick.toLocaleString();
                ticks++;
                
                if (ticks >= 24) {
                    clearInterval(clockInterval);
                    mainNumber.innerText = finalCount.toLocaleString();
                    
                    // Dramatic pop animation
                    mainNumber.style.transform = 'scale(1.1)';
                    setTimeout(() => { mainNumber.style.transform = 'scale(1)'; }, 400);

                    // Inject Welcome Message
                    actionPanel.innerHTML = `
                        <div style="padding: 40px; background: rgba(0,0,0,0.8); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                            <h2 style="color: #ffffff; font-size: 2.2rem; margin: 0 0 10px 0;">One more person joined the community.</h2>
                            <p style="color: #ccc; font-size: 1.2rem; margin-bottom: 30px;">Welcome to the Bristol network.</p>
                            <button id="btn-continue-hub" style="background: #005EB8; color: white; border: none; padding: 18px 40px; font-size: 1.3rem; border-radius: 12px; cursor: pointer; font-weight: bold;">Continue &rarr;</button>
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
    if (!prologue) return;
    
    const stats = prologue.querySelectorAll('.stat');
    let isPrologueActive = true;
    let currentStatIndex = 0;
    let loopTimeout;
    let shuffledDeck = [];
    const highlightColors = ['#f39c12', '#ff0f5b', '#2b6df2', '#00ffcc', '#9b59b6'];
    
    function playPrologueLoop() {
        if (!isPrologueActive || stats.length === 0) return;

        stats.forEach(stat => {
            stat.style.opacity = '0';
            stat.querySelectorAll('.base-text').forEach(t => t.style.opacity = '0');
            stat.querySelectorAll('.highlight').forEach(h => h.style.opacity = '0');
        });

        const currentStat = stats[currentStatIndex];
        prologue.style.setProperty('--highlight-color', highlightColors[currentStatIndex % highlightColors.length]);

        // Randomize Position (STABLE PROLOGUE FEATURE)
        currentStat.style.top = (Math.random() * 55 + 15) + 'vh';
        currentStat.style.left = (Math.random() * 30 + 5) + 'vw';

        currentStat.style.opacity = '1';
        currentStat.querySelectorAll('.base-text').forEach(t => t.style.opacity = '1');
        currentStat.querySelectorAll('.highlight').forEach(h => h.style.opacity = '1');

        loopTimeout = setTimeout(() => {
            currentStat.querySelectorAll('.base-text').forEach(t => t.style.opacity = '0');
            setTimeout(() => {
                currentStat.querySelectorAll('.highlight').forEach(h => h.style.opacity = '0');
                setTimeout(() => {
                    if (shuffledDeck.length === 0) {
                        for (let i = 0; i < stats.length; i++) shuffledDeck.push(i);
                        for (let i = shuffledDeck.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
                        }
                    }
                    currentStatIndex = shuffledDeck.pop();
                    playPrologueLoop();
                }, 2000); 
            }, 300);
        }, 5000);
    }
    
    prologue.addEventListener('click', () => {
        isPrologueActive = false;
        clearTimeout(loopTimeout);
        prologue.style.display = 'none';
        
        const curtainTop = document.getElementById('curtain-top');
        const curtainBottom = document.getElementById('curtain-bottom');
        if(curtainTop && curtainBottom) {
            curtainTop.style.transform = "translateY(-100%)";
            curtainBottom.style.transform = "translateY(100%)";
        }
    });
    
    playPrologueLoop();
}
