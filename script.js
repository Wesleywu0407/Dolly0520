function showPraise() {
    const messages = [
        "阿芊芊今天是全宇宙第一名漂亮！",
        "你知道嗎？雲也比不上你的柔和漂亮～",
        "Wesley 認證：這顆心只屬於阿芊芊。",
        "哎呀～又被妳美到心跳加速啦！",
        "沒有比妳更讓我想一直盯著看的風景了。",
        "如果有漂亮排行榜，妳會是常勝軍！",
        "女神請收下我全部的崇拜和撥蛋～",
    ];
    const rand = Math.floor(Math.random() * messages.length);
    document.getElementById("praise-message").textContent = messages[rand];
}

function updateCountdown() {
    const targetDate = new Date("2025-06-22T00:00:00");
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        document.getElementById("countdown").textContent = "我們已經見面啦！💞";
    } else {
        document.getElementById("countdown").textContent = `${diffDays} 天`;
    }
}

function toggleNote(el) {
    const p = el.querySelector("p");
    p.style.display = p.style.display === "block" ? "none" : "block";
}

function spawnHeartOnImage(img) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = "🤎";
    document.body.appendChild(heart);

    const rect = img.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + "px";
    heart.style.top = rect.top + window.scrollY + "px";

    setTimeout(() => heart.remove(), 1000);
}

function initImageHearts() {
    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("click", () => spawnHeartOnImage(img));
    });
}

function initDailyCardTapFlip() {
    document.querySelectorAll(".daily-card").forEach((card) => {
        card.addEventListener("click", () => {
            card.classList.toggle("is-flipped");
        });
    });
}

function initTapGame() {
    const gameArea = document.getElementById("tap-game-area");
    const startBtn = document.getElementById("game-start-btn");
    const resetBtn = document.getElementById("game-reset-btn");
    const timerEl = document.getElementById("game-timer");
    const scoreEl = document.getElementById("game-score");
    const comboEl = document.getElementById("game-combo");
    const statusEl = document.getElementById("game-status");

    const GAME_SECONDS = 30;
    const HEART_LIFETIME = 1200;
    const SPAWN_INTERVAL = 520;

    let score = 0;
    let combo = 0;
    let timeLeft = GAME_SECONDS;
    let running = false;
    let countdownId = null;
    let spawnId = null;

    function resetUi() {
        timerEl.textContent = String(timeLeft);
        scoreEl.textContent = String(score);
        comboEl.textContent = String(combo);
        gameArea.innerHTML = "";
    }

    function updateHud() {
        timerEl.textContent = String(timeLeft);
        scoreEl.textContent = String(score);
        comboEl.textContent = String(combo);
    }

    function createTarget() {
        if (!running) return;

        const target = document.createElement("button");
        target.type = "button";
        target.className = "tap-target";
        target.textContent = "😺";

        const size = 44 + Math.floor(Math.random() * 12);
        const maxX = Math.max(gameArea.clientWidth - size, 0);
        const maxY = Math.max(gameArea.clientHeight - size, 0);
        target.style.width = `${size}px`;
        target.style.height = `${size}px`;
        target.style.left = `${Math.floor(Math.random() * (maxX + 1))}px`;
        target.style.top = `${Math.floor(Math.random() * (maxY + 1))}px`;

        const bornAt = Date.now();
        target.addEventListener("click", () => {
            if (!running) return;
            const reactionMs = Date.now() - bornAt;
            const speedBonus = reactionMs < 450 ? 2 : 1;
            combo += 1;
            score += speedBonus + Math.min(Math.floor(combo / 5), 3);
            statusEl.textContent = reactionMs < 450 ? "好快！連擊中 🔥" : "繼續衝分！";
            updateHud();
            target.remove();
        });

        gameArea.appendChild(target);

        setTimeout(() => {
            if (!running || !target.isConnected) return;
            combo = 0;
            statusEl.textContent = "被逃掉一顆，連擊重置！";
            updateHud();
            target.remove();
        }, HEART_LIFETIME);
    }

    function stopGame() {
        running = false;
        clearInterval(countdownId);
        clearInterval(spawnId);
        gameArea.innerHTML = "";
        statusEl.textContent = `時間到！你拿了 ${score} 分，超強 ❤️`;
    }

    function startGame() {
        score = 0;
        combo = 0;
        timeLeft = GAME_SECONDS;
        running = true;
        resetUi();
        statusEl.textContent = "開始！快點掉愛心吧！";

        clearInterval(countdownId);
        clearInterval(spawnId);

        createTarget();
        spawnId = setInterval(createTarget, SPAWN_INTERVAL);
        countdownId = setInterval(() => {
            timeLeft -= 1;
            updateHud();
            if (timeLeft <= 0) {
                stopGame();
            }
        }, 1000);
    }

    startBtn.addEventListener("click", startGame);
    resetBtn.addEventListener("click", () => {
        running = false;
        clearInterval(countdownId);
        clearInterval(spawnId);
        score = 0;
        combo = 0;
        timeLeft = GAME_SECONDS;
        resetUi();
        statusEl.textContent = "重置完成，按開始再玩一次！";
    });

    gameArea.addEventListener("click", (event) => {
        if (event.target === gameArea && running) {
            combo = 0;
            comboEl.textContent = "0";
            statusEl.textContent = "差一點點，再準一點！";
        }
    });

    resetUi();
}

document.addEventListener("DOMContentLoaded", () => {
    updateCountdown();
    initImageHearts();
    initDailyCardTapFlip();
    initTapGame();
});
