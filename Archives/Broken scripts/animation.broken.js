document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('support-stats-container') || document.querySelector('.prologue-text');
    if (!container) return;
    const stats = container.querySelectorAll('.stat');
    let idx = 0;
    function loop() {
        stats.forEach(s => s.style.opacity = '0');
        if(stats[idx]) {
            stats[idx].style.opacity = '1';
            idx = (idx + 1) % stats.length;
            setTimeout(loop, 4500);
        }
    }
    loop();
    const prologue = document.querySelector('.prologue');
    if(prologue) prologue.addEventListener('click', () => {
        prologue.style.display = 'none';
    });
});
