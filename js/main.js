function searchProduct() {
    const input = document.getElementById("searchInput").value.trim();
    const results = document.getElementById("results");

    // 取得已勾選平台
    const checkedPlatforms = Array.from(
        document.querySelectorAll(".platform:checked")
    ).map(cb => cb.value);

    // 清空結果區塊
    results.innerHTML = "";

    // 假資料模擬
    const fakeData = [
        { platform: "蝦皮", price: "$8990", link: "https://shopee.tw" },
        { platform: "momo", price: "$9050", link: "https://momo.com.tw" },
        { platform: "露天", price: "$9100", link: "https://ruten.com.tw" }
    ];

    // 篩選出勾選的平台資料
    const filtered = fakeData.filter(item =>
        checkedPlatforms.includes(item.platform)
    );

    // 如果沒有選任何平台
    if (filtered.length === 0) {
        results.innerHTML = "<p>請至少選擇一個平台。</p>";
        return;
    }

    // 顯示比價結果
    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "result-card";
        div.innerHTML = `
            <h2>${item.platform}</h2>
            <p>價格：${item.price}</p>
            <a href="${item.link}" target="_blank">前往查看</a>
        `;
        results.appendChild(div);
    });
}

// ✅ 全選功能
function toggleAll(allCheckbox) {
    const checkboxes = document.querySelectorAll(".platform");
    checkboxes.forEach(cb => cb.checked = allCheckbox.checked);
}

// ✅ 當取消其中一個平台時，自動取消全選勾選狀態
document.querySelectorAll(".platform").forEach(cb => {
    cb.addEventListener("change", () => {
        const all = document.querySelectorAll(".platform");
        const allChecked = Array.from(all).every(cb => cb.checked);
        document.getElementById("selectAll").checked = allChecked;
    });
});
