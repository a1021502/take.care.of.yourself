/*
 * Safe Space - Feature Modal Router / History Controller
 */
/* =========================================
   2. 修改原本的 openFeature 函式 (核心大腦)
   ========================================= */
/* --- 放在原本的 openFeature 附近 --- */

// 全域變數：用來記錄當前功能是否有「內部返回」的需求
    const modal = document.getElementById('active-feature-container');
    const featureTitle = document.getElementById('feature-title-display');
    const contentArea = document.getElementById('feature-content-area');
window.currentFeatureBack = null;
window.currentFeatureCleanup = null;

function openFeature(feature) {


    // 1. 打開視窗 & 鎖定背景滑動 (關鍵！防止破圖)
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 鎖死主頁面捲動
    document.body.style.position = 'fixed';  // 強制固定 iOS
    document.body.style.width = '100%';

    // 2. 設定標題
    featureTitle.innerText = feature.name;
    modal.dataset.featureId = feature.id;
    
    // 3. 命名轉換 (answer_book -> renderAnswerBook)
    const featureName = feature.id
        .toLowerCase()
        .replace(/_(\w)/g, (all, letter) => letter.toUpperCase())
        .replace(/^\w/, c => c.toUpperCase());
    const targetRendererName = `render${featureName}`;

    // 4. 清理上一個功能留下的生命週期資源（例如 popstate、timer、listener）
    if (typeof window.currentFeatureCleanup === 'function') {
        try { window.currentFeatureCleanup(); } catch (error) { console.warn('Feature cleanup failed:', error); }
    }
    window.currentFeatureBack = null;
    window.currentFeatureCleanup = null;

    // 5. 執行渲染
    if (typeof renderers[targetRendererName] === 'function') {
        renderers[targetRendererName](contentArea);
    } else {
        renderers.renderDefault(contentArea);
    }

    // 6. 寫入歷史紀錄 (讓手機按返回鍵有反應)
    // 這裡我們推入一個帶有標記的 state
    history.pushState({ type: 'feature_modal', featureId: feature.id }, null, `#${feature.id}`);
}

/* --- 修改原本的 popstate 監聽器 --- */
window.addEventListener('popstate', function(event) {
    const modal = document.getElementById('active-feature-container');
    const settingsModal = document.getElementById('settings-modal');

    // 1. 如果設定頁面開著，優先關閉
    if (settingsModal && settingsModal.classList.contains('show')) {
        settingsModal.classList.remove('show');
        setTimeout(() => { settingsModal.style.display = 'none'; }, 300);
        return; // 結束，不繼續往下
    }

    // 2. 如果功能視窗開著
    if (modal.style.display === 'flex') {
        // [關鍵邏輯] 詢問當前功能：「你內部還有步驟要退回嗎？」
        // 如果 currentFeatureBack 存在且回傳 true，表示它在內部退了一步（例如從抽卡退回選卡包）
        // 這時我們就不關閉視窗。
        if (window.currentFeatureBack && window.currentFeatureBack()) {
            // 為了保持瀏覽器歷史堆疊正確，我們要在這裡「把剛剛被 pop 掉的狀態推回去」
            // 這樣使用者下次按返回鍵時，才能再次觸發 popstate
            history.pushState({ type: 'feature_modal' }, null, location.hash);
            return;
        }

        // 如果功能說「沒了，我已經在第一頁了」，那就執行關閉視窗
        closeFeatureModal();
    }
});

/* === 修復後的關閉函式 (解決主頁卡死問題) === */
function closeFeatureModal() {
    const modal = document.getElementById('active-feature-container');
    const contentArea = document.getElementById('feature-content-area');
    
    // 1. 隱藏視窗
    modal.style.display = 'none';
    
    // 2. 清空內容 (節省效能)
    contentArea.innerHTML = ''; 
    
    // 3. 清理目前功能的生命週期資源，再重置引用。
    if (typeof window.currentFeatureCleanup === 'function') {
        try { window.currentFeatureCleanup(); } catch (error) { console.warn('Feature cleanup failed:', error); }
    }
    window.currentFeatureBack = null;
    window.currentFeatureCleanup = null;

    // 4. ★ 關鍵修復：強制解除 Body 的鎖定狀態 ★
    document.body.style.overflow = 'auto';      // 恢復捲動
    document.body.style.position = 'static';    // 解除定位鎖定
    document.body.style.width = '';             // 移除寬度限制
    document.body.style.height = '';            // 移除高度限制
    document.body.style.touchAction = 'auto';   // 恢復觸控行為
}

// --- 綁定 UI 上的「關閉按鈕 (X)」邏輯 ---
/* === 修正後的 X 按鈕綁定邏輯 === */
// 請確保這裡的 ID 跟你的 HTML 一樣 (看是 feature-close-btn 還是 close-feature-btn)
const uiCloseBtn = document.getElementById('feature-close-btn') || document.getElementById('close-feature-btn');

if (uiCloseBtn) {
    uiCloseBtn.onclick = function() {
        // ★ 關鍵修正 1：先廢除「內部返回邏輯」
        // 這樣等等觸發 history.back() 時，popstate 監聽器就不會攔截我們
        window.currentFeatureBack = null; 

        // ★ 關鍵修正 2：檢查歷史紀錄
        if (history.state && history.state.type === 'feature_modal') {
            history.back(); // 這會觸發 popstate，但因為上面設為 null 了，所以會成功關閉
        } else {
            closeFeatureModal(); // 如果沒紀錄，直接暴力關閉
        }
    };
}

