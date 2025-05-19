function showPraise() {
    const messages = [
        "阿芊芊今天是全宇宙第一名漂亮！",
        "你知道嗎？雲也比不上你的柔和漂亮～",
        "Wesley 認證：這顆心只屬於阿芊芊。",
        "哎呀～又被妳美到心跳加速啦！",
        "沒有比妳更讓我想一直盯著看的風景了。",
        "如果有漂亮排行榜，妳會是常勝軍！",
        "女神請收下我全部的崇拜和撥蛋～"
    ];
    const rand = Math.floor(Math.random() * messages.length);
    document.getElementById("praise-message").textContent = messages[rand];
}

function updateCountdown() {
    const targetDate = new Date("2025-06-22T00:00:00");
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById("countdown").textContent = `${diffDays} 天`;
}

function toggleNote(el) {
    const p = el.querySelector("p");
    p.style.display = p.style.display === "block" ? "none" : "block";
}

updateCountdown();


// 點圖片噴出愛心效果
document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", function (e) {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerText = "🤎";
        document.body.appendChild(heart);

        // 取得圖片座標
        const rect = img.getBoundingClientRect();
        heart.style.left = rect.left + rect.width / 2 + "px";
        heart.style.top = rect.top + window.scrollY + "px";

        // 一秒後移除
        setTimeout(() => heart.remove(), 1000);
    });
});

