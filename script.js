// Track opened letters
let openedLetters = new Set();

// Envelope positions for floating effect
const envelopePositions = [
    { x: 15, y: 20, rotation: -15, delay: 0 },
    { x: 65, y: 15, rotation: 12, delay: 0.5 },
    { x: 40, y: 45, rotation: -8, delay: 1 },
    { x: 10, y: 65, rotation: 18, delay: 1.5 },
    { x: 60, y: 70, rotation: -12, delay: 2 }
];

// Create floating hearts
function createHearts() {
    const container = document.getElementById('hearts');
    const heartSymbols = ['♥', '♡', '❤'];

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createHeart(container, heartSymbols);
        }, i * 500);
    }

    setInterval(() => {
        createHeart(container, heartSymbols);
    }, 2500);
}

function createHeart(container, symbols) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (12 + Math.random() * 18) + 'px';
    heart.style.animationDuration = (8 + Math.random() * 6) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 16000);
}

// Start experience
function startExperience() {
    document.getElementById('welcome').classList.remove('active');
    document.getElementById('envelopesScreen').classList.add('active');
    createFloatingEnvelopes();
}

// Create floating envelopes
function createFloatingEnvelopes() {
    const container = document.getElementById('envelopesArea');
    container.innerHTML = '';

    letters.forEach((letter, index) => {
        const pos = envelopePositions[index];
        const isOpened = openedLetters.has(letter.id);

        const envelope = document.createElement('div');
        envelope.className = `floating-envelope ${isOpened ? 'opened' : ''}`;
        envelope.style.left = `${pos.x}%`;
        envelope.style.top = `${pos.y}%`;
        envelope.style.setProperty('--rotation', `${pos.rotation}deg`);
        envelope.style.animationDelay = `${pos.delay}s`;
        envelope.onclick = () => openLetter(letter, envelope);

        envelope.innerHTML = `
            <svg class="envelope-svg" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                <!-- Envelope body -->
                <rect class="envelope-body-svg" x="0" y="20" width="120" height="60" rx="4"/>
                <!-- Inner shadow -->
                <polygon class="envelope-inner-svg" points="0,20 60,55 120,20"/>
                <!-- Flap -->
                <polygon class="envelope-flap-svg" points="0,20 60,55 120,20 120,20 60,0 0,20"/>
                <!-- Heart seal -->
                <g transform="translate(60, 35)">
                    <path class="envelope-heart" d="M0,-8 C-4,-12 -10,-8 -10,-3 C-10,3 0,10 0,10 C0,10 10,3 10,-3 C10,-8 4,-12 0,-8"/>
                </g>
            </svg>
            <span class="envelope-number">${letter.id}</span>
        `;

        container.appendChild(envelope);
    });

    updateProgress();
}

// Open letter with animation
function openLetter(letter, envelopeElement) {
    if (openedLetters.has(letter.id)) return;

    // Create sparkles
    createSparkles(envelopeElement);

    // Set letter content
    document.getElementById('letterPhoto').src = letter.photo;
    document.getElementById('letterText').textContent = letter.message;

    // Show overlay
    const overlay = document.getElementById('letterOverlay');
    const envelopeLarge = document.getElementById('envelopeLarge');

    overlay.classList.add('active');

    // Trigger opening animation after a brief delay
    setTimeout(() => {
        envelopeLarge.classList.add('opening');
    }, 300);

    // Mark as opened
    openedLetters.add(letter.id);
    envelopeElement.classList.add('opened');
    updateProgress();
}

// Create sparkle effect
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.background = ['#ffd700', '#ff69b4', '#ff1493', '#ffffff'][Math.floor(Math.random() * 4)];

        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 600);
    }
}

// Close letter
function closeLetter() {
    const overlay = document.getElementById('letterOverlay');
    const envelopeLarge = document.getElementById('envelopeLarge');

    envelopeLarge.classList.remove('opening');

    setTimeout(() => {
        overlay.classList.remove('active');
    }, 300);

    // Check if all letters are opened
    if (openedLetters.size === letters.length) {
        setTimeout(() => {
            showFinalScreen();
        }, 800);
    }
}

// Update progress
function updateProgress() {
    const text = document.getElementById('progressText');
    text.textContent = `${openedLetters.size} / ${letters.length} letters opened`;
}

// Show final screen
function showFinalScreen() {
    document.getElementById('envelopesScreen').classList.remove('active');
    document.getElementById('finalScreen').classList.add('active');

    // Update final message from config
    document.querySelector('.final-content h1').textContent = finalMessage.title;
    document.querySelector('.final-message').textContent = finalMessage.text;
    document.querySelector('.final-content .signature').textContent = finalMessage.signature;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createHearts();
});
