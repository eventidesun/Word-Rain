// script.js
let words = [];
const wordContainer = document.getElementById("word-container");
const wordInput = document.getElementById("word-input");

let activeWords = [];
let score = 0;
let lives = 3;

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const restartButton = document.getElementById("restart-button");

fetch("words.txt")
    .then(response => response.text())
    .then(data => {
        words = data.split(/\r?\n/).filter(Boolean); // split lines, remove empty ones
        updateLives(); // Initialize hearts display
        setInterval(spawnWord, 2000);
    })
    .catch(err => {
        console.error("Failed to load words:", err);
    });


function spawnWord() {
    const word = words[Math.floor(Math.random() * words.length)];
    const span = document.createElement("span");
    span.classList.add("word");
    span.textContent = word;
    span.style.left = `${Math.random() * 90}%`; // Random x position
    wordContainer.appendChild(span);

    const wordObj = { text: word, element: span };
    activeWords.push(wordObj);

    setTimeout(() => {
        if (wordContainer.contains(span)) {
            wordContainer.removeChild(span);
            activeWords = activeWords.filter(w => w !== wordObj);
            lives--;
            updateLives();
        }
    }, 5000);
}

setInterval(spawnWord, 2000); // New word every 2 seconds

function updateScore() {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
}

wordInput.addEventListener("input", () => {
    const typed = wordInput.value.trim();
    const match = activeWords.find(w => w.text === typed);

    if (match) {
        wordContainer.removeChild(match.element);
        activeWords = activeWords.filter(w => w !== match);
        wordInput.value = "";
        updateScore();
    }
});


function updateLives() {
    livesDisplay.textContent = "❤️".repeat(lives);
    if (lives <= 0) {
        endGame();
    }
}

function endGame() {
    alert("Game Over! Final Score: " + score);
    wordInput.disabled = true; // prevent more typing
    restartButton.style.display = "block"; // show restart button
}

restartButton.addEventListener("click", () => {
    location.reload(); // restart the game
});

