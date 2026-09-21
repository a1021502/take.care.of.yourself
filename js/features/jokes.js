/*
 * Safe Space — 笑友聊天 / 笑話模組 v10.0
 *
 * UX:
 * 1. 左右滑選擇笑友
 * 2. 喜歡 → 配對成功
 * 3. 進入手機聊天室
 * 4. 笑友先自我介紹並邀請玩急轉彎
 * 5. 使用者從選項中選擇回覆；riddle 另提供自由輸入
 * 6. riddle 選項不直接放答案，避免變成考試
 * 7. 使用者送出後由笑友先公布答案；使用者回覆後才補上解釋與後續台詞
 * 8. dialogue / one_liner / story 直接以聊天形式講笑話
 * 9. 笑友公布答案或包袱後詢問感受
 *
 * 兼容：
 * - 目前舊版 index.html 的 const renderers {}
 * - Stage 1–3 的 feature-registry.js
 */
(function () {
    'use strict';

    const DB = window.SAFE_SPACE_JOKES_DB;
    if (!DB) {
        console.error('[Safe Space] jokes-data.js 尚未載入。');
        return;
    }

    const FRIENDS = Array.isArray(DB.friends) ? DB.friends : [];
    const JOKES = Array.isArray(DB.jokes) ? DB.jokes : [];

    const FALLBACK_REPLIES = [
        '好啊，你出題！',
        '來吧，我準備好了 😂',
        '我今天可以接受一點冷笑話。'
    ];

    const REACTION_BY_STYLE = {
        '冷面型': [
            '你這個答案……很有自己的風格。',
            '嗯，我有感受到你的冷靜。',
            '很好，先把期待放低一點，等等就不會失望。'
        ],
        '諧音型': [
            '這個答案很有「梗」喔。',
            '你差一點就猜到我的笑點了。',
            '放心，真正的梗現在才要出來。'
        ],
        '動物型': [
            '你這個回答讓我忍不住想幫你加一個小尾巴。',
            '我覺得這個答案很可愛。',
            '先收藏起來，等一下笑話比較重要。'
        ],
        '食物型': [
            '這個答案先放旁邊，我們先上菜。',
            '有料喔，但還沒到主菜。',
            '不管你選什麼，我這邊都已經切好下一塊了。'
        ],
        '校園型': [
            '這題沒有計分，放心。',
            '答題卡先不用緊張。',
            '老師不在，我們可以亂猜。'
        ],
        '反轉型': [
            '你以為你猜的是答案，其實你只是走進我設的門。',
            '很好，你已經開始懷疑這題了。',
            '不要相信直覺——但也不要太相信我。'
        ],
        '科技型': [
            '系統已收到你的答案。',
            '正在分析……分析結果：可以繼續笑。',
            '你的回覆成功通過娛樂性測試。'
        ],
        '荒謬型': [
            '這個答案居然合理到有點不合理。',
            '我欣賞你的腦洞，但我的更大。',
            '很好，世界又朝著奇怪的方向前進了一步。'
        ],
        '溫柔型': [
            '這個答案很好呀，沒有答錯這回事。',
            '謝謝你認真陪我玩。',
            '我們不用急，笑話慢慢來就好。'
        ],
        '短梗型': [
            '收到。',
            '可以。',
            '很好，來了。'
        ],
        '生活擬人型': [
            '這回答可以先放在桌上。',
            '我覺得這個答案有生活感。',
            '來，下一頁繼續。'
        ],
        '長篇純笑話': [
            '不用急，故事講慢一點才有味道。',
            '我先確認一下：你現在還在聽嗎？😂',
            '這題沒有標準答案，只有我的故事。'
        ]
    };

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function randomItem(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function shuffle(list) {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function vibrate(pattern = 30) {
        try {
            if (navigator.vibrate) navigator.vibrate(pattern);
        } catch (_) {}
    }

    function playUiSound(kind) {
        // 兼容未來的共用音效服務；現在沒有也不會報錯。
        try {
            if (window.SafeSpaceAudio && typeof window.SafeSpaceAudio.play === 'function') {
                window.SafeSpaceAudio.play(kind);
            }
        } catch (_) {}
    }

    function getFriendStyle(friend) {
        const text = friend?.style || friend?.tone || '';
        if (text.includes('諧音')) return '諧音型';
        if (text.includes('動物')) return '動物型';
        if (text.includes('食物')) return '食物型';
        if (text.includes('校園')) return '校園型';
        if (text.includes('反轉')) return '反轉型';
        if (text.includes('科技')) return '科技型';
        if (text.includes('荒謬')) return '荒謬型';
        if (text.includes('溫柔')) return '溫柔型';
        if (text.includes('短梗')) return '短梗型';
        if (text.includes('長篇純笑話')) return '長篇純笑話';
        if (text.includes('生活擬人')) return '生活擬人型';
        return '冷面型';
    }

    function createState() {
        return {
            screen: 'browse',
            stack: shuffle(FRIENDS),
            index: 0,
            currentFriend: null,
            matchedFriendId: null,
            currentJoke: null,
            selectedIntro: null,
            selectedGuess: null,
            usedJokes: new Set(),
            jokeRoundCount: 0,
            sessionMaxJokes: randomBetween(1, 3),
            locked: false,
            sessionId: 0,
            timers: new Set(),
            chatHistory: []
        };
    }

    // 配對成功後，matchedFriendId 是唯一可信的人物來源。
    // currentFriend 只是快取，這可避免滑卡索引變動時聊天室拿到別人。
    function getMatchedFriend(state) {
        if (!state?.matchedFriendId) return null;
        return FRIENDS.find(friend => friend.id === state.matchedFriendId) || state.currentFriend || null;
    }

    function invalidateSession(state) {
        state.sessionId += 1;
        state.timers.forEach(timerId => clearTimeout(timerId));
        state.timers.clear();
    }

    function later(state, callback, delay, sessionId = state.sessionId) {
        const timerId = setTimeout(() => {
            state.timers.delete(timerId);
            if (sessionId !== state.sessionId) return;
            callback();
        }, delay);
        state.timers.add(timerId);
        return timerId;
    }

    // 模擬真人回覆：依訊息長度、訊息用途與隨機抖動決定等待時間。
    // 不是單純固定 500ms，避免使用者很快看出「機械節拍」。
    function humanDelay(text = '', phase = 'normal') {
        const chars = [...String(text)].filter(ch => !/\s/.test(ch)).length;
        const baseByPhase = { opening: 650, response: 540, question: 650, answer: 760, punchline: 820, story: 850, reaction: 680, closing: 600, normal: 560 };
        const speedByPhase = { opening: 18, response: 15, question: 18, answer: 20, punchline: 21, story: 19, reaction: 16, closing: 15, normal: 16 };
        const base = baseByPhase[phase] ?? baseByPhase.normal;
        const perChar = speedByPhase[phase] ?? speedByPhase.normal;
        const naturalVariation = (Math.random() - 0.5) * 500;
        const hesitation = Math.random() < 0.22 ? 250 + Math.random() * 850 : 0;
        const punctuationPause = /[！？。…]$/.test(String(text).trim()) ? 120 + Math.random() * 260 : 0;
        const lengthComponent = Math.min(chars, 100) * perChar;
        const min = phase === 'story' ? 900 : 650;
        const max = phase === 'story' ? 3600 : 2900;
        return Math.round(Math.min(max, Math.max(min, base + lengthComponent + naturalVariation + hesitation + punctuationPause)));
    }

    function randomBetween(min, max) {
        return Math.round(min + Math.random() * (max - min));
    }

    // 依序傳送多則訊息。每一則訊息前都會短暫顯示「正在輸入」，
    // 下一則則在前一則出現後再重新思考一小段時間。
    function queueFriendMessages(container, state, friend, messages, onDone, sessionId = state.sessionId) {
        const queue = messages
            .map(item => typeof item === 'string' ? { text: item } : item)
            .filter(item => item && String(item.text ?? '').trim() !== '');

        let index = 0;

        const sendNext = () => {
            if (!isSessionActive(state, friend.id, sessionId)) return;
            if (index >= queue.length) {
                if (typeof onDone === 'function') onDone();
                return;
            }

            const item = queue[index++];
            const typing = showTyping(container, friend);
            const wait = Number.isFinite(item.delay) ? item.delay : humanDelay(item.text, item.phase || 'normal');

            later(state, () => {
                if (!isSessionActive(state, friend.id, sessionId)) return;
                typing?.remove();
                appendChatMessage(container, 'friend', item.text, {
                    avatar: friend.emoji,
                    story: !!item.story,
                    dialogue: !!item.dialogue
                });

                if (index >= queue.length) {
                    if (typeof onDone === 'function') onDone();
                    return;
                }

                const between = Number.isFinite(item.after)
                    ? item.after
                    : randomBetween(240, 620);

                later(state, sendNext, between, sessionId);
            }, wait, sessionId);
        };

        sendNext();
    }

    function isSessionActive(state, friendId, sessionId) {
        return sessionId === state.sessionId && state.matchedFriendId === friendId && !!getMatchedFriend(state);
    }

    function getJokesForFriend(friend, state) {
        const active = JOKES.filter(joke => joke.enabled !== false);
        const categories = new Set(friend?.categories || []);

        let pool = active.filter(joke => Array.isArray(joke.friendIds) && joke.friendIds.includes(friend?.id) && !state.usedJokes.has(joke.id));
        if (!pool.length) pool = active.filter(joke => categories.has(joke.category) && !state.usedJokes.has(joke.id));
        if (!pool.length) pool = active.filter(joke => Array.isArray(joke.friendIds) && joke.friendIds.includes(friend?.id));
        if (!pool.length) pool = active.filter(joke => categories.has(joke.category));
        if (!pool.length) pool = active.filter(joke => !state.usedJokes.has(joke.id));
        if (!pool.length) pool = active;
        return pool;
    }

    function chooseJokeKind(friend, pool) {
        const bias = friend?.kindBias || { dialogue: 0.55, one_liner: 0.35, riddle: 0.10, story: 0.05 };
        const available = [...new Set(pool.map(item => item.kind))];
        if (!available.length) return 'one_liner';

        const storyOnly = available.length === 1 && available[0] === 'story';
        if (storyOnly) return 'story';

        const weighted = available
            .filter(kind => kind !== 'story' || Number(bias.story ?? 0) > 0.25)
            .map(kind => ({ kind, weight: Math.max(0, Number(bias[kind] ?? 0)) }));
        const total = weighted.reduce((sum, item) => sum + item.weight, 0);
        if (!total) return weighted[0]?.kind || available[0];

        let cursor = Math.random() * total;
        for (const item of weighted) {
            cursor -= item.weight;
            if (cursor <= 0) return item.kind;
        }
        return weighted[weighted.length - 1].kind;
    }

    function chooseJokeForFriend(friend, state) {
        const pool = getJokesForFriend(friend, state);
        const kind = chooseJokeKind(friend, pool);
        const sameKind = pool.filter(joke => joke.kind === kind);
        return randomItem(sameKind.length ? sameKind : pool);
    }

    function makeQuestionChoices(joke) {
        if (Array.isArray(joke?.options) && joke.options.length >= 3) {
            return shuffle(joke.options).slice(0, 3);
        }

        const correct = joke.answer;
        const sameCategory = JOKES.filter(item =>
            item.id !== joke.id &&
            item.answer &&
            item.answer !== correct &&
            item.category === joke.category
        ).map(item => item.answer);

        const backup = JOKES.filter(item =>
            item.id !== joke.id &&
            item.answer &&
            item.answer !== correct
        ).map(item => item.answer);

        const candidateSource = sameCategory.length >= 2 ? sameCategory : backup;
        const distractors = shuffle([...new Set(candidateSource)]).slice(0, 2);
        const choices = shuffle([correct, ...distractors]);
        return choices.length === 3 ? choices : [correct, '我先猜一個', '這題有陷阱'];
    }

    function getIntroChoices(friend) {
        const choicesByStyle = {
            '諧音型': ['好啊，你出題！', '我有預感這題很冷。', '先說，我不一定接得到你的梗。'],
            '動物型': ['好呀，來一題可愛的！', '我準備好了 🐾', '來吧，我今天有空。'],
            '食物型': ['好啊，先上菜！', '來一道招牌的。', '我接受這份笑話套餐。'],
            '校園型': ['好啊，你出題！', '老師不在，我要亂猜了。', '考試前先來玩一題。'],
            '反轉型': ['我準備好了。', '你最好不要騙我。', '來，讓我看看有多難。'],
            '科技型': ['已連線，請出題。', '收到，開始測試。', '我現在 CPU 很閒。'],
            '荒謬型': ['來啊，越怪越好。', '我已經準備放棄正常思考。', '腦洞模式 ON。'],
            '溫柔型': ['好啊，我陪你玩。', '可以呀，慢慢來。', '來一題輕鬆的就好。'],
            '短梗型': FALLBACK_REPLIES,
            '生活擬人型': ['好啊，翻下一頁。', '來吧，我已經坐好了。', '可以，今天就從這題開始。'],
            '長篇純笑話': ['好啊，你慢慢講。', '我今天有空，來個長一點的。', '不用急，我聽你說。']
        };
        const style = getFriendStyle(friend);
        return choicesByStyle[style] || FALLBACK_REPLIES;
    }

    function getGuessChoices(joke) {
        return [
            '我有一個直覺答案 🤔',
            '這題感覺有陷阱',
            '我先亂猜一下 😂'
        ];
    }

    function appendChatMessage(container, role, text, options = {}) {
        const feed = container.querySelector('.joke-chat-feed');
        if (!feed) return;
        const row = document.createElement('div');
        row.className = `joke-msg-row ${role === 'user' ? 'is-user' : 'is-friend'}`;
        const storyClass = options.story ? ' joke-story-message' : '';
        row.innerHTML = `
            ${role === 'friend' ? `<div class="joke-msg-avatar">${escapeHTML(options.avatar || '🙂')}</div>` : ''}
            <div class="joke-message ${role === 'user' ? 'joke-message-user' : 'joke-message-friend'}${storyClass}">
                ${escapeHTML(text)}
            </div>
        `;
        feed.appendChild(row);
        requestAnimationFrame(() => feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' }));
        return row;
    }

    function addMessageReaction(userRow, emoji) {
        if (!userRow || !emoji) return;
        const bubble = userRow.querySelector('.joke-message-user');
        if (!bubble) return;

        const reaction = document.createElement('span');
        reaction.className = 'joke-msg-reaction';
        reaction.setAttribute('aria-label', `笑友回應 ${emoji}`);
        reaction.textContent = emoji;
        bubble.appendChild(reaction);
        return reaction;
    }

    function showTyping(container, friend) {
        const feed = container.querySelector('.joke-chat-feed');
        if (!feed) return null;
        const row = document.createElement('div');
        row.className = 'joke-msg-row is-friend joke-typing-row';
        row.innerHTML = `
            <div class="joke-msg-avatar">${escapeHTML(friend.emoji || '🙂')}</div>
            <div class="joke-message joke-message-friend joke-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        feed.appendChild(row);
        requestAnimationFrame(() => feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' }));
        return row;
    }

    function render(container, state) {
        if (!container) return;

        if (state.screen === 'browse') renderBrowse(container, state);
        else if (state.screen === 'match') renderMatch(container, state);
        else if (state.screen === 'chat') renderChat(container, state);
    }

    function renderShellHeader(friend = null) {
        if (!friend) return '';

        return `
            <div class="joke-chat-header">
                <button class="joke-header-back" type="button" data-joke-action="back">←</button>
                <div class="joke-header-avatar">${escapeHTML(friend.emoji)}</div>
                <div class="joke-header-info">
                    <div class="joke-header-name">${escapeHTML(friend.name)}</div>
                    <div class="joke-header-status">${escapeHTML(friend.status)}</div>
                </div>
                <div class="joke-header-online"><span></span> 在線</div>
            </div>
        `;
    }

    function renderBrowse(container, state) {
        const friend = state.stack[state.index];
        if (!friend) {
            state.stack = shuffle(FRIENDS);
            state.index = 0;
            renderBrowse(container, state);
            return;
        }

        const progress = `${Math.min(state.index + 1, state.stack.length)} / ${state.stack.length}`;
        container.innerHTML = `
            <div class="joke-app joke-browse-app">
                ${renderShellHeader()}

                <div class="joke-browse-intro">
                    <div class="joke-browse-title">今天想找哪位笑友？</div>
                    <div class="joke-browse-subtitle">左右滑一下，看看誰最懂你的笑點。</div>
                </div>

                <div class="joke-card-stage" data-swipe-surface>
                    <div class="joke-deck-shadow"></div>
                    <article class="joke-profile-card" data-swipe-card tabindex="0">
                        <div class="joke-profile-cover"></div>
                        <div class="joke-profile-avatar-wrap">
                            <div class="joke-profile-avatar">${escapeHTML(friend.emoji)}</div>
                            <div class="joke-profile-online-dot"></div>
                        </div>
                        <div class="joke-profile-body">
                            <div class="joke-profile-name-row">
                                <h3>${escapeHTML(friend.name)}</h3>
                                <span class="joke-profile-heart">♡</span>
                            </div>
                            <div class="joke-profile-tone">${escapeHTML(friend.tone)}</div>
                            <div class="joke-profile-style">${escapeHTML(friend.style)}</div>
                            <p>${escapeHTML(friend.bio)}</p>
                            <div class="joke-profile-status">「${escapeHTML(friend.status)}」</div>
                        </div>
                    </article>
                    <div class="joke-swipe-stamp joke-stamp-like">LIKE ♥</div>
                    <div class="joke-swipe-stamp joke-stamp-nope">PASS</div>
                </div>

                <div class="joke-swipe-hint">← 左滑略過　　右滑喜歡 →</div>

                <div class="joke-swipe-actions">
                    <button type="button" class="joke-circle-action joke-pass" data-joke-action="pass" aria-label="略過">×</button>
                    <div class="joke-progress">${progress}</div>
                    <button type="button" class="joke-circle-action joke-like" data-joke-action="like" aria-label="喜歡">♥</button>
                </div>

                <div class="joke-browse-note">這裡的笑友都是 Safe Space 裡的虛構角色，不是真人。</div>
            </div>
        `;

        bindSwipe(container, state);
    }

    function bindSwipe(container, state) {
        const surface = container.querySelector('[data-swipe-surface]');
        const card = container.querySelector('[data-swipe-card]');
        if (!surface || !card) return;

        surface.style.touchAction = 'none';
        card.style.touchAction = 'none';
        surface.style.overscrollBehavior = 'none';
        card.style.webkitTouchCallout = 'none';
        card.style.webkitUserSelect = 'none';
        card.style.userSelect = 'none';

        let active = false;
        let inputType = null;
        let startX = 0;
        let startY = 0;
        let dx = 0;
        let dy = 0;
        let moved = false;
        let lastTouchEnd = 0;

        const startDrag = (x, y, type) => {
            if (state.locked) return;
            active = true;
            inputType = type;
            startX = x;
            startY = y;
            dx = 0;
            dy = 0;
            moved = false;
            card.classList.add('is-pointer-down');
        };

        const moveDrag = (x, y, event) => {
            if (!active || state.locked) return;
            dx = x - startX;
            dy = y - startY;
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) moved = true;
            event?.preventDefault?.();
            const rotation = Math.max(-18, Math.min(18, dx * 0.055));
            card.style.transform = `translate3d(${dx}px, ${dy * 0.12}px, 0) rotate(${rotation}deg)`;
            card.classList.toggle('is-dragging-right', dx > 28);
            card.classList.toggle('is-dragging-left', dx < -28);
        };

        const resetDrag = () => {
            active = false;
            inputType = null;
            card.classList.remove('is-pointer-down', 'is-dragging-right', 'is-dragging-left');
            card.style.transform = '';
            dx = 0;
            dy = 0;
        };

        const finishDrag = () => {
            if (!active) return;
            const finalDx = dx;
            active = false;
            inputType = null;
            card.classList.remove('is-pointer-down', 'is-dragging-right', 'is-dragging-left');
            if (finalDx > 105) settleSwipe(container, state, 'like', card);
            else if (finalDx < -105) settleSwipe(container, state, 'pass', card);
            else card.style.transform = '';
            dx = 0;
            dy = 0;
        };

        const onTouchStart = (event) => {
            if (!event.touches?.length) return;
            const t = event.touches[0];
            startDrag(t.clientX, t.clientY, 'touch');
        };
        const onTouchMove = (event) => {
            if (inputType !== 'touch' || !event.touches?.length) return;
            const t = event.touches[0];
            moveDrag(t.clientX, t.clientY, event);
        };
        const onTouchEnd = (event) => {
            if (inputType !== 'touch') return;
            event.preventDefault();
            lastTouchEnd = Date.now();
            finishDrag();
        };

        surface.addEventListener('touchstart', onTouchStart, { passive: false });
        surface.addEventListener('touchmove', onTouchMove, { passive: false });
        surface.addEventListener('touchend', onTouchEnd, { passive: false });
        surface.addEventListener('touchcancel', onTouchEnd, { passive: false });

        if ('PointerEvent' in window) {
            card.addEventListener('pointerdown', (event) => {
                if (event.pointerType === 'touch') return;
                if (event.pointerType === 'mouse' && event.button !== 0) return;
                startDrag(event.clientX, event.clientY, 'pointer');
                try { card.setPointerCapture(event.pointerId); } catch (_) {}
            }, { passive: false });
            card.addEventListener('pointermove', (event) => {
                if (event.pointerType === 'touch') return;
                moveDrag(event.clientX, event.clientY, event);
            }, { passive: false });
            card.addEventListener('pointerup', (event) => {
                if (event.pointerType === 'touch') return;
                finishDrag();
            });
            card.addEventListener('pointercancel', (event) => {
                if (event.pointerType === 'touch') return;
                resetDrag();
            });
        }

        surface.addEventListener('click', (event) => {
            if (moved && Date.now() - lastTouchEnd < 500) {
                event.preventDefault();
                event.stopPropagation();
                moved = false;
            }
        }, true);
    }

    function settleSwipe(container, state, action, card) {
        state.locked = true;
        playUiSound(action === 'like' ? 'match' : 'dismiss');
        vibrate(action === 'like' ? [18, 35, 18] : 18);
        card.classList.add(action === 'like' ? 'swipe-out-right' : 'swipe-out-left');
        const stamp = container.querySelector(action === 'like' ? '.joke-stamp-like' : '.joke-stamp-nope');
        if (stamp) stamp.classList.add('show');
        const swipeSession = state.sessionId;
        later(state, () => handleSwipeResult(container, state, action), 420, swipeSession);
    }

    function handleSwipeResult(container, state, action) {
        const friend = state.stack[state.index];
        state.locked = false;
        if (action === 'like') {
            // ★ 配對完成後立刻鎖定人物 ID；後續 Match / Chat 都只認這個 ID。
            state.currentFriend = friend;
            state.matchedFriendId = friend.id;
            state.currentJoke = null;
            state.selectedIntro = null;
            state.selectedGuess = null;
            invalidateSession(state);
            state.sessionId += 1;
            state.screen = 'match';
            render(container, state);
            return;
        }
        state.index += 1;
        if (state.index >= state.stack.length) {
            state.stack = shuffle(FRIENDS);
            state.index = 0;
        }
        render(container, state);
    }

    function renderMatch(container, state) {
        const friend = getMatchedFriend(state);
        if (!friend) {
            state.screen = 'browse';
            state.currentFriend = null;
            state.matchedFriendId = null;
            render(container, state);
            return;
        }
        state.currentFriend = friend;
        container.innerHTML = `
            <div class="joke-app joke-match-app">
                <div class="joke-match-glow"></div>
                <div class="joke-match-heart">♥</div>
                <div class="joke-match-label">IT'S A MATCH!</div>
                <div class="joke-match-title">你和 ${escapeHTML(friend.name)} 配對成功了</div>
                <div class="joke-match-avatar">${escapeHTML(friend.emoji)}</div>
                <div class="joke-match-name">${escapeHTML(friend.name)}</div>
                <div class="joke-match-style">${escapeHTML(friend.style)}</div>
                <p class="joke-match-copy">${escapeHTML(friend.status)}</p>
                <button type="button" class="joke-primary-btn" data-joke-action="enter-chat">💬 進入聊天室</button>
                <button type="button" class="joke-text-btn" data-joke-action="back">先看看別人</button>
            </div>
        `;
    }

    function renderChat(container, state) {
        const friend = getMatchedFriend(state);
        if (!friend) {
            state.screen = 'browse';
            state.currentFriend = null;
            state.matchedFriendId = null;
            render(container, state);
            return;
        }

        // 聊天室每次 render 都重新綁定到「已配對 ID」，避免畫面跟錯人。
        state.currentFriend = friend;

        container.innerHTML = `
            <div class="joke-app joke-chat-app">
                ${renderShellHeader(friend)}
                <div class="joke-chat-feed" aria-live="polite"></div>
                <div class="joke-chat-composer" id="joke-composer"></div>
            </div>
        `;

        beginChat(container, state);
    }

    function beginChat(container, state) {
        const friend = getMatchedFriend(state);
        if (!friend) return;

        // 每次正式進聊天室，都建立新的 session。舊聊天室殘留的 setTimeout 全部失效。
        invalidateSession(state);
        state.sessionId += 1;
        const sessionId = state.sessionId;
        const friendId = friend.id;
        const style = getFriendStyle(friend);
        const introChoices = getIntroChoices(friend);

        const invitation = friend?.kindBias?.story
            ? '今天不考你，我想慢慢講一個小故事給你聽。'
            : '今天有空的話，我想跟你玩一個小小的笑話。';

        state.locked = true;
        state.jokeRoundCount = 0;
        state.sessionMaxJokes = randomBetween(1, 3);
        queueFriendMessages(
            container,
            state,
            friend,
            [
                { text: friend.intro, phase: 'opening' },
                { text: invitation, phase: style === '長篇純笑話' ? 'story' : 'opening' }
            ],
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                state.locked = false;
                showComposerChoices(container, state, introChoices, 'intro');
            },
            sessionId
        );
    }

    function showComposerChoices(container, state, choices, type) {
        const composer = container.querySelector('#joke-composer');
        if (!composer) return;

        if (type === 'guess') {
            composer.innerHTML = `
                <div class="joke-composer-label">你可以怎麼回？不用急著猜對。</div>
                <div class="joke-choice-grid joke-guess-reaction-grid">
                    ${choices.map((choice, index) => `
                        <button type="button" class="joke-choice-btn" data-joke-action="guess-choice" data-value="${index}">
                            ${escapeHTML(choice)}
                        </button>
                    `).join('')}
                </div>
                <div class="joke-free-guess">
                    <input id="joke-free-guess-input" class="joke-free-guess-input" type="text" maxlength="120" autocomplete="off" placeholder="或自己打一句猜測……">
                    <button type="button" class="joke-free-guess-send" data-joke-action="submit-free-guess">送出</button>
                </div>
            `;
            return;
        }

        composer.innerHTML = `
            <div class="joke-composer-label">你想怎麼回？</div>
            <div class="joke-choice-grid">
                ${choices.map((choice, index) => `
                    <button type="button" class="joke-choice-btn" data-joke-action="${type === 'intro' ? 'intro-choice' : 'guess-choice'}" data-value="${index}">
                        ${escapeHTML(choice)}
                    </button>
                `).join('')}
            </div>
        `;
    }

    function showNextButton(container, action, label) {
        const composer = container.querySelector('#joke-composer');
        if (!composer) return;
        composer.innerHTML = `
            <button type="button" class="joke-primary-btn joke-full-btn" data-joke-action="${action}">${escapeHTML(label)}</button>
        `;
    }

    function handleAction(container, state, action, value) {
        switch (action) {
            case 'pass':
                settleSwipe(container, state, 'pass', container.querySelector('[data-swipe-card]'));
                break;
            case 'like':
                settleSwipe(container, state, 'like', container.querySelector('[data-swipe-card]'));
                break;
            case 'enter-chat':
                state.screen = 'chat';
                state.locked = false;
                render(container, state);
                break;
            case 'intro-choice':
                handleIntroChoice(container, state, Number(value));
                break;
            case 'guess-choice':
                handleGuessChoice(container, state, Number(value));
                break;
            case 'submit-free-guess':
                submitFreeGuess(container, state);
                break;
            case 'answer-response':
                submitAnswerResponse(container, state, Number(value));
                break;
            case 'leave-reply':
                completeFriendLeave(container, state, Number(value));
                break;
            case 'continue-joke':
                continueJoke(container, state, Number(value));
                break;
            case 'end-chat':
                handleEndChatChoice(container, state, Number(value));
                break;
            case 'explain':
                showJokeExplanation(container, state);
                break;
            case 'feel-good':
                finishRound(container, state, 'feel-good');
                break;
            case 'feel-mild':
                finishRound(container, state, 'feel-mild');
                break;
            case 'feel-flat':
                finishRound(container, state, 'feel-flat');
                break;
            case 'next-friend':
                goNextFriend(container, state);
                break;
            case 'back':
                goBack(container, state);
                break;
            default:
                break;
        }
    }

    function handleIntroChoice(container, state, index) {
        const friend = getMatchedFriend(state);
        if (!friend) return;
        const options = getIntroChoices(friend);
        const selected = options[index] || options[0];
        const style = getFriendStyle(friend);
        const reactions = REACTION_BY_STYLE[style] || REACTION_BY_STYLE['冷面型'];
        const reaction = randomItem(reactions);

        state.selectedIntro = selected;
        appendChatMessage(container, 'user', selected);
        state.locked = true;
        container.querySelector('#joke-composer').innerHTML = '';

        const sessionId = state.sessionId;
        const friendId = friend.id;

        queueFriendMessages(
            container,
            state,
            friend,
            [{ text: reaction, phase: 'reaction' }],
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                prepareJoke(container, state);
            },
            sessionId
        );
    }

    function isRiddleJoke(joke) {
        return joke?.kind === 'riddle';
    }

    function isDialogueJoke(joke) {
        return joke?.kind === 'dialogue';
    }

    function isOneLinerJoke(joke) {
        return joke?.kind === 'one_liner';
    }

    function isStoryJoke(joke) {
        return joke?.kind === 'story' || joke?.category === 'story';
    }

    function prepareJoke(container, state) {
        const friend = getMatchedFriend(state);
        if (!friend) return;

        const joke = chooseJokeForFriend(friend, state);
        state.currentJoke = joke;
        state.usedJokes.add(joke.id);
        state.jokeRoundCount += 1;
        state.locked = true;

        const composer = container.querySelector('#joke-composer');
        if (composer) composer.innerHTML = '';

        const sessionId = state.sessionId;
        const friendId = friend.id;

        // 長篇故事：拆成數個訊息泡泡，並在每則前重新顯示輸入中。
        if (isStoryJoke(joke)) {
            const storyLines = String(joke.text || joke.question || '')
                .split(/\n+/)
                .map(line => line.trim())
                .filter(Boolean);

            queueFriendMessages(
                container,
                state,
                friend,
                [
                    { text: '這次不考你，我直接講個故事。', phase: 'opening', after: randomBetween(380, 720) },
                    ...storyLines.map(line => ({ text: line, phase: 'story', story: true }))
                ],
                () => finishDirectJoke(container, state, sessionId, friendId, joke, 'story'),
                sessionId
            );
            return;
        }

        // 短對話：每一句台詞都分開送出，模擬真人逐句打字。
        if (isDialogueJoke(joke)) {
            const lines = String(joke.text || '')
                .split(/\n+/)
                .map(line => line.trim())
                .filter(Boolean);

            queueFriendMessages(
                container,
                state,
                friend,
                [
                    { text: '這次來一段小短劇。', phase: 'opening', after: randomBetween(300, 580) },
                    ...lines.map(line => ({ text: line, phase: 'normal', dialogue: true }))
                ],
                () => finishDirectJoke(container, state, sessionId, friendId, joke, 'dialogue'),
                sessionId
            );
            return;
        }

        // 一句／短笑話：直接講，但仍保留真人式等待。
        if (isOneLinerJoke(joke)) {
            queueFriendMessages(
                container,
                state,
                friend,
                [{ text: joke.text || joke.question || '', phase: 'punchline' }],
                () => finishDirectJoke(container, state, sessionId, friendId, joke, 'one_liner'),
                sessionId
            );
            return;
        }

        // 真正的急轉彎才進入猜題。
        queueFriendMessages(
            container,
            state,
            friend,
            [
                { text: '好，這次是真的讓你猜看看 😏', phase: 'opening', after: randomBetween(280, 560) },
                { text: joke.question || '', phase: 'question' }
            ],
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                showComposerChoices(container, state, getGuessChoices(joke), 'guess');
                state.locked = false;
            },
            sessionId
        );
    }

    function finishDirectJoke(container, state, sessionId, friendId, joke, kind) {
        const friend = getMatchedFriend(state);
        // 這裡只負責非 riddle；原 v6.1 的條件寫反，導致 story/dialogue/one_liner 全部在這裡直接 return，
        // 因而笑友講完最後一句後 composer 永遠不會恢復。
        if (!friend || !joke || isRiddleJoke(joke) || !isSessionActive(state, friendId, sessionId)) return;

        const tag = {
            story: '故事講完了。這次不用猜，單純陪你笑一下就好。',
            dialogue: '好了，短劇散場。剛才那個場面，你有沒有覺得很熟悉？😂',
            one_liner: '嗯，這種就是不用想太久，聽完就可以直接吐槽我的那種。'
        }[kind] || '笑話講完了，謝謝你陪我玩一下。';

        const messages = [];
        if (joke.reveal) {
            messages.push({ text: joke.reveal, phase: 'punchline' });
        }
        messages.push({ text: tag, phase: 'closing' });

        queueFriendMessages(
            container,
            state,
            friend,
            messages,
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                showFeelingChoices(container, state);
                state.locked = false;
                vibrate(25);
                playUiSound('success');
            },
            sessionId
        );
    }

    function handleGuessChoice(container, state, index) {
        const joke = state.currentJoke;
        if (!joke || !isRiddleJoke(joke)) return;
        const choices = getGuessChoices(joke);
        submitGuessReply(container, state, choices[index] || choices[0]);
    }

    function submitFreeGuess(container, state) {
        const input = container.querySelector('#joke-free-guess-input');
        if (!input || !input.value.trim()) {
            input?.focus();
            return;
        }
        submitGuessReply(container, state, input.value.trim());
    }

    function submitGuessReply(container, state, selected) {
        const friend = getMatchedFriend(state);
        const joke = state.currentJoke;
        if (!friend || !joke || !isRiddleJoke(joke) || state.locked) return;

        state.selectedGuess = selected;
        appendChatMessage(container, 'user', selected);
        state.locked = true;
        const composer = container.querySelector('#joke-composer');
        if (composer) composer.innerHTML = '';

        const sessionId = state.sessionId;
        const friendId = friend.id;
        const answerText = joke.answer ? `答案是：${joke.answer}！` : '答案揭曉囉！';
        const reaction = randomItem([
            '嗯……這個答案我先收下。',
            '這個猜法我懂 😂',
            '好，我不賣關子了。'
        ]);

        queueFriendMessages(
            container,
            state,
            friend,
            [
                { text: reaction, phase: 'reaction', after: randomBetween(360, 760) },
                { text: answerText, phase: 'answer' }
            ],
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                showAnswerResponseChoices(container, state);
                state.locked = false;
            },
            sessionId
        );
    }

    function showAnswerResponseChoices(container, state) {
        const composer = container.querySelector('#joke-composer');
        if (!composer) return;
        composer.innerHTML = `
            <div class="joke-composer-label">知道答案之後，你想怎麼回？</div>
            <div class="joke-choice-grid joke-answer-response-grid">
                <button type="button" class="joke-choice-btn" data-joke-action="answer-response" data-value="0">喔～原來是這樣！</button>
                <button type="button" class="joke-choice-btn" data-joke-action="answer-response" data-value="1">等等，我懂了 😂</button>
                <button type="button" class="joke-choice-btn" data-joke-action="answer-response" data-value="2">你繼續，我想聽後面 👂</button>
            </div>
        `;
    }

    function submitAnswerResponse(container, state, index) {
        const friend = getMatchedFriend(state);
        const joke = state.currentJoke;
        if (!friend || !joke || !isRiddleJoke(joke) || state.locked) return;

        const replies = [
            '喔～原來是這樣！',
            '等等，我懂了 😂',
            '你繼續，我想聽後面 👂'
        ];
        const reply = replies[index] || replies[0];
        appendChatMessage(container, 'user', reply);
        state.locked = true;
        const sessionId = state.sessionId;
        const friendId = friend.id;

        const explanation = joke.explain || '重點就在最後那一下反轉：前面的情境讓你往一個方向想，最後再把它換個角度看。';
        const followupsByStyle = {
            '冷面型': ['你剛剛是不是有一瞬間很認真地相信答案就是你猜的那個？', '冷笑話講完，我會負責把空氣留給你。'],
            '諧音型': ['我承認，這種笑點真的很仰賴最後那個字。', '如果你沒有笑，也可以把責任推給我的諧音。'],
            '動物型': ['其實這題最可愛的地方，是答案完全沒打算跟你講道理。', '好啦，這隻腦袋今天先到這裡。'],
            '食物型': ['這個包袱大概就是最後一口才出現。', '我覺得它還可以配一杯飲料。'],
            '校園型': ['這題如果出現在考卷上，我大概會先懷疑老師。', '反正這不是成績，猜不到也沒關係。'],
            '反轉型': ['你剛剛走的路很合理，可惜這題故意在最後轉彎。', '這就是我最喜歡的地方：前面都認真，最後才耍賴。'],
            '科技型': ['簡單說，就是前面建立了一個假邏輯，最後執行了不同的程式。', '系統暫時不需要更新，你已經懂了。'],
            '荒謬型': ['它沒有多深奧，只是最後突然決定不講武德。', '有些笑話就是這樣，邏輯走到一半就請假了。'],
            '溫柔型': ['不用很用力理解啦，抓到那個小小反差就好。', '有懂就好，不懂也可以把它當成一個小腦洞。'],
            '短梗型': ['重點就一個：最後那一下。', '好，包袱收乾淨。'],
            '生活擬人型': ['就是把日常裡很普通的事情，稍微歪一下。', '生活本身有時候就很會開玩笑。'],
            '長篇純笑話': ['這種題目不是要你考滿分，是陪你繞一下再回來。', '好，這個小故事的轉彎處你現在有抓到了。']
        };
        const style = getFriendStyle(friend);
        const followups = followupsByStyle[style] || followupsByStyle['冷面型'];

        queueFriendMessages(
            container,
            state,
            friend,
            [
                { text: `其實梗在這裡：${explanation}`, phase: 'punchline', after: randomBetween(520, 980) },
                { text: randomItem(followups), phase: 'response' }
            ],
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                showFeelingChoices(container, state);
                state.locked = false;
            },
            sessionId
        );
    }

    function showJokeExplanation(container, state) {
        const joke = state.currentJoke;
        if (!joke?.explain) return;
        const composer = container.querySelector('#joke-composer');
        if (!composer) return;
        const panel = composer.querySelector('.joke-explain-panel');
        const trigger = composer.querySelector('.joke-explain-card');
        if (!panel || !trigger) return;
        const isOpen = panel.classList.toggle('is-open');
        trigger.classList.toggle('is-open', isOpen);
        trigger.setAttribute('aria-expanded', String(isOpen));
    }

    function showFeelingChoices(container, state, includeExplain = true) {
        const composer = container.querySelector('#joke-composer');
        if (!composer) return;
        const explainHtml = includeExplain && state.currentJoke?.explain ? `
            <div class="joke-explain-wrap">
                <button type="button" class="joke-explain-card" data-joke-action="explain" aria-expanded="false">
                    <span class="joke-explain-icon">💡</span>
                    <span class="joke-explain-copy"><strong>想知道為什麼好笑？</strong><small>看看這題的梗怎麼落下來</small></span>
                    <span class="joke-explain-arrow">⌄</span>
                </button>
                <div class="joke-explain-panel"><div class="joke-explain-inner">${escapeHTML(state.currentJoke.explain)}</div></div>
            </div>
        ` : '';
        composer.innerHTML = `
            ${explainHtml}
            <div class="joke-composer-label">這次的笑話：</div>
            <div class="joke-feel-grid">
                <button type="button" data-joke-action="feel-good">😂 有笑到</button>
                <button type="button" data-joke-action="feel-mild">🙂 微微笑</button>
                <button type="button" data-joke-action="feel-flat">😐 我在努力</button>
            </div>
        `;
    }

    function getConversationLeaveChance(friend, roundCount) {
        const style = getFriendStyle(friend);
        const base = {
            '長篇純笑話': 0.18,
            '冷面型': 0.12,
            '諧音型': 0.14,
            '動物型': 0.10,
            '食物型': 0.12,
            '校園型': 0.10,
            '反轉型': 0.14,
            '科技型': 0.12,
            '荒謬型': 0.12,
            '溫柔型': 0.08,
            '短梗型': 0.11,
            '生活擬人型': 0.10
        }[style] ?? 0.12;
        return Math.min(0.45, base + Math.max(0, roundCount - 1) * 0.08);
    }

    function getFarewellMessages(friend) {
        const style = getFriendStyle(friend);
        const byStyle = {
            '長篇純笑話': [
                '好啦，我今天的故事庫先收起來。',
                '改天再找你，我還有幾個故事沒有講完。'
            ],
            '冷面型': [
                '我先撤了，免得今天冷笑話超標。',
                '下次見。記得替我跟氣氛說聲對不起。'
            ],
            '諧音型': [
                '我先閃了，再講下去可能會諧過頭。',
                '今天就到這裡，梗先留著。'
            ],
            '動物型': [
                '我要去找點東西吃了，先溜～ 🐾',
                '下次再來陪你玩！'
            ],
            '食物型': [
                '我先去忙了，麵包還在等我顧火。',
                '今天先到這裡，下次再端新的上來。'
            ],
            '校園型': [
                '好啦，下課鐘聲響了，我先走一步。',
                '下次再來，不然我真的要遲到了。'
            ],
            '反轉型': [
                '我先走囉。你以為這是結尾？對，就是結尾。',
                '下次見，別太早猜到我的套路。'
            ],
            '科技型': [
                '我先暫停服務一下，CPU 需要休息。',
                '聊天連線先到這裡，下次再重新連線。'
            ],
            '荒謬型': [
                '我突然有事情要去做——至於是什麼，我也不知道。',
                '先撤退。今天的正常思考額度用完了。'
            ],
            '溫柔型': [
                '今天先聊到這裡就好。',
                '你不用一直待在這裡，也可以去做自己的事。下次見。'
            ],
            '短梗型': [
                '好啦，我先走。',
                '下次再丟一個短的給你。'
            ],
            '生活擬人型': [
                '我先去忙一下日常，今天就聊到這裡。',
                '下次再見。生活還沒演完。'
            ]
        };
        return byStyle[style] || byStyle['溫柔型'];
    }

    const LEAVE_REPLY_CHOICES = [
        { text: '好呀，下次見 👋', reaction: '👋' },
        { text: '好，去忙吧～😊', reaction: '😊' },
        { text: '掰掰！謝謝你今天陪我聊 ❤️', reaction: '❤️' }
    ];

    function appendLeaveNotice(container, state, friend) {
        const feed = container.querySelector('.joke-chat-feed');
        if (!feed) return;
        const notice = document.createElement('div');
        notice.className = 'joke-chat-leave-notice';
        notice.innerHTML = `<span class="joke-chat-leave-dot"></span><strong>${escapeHTML(friend.name)}</strong><span>已離開聊天室</span>`;
        feed.appendChild(notice);
        feed.scrollTop = feed.scrollHeight;
    }

    function showLeaveReplyChoices(container, state) {
        const friend = getMatchedFriend(state);
        const composer = container.querySelector('#joke-composer');
        if (!friend || !composer) return;

        composer.innerHTML = `
            <div class="joke-composer-label">要怎麼回 ${escapeHTML(friend.name)}？</div>
            <div class="joke-choice-grid joke-leave-reply-grid">
                ${LEAVE_REPLY_CHOICES.map((choice, index) => `
                    <button type="button" class="joke-choice-btn joke-leave-reply-btn" data-joke-action="leave-reply" data-value="${index}">
                        ${escapeHTML(choice.text)}
                    </button>
                `).join('')}
            </div>
        `;
        state.locked = false;
    }

    function completeFriendLeave(container, state, replyIndex) {
        const friend = getMatchedFriend(state);
        if (!friend || state.locked) return;
        const choice = LEAVE_REPLY_CHOICES[replyIndex] || LEAVE_REPLY_CHOICES[0];

        const userRow = appendChatMessage(container, 'user', choice.text);
        const composer = container.querySelector('#joke-composer');
        if (composer) composer.innerHTML = '';

        state.locked = true;
        const sessionId = state.sessionId;
        const friendId = friend.id;

        // 模擬「看到訊息後按了一個表情反應」：先在使用者訊息上掛反應，再送最後一句。
        later(state, () => {
            if (!isSessionActive(state, friendId, sessionId)) return;
            addMessageReaction(userRow, choice.reaction);
            playUiSound('success');
            vibrate(18);

            const finalReplies = {
                '👋': ['收到～那我先走啦！👋', '好呀，下次再來找我聊。'],
                '😊': ['好，先去忙一下～你也慢慢來。', '收到，那我先離開一下囉 😊'],
                '❤️': ['我也很開心今天有陪你聊一下。', '那就先這樣，謝謝你陪我玩～ ❤️']
            }[choice.reaction] || ['好呀，那我先走啦！'];

            queueFriendMessages(
                container,
                state,
                friend,
                [{ text: randomItem(finalReplies), phase: 'closing' }],
                () => {
                    if (!isSessionActive(state, friendId, sessionId)) return;
                    appendLeaveNotice(container, state, friend);
                    state.locked = false;
                    showNextButton(container, 'next-friend', '❤️ 回到笑友列表');
                },
                sessionId
            );
        }, randomBetween(420, 900), sessionId);
    }

    function handleEndChatChoice(container, state, replyIndex = 0) {
        const friend = getMatchedFriend(state);
        if (!friend || state.locked) return;
        const options = [
            '🌿 今天先這樣，我先去忙了。',
            '🌿 今天先這樣，謝謝你陪我聊。',
            '🌿 我先離開囉，下次見。'
        ];
        appendChatMessage(container, 'user', options[replyIndex] || options[0]);
        endConversation(container, state, 'user');
    }

    function endConversation(container, state, reason = 'auto') {
        const friend = getMatchedFriend(state);
        if (!friend || state.locked) return;
        state.locked = true;
        const sessionId = state.sessionId;
        const friendId = friend.id;
        const farewell = getFarewellMessages(friend);

        // 這裡只講「為什麼先離開」，不直接宣布離開；說完理由後再讓使用者回覆。
        const reasonMessages = reason === 'user'
            ? [
                { text: '好呀，我剛好也差不多要去忙一下了。', phase: 'response' },
                { text: randomItem(farewell), phase: 'closing' }
            ]
            : [
                { text: randomItem(farewell), phase: 'closing' }
            ];

        const composer = container.querySelector('#joke-composer');
        if (composer) composer.innerHTML = '';

        queueFriendMessages(
            container,
            state,
            friend,
            reasonMessages,
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                showLeaveReplyChoices(container, state);
            },
            sessionId
        );
    }

    function getContinueChoices() {
        return [
            { text: '好啊，再來一個！😂', action: 'continue-joke', value: 0 },
            { text: '可以，我還沒聽夠 👀', action: 'continue-joke', value: 1 },
            { text: '今天先這樣，謝謝你 🌿', action: 'end-chat', value: 0 }
        ];
    }

    function showContinueChoices(container, state) {
        const friend = getMatchedFriend(state);
        const composer = container.querySelector('#joke-composer');
        if (!friend || !composer) return;
        const choices = getContinueChoices();

        composer.innerHTML = `
            <div class="joke-composer-label">還要再聊一個嗎？</div>
            <div class="joke-choice-grid joke-continue-choice-grid">
                ${choices.map(choice => `
                    <button type="button" class="joke-choice-btn joke-continue-choice-btn" data-joke-action="${choice.action}" data-value="${choice.value}">
                        ${escapeHTML(choice.text)}
                    </button>
                `).join('')}
            </div>
        `;
    }

    function maybeContinueAfterRound(container, state) {
        const friend = getMatchedFriend(state);
        if (!friend || state.locked) return;

        const reachedMax = state.jokeRoundCount >= state.sessionMaxJokes;
        const shouldLeave = reachedMax || Math.random() < getConversationLeaveChance(friend, state.jokeRoundCount);

        if (shouldLeave) {
            endConversation(container, state, 'auto');
            return;
        }
        showContinueChoices(container, state);
    }

    function finishRound(container, state, mood) {
        const friend = getMatchedFriend(state);
        if (!friend || state.locked) return;
        const messages = {
            'feel-good': '我就知道！😎 那我今天的工作完成一半了。',
            'feel-mild': '微微笑也算成功，我收下這個小小成就。',
            'feel-flat': '沒關係，今天笑不出來也不用勉強。我們先一起待一下。'
        };
        const userMessages = {
            'feel-good': '😂 有笑到',
            'feel-mild': '🙂 微微笑',
            'feel-flat': '😐 我在努力'
        };

        appendChatMessage(container, 'user', userMessages[mood]);
        state.locked = true;

        const sessionId = state.sessionId;
        const friendId = friend.id;
        queueFriendMessages(
            container,
            state,
            friend,
            [{ text: messages[mood], phase: 'response' }],
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                state.locked = false;
                maybeContinueAfterRound(container, state);
            },
            sessionId
        );
    }

    function continueJoke(container, state, choiceIndex = 0) {
        const friend = getMatchedFriend(state);
        if (!friend || state.locked) return;
        if (state.jokeRoundCount >= state.sessionMaxJokes) {
            maybeContinueAfterRound(container, state);
            return;
        }

        const choices = getContinueChoices().filter(choice => choice.action === 'continue-joke');
        const selectedChoice = choices[choiceIndex] || choices[0];
        appendChatMessage(container, 'user', selectedChoice.text);
        const composer = container.querySelector('#joke-composer');
        if (composer) composer.innerHTML = '';
        state.locked = true;
        const sessionId = state.sessionId;
        const friendId = friend.id;
        const transition = randomItem([
            '好啊，我還有一個想到就想講的。',
            '行，那我再找一個比較適合你的。',
            '可以，第二回合開始。'
        ]);
        queueFriendMessages(
            container,
            state,
            friend,
            [{ text: transition, phase: 'response' }],
            () => {
                if (!isSessionActive(state, friendId, sessionId)) return;
                prepareJoke(container, state);
            },
            sessionId
        );
    }

    function goNextFriend(container, state) {
        invalidateSession(state);
        state.screen = 'browse';
        state.currentFriend = null;
        state.matchedFriendId = null;
        state.currentJoke = null;
        state.selectedGuess = null;
        state.selectedIntro = null;
        state.jokeRoundCount = 0;
        state.sessionMaxJokes = randomBetween(1, 3);
        state.locked = false;
        state.index += 1;
        if (state.index >= state.stack.length) {
            state.stack = shuffle(FRIENDS);
            state.index = 0;
        }
        state.sessionId += 1;
        render(container, state);
    }

    function goBack(container, state) {
        if (state.screen === 'chat' || state.screen === 'match') {
            invalidateSession(state);
            state.screen = 'browse';
            state.currentFriend = null;
            state.matchedFriendId = null;
            state.currentJoke = null;
            state.jokeRoundCount = 0;
            state.sessionMaxJokes = randomBetween(1, 3);
            state.locked = false;
            state.sessionId += 1;
            render(container, state);
            return true;
        }
        return false;
    }

    function mountFeature(container) {
        const state = createState();
        container.classList.add('joke-feature-host');

        // 使用事件委派，確保之後動態生成的聊天選項也能正常點擊。
        const onClick = (event) => {
            const button = event.target.closest?.('[data-joke-action]');
            if (!button || !container.contains(button)) return;
            if (state.locked) return;
            handleAction(container, state, button.dataset.jokeAction, button.dataset.value || '');
        };
        container.addEventListener('click', onClick);

        render(container, state);
        window.currentFeatureBack = () => goBack(container, state);

        return {
            destroy() {
                invalidateSession(state);
                window.currentFeatureBack = null;
                container.removeEventListener('click', onClick);
                container.classList.remove('joke-feature-host');
                container.innerHTML = '';
            }
        };
    }

    function renderJokes(container) {
        const lifecycle = mountFeature(container);
        // ★ 把 destroy 真正交給 Safe Space Router，避免舊聊天室計時器/事件殘留。
        window.currentFeatureCleanup = lifecycle?.destroy || null;
    }

    // 註冊給目前版本與 Stage 1–3 版本的 renderer registry。
    window.renderJokes = renderJokes;
    try {
        if (typeof renderers !== 'undefined' && renderers) {
            renderers.renderJokes = renderJokes;
        }
    } catch (_) {}
})();
