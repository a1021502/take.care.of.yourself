/*
 * Safe Space - Stage 1 feature module
 * Extracted from the original renderers object; behavior intentionally preserved.
 */

renderers.renderAnswerBook = (container) => {
    // 1. 定義模糊但具啟發性的答案庫 (可以自己無限擴充)
   // 🔮 擴充後的 200+ 句解答庫
const ab_answers = [
    // --- 正向肯定 (Action & Yes) ---
    "毫無疑問。<span class='ab-en'>Without a doubt.</span>",
    "這就是你想要的答案。<span class='ab-en'>This is the answer you seek.</span>",
    "放手去做。<span class='ab-en'>Just do it.</span>",
    "絕對是。<span class='ab-en'>Absolutely.</span>",
    "現在就是最佳時機。<span class='ab-en'>Now is the perfect time.</span>",
    "這是一個很棒的計畫。<span class='ab-en'>It is a great plan.</span>",
    "結果會讓你驚喜。<span class='ab-en'>The outcome will surprise you.</span>",
    "勇往直前。<span class='ab-en'>Go for it.</span>",
    "相信你的直覺。<span class='ab-en'>Trust your intuition.</span>",
    "是的，立刻。<span class='ab-en'>Yes, immediately.</span>",
    "這值得冒險。<span class='ab-en'>It is worth the risk.</span>",
    "你會成功的。<span class='ab-en'>You will succeed.</span>",
    "不要猶豫。<span class='ab-en'>Don't hesitate.</span>",
    "這將帶來好運。<span class='ab-en'>It will bring good luck.</span>",
    "全力以赴。<span class='ab-en'>Give it your all.</span>",
    "這是正確的方向。<span class='ab-en'>You are on the right path.</span>",
    "你的選擇是對的。<span class='ab-en'>Your choice is correct.</span>",
    "它會帶來快樂。<span class='ab-en'>It will bring joy.</span>",
    "保持樂觀。<span class='ab-en'>Stay optimistic.</span>",
    "去做就對了。<span class='ab-en'>Just go ahead.</span>",
    "你已經準備好了。<span class='ab-en'>You are ready.</span>",
    "這對你有利。<span class='ab-en'>The odds are in your favor.</span>",
    "這是一次千載難逢的機會。<span class='ab-en'>Once in a lifetime opportunity.</span>",
    "這件事會很順利。<span class='ab-en'>It will go smoothly.</span>",
    "盡力而為，必有回報。<span class='ab-en'>Do your best, and it will pay off.</span>",
    "你會得到支持。<span class='ab-en'>You will be supported.</span>",
    "情況正在好轉。<span class='ab-en'>Things are getting better.</span>",
    "相信你自己。<span class='ab-en'>Believe in yourself.</span>",
    "這是一條康莊大道。<span class='ab-en'>It is a promising path.</span>",
    "你會為此感到自豪。<span class='ab-en'>You will be proud of this.</span>",
    "現在開始。<span class='ab-en'>Start now.</span>",
    "別回頭。<span class='ab-en'>Don't look back.</span>",
    "你比想像中更強大。<span class='ab-en'>You are stronger than you think.</span>",
    "這是命運的安排。<span class='ab-en'>It is destiny.</span>",
    "去爭取。<span class='ab-en'>Fight for it.</span>",
    "接受這個挑戰。<span class='ab-en'>Accept the challenge.</span>",
    "你會喜歡結果的。<span class='ab-en'>You will love the result.</span>",
    "這一頁將是精彩的。<span class='ab-en'>This chapter will be amazing.</span>",
    "是的。<span class='ab-en'>Yes.</span>",
    "當然。<span class='ab-en'>Of course.</span>",

    // --- 否定與煞車 (Stop & No) ---
    "絕對不是。<span class='ab-en'>Absolutely not.</span>",
    "不要這麼做。<span class='ab-en'>Don't do it.</span>",
    "現在不是時候。<span class='ab-en'>Now is not the time.</span>",
    "這是一個陷阱。<span class='ab-en'>It is a trap.</span>",
    "你需要停下來。<span class='ab-en'>You need to stop.</span>",
    "還不是時候。<span class='ab-en'>Not yet.</span>",
    "再考慮一下。<span class='ab-en'>Reconsider it.</span>",
    "這不是個好主意。<span class='ab-en'>It's not a good idea.</span>",
    "結果可能不如預期。<span class='ab-en'>The outcome may disappoint you.</span>",
    "最好不要。<span class='ab-en'>Better not.</span>",
    "請三思而後行。<span class='ab-en'>Think twice.</span>",
    "這條路行不通。<span class='ab-en'>This way won't work.</span>",
    "風險太大了。<span class='ab-en'>The risk is too high.</span>",
    "放下它。<span class='ab-en'>Let it go.</span>",
    "這不值得。<span class='ab-en'>It is not worth it.</span>",
    "你會後悔的。<span class='ab-en'>You will regret it.</span>",
    "保持現狀。<span class='ab-en'>Stay as you are.</span>",
    "不要強求。<span class='ab-en'>Don't force it.</span>",
    "這件事有變數。<span class='ab-en'>Variables exist.</span>",
    "小心行事。<span class='ab-en'>Proceed with caution.</span>",
    "暫時擱置。<span class='ab-en'>Put it on hold.</span>",
    "這是錯誤的選擇。<span class='ab-en'>It is the wrong choice.</span>",
    "不要衝動。<span class='ab-en'>Don't be impulsive.</span>",
    "現在不要。<span class='ab-en'>Not now.</span>",
    "你需要更多資訊。<span class='ab-en'>You need more information.</span>",
    "這會讓你分心。<span class='ab-en'>It will distract you.</span>",
    "拒絕。<span class='ab-en'>Refuse.</span>",
    "不要浪費時間。<span class='ab-en'>Don't waste time.</span>",
    "結果不樂觀。<span class='ab-en'>The outlook is not good.</span>",
    "這不是你該管的事。<span class='ab-en'>It's none of your business.</span>",
    "遠離它。<span class='ab-en'>Stay away from it.</span>",
    "你會失望的。<span class='ab-en'>You will be disappointed.</span>",
    "不要抱太大期望。<span class='ab-en'>Don't expect too much.</span>",
    "這會很困難。<span class='ab-en'>It will be difficult.</span>",
    "不要被表象迷惑。<span class='ab-en'>Don't be fooled by appearances.</span>",
    "這不適合你。<span class='ab-en'>It's not for you.</span>",

    // --- 時間相關 (Timing) ---
    "等待。<span class='ab-en'>Wait.</span>",
    "耐心是關鍵。<span class='ab-en'>Patience is key.</span>",
    "一個月後。<span class='ab-en'>In a month.</span>",
    "明年。<span class='ab-en'>Next year.</span>",
    "明天再決定。<span class='ab-en'>Decide tomorrow.</span>",
    "很快。<span class='ab-en'>Very soon.</span>",
    "還需要一點時間。<span class='ab-en'>It needs more time.</span>",
    "時機尚未成熟。<span class='ab-en'>The time is not ripe.</span>",
    "現在太早了。<span class='ab-en'>Too early.</span>",
    "再等一等。<span class='ab-en'>Wait a little longer.</span>",
    "這需要時間發酵。<span class='ab-en'>Let it brew.</span>",
    "別急。<span class='ab-en'>No rush.</span>",
    "時間會證明一切。<span class='ab-en'>Time will tell.</span>",
    "你需要休息。<span class='ab-en'>You need rest.</span>",
    "這是一個漫長的過程。<span class='ab-en'>It is a long process.</span>",
    "不要急於求成。<span class='ab-en'>Don't rush success.</span>",
    "下週會有答案。<span class='ab-en'>Answer comes next week.</span>",
    "現在不是擔心的時刻。<span class='ab-en'>Not the time to worry.</span>",
    "幾年後你會感謝自己。<span class='ab-en'>You'll thank yourself later.</span>",
    "這件事急不來。<span class='ab-en'>It cannot be rushed.</span>",
    "在春天來臨之前。<span class='ab-en'>Before spring comes.</span>",
    "就在眼前。<span class='ab-en'>It is right in front of you.</span>",
    "這需要長期抗戰。<span class='ab-en'>It requires endurance.</span>",
    "放慢腳步。<span class='ab-en'>Slow down.</span>",
    "不要趕進度。<span class='ab-en'>Don't push the pace.</span>",
    "讓子彈飛一會兒。<span class='ab-en'>Let it unfold.</span>",
    "時間是最好的解藥。<span class='ab-en'>Time is the best healer.</span>",
    "時機稍縱即逝。<span class='ab-en'>Opportunity is fleeting.</span>",
    "你需要睡個好覺再來想。<span class='ab-en'>Sleep on it.</span>",
    "不要在這個週末做決定。<span class='ab-en'>Don't decide this weekend.</span>",
    "這週不適合。<span class='ab-en'>Not this week.</span>",
    "還有機會。<span class='ab-en'>There is still a chance.</span>",

    // --- 尋求外部資源 (External Help) ---
    "去問問你的母親。<span class='ab-en'>Ask your mother.</span>",
    "聽從專家的建議。<span class='ab-en'>Listen to experts.</span>",
    "有人在暗中幫助你。<span class='ab-en'>Someone is helping you secretly.</span>",
    "這需要合作。<span class='ab-en'>Collaboration is needed.</span>",
    "你的朋友知道答案。<span class='ab-en'>Your friend knows.</span>",
    "尋求協助。<span class='ab-en'>Seek help.</span>",
    "不要獨自承擔。<span class='ab-en'>Don't bear it alone.</span>",
    "與人分享。<span class='ab-en'>Share it.</span>",
    "聽聽別人的意見。<span class='ab-en'>Listen to others.</span>",
    "觀察別人的做法。<span class='ab-en'>Observe others.</span>",
    "你需要一個夥伴。<span class='ab-en'>You need a partner.</span>",
    "信任你的導師。<span class='ab-en'>Trust your mentor.</span>",
    "這與某個你認識的人有關。<span class='ab-en'>It involves someone you know.</span>",
    "你會在對話中找到答案。<span class='ab-en'>Answer lies in conversation.</span>",
    "去讀書。<span class='ab-en'>Read a book.</span>",
    "注意路標。<span class='ab-en'>Watch the signs.</span>",
    "這需要團隊合作。<span class='ab-en'>Teamwork required.</span>",
    "接受別人的好意。<span class='ab-en'>Accept the kindness.</span>",
    "有人正在想念你。<span class='ab-en'>Someone is missing you.</span>",
    "去見見老朋友。<span class='ab-en'>See an old friend.</span>",
    "這取決於他人。<span class='ab-en'>It depends on others.</span>",
    "你忽略了某個人的感受。<span class='ab-en'>You ignored someone's feelings.</span>",
    "這與家庭有關。<span class='ab-en'>It is about family.</span>",
    "你需要陪伴。<span class='ab-en'>You need company.</span>",
    "這不是你一個人的事。<span class='ab-en'>It's not just about you.</span>",
    "去尋找指引。<span class='ab-en'>Seek guidance.</span>",
    "這需要溝通。<span class='ab-en'>Communication is needed.</span>",
    "這與一段關係有關。<span class='ab-en'>It's about a relationship.</span>",
    "你的對手會告訴你答案。<span class='ab-en'>Your rival holds the answer.</span>",
    "你需要專業建議。<span class='ab-en'>Get professional advice.</span>",
    "信任那個愛你的人。<span class='ab-en'>Trust the one who loves you.</span>",
    "這需要妥協。<span class='ab-en'>Compromise is needed.</span>",

    // --- 內在反思 (Reflection) ---
    "答案就在你心中。<span class='ab-en'>The answer is within you.</span>",
    "你其實已經知道答案了。<span class='ab-en'>You already know the answer.</span>",
    "誠實面對自己。<span class='ab-en'>Be honest with yourself.</span>",
    "這對你重要嗎？<span class='ab-en'>Is this important to you?</span>",
    "你在逃避什麼？<span class='ab-en'>What are you avoiding?</span>",
    "這真的讓你快樂嗎？<span class='ab-en'>Does this truly make you happy?</span>",
    "傾聽內在的聲音。<span class='ab-en'>Listen to your inner voice.</span>",
    "這與你的恐懼有關。<span class='ab-en'>It is related to your fear.</span>",
    "重新評估你的價值觀。<span class='ab-en'>Re-evaluate your values.</span>",
    "這只是一個過渡期。<span class='ab-en'>It is just a phase.</span>",
    "你在尋找安全感。<span class='ab-en'>You are seeking safety.</span>",
    "這與過去有關。<span class='ab-en'>It is about the past.</span>",
    "放下執念。<span class='ab-en'>Let go of attachment.</span>",
    "你需要原諒。<span class='ab-en'>You need to forgive.</span>",
    "這是一個學習的機會。<span class='ab-en'>It is a learning opportunity.</span>",
    "你在欺騙自己。<span class='ab-en'>You are fooling yourself.</span>",
    "這不是重點。<span class='ab-en'>That is not the point.</span>",
    "你的動機是什麼？<span class='ab-en'>What is your motive?</span>",
    "這與金錢無關。<span class='ab-en'>It is not about money.</span>",
    "專注於當下。<span class='ab-en'>Focus on the present.</span>",
    "這是一個考驗。<span class='ab-en'>It is a test.</span>",
    "你在重複舊的模式。<span class='ab-en'>You are repeating patterns.</span>",
    "這與你的童年有關。<span class='ab-en'>It relates to your childhood.</span>",
    "你需要療癒。<span class='ab-en'>You need healing.</span>",
    "這是一個信號。<span class='ab-en'>This is a sign.</span>",
    "改變你的觀點。<span class='ab-en'>Change your perspective.</span>",
    "這只是一個幻覺。<span class='ab-en'>It is just an illusion.</span>",
    "你需要勇氣。<span class='ab-en'>You need courage.</span>",
    "這與你的自尊有關。<span class='ab-en'>It is about your self-esteem.</span>",
    "你在尋找認同。<span class='ab-en'>You are seeking approval.</span>",
    "這是一個轉捩點。<span class='ab-en'>This is a turning point.</span>",
    "這與愛有關。<span class='ab-en'>It is about love.</span>",
    "你需要釋放情緒。<span class='ab-en'>Release your emotions.</span>",
    "這是一個循環。<span class='ab-en'>It is a cycle.</span>",
    "你在尋找意義。<span class='ab-en'>You are searching for meaning.</span>",
    "這與自由有關。<span class='ab-en'>It is about freedom.</span>",

    // --- 模糊與神祕 (Ambiguous & Mystic) ---
    "也許。<span class='ab-en'>Maybe.</span>",
    "這很複雜。<span class='ab-en'>It is complicated.</span>",
    "結果未定。<span class='ab-en'>Outcome is uncertain.</span>",
    "這取決於你。<span class='ab-en'>It depends on you.</span>",
    "這是一個謎。<span class='ab-en'>It is a mystery.</span>",
    "這無法預測。<span class='ab-en'>It is unpredictable.</span>",
    "你需要冒險。<span class='ab-en'>You need to adventure.</span>",
    "這是一個驚喜。<span class='ab-en'>It is a surprise.</span>",
    "這是一個秘密。<span class='ab-en'>It is a secret.</span>",
    "這是一個奇蹟。<span class='ab-en'>It is a miracle.</span>",
    "這是一個開始。<span class='ab-en'>It is a beginning.</span>",
    "這是一個結束。<span class='ab-en'>It is an end.</span>",
    "這是一個循環。<span class='ab-en'>It is a loop.</span>",
    "這是一個夢。<span class='ab-en'>It is a dream.</span>",
    "這是一個遊戲。<span class='ab-en'>It is a game.</span>",
    "這是一個禮物。<span class='ab-en'>It is a gift.</span>",
    "這是一個負擔。<span class='ab-en'>It is a burden.</span>",
    "這是一個責任。<span class='ab-en'>It is a responsibility.</span>",
    "這是一個挑戰。<span class='ab-en'>It is a challenge.</span>",
    "這是一個機會。<span class='ab-en'>It is an opportunity.</span>",
    "這是一個陷阱。<span class='ab-en'>It is a trap.</span>",
    "這是一個測試。<span class='ab-en'>It is a test.</span>",
    "這是一個玩笑。<span class='ab-en'>It is a joke.</span>",
    "這是一個警告。<span class='ab-en'>It is a warning.</span>",
    "這是一個祝福。<span class='ab-en'>It is a blessing.</span>",
    "這是一個詛咒。<span class='ab-en'>It is a curse.</span>",
    "這是一個承諾。<span class='ab-en'>It is a promise.</span>",
    "這是一個謊言。<span class='ab-en'>It is a lie.</span>",
    "這是一個真相。<span class='ab-en'>It is the truth.</span>",
    "這是一個誤會。<span class='ab-en'>It is a misunderstanding.</span>",
    "這是一個巧合。<span class='ab-en'>It is a coincidence.</span>",
    "這是一個命運。<span class='ab-en'>It is fate.</span>",
    "換個角度看。<span class='ab-en'>Look from another angle.</span>",
    "一笑置之。<span class='ab-en'>Laugh it off.</span>",
    "數到十。<span class='ab-en'>Count to ten.</span>",
    "深呼吸。<span class='ab-en'>Take a deep breath.</span>",
    "看向窗外。<span class='ab-en'>Look out the window.</span>",
    "整理你的房間。<span class='ab-en'>Clean your room.</span>",
    "喝杯水。<span class='ab-en'>Drink some water.</span>",
    "出去走走。<span class='ab-en'>Go for a walk.</span>",
    "寫下來。<span class='ab-en'>Write it down.</span>",
    "把它畫出來。<span class='ab-en'>Draw it out.</span>",
    "唱首歌。<span class='ab-en'>Sing a song.</span>",
    "跳支舞。<span class='ab-en'>Dance.</span>",
    "保持沉默。<span class='ab-en'>Stay silent.</span>",
    "大聲說出來。<span class='ab-en'>Say it out loud.</span>",
    "閉上眼睛。<span class='ab-en'>Close your eyes.</span>",
    "張開雙手。<span class='ab-en'>Open your arms.</span>",
    "這沒什麼大不了的。<span class='ab-en'>No big deal.</span>",
    "這很重要。<span class='ab-en'>This is important.</span>",
    "這微不足道。<span class='ab-en'>It is trivial.</span>",
    "這意義重大。<span class='ab-en'>It means a lot.</span>",
    "這很可笑。<span class='ab-en'>It is ridiculous.</span>",
    "這很嚴肅。<span class='ab-en'>It is serious.</span>",
    "這很簡單。<span class='ab-en'>It is simple.</span>",
    "這很困難。<span class='ab-en'>It is hard.</span>",

    // --- 杜專屬彩蛋 (Easter Eggs) ---
    "如果奇蹟發生了...<span class='ab-en'>If a miracle happened...</span>",
    "試著外化這個問題。<span class='ab-en'>Externalize the problem.</span>",
    "你的例外經驗在哪裡？<span class='ab-en'>Where are your exceptions?</span>",
    "這是一個獨特結果。<span class='ab-en'>This is a unique outcome.</span>",
    "照顧好你的內在小孩。<span class='ab-en'>Care for your inner child.</span>",
    "這需要系統觀。<span class='ab-en'>Think systemically.</span>",
    "別忘了你的初衷。<span class='ab-en'>Remember why you started.</span>",
    "這也是一種複利效應。<span class='ab-en'>This is compound interest.</span>",
    "你的肌肉記得。<span class='ab-en'>Your muscles remember.</span>",
    "這需要刻意練習。<span class='ab-en'>It takes deliberate practice.</span>",
    "這是你的英雄之旅。<span class='ab-en'>This is your Hero's Journey.</span>",
    "你的故事由你改寫。<span class='ab-en'>Rewrite your story.</span>"
];
    // 2. 音效
    const flipSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2411/2411-preview.mp3');
    flipSound.volume = 0.5;

    // 3. 渲染 HTML (加入右側實體頁面層)
    contentArea.innerHTML = `
        <div class="ab-container" id="ab-container">
            
            <div class="ab-book" id="ab-book">
                <div class="ab-spine"><span class="ab-spine-text">THE BOOK OF ANSWERS</span></div>

                <div class="ab-cover-group">
                    <div class="ab-cover-front" id="ab-cover-front">
                        <div class="ab-shine"></div>
                        <div class="ab-star-icon">
                            <svg viewBox="0 0 100 100" fill="none" stroke="#c9a227" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M50 0 L50 10 M50 90 L50 100 M0 50 L10 50 M90 50 L100 50 M15 15 L22 22 M78 78 L85 85 M15 85 L22 78 M78 22 L85 15" stroke-opacity="0.6" stroke-width="1.5" />
                                <circle cx="50" cy="50" r="42" stroke-width="0.5" stroke-dasharray="2 2" />
                                <circle cx="50" cy="50" r="38" stroke-width="1.2" />
                                <path d="M50 18 L78 68 L22 68 Z" stroke-opacity="0.9" />
                                <path d="M50 82 L22 32 L78 32 Z" stroke-opacity="0.9" />
                                <path d="M35 50 Q50 35 65 50 Q50 65 35 50 Z" fill="rgba(201,162,39,0.1)" stroke-width="1.5"/>
                                <circle cx="50" cy="50" r="6" fill="#c9a227" stroke="none" />
                                <circle cx="50" cy="50" r="2" fill="#fff" stroke="none" />
                                <circle cx="50" cy="50" r="14" stroke-opacity="0.5" stroke-dasharray="1 3"/>
                            </svg>
                        </div>
                        <div class="ab-cover-title-en">The Book<br>of Answers</div>
                        <div class="ab-cover-title-zh">默念問題 · 輕觸揭示</div>
                    </div>
                    <div class="ab-cover-back"></div>
                </div>

                <div class="ab-cover-exterior-back"></div>

                <div class="ab-pages">
                    <div class="ab-pages-top"></div>
                    <div class="ab-pages-bottom"></div>
                    <div class="ab-pages-right"></div>
                    
                    <div class="ab-content-box" id="ab-content-box">
                        <div class="ab-answer-text" id="ab-text">...</div>
                    </div>
                </div>
            </div>
            
            <div class="ab-hint">點擊書本翻頁</div>
        </div>
    `;

    // 4. 變數
    const abContainer = document.getElementById('ab-container'); 
    const book = document.getElementById('ab-book');
    const textEl = document.getElementById('ab-text');
    const contentBox = document.getElementById('ab-content-box');
    let lastIndex = -1;

    // --- A. 視差懸浮 & 動態光照 ---
    const handleParallax = (clientX, clientY) => {
        if (book.classList.contains('is-open')) return;

        const x = clientX - window.innerWidth / 2;
        const y = clientY - window.innerHeight / 2;

        const rotateY = x / 3; 
        const rotateX = -y / 15; 

        book.style.setProperty('--rY', rotateY + 'deg');
        book.style.setProperty('--rX', rotateX + 'deg');

        const rect = book.getBoundingClientRect();
        const lightX = ((clientX - rect.left) / rect.width) * 100;
        const lightY = ((clientY - rect.top) / rect.height) * 100;
        book.style.setProperty('--light-x', lightX + '%');
        book.style.setProperty('--light-y', lightY + '%');
    };

    abContainer.addEventListener('mousemove', (e) => {
        handleParallax(e.clientX, e.clientY);
    });

    // 手機觸控
    abContainer.addEventListener('touchmove', (e) => {
        e.preventDefault(); 
        if (e.touches.length > 0) {
            handleParallax(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    // --- B. 互動邏輯 ---
    const playFlipSound = () => {
        if (typeof isSfxOn !== 'undefined' && isSfxOn) {
            flipSound.currentTime = 0;
            flipSound.play().catch(()=>{});
        }
    };

    book.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(20);

        if (book.classList.contains('is-open')) {
            // --- 關書 ---
            book.classList.remove('is-open');
            
            book.style.setProperty('--rY', '0deg');
            book.style.setProperty('--rX', '0deg');
            
            if (typeof isSfxOn !== 'undefined' && isSfxOn) {
                flipSound.currentTime = 0;
                flipSound.playbackRate = 1.3;
                flipSound.play().catch(()=>{});
            }
            
            setTimeout(() => { 
                contentBox.classList.remove('ab-text-reveal');
                textEl.innerHTML = '...'; 
            }, 1800); 

        } else {
            // --- 開書 ---
            flipSound.playbackRate = 1.0;
            playFlipSound(); 

            let randomIndex;
            if (ab_answers.length > 1) {
                do { randomIndex = Math.floor(Math.random() * ab_answers.length); } while (randomIndex === lastIndex);
            } else { randomIndex = 0; }
            lastIndex = randomIndex;
            
            textEl.innerHTML = ab_answers[randomIndex];
            contentBox.classList.add('ab-text-reveal');
            book.classList.add('is-open');
        }
    });
};
