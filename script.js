// Track opened letters
let openedLetters = new Set();

// Better positioned envelopes - spread out nicely on mobile
const envelopePositions = [
    { x: 10, y: 5, rotation: -12 },
    { x: 55, y: 8, rotation: 8 },
    { x: 25, y: 35, rotation: -5 },
    { x: 60, y: 42, rotation: 10 },
    { x: 35, y: 68, rotation: -8 }
];

// Create floating hearts background
function createHearts() {
    const container = document.getElementById('hearts');
    const heartSymbols = ['♥', '♡', '💕'];

    // Initial hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createHeart(container, heartSymbols), i * 600);
    }

    // Continuous hearts
    setInterval(() => createHeart(container, heartSymbols), 3000);
}

function createHeart(container, symbols) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (14 + Math.random() * 16) + 'px';
    heart.style.animationDuration = (10 + Math.random() * 8) + 's';
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 20000);
}

// Start the experience
function startExperience() {
    document.getElementById('welcome').classList.remove('active');
    setTimeout(() => {
        document.getElementById('envelopesScreen').classList.add('active');
        createFloatingEnvelopes();
        updateProgress();
    }, 300);
}

// Create the floating envelopes
function createFloatingEnvelopes() {
    const container = document.getElementById('envelopesArea');
    container.innerHTML = '';

    letters.forEach((letter, index) => {
        const pos = envelopePositions[index];
        const isOpened = openedLetters.has(letter.id);

        const envelope = document.createElement('div');
        envelope.className = `floating-envelope${isOpened ? ' opened' : ''}`;
        envelope.style.left = `${pos.x}%`;
        envelope.style.top = `${pos.y}%`;
        envelope.style.setProperty('--rotation', `${pos.rotation}deg`);
        envelope.style.animationDelay = `${index * 0.3}s`;

        if (!isOpened) {
            envelope.onclick = () => openLetter(letter, envelope);
        }

        // Create envelope SVG
        envelope.innerHTML = `
            <div class="envelope-wrapper">
                <svg viewBox="0 0 110 75" xmlns="http://www.w3.org/2000/svg">
                    <!-- Back/shadow -->
                    <rect class="env-back" x="2" y="22" width="106" height="51" rx="3"/>
                    <!-- Main body -->
                    <rect class="env-front" x="0" y="20" width="110" height="55" rx="4"/>
                    <!-- Inner V shadow -->
                    <polygon class="env-shadow" points="0,20 55,50 110,20 110,25 55,55 0,25"/>
                    <!-- Flap -->
                    <polygon class="env-flap" points="0,20 55,52 110,20 55,0"/>
                    <!-- Wax seal circle -->
                    <circle class="env-seal" cx="55" cy="32" r="12"/>
                    <!-- Heart on seal -->
                    <path class="env-seal-heart" d="M55,28 C53,25 49,26 49,30 C49,33 55,38 55,38 C55,38 61,33 61,30 C61,26 57,25 55,28"/>
                </svg>
                <span class="envelope-label">Letter ${letter.id}</span>
            </div>
        `;

        container.appendChild(envelope);
    });
}

// Open letter with animation
function openLetter(letter, envelopeElement) {
    if (openedLetters.has(letter.id)) return;

    // Sparkle effect
    createSparkles(envelopeElement);

    // Set content
    document.getElementById('letterPhoto').src = letter.photo;
    document.getElementById('letterText').textContent = letter.message;

    // Show overlay
    const overlay = document.getElementById('letterOverlay');
    const envelopeLarge = document.getElementById('envelopeLarge');

    // Reset state
    envelopeLarge.classList.remove('opening');

    overlay.classList.add('active');

    // Trigger opening after overlay fades in
    setTimeout(() => {
        envelopeLarge.classList.add('opening');
    }, 400);

    // Mark as opened
    openedLetters.add(letter.id);
    envelopeElement.classList.add('opened');
    updateProgress();
}

// Sparkle effect
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';

            const angle = (Math.random()) * Math.PI * 2;
            const distance = 30 + Math.random() * 50;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.background = ['#ffd700', '#ff69b4', '#ff1493', '#fff', '#ffb6c1'][Math.floor(Math.random() * 5)];
            sparkle.style.width = (5 + Math.random() * 6) + 'px';
            sparkle.style.height = sparkle.style.width;

            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }, i * 30);
    }
}

// Close letter
function closeLetter() {
    const overlay = document.getElementById('letterOverlay');
    const envelopeLarge = document.getElementById('envelopeLarge');

    envelopeLarge.classList.remove('opening');

    setTimeout(() => {
        overlay.classList.remove('active');

        // Check if all opened
        if (openedLetters.size === letters.length) {
            setTimeout(showFinalScreen, 600);
        }
    }, 300);
}

// Update progress indicator
function updateProgress() {
    const heartsContainer = document.getElementById('progressHearts');
    const textEl = document.getElementById('progressText');

    // Show hearts for progress
    let hearts = '';
    for (let i = 0; i < letters.length; i++) {
        hearts += i < openedLetters.size ? '❤️' : '🤍';
    }
    heartsContainer.textContent = hearts;

    textEl.textContent = `${openedLetters.size} of ${letters.length} letters opened`;
}

// Show final screen
function showFinalScreen() {
    document.getElementById('envelopesScreen').classList.remove('active');

    setTimeout(() => {
        const final = document.getElementById('finalScreen');
        final.classList.add('active');

        // Update with custom messages
        document.getElementById('finalTitle').textContent = finalMessage.title;
        document.getElementById('finalText').textContent = finalMessage.text;
        document.getElementById('finalSignature').textContent = finalMessage.signature;
    }, 300);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    createHearts();
});
