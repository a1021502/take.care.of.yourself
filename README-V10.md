# Safe Space 笑話功能 v10

這是以 Safe Space v9 完整版為基礎的增量更新。

### 這次只需要更新

```text
js/features/jokes.js
css/features/jokes.css
```

`index.html` 與 `jokes-data.js` 不需要更換。

### 本次核心改動

1. 聊天選項區向上退避，避免被左下角全站設定齒輪遮住。
2. 笑友離開前先說理由，再讓使用者回覆。
3. 使用者回覆後，笑友會在該使用者訊息上加入 emoji reaction，再送最後一句才顯示「已離開聊天室」。
4. 「再聽一個」改成與一般聊天一致的垂直選項。
5. 延續 v9 的 matchedFriendId、sessionId、timer cleanup。
