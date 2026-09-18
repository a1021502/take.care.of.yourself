# Safe Space — GitHub Pages 上架操作（第一～第三階段）

以下流程以「你已經有 GitHub repository，而且目前網站是由 `index.html` 發布」為前提。

## 1. 先在電腦解壓縮

把 `safe-space-stage1-3.zip` 解壓縮。不要把 zip 檔本身直接當成網站檔案；GitHub Pages 不會替你把 zip 解壓縮成網站。

解壓後，確認最外層直接看到：

```text
index.html
css/
js/
images/
tools/
README.md
GITHUB_SETUP.md
```

## 2. 保留你原本的圖片

這次重構是從原本的 `index(2).html` 拆出來的。原網站如果已經有：

```text
images/tarot/
```

或其他圖片資料夾，請保留原本的圖片，不要用這個重構包裡的空 `images/` 資料夾去覆蓋它。

## 3. 上傳到原本的 repository

在 GitHub 開啟你現在放網站的 repository。

先確認你正在使用的發布分支，例如：

```text
main
```

然後依序把新的檔案放到 repository 根目錄。

最終 GitHub repository 應該接近：

```text
YOUR-REPOSITORY/
├── index.html
├── README.md
├── GITHUB_SETUP.md
├── css/
│   ├── core.css
│   ├── components.css
│   └── features/
│       ├── dbt-cards.css
│       ├── answer-book.css
│       └── tarot.css
├── js/
│   ├── app.js
│   ├── core/
│   │   ├── storage.js
│   │   ├── state.js
│   │   ├── feature-registry.js
│   │   ├── audio.js
│   │   ├── pet.js
│   │   └── router.js
│   ├── data/
│   │   ├── icons.js
│   │   ├── features.js
│   │   └── moods.js
│   └── features/
│       ├── dbt-cards.js
│       ├── answer-book.js
│       └── tarot.js
├── images/
│   └── tarot/ ...（保留你的原圖）
└── tools/
    └── validate.mjs
```

### 用 GitHub 網頁上傳時

可使用 repository 頁面的：

`Add file` → `Upload files`

把解壓後的檔案上傳並 Commit changes。

由於這次有多層資料夾，實務上比較不容易出錯的方法是：先建立 `css`、`js`、`images` 等資料夾，再把相對應檔案放進去；也可以使用 GitHub Desktop 或 Git 指令一次提交整個資料夾結構。

## 4. 千萬確認 index.html 的位置

如果 GitHub Pages 的來源是：

```text
Branch: main
Folder: /(root)
```

那麼必須是：

```text
main/index.html
```

不能變成：

```text
main/safe-space-stage1-3/index.html
```

除非你真的把 Pages 的 publishing source 設到那個資料夾。

## 5. 設定 GitHub Pages

進入 repository：

`Settings` → 左側 `Pages`

在：

`Build and deployment` → `Source`

選：

`Deploy from a branch`

然後設定：

```text
Branch: main
Folder: /(root)
```

按 `Save`。

## 6. 之後每次修改怎麼做

以後你新增功能，不需要再修改一個超長的 index.html。

例如要新增「呼吸練習」：

```text
js/features/breathing.js
css/features/breathing.css
```

再把它加入 `index.html` 的 script / stylesheet 或後續的功能註冊機制。

這樣每次 Commit 後，GitHub Pages 會重新發布。

## 7. 第一次上架後怎麼檢查

先開首頁：

```text
https://你的帳號.github.io/你的repository/
```

如果是使用者網站 repository（例如 `你的帳號.github.io`），則通常是：

```text
https://你的帳號.github.io/
```

依序檢查：

1. Splash 是否正常。
2. 首頁 14 張功能卡是否出現。
3. 「自我照顧卡」是否能開啟。
4. 「解答之書」是否能開啟。
5. 「塔羅指引」是否能開啟。
6. 設定齒輪是否能開啟。
7. 深色模式是否正常。
8. 返回鍵 / 關閉按鈕是否正常。
9. 手機寬度下是否沒有水平溢出。
10. 塔羅圖片路徑是否仍然正確。

## 8. 如果畫面出現「只有 HTML、沒有樣式」

先檢查：

```text
./css/core.css
./css/components.css
./css/features/dbt-cards.css
./css/features/answer-book.css
./css/features/tarot.css
```

GitHub 上的檔名大小寫必須完全一致。

## 9. 如果畫面出現「按鈕都沒反應」

檢查：

```text
./js/core/storage.js
./js/data/icons.js
./js/data/features.js
./js/data/moods.js
./js/core/state.js
./js/core/feature-registry.js
./js/features/dbt-cards.js
./js/features/answer-book.js
./js/features/tarot.js
./js/core/audio.js
./js/core/pet.js
./js/core/router.js
./js/app.js
```

任何一個檔案 404，都可能讓後面的 JavaScript 無法正常初始化。

## 10. 如果剛 Commit 看不到更新

GitHub Pages 的發布不是永遠即時完成。先等部署完成，再重新整理頁面；也可以到 repository 的 Actions / Pages 狀態查看是否有部署錯誤。

## 11. 這次的設計原則

這一版故意沒有導入 React、Vue、Vite 或 Webpack。

原因是你目前的 Safe Space 已經有大量既有互動邏輯，而且首頁仍使用 inline `onclick`。直接先「分檔」可以大幅降低第一次重構的風險。

等第一～第三階段穩定後，再考慮第四階段：

```text
ES Modules
↓
dynamic import / lazy loading
↓
功能生命週期 destroy()
↓
更完整的 state/service 架構
```

這樣每一步都可以驗證，不必一次把整個 App 改寫。
