# Safe Space 笑話模組 v6.2 修正紀錄

## 1. 修正「講完笑話後卡住」
v6.1 的 `finishDirectJoke()` 條件判斷反了：

```js
if (!friend || !joke || !isRiddleJoke(joke) || ...) return;
```

因此 story / dialogue / one_liner 進入該函式時一定會直接 return，聊天室 composer 不會恢復。
v6.2 改為只有 `riddle` 不進入 direct-joke completion：

```js
if (!friend || !joke || isRiddleJoke(joke) || ...) return;
```

## 2. 真人式等待
新增：
- `humanDelay(text, phase)`：依訊息長度、訊息用途與隨機抖動計算等待時間。
- `randomBetween(min, max)`：產生訊息間的小幅隨機間隔。
- `queueFriendMessages(...)`：逐則顯示 typing indicator，再送出訊息；下一則在上一則出現後再等待一小段時間。

這套流程套用到：
- 初次自我介紹
- 邀請玩笑話
- 使用者回覆後的反應
- 長篇故事
- 漫才／對話
- 短笑話
- 急轉彎題目
- 猜答案後的回應
- 公布答案與包袱
- 看梗點
- 使用者回饋後的收尾

## 3. 維持 session 防護
所有延遲訊息仍透過 `later()` 與 `isSessionActive()` 控制，離開或重新建立聊天室時，舊 session 的訊息不會回寫到新聊天室。

## 4. 額外小修
「看看梗在哪？」顯示後，會重新恢復感受選項，且不會再次顯示相同的解說按鈕。
