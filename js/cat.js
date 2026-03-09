const catQuotes = [
    "歐哩說：今天要帥帥地躺著。",
    "大咪說：先抱抱，再去忙。",
    "今日喵提醒：看到貓咪先稱讚再摸摸。",
    "喵星播報：今天適合曬太陽和撒嬌。",
    "歐哩與大咪同意：家裡有愛就有呼嚕聲。",
];

function initQuoteButton() {
    const quoteBtn = document.getElementById("quote-btn");
    const quoteResult = document.getElementById("quote-result");

    quoteBtn.addEventListener("click", () => {
        const pick = catQuotes[Math.floor(Math.random() * catQuotes.length)];
        quoteResult.textContent = pick;
    });
}

function initBoopButtons() {
    const boopButtons = document.querySelectorAll(".boop-btn");
    boopButtons.forEach((button) => {
        let count = 0;
        const catName = button.dataset.cat;
        button.addEventListener("click", () => {
            count += 1;
            button.textContent = `${catName} 被戳 ${count} 次`; 
        });
    });
}

function initPawEffects() {
    document.addEventListener("click", (event) => {
        const paw = document.createElement("span");
        paw.className = "paw-pop";
        paw.textContent = "🐾";
        paw.style.left = `${event.clientX - 8}px`;
        paw.style.top = `${event.clientY - 10}px`;
        document.body.appendChild(paw);

        setTimeout(() => paw.remove(), 780);
    });
}

function initFishGame() {
    const zone = document.getElementById("fish-zone");
    const startBtn = document.getElementById("fish-start");
    const resetBtn = document.getElementById("fish-reset");
    const normalModeBtn = document.getElementById("fish-mode-normal");
    const hardModeBtn = document.getElementById("fish-mode-hard");
    const scoreEl = document.getElementById("fish-score");
    const timerEl = document.getElementById("fish-timer");
    const statusEl = document.getElementById("fish-status");

    const modeConfig = {
        normal: {
            spawnMs: 540,
            minZ: -420,
            extraZ: 420,
            minVz: 165,
            extraVz: 95,
            driftX: 42,
            driftY: 36,
            target: 18,
        },
        hard: {
            spawnMs: 390,
            minZ: -520,
            extraZ: 520,
            minVz: 230,
            extraVz: 140,
            driftX: 64,
            driftY: 54,
            target: 24,
        },
    };

    let score = 0;
    let seconds = 20;
    let running = false;
    let mode = "normal";
    let gameTimer = null;
    let spawnTimer = null;
    let animationId = null;
    let fishes = [];
    let lastFrame = performance.now();
    let fishId = 0;
    let misses = 0;

    function clearGameArea() {
        zone.innerHTML = "";
        fishes = [];
    }

    function updateHud() {
        scoreEl.textContent = String(score);
        timerEl.textContent = String(seconds);
    }

    function zoneSize() {
        return {
            width: zone.clientWidth,
            height: zone.clientHeight,
        };
    }

    function destroyFish(id) {
        const idx = fishes.findIndex((f) => f.id === id);
        if (idx === -1) return;
        const fish = fishes[idx];
        fish.el.remove();
        fishes.splice(idx, 1);
    }

    function spawnFish() {
        if (!running) return;
        const { width, height } = zoneSize();
        if (!width || !height) return;
        const config = modeConfig[mode];

        const el = document.createElement("button");
        el.type = "button";
        el.className = "fish-target";
        el.textContent = "🐟";

        const newFish = {
            id: ++fishId,
            el,
            x: Math.random() * (width - 56),
            y: Math.random() * (height - 56),
            z: config.minZ - Math.random() * config.extraZ,
            vz: config.minVz + Math.random() * config.extraVz,
            driftX: (Math.random() - 0.5) * config.driftX,
            driftY: (Math.random() - 0.5) * config.driftY,
            rot: (Math.random() - 0.5) * 14,
        };

        el.addEventListener("click", () => {
            if (!running) return;
            score += newFish.z > -120 ? 2 : 1;
            statusEl.textContent = "抓到了！再來一條！";
            updateHud();
            destroyFish(newFish.id);
        });

        zone.appendChild(el);
        fishes.push(newFish);
    }

    function renderFish(fish, dt) {
        const { width, height } = zoneSize();
        fish.z += fish.vz * dt;
        fish.x += fish.driftX * dt;
        fish.y += fish.driftY * dt;

        if (fish.x < -20 || fish.x > width - 34) fish.driftX *= -1;
        if (fish.y < -20 || fish.y > height - 34) fish.driftY *= -1;

        const depthScale = 1 + (fish.z + 500) / 520;
        const clampedScale = Math.max(0.35, Math.min(depthScale, 1.65));
        const alpha = Math.max(0.3, Math.min(1, clampedScale * 0.85));

        if (fish.z > -110) {
            fish.el.classList.add("is-near");
        } else {
            fish.el.classList.remove("is-near");
        }

        fish.el.style.opacity = String(alpha);
        fish.el.style.transform = `translate3d(${fish.x}px, ${fish.y}px, ${fish.z}px) scale(${clampedScale}) rotate(${fish.rot}deg)`;

        if (fish.z > 140) {
            misses += 1;
            if (misses % 4 === 0) {
                statusEl.textContent = "魚魚游走了，快一點！";
            }
            destroyFish(fish.id);
        }
    }

    function animate(now) {
        const dt = Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;

        fishes.slice().forEach((fish) => renderFish(fish, dt));
        animationId = requestAnimationFrame(animate);
    }

    function endGame() {
        running = false;
        clearInterval(gameTimer);
        clearInterval(spawnTimer);
        cancelAnimationFrame(animationId);
        clearGameArea();

        const target = modeConfig[mode].target;
        if (score >= target) {
            statusEl.textContent = `${mode.toUpperCase()} 成功！你抓到 ${score} 分，歐哩和大咪吃飽了 😸`;
        } else {
            statusEl.textContent = `你拿到 ${score} 分，再試一次衝 ${target} 分！`;
        }
    }

    function startGame() {
        score = 0;
        seconds = 20;
        misses = 0;
        running = true;
        statusEl.textContent = "3D 模式開始！魚從遠方游過來了！";
        updateHud();
        clearGameArea();

        clearInterval(gameTimer);
        clearInterval(spawnTimer);
        cancelAnimationFrame(animationId);

        const config = modeConfig[mode];
        spawnTimer = setInterval(spawnFish, config.spawnMs);
        spawnFish();
        lastFrame = performance.now();
        animationId = requestAnimationFrame(animate);
        gameTimer = setInterval(() => {
            seconds -= 1;
            updateHud();
            if (seconds <= 0) {
                endGame();
            }
        }, 1000);
    }

    function resetGame() {
        running = false;
        clearInterval(gameTimer);
        clearInterval(spawnTimer);
        cancelAnimationFrame(animationId);
        score = 0;
        seconds = 20;
        misses = 0;
        updateHud();
        clearGameArea();
        statusEl.textContent = "準備好就進入 3D 抓魚模式吧！";
    }

    function setMode(nextMode) {
        if (running) return;
        mode = nextMode;
        normalModeBtn.classList.toggle("active", mode === "normal");
        hardModeBtn.classList.toggle("active", mode === "hard");
        const target = modeConfig[mode].target;
        statusEl.textContent = `目前 ${mode.toUpperCase()} 模式，目標 ${target} 分。`;
    }

    normalModeBtn.addEventListener("click", () => setMode("normal"));
    hardModeBtn.addEventListener("click", () => setMode("hard"));
    startBtn.addEventListener("click", startGame);
    resetBtn.addEventListener("click", resetGame);
    setMode("normal");
    updateHud();
}

document.addEventListener("DOMContentLoaded", () => {
    initQuoteButton();
    initBoopButtons();
    initPawEffects();
    initFishGame();
});
