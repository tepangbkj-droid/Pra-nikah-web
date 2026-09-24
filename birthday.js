// birthday.js
export function initBirthdaySurprise() {
    const trigger = document.getElementById('birthday-trigger');
    
    // Munculkan tombol amplop setelah 2 detik halaman terbuka
    setTimeout(() => {
        if(trigger) {
            trigger.classList.remove('hidden');
        }
    }, 2000);

    // Load library confetti
    if (!window.confetti) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
        document.head.appendChild(script);
    }
}

window.openEnvelope = () => {
    const trigger = document.getElementById('birthday-trigger');
    const modal = document.getElementById('birthday-modal');
    const song = document.getElementById('birthday-song');
    const birthdayText = document.getElementById('birthday-message');
    
    const message = "Barakallah fii umrik sayang, semoga di usia ke-21 ini kamu makin bahagia dan semua rencana kita kedepan dilancarkan Allah. ❤️";

    // Sembunyikan tombol amplop
    if(trigger) trigger.classList.add('hidden');

    // Tampilkan Modal
    if(modal) {
        modal.classList.remove('hidden');
        
        // Putar Musik
        if(song) {
            song.play().catch(e => console.log("Musik butuh interaksi user"));
        }

        // Jalankan Confetti
        triggerConfetti();

        // Jalankan Efek Mengetik
        if(birthdayText) {
            birthdayText.innerHTML = "";
            typeWriter(birthdayText, message, 0);
        }
    }
};

function typeWriter(element, text, i) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(element, text, i + 1), 50);
    }
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }
}

window.closeBirthdayModal = () => {
    const modal = document.getElementById('birthday-modal');
    const song = document.getElementById('birthday-song');
    if (modal) {
        modal.classList.add('hidden');
        if(song) { song.pause(); song.currentTime = 0; }
    }
};