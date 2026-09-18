/*
 * Safe Space - Main App Controller
 * Home page, settings, filters, feature cards and boot sequence.
 */

function initApp() {
    // 套用深色模式
    if (isDarkMode) document.body.classList.add('dark-mode');

    renderMoodButtons();
    updateResults();
    initPetSystem();
    initSettings();
    updateGreeting();

    // 綁定 Splash 點擊 (觸發 AudioContext 與自動播放)
    const splashBtn = document.getElementById('splash-start-btn');
    splashBtn.onclick = () => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 800);

        // 啟動音訊核心
        resumeAudioContext();
        if(isMusicOn) playNextNote();
    };
}

function updateGreeting() {
    if (userNickname && userNickname.trim() !== "") {
        const hour = new Date().getHours();
        let greet = "你好";
        if (hour < 6) greet = "夜深了";
        else if (hour < 11) greet = "早安";
        else if (hour < 14) greet = "午安";
        else if (hour < 18) greet = "下午好";
        else greet = "晚安";

        // 強制顏文字用 Arial，避免跑版
        greetingTitle.innerHTML = `${greet}，${userNickname} <span class="kaomoji" style="font-size:0.8em; margin-left:5px;">( ˘ ³˘)</span>`;
    } else {
        greetingTitle.innerHTML = 'Safe Space <span class="kaomoji" style="font-size:0.8em; margin-left:5px;">( ˘ ³˘)</span>';
    }
}

// --- 設定功能整合 ---
function initSettings() {
    // 1. 暱稱
    nicknameInput.value = userNickname;
    nicknameInput.addEventListener('input', (e) => {
        userNickname = e.target.value;
        SafeStorage.setText('safeSpaceName', userNickname);
        updateGreeting();
    });

    // 2. 深色模式
    updateToggleUI(darkToggle, isDarkMode);
    darkToggle.onclick = () => {
        isDarkMode = !isDarkMode;
        SafeStorage.setJSON('safeSpaceDarkMode', isDarkMode);
        updateToggleUI(darkToggle, isDarkMode);
        if(isDarkMode) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    };

    // 3. 音樂開關
    updateToggleUI(musicToggle, isMusicOn);
    musicToggle.onclick = () => {
        isMusicOn = !isMusicOn;
        SafeStorage.setJSON('safeSpaceMusicOn', isMusicOn);
        updateToggleUI(musicToggle, isMusicOn);

        if (isMusicOn) {
            resumeAudioContext();
            if (!bgmTimeout) playNextNote();
        } else {
            clearTimeout(bgmTimeout);
            bgmTimeout = null;
        }
    };

    // 4. 音效開關
    updateToggleUI(sfxToggle, isSfxOn);
    sfxToggle.onclick = () => {
        isSfxOn = !isSfxOn;
        SafeStorage.setJSON('safeSpaceSfxOn', isSfxOn);
        updateToggleUI(sfxToggle, isSfxOn);
    };

    // 5. 精靈開關
    updateToggleUI(petToggle, isPetActive);
    petToggle.onclick = () => {
        isPetActive = !isPetActive;
        SafeStorage.setJSON('safeSpacePetActive', isPetActive);
        updateToggleUI(petToggle, isPetActive);
        updatePetVisibility();
    };
}

function updateToggleUI(el, isActive) {
    if(isActive) el.classList.add('active');
    else el.classList.remove('active');
}

function openSettings() {
    settingsModal.style.display = 'flex';
    void settingsModal.offsetWidth;
    settingsModal.classList.add('show');
    // 推入歷史紀錄以支援返回鍵關閉
    history.pushState({ type: 'settings' }, null, "#settings");
}

function closeSettings(e) {
    if(e.target === settingsModal) {
        history.back();
    }
}

function toggleSettings() {
    if(settingsModal.classList.contains('show')) {
        history.back();
    } else {
        openSettings();
    }
}

function resetAppData() {
    if(confirm('確定要清除所有設定和收藏嗎？這將無法復原。')) {
        localStorage.clear();
        location.reload();
    }
}

// --- 核心互動邏輯 ---
function renderMoodButtons() {
    moodGrid.innerHTML = '';
    moodOptions.forEach(mood => {
        const btn = document.createElement('div');
        btn.className = 'mood-card';
        btn.dataset.id = mood.id;
        btn.onclick = () => toggleMood(mood.id);
        btn.innerHTML = `
            ${getMoodIcon(mood.id)}
            <div class="mood-label">${mood.label}</div>
        `;
        btn.style.setProperty('--mood-color', mood.color);
        moodGrid.appendChild(btn);
    });
}

function updateResults() {
    // 更新按鈕樣式
    document.querySelectorAll('.mood-card').forEach(btn => {
        const id = btn.dataset.id;
        const moodData = moodOptions.find(m => m.id === id);
        if(selectedMoods.has(id)) {
            btn.classList.add('active');
            btn.style.borderColor = moodData.color;
        } else {
            btn.classList.remove('active');
            btn.style.borderColor = 'transparent';
        }
    });

    // 更新收藏按鈕
    if(isFavFilterActive) favFabBtn.classList.add('active');
    else favFabBtn.classList.remove('active');

    // 篩選邏輯
    let filtered = featuresDB.filter(item => {
        const matchKeyword = searchKeyword === "" || item.name.includes(searchKeyword) || item.keywords.includes(searchKeyword) || item.tag.includes(searchKeyword);
        const itemMoodsSet = new Set(item.moods);
        const hasMoodIntersection = [...selectedMoods].some(mood => itemMoodsSet.has(mood));
        const matchMood = selectedMoods.size === 0 || hasMoodIntersection;
        const matchFav = !isFavFilterActive || favorites.includes(item.id);
        return matchKeyword && matchMood && matchFav;
    });
    renderFeatures(filtered);
}

function renderFeatures(list) {
    toolboxEl.innerHTML = '';
    if (list.length === 0) {
        toolboxEl.innerHTML = `<div style="grid-column:span 2; text-align:center; padding:30px; color:#aaa; font-weight:700;">🍂<br>這裡空空的</div>`;
        return;
    }
    list.forEach(feature => {
        const isFav = favorites.includes(feature.id);
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <div class="card-fav-btn ${isFav ? 'is-active' : ''}" onclick="toggleCardFav(event, '${feature.id}')">
                ${isFav ? '❤️' : '🤍'}
            </div>
            <div class="card-visual">${getFeatureIcon(feature.id)}</div>
            <div class="card-title">${feature.name}</div>
            <div class="card-tag">${feature.tag}</div>
        `;
        card.onclick = (e) => {
            if(e.target.classList.contains('card-fav-btn')) return;
            openFeature(feature);
        };
        toolboxEl.appendChild(card);
    });
}

function toggleMood(moodId) {
    if (selectedMoods.has(moodId)) selectedMoods.delete(moodId);
    else selectedMoods.add(moodId);
    ensureHistoryState();
    updateResults();
}

function toggleFavFilter() {
    isFavFilterActive = !isFavFilterActive;
    ensureHistoryState();
    updateResults();
}

function toggleCardFav(event, id) {
    event.stopPropagation();
    if (favorites.includes(id)) favorites = favorites.filter(favId => favId !== id);
    else favorites.push(id);
    SafeStorage.setJSON('safeSpaceFavs', favorites);

    if (isSfxOn) { /* 可以在這裡加一個輕微的點擊音效 */ }

    if(isFavFilterActive) updateResults();
    else {
        const btn = event.currentTarget;
        const isNowFav = favorites.includes(id);
        btn.innerHTML = isNowFav ? '❤️' : '🤍';
        btn.classList.toggle('is-active');
    }
}

searchInput.addEventListener('input', (e) => {
    searchKeyword = e.target.value.toLowerCase().trim();
    if(searchKeyword !== "") ensureHistoryState();
    updateResults();
});

function resetAllFilters() {
    selectedMoods.clear();
    isFavFilterActive = false;
    searchKeyword = "";
    searchInput.value = "";
    updateResults();
}

function ensureHistoryState() {
    if (window.location.hash !== '#filter' && window.location.hash !== '#feature') {
        history.pushState({ type: 'filter' }, null, '#filter');
    }
}

// 啟動
initApp();
