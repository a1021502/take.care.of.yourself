# Safe Space — Stage 1–3 modularized build

這個資料夾是從你原本的 `index(2).html` 直接重構出的第一～第三階段版本。

## 這次做了什麼

### Stage 1 — 三個已完成的大功能獨立化

- `js/features/dbt-cards.js`
- `js/features/answer-book.js`
- `js/features/tarot.js`

三個功能仍透過共同的 `renderers` registry 注冊，因此首頁的 `openFeature()` 不需要知道每個功能的內部實作。

### Stage 2 — 共用核心與資料拆出

- `js/core/storage.js` — localStorage 服務
- `js/core/state.js` — 全域狀態與 DOM references
- `js/core/feature-registry.js` — 功能註冊中心
- `js/core/audio.js` — 全站音效 / 背景音樂
- `js/core/pet.js` — 麵團精靈
- `js/core/router.js` — Modal / history / 返回鍵
- `js/data/icons.js` — SVG 圖示
- `js/data/features.js` — 功能資料
- `js/data/moods.js` — 情緒選項
- `js/app.js` — 首頁、設定、篩選與啟動流程

這一階段刻意使用「傳統 script 分檔」而不是 ES Modules，原因是目前首頁還有 inline `onclick="..."` 與大量既有全域函式。這可以在不引入 build tool 的前提下降低第一次重構的風險。

### Stage 3 — CSS 拆分

- `css/core.css`
- `css/components.css`
- `css/features/dbt-cards.css`
- `css/features/answer-book.css`
- `css/features/tarot.css`

CSS `<link>` 順序已按照原本單一 `<style>` 中的出現順序安排，以盡量保留原本 cascade 行為。

## GitHub Pages 檔案結構

```text
safe-space/
├─ index.html
├─ css/
│  ├─ core.css
│  ├─ components.css
│  └─ features/
│     ├─ dbt-cards.css
│     ├─ answer-book.css
│     └─ tarot.css
├─ js/
│  ├─ app.js
│  ├─ core/
│  │  ├─ storage.js
│  │  ├─ state.js
│  │  ├─ feature-registry.js
│  │  ├─ audio.js
│  │  ├─ pet.js
│  │  └─ router.js
│  ├─ data/
│  │  ├─ icons.js
│  │  ├─ features.js
│  │  └─ moods.js
│  └─ features/
│     ├─ dbt-cards.js
│     ├─ answer-book.js
│     └─ tarot.js
└─ tools/
   └─ validate.mjs
```

## UI Layout 修正版（本次更新）

本次針對桌面與手機的實際使用問題追加了版面修正：

- 功能標題改為固定在功能視窗上方的短標題區，不再佔用過多垂直空間。
- Tarot 的「主題 → 牌陣 → 洗牌 → 結果」主流程不再讓整個頁面上下捲動。
- Tarot 的「塔羅圖書館」保留自己的內部垂直捲動區域。
- Tarot 的開始洗牌按鈕與今日運勢日記區改為跟著固定舞台排列，避免必須先往下捲才能找到。
- Answer Book 改為固定舞台置中，不再讓外層捲動容器裁切 3D 書本。
- Answer Book 的「點擊書本翻頁」提示緊跟書本，不再需要捲動。
- 修正 3D 書本與外層滿版容器之間可能造成的裁切／破圖問題。

## 本地驗證

如果電腦有 Node.js：

```bash
node tools/validate.mjs
node --check js/core/storage.js
node --check js/core/state.js
node --check js/core/feature-registry.js
node --check js/core/audio.js
node --check js/core/pet.js
node --check js/core/router.js
node --check js/data/icons.js
node --check js/data/features.js
node --check js/data/moods.js
node --check js/features/dbt-cards.js
node --check js/features/answer-book.js
node --check js/features/tarot.js
node --check js/app.js
```

不要用 `file://` 直接雙擊 `index.html` 當作 GitHub Pages 的最終測試；建議使用本機 HTTP server，例如：

```bash
python -m http.server 8000
```

然後開啟 `http://localhost:8000/`。

## GitHub Pages

保持 `index.html` 在 GitHub Pages 選定的發布來源最上層，其他 CSS / JS / images 用相對路徑連接。此版本已使用 `./css/...`、`./js/...`，適合 GitHub project site。
