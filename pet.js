/*
 * Safe Space - Dough Spirit (Pet) System
 */

let petMoveInterval;
let isDragging = false;
let speechTimeout;
let lastInteractionTime = 0;

const comfortMessages = [
    '記得喝水喔 <span class="kaomoji">( ˘ ³˘)♥</span>',
    '深呼吸～ <span class="kaomoji">( ´ ▽ ` )ﾉ</span>',
    '我在這裡陪你 <span class="kaomoji">(´• ω •`)</span>',
    '你做得很好 <span class="kaomoji">(๑•̀ㅂ•́)و✧</span>',
    '休息一下吧 <span class="kaomoji">_(:3 」∠ )_</span>',
    '慢慢來 <span class="kaomoji">(・∀・)</span>',
    '放輕鬆～ <span class="kaomoji">(￣▽￣)~*</span>',
    '感受當下 <span class="kaomoji">(❁´◡`❁)</span>',
    '抱抱 <span class="kaomoji">(つ´ω`)つ</span>'
];

function initPetSystem() {
    const savedX = localStorage.getItem('petX');
    const savedY = localStorage.getItem('petY');

    if (savedX && savedY) {
        petEl.style.left = savedX + 'px';
        petEl.style.top = savedY + 'px';
    } else {
        petEl.style.left = (window.innerWidth - 100) + 'px';
        petEl.style.top = '100px';
    }

    setupPetInteraction();
    updatePetVisibility();
    if (isPetActive) startPetBehavior();
}

function updatePetVisibility() {
    if (isPetActive) {
        petEl.style.display = 'block';
        startPetBehavior();
        showSpeech('我回來了！', 2000);
    } else {
        petEl.style.display = 'none';
        stopPetBehavior();
    }
}

function startPetBehavior() {
    clearInterval(petMoveInterval);
    petMoveInterval = setInterval(() => {
        if(!isDragging) movePetRandomly();
    }, 12000);
}

function stopPetBehavior() {
    clearInterval(petMoveInterval);
}

function movePetRandomly() {
    petEl.classList.add('auto-moving');
    const maxX = window.innerWidth - 90;
    const maxY = window.innerHeight - 90;
    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(80, Math.random() * maxY);

    petEl.style.left = randomX + 'px';
    petEl.style.top = randomY + 'px';

    localStorage.setItem('petX', randomX);
    localStorage.setItem('petY', randomY);
}

function setupPetInteraction() {
    let startX, startY, initialLeft, initialTop, moveDistance = 0;

    const startDrag = (e) => {
        if(!isPetActive) return;
        isDragging = true;
        petEl.classList.remove('auto-moving');
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX = clientX; startY = clientY;
        initialLeft = petEl.offsetLeft; initialTop = petEl.offsetTop;
        moveDistance = 0;
        resumeAudioContext();
    };

    const doDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const dx = clientX - startX;
        const dy = clientY - startY;
        moveDistance += Math.abs(dx) + Math.abs(dy);
        petEl.style.left = (initialLeft + dx) + 'px';
        petEl.style.top = (initialTop + dy) + 'px';
    };

    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        localStorage.setItem('petX', parseInt(petEl.style.left));
        localStorage.setItem('petY', parseInt(petEl.style.top));
        if (moveDistance < 10) {
            const now = Date.now();
            if (now - lastInteractionTime > 300) {
                triggerInteraction();
                lastInteractionTime = now;
            }
        }
    };
    petEl.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', endDrag);
    petEl.addEventListener('touchstart', startDrag, {passive: false});
    window.addEventListener('touchmove', doDrag, {passive: false});
    window.addEventListener('touchend', endDrag);
}

function triggerInteraction() {
    if (navigator.vibrate) navigator.vibrate(50);
    if (isSfxOn) playExhaleSound();
    const body = petEl.querySelector('.pet-svg-body');
    body.classList.remove('pet-shake');
    void petEl.offsetWidth;
    body.classList.add('pet-shake');
    const msg = comfortMessages[Math.floor(Math.random() * comfortMessages.length)];
    showSpeech(msg, 3500);
}

function showSpeech(text, duration) {
    if (speechTimeout) clearTimeout(speechTimeout);
    const petSpeech = document.getElementById('pet-speech');
    petSpeech.innerHTML = text;
    petSpeech.classList.add('show');
    speechTimeout = setTimeout(() => {
        petSpeech.classList.remove('show');
    }, duration);
}
