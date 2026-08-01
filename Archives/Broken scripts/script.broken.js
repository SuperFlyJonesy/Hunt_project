// script.js - REPAIRED VERSION
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
    } else if (prologue) {
        initPrologue();
    }

    // 3. SEAMLESS LINK ROUTING
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !link.classList.contains('citation-link')) {
                e.preventDefault();
                if (overlay) overlay.classList.remove('reveal');
                setTimeout(() => { window.location.href = href; }, 800);
            }
        });
    });

    // 4. Modal/Form Logic
    const modal = document.getElementById('registration-modal');
    const ctaYes = document.getElementById('cta-yes');
    const closeModal = document.getElementById('close-modal');
    const regForm = document.getElementById('registration-form');

    if (ctaYes) ctaYes.addEventListener('click', () => { if (modal) modal.classList.add('active'); });
    if (closeModal) closeModal.addEventListener('click', () => { if (modal) modal.classList.remove('active'); });

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('hasVisitedHub', 'true');
            window.location.href = 'path-yes.html';
        });
    }
});

function initPrologue() {
    const prologue = document.getElementById('prologue-lockdown');
    const stats = prologue.querySelectorAll('.stat');
    let isPrologueActive = true;
    const highlightColors = ['#f39c12', '#ff0f5b', '#2b6df2', '#00ffcc', '#9b59b6'];
    
    function playPrologueLoop(idx = 0) {
        if (!isPrologueActive) return;
        stats.forEach(s => s.style.opacity = '0');
        const currentStat = stats[idx % stats.length];
        prologue.style.setProperty('--highlight-color', highlightColors[idx % highlightColors.length]);
        currentStat.style.top = (Math.random() * 40 + 20) + 'vh';
        currentStat.style.left = (Math.random() * 40 + 30) + 'vw';
        currentStat.style.opacity = '1';
        setTimeout(() => playPrologueLoop(idx + 1), 4500);
    }
    playPrologueLoop();
    prologue.addEventListener('click', () => { isPrologueActive = false; prologue.style.display = 'none'; });
}
