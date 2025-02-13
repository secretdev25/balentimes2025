document.addEventListener("DOMContentLoaded", () => {
    const maxScore = 11; // Winning score
    const maxMissed = 5; // Max allowed misses

    // 🎵 Load game music files
    const gameMusic = new Audio("gameplay.mp3");  // In-game music
    const endMusic = new Audio("gameover.mp3");   // End music

    gameMusic.loop = true;
    endMusic.loop = false;

    gameMusic.volume = 0.5;
    endMusic.volume = 0.7;

    // 🎮 Setup Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = 500;
    canvas.height = 600;

    // 🎮 Game Variables
    const player = { x: 200, y: 500, width: 80, height: 80 };
    let hearts = [];
    let score = 0;
    let missed = 0;
    let gameOver = false;

    // 🖼️ Load Images
    const catImage = new Image();
    catImage.src = "cat.png"; 

    const heartImage = new Image();
    heartImage.src = "heart.png";

    // 🎮 Start game with music
    function startGame() {
        gameMusic.play();
        gameLoop();
    }

    // 🎵 Stop game music and play end music
    function playEndMusic() {
        gameMusic.pause();
        gameMusic.currentTime = 0; // Reset game music

        endMusic.play().catch(() => {
            console.log("⚠️ Autoplay blocked! Playing sound on user interaction.");
            document.addEventListener("click", () => endMusic.play(), { once: true });
        });
    }

    // ✅ Modify askReplay() to switch music
    function askReplay(message) {
        playEndMusic(); // Stop game music and play end music

        setTimeout(() => {
            alert(message);
            resetGame();
        }, 100);
    }

    // 🛠 Reset game and music when restarting
    function resetGame() {
        endMusic.pause();
        endMusic.currentTime = 0;

        score = 0;
        missed = 0;
        gameOver = false;
        hearts = [];

        startGame(); // Restart game music & loop
    }

    // 🏆 Game Logic
    function drawPlayer() {
        ctx.drawImage(catImage, player.x, player.y, player.width, player.height);
    }

    function createHeart() {
        hearts.push({ x: Math.random() * 450, y: 0, width: 30, height: 30, speed: 2 });
    }

    function update() {
        if (gameOver) return;

        hearts.forEach((heart, index) => {
            heart.y += heart.speed;

            // ✅ Check collision with player
            if (
                heart.x < player.x + player.width &&
                heart.x + heart.width > player.x &&
                heart.y < player.y + player.height &&
                heart.y + heart.height > player.y
            ) {
                score++; // Increase score
                hearts.splice(index, 1); // Remove caught heart

                // ✅ Check for win
                if (score >= maxScore) {
                    gameOver = true;
                    askReplay("You won! 🎉 I love you!! 💘🙈 Happy Valentines! ");
                }
            }

            // ❌ Remove heart if it falls off the screen
            if (heart.y > canvas.height) {
                hearts.splice(index, 1);
                missed++;

                // ✅ Special message if 5 misses but score is 11
                if (missed >= maxMissed) {
                    gameOver = true;
                    if (score >= maxScore) {
                        askReplay("So close! You reached 11 points but missed too many. Try again? 😿");
                    } else {
                        askReplay("Game Over! Can you be my Valentine? 💕");
                    }
                }
            }
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();

        // Draw falling hearts
        hearts.forEach(heart => {
            ctx.drawImage(heartImage, heart.x, heart.y, heart.width, heart.height);
        });

        // Draw score and missed text
        ctx.fillStyle = "black";
        ctx.fillText(`Score: ${score}`, 20, 20);
        ctx.fillText(`Missed: ${missed}`, 20, 40);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
        if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += 20;
    });

    function gameLoop() {
        update();
        draw();
        if (!gameOver) requestAnimationFrame(gameLoop);
    }

    // ✅ Call these functions at the end
    setInterval(createHeart, 1000);
    startGame(); // Start game with music
});
