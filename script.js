// Track opened letters
let openedLetters = new Set();

// Create floating hearts
function createHearts() {
    const container = document.getElementById('hearts');
    const heartSymbols = ['♥', '♡', '❤', '💕'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeart(container, heartSymbols);
        }, i * 400);
    }

    // Continue creating hearts
    setInterval(() => {
        createHeart(container, heartSymbols);
    }, 2000);
}

function createHeart(container, symbols) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (15 + Math.random() * 20) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 12000);
}

// Start experience
function startExperience() {
    document.getElementById('welcome').classList.remove('active');
    document.getElementById('lettersScreen').classList.add('active');
    renderEnvelopes();
}

// Render envelopes
function renderEnvelopes() {
    const container = document.getElementById('envelopes');
    container.innerHTML = '';

    letters.forEach((letter, index) => {
        const isOpened = openedLetters.has(letter.id);
        const envelope = document.createElement('div');
        envelope.className = `envelope ${isOpened ? 'opened' : ''}`;
        envelope.onclick = () => openLetter(letter);
        envelope.style.animationDelay = (index * 0.1) + 's';

        envelope.innerHTML = `
            <div class="envelope-icon">${isOpened ? '💌' : '💝'}</div>
            <div class="envelope-info">
                <div class="envelope-label">${letter.label}</div>
                <div class="envelope-hint">${letter.hint}</div>
            </div>
            <div class="envelope-status">${isOpened ? '✓' : '→'}</div>
        `;

        container.appendChild(envelope);
    });
}

// Open letter
function openLetter(letter) {
    openedLetters.add(letter.id);

    document.getElementById('letterPhoto').src = letter.photo;
    document.getElementById('letterText').textContent = letter.message;
    document.getElementById('letterModal').classList.add('active');

    renderEnvelopes();
}

// Close letter
function closeLetter() {
    document.getElementById('letterModal').classList.remove('active');

    // Check if all letters are opened
    if (openedLetters.size === letters.length) {
        setTimeout(() => {
            showFinalScreen();
        }, 500);
    }
}

// Show final screen
function showFinalScreen() {
    document.getElementById('lettersScreen').classList.remove('active');
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
