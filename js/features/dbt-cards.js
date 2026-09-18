/*
 * Safe Space - Stage 1 feature module
 * Extracted from the original renderers object; behavior intentionally preserved.
 */

// --- 🃏 Feature: DBT Cards (修復變數順序與所有功能) ---
renderers.renderDbtCards = (container) => {
               // 4. 定義 DBT 資料
        const dbt_data = [
            { id:1, type:'mindfulness', title:'找出導火線', subtitle:'鏈鎖分析', desc:'詳細列出導致問題行為的連串事件：誘發事件 -> 想法 -> 情緒 -> 行為 -> 後果。' },
            { id:2, type:'mindfulness', title:'找出卡關點', subtitle:'缺失鏈鎖', desc:'分析是什麼阻礙了有效行為？是缺乏技能、恐懼、還是環境因素？' },
            { id:3, type:'mindfulness', title:'明智之心', subtitle:'Wise Mind', desc:'在極端情緒與冷酷邏輯之間，找到內在的直覺與智慧。' },
            { id:4, type:'mindfulness', title:'觀察', subtitle:'Observe', desc:'只用感官去體驗當下，像不沾鍋一樣，讓念頭來去而不抓取。' },
            { id:5, type:'mindfulness', title:'描述', subtitle:'Describe', desc:'貼標籤。把「我很爛」改成「我現在感到羞愧」，只陳述事實。' },
            { id:6, type:'mindfulness', title:'參與', subtitle:'Participate', desc:'完全投入當下的活動，丟掉自我意識，與當下合一。' },
            { id:7, type:'mindfulness', title:'不批判', subtitle:'Non-judgmental', desc:'區分事實與評價。不說「這很糟」，改說「這讓我不舒服」。' },
            { id:8, type:'mindfulness', title:'專注當下', subtitle:'One-mindfully', desc:'一次只做一件事。走路時只走路，吃飯時只吃飯。' },
            { id:9, type:'mindfulness', title:'有效率', subtitle:'Effectively', desc:'做對目標有幫助的事，放棄爭論「對錯」或「公平」。' },
            { id:10, type:'interpersonal', title:'DEAR', subtitle:'劇本溝通', desc:'Describe(描述), Express(表達), Assert(要求), Reinforce(增強)。' },
            { id:11, type:'interpersonal', title:'MAN', subtitle:'談判姿態', desc:'Mindful(專注目標), Appear confident(自信), Negotiate(協商)。' },
            { id:12, type:'interpersonal', title:'GIVE-G', subtitle:'溫和', desc:'Gentle: 說話溫和，不攻擊、不威脅、不批判。' },
            { id:13, type:'interpersonal', title:'GIVE-I', subtitle:'興趣', desc:'Interested: 展現興趣，眼神接觸，專心傾聽，不打斷。' },
            { id:14, type:'interpersonal', title:'GIVE-V', subtitle:'認可', desc:'Validate: 透過話語或表情，認可對方的感受與處境。' },
            { id:15, type:'interpersonal', title:'GIVE-E', subtitle:'輕鬆', desc:'Easy manner: 態度輕鬆，運用幽默，放鬆嘴角。' },
            { id:16, type:'interpersonal', title:'FAST-A', subtitle:'不亂道歉', desc:'Apologies: 沒做錯就不說對不起，不需為存在感到抱歉。' },
            { id:17, type:'interpersonal', title:'FAST-S', subtitle:'價值觀', desc:'Stick to values: 堅守自己的底線與價值觀。' },
            { id:18, type:'interpersonal', title:'FAST-T', subtitle:'誠實', desc:'Truthful: 不撒謊，不誇大，不為了避戰而欺騙。' },
            { id:19, type:'interpersonal', title:'辯證法', subtitle:'Middle Path', desc:'尋求中道。這不是二選一，而是兩個對立面可能同時成立。' },
            { id:20, type:'emotion', title:'檢查事實', subtitle:'Check Facts', desc:'我的情緒反應是否符合客觀事實？如果不符，改變想法。' },
            { id:21, type:'emotion', title:'相反動作', subtitle:'Opposite Action', desc:'當情緒不符合事實或無效時，做與情緒衝動完全相反的事。' },
            { id:22, type:'emotion', title:'解決問題', subtitle:'Problem Solving', desc:'針對外在問題列出步驟：定義問題 -> 列出方案 -> 執行。' },
            { id:23, type:'emotion', title:'累積正向', subtitle:'Positive Exp', desc:'短期：每天做一件讓自己快樂的小事。長期：為人生目標努力。' },
            { id:24, type:'emotion', title:'建立掌控', subtitle:'Mastery', desc:'每天做一件稍微有挑戰性但能完成的事，建立勝任感。' },
            { id:25, type:'emotion', title:'預先應對', subtitle:'Cope Ahead', desc:'想像未來可能的壓力情境，並在腦中演練有效的應對方式。' },
            { id:26, type:'emotion', title:'PLEASE', subtitle:'顧好身體', desc:'治療疾病、平衡飲食、避免藥物濫用、充足睡眠、適度運動。' },
            { id:27, type:'emotion', title:'情緒衝浪', subtitle:'Surfing', desc:'把情緒想像成海浪，你站在衝浪板上，觀察它的起伏而不被淹沒。' },
            { id:28, type:'distress', title:'STOP', subtitle:'停看聽', desc:'Stop(停下), Take a step back(後退), Observe(觀察), Proceed(行動)。' },
            { id:29, type:'distress', title:'利弊分析', subtitle:'Pros & Cons', desc:'列出衝動行為的優點與缺點，以及「忍住不衝動」的優點與缺點。' },
            { id:30, type:'distress', title:'TIP-T', subtitle:'冰水降溫', desc:'Temperature: 用冷水潑臉或握住冰塊，啟動潛水反射，快速冷靜。' },
            { id:31, type:'distress', title:'TIP-I', subtitle:'劇烈運動', desc:'Intense exercise: 短時間高強度運動，消耗過剩的情緒能量。' },
            { id:32, type:'distress', title:'ACCEPTS', subtitle:'轉移注意', desc:'活動、貢獻、比較、相反情緒、推開、想別的事、強烈感官刺激。' },
            { id:33, type:'distress', title:'自我安撫', subtitle:'Self-Soothe', desc:'運用五感(視、聽、嗅、味、觸)來溫柔地照顧自己。' },
            { id:34, type:'distress', title:'徹底接受', subtitle:'Radical Accept', desc:'這不是認同，而是停止與現實對抗。深呼吸，接受「事情就是這樣」。' },
            { id:35, type:'distress', title:'轉向心智', subtitle:'Turning Mind', desc:'像遇到岔路一樣，反覆地選擇轉向「接受」的道路。' },
            { id:36, type:'distress', title:'意願', subtitle:'Willingness', desc:'像球員接受教練指導一樣，放下任性(Willfulness)，做當下該做的事。' },
            { id:37, type:'distress', title:'半笑', subtitle:'Half-Smile', desc:'放鬆臉部肌肉，嘴角微微上揚。生理回饋會告訴大腦你是安全的。' },
            { id:38, type:'distress', title:'戒癮', subtitle:'Abstinence', desc:'辯證性戒癮：承認會跌倒，但致力於徹底戒除。燒掉後路。' }
        ];
        // --- 🎵 Audio Engine V5 (Global Sync & Fixes) ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 檢查全域音效設定 (預設為 true，若有儲存則讀取字串比對)
        const checkSfxEnabled = () => {
            const saved = localStorage.getItem('safeSpaceSfxOn');
            return saved === null ? true : (saved === 'true');
        };

        const bufferSize = audioCtx.sampleRate * 2; 
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const playSound = (type) => {
            // 如果全域音效關閉，直接返回，不播放也不震動
            if (!checkSfxEnabled()) return;

            if (audioCtx.state === 'suspended') audioCtx.resume();
            const now = audioCtx.currentTime;
            
            if (type === 'ratchet') { 
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.03);
                gain.gain.setValueAtTime(0.08, now); // 稍微調大一點點，確保聽得到
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(now); osc.stop(now + 0.04);
                if(navigator.vibrate) navigator.vibrate(5);
                
            } else if (type === 'swish') { 
                const source = audioCtx.createBufferSource();
                source.buffer = noiseBuffer;
                const filter = audioCtx.createBiquadFilter();
                const gain = audioCtx.createGain();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(400, now);
                filter.frequency.linearRampToValueAtTime(1200, now + 0.1); 
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.15, now + 0.05); 
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2); 
                source.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
                source.start(now); source.stop(now + 0.3);
                
            } else if (type === 'rip') { 
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(70, now);
                osc.frequency.linearRampToValueAtTime(30, now + 0.1);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(now); osc.stop(now + 0.1);
            }
        };

        const createDough = (type, contentSvg) => {
            const theme = {
                'mindfulness': { color: '#9B6E9F', blush: '#E1BEE7' },
                'interpersonal': { color: '#6E8F9F', blush: '#B3E5FC' },
                'emotion': { color: '#D67D68', blush: '#FFCDD2' },
                'distress': { color: '#78909C', blush: '#CFD8DC' }
            }[type] || { color: '#555', blush: '#FFB7B2' };

            return `
            <svg viewBox="0 0 100 100" style="width:100%; height:100%; overflow:visible;">
                <defs>
                    <filter id="softGlow-${type}" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                        <feOffset in="blur" dx="0" dy="2" result="offsetBlur"/>
                        <feMerge>
                            <feMergeNode in="offsetBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g filter="url(#softGlow-${type})">
                    <path d="M50 12 C20 12 5 30 5 62 C5 88 22 98 50 98 C78 98 95 88 95 62 C95 30 80 12 50 12 Z" 
                          fill="#FDFBF7" stroke="${theme.color}" stroke-width="2.5" stroke-linejoin="round" />
                    <circle cx="25" cy="62" r="7" fill="${theme.blush}" opacity="0.6" filter="blur(1px)"/>
                    <circle cx="75" cy="62" r="7" fill="${theme.blush}" opacity="0.6" filter="blur(1px)"/>
                    <g stroke="${theme.color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        ${contentSvg}
                    </g>
                </g>
            </svg>`;
        };

        const svgs = {
            mindfulness: createDough('mindfulness', `<path d="M30 55 Q35 58 40 55 M60 55 Q65 58 70 55" /><path d="M48 48 Q50 65 52 48" opacity="0.4"/><path d="M45 68 Q50 72 55 68" />`),
            interpersonal: createDough('interpersonal', `<circle cx="32" cy="55" r="2.5" fill="#6E8F9F" stroke="none"/><circle cx="68" cy="55" r="2.5" fill="#6E8F9F" stroke="none"/><path d="M45 66 Q50 71 55 66" /><path d="M75 22 L92 22 L92 38 L82 38 L78 44 L75 38 Z" fill="#E1F5FE" stroke-width="1.5"/><text x="80" y="34" font-size="9" fill="#6E8F9F" stroke="none" font-weight="bold" font-family="sans-serif">Hi</text>`),
            emotion: createDough('emotion', `<circle cx="32" cy="55" r="2.5" fill="#D67D68" stroke="none"/><circle cx="68" cy="55" r="2.5" fill="#D67D68" stroke="none"/><path d="M48 66 Q50 62 52 66"/><path d="M50 78 C40 74 36 78 36 84 C36 90 50 95 50 95 C50 95 64 90 64 84 C64 78 60 74 50 78 Z" fill="#FFEBEE" />`),
            distress: createDough('distress', `<circle cx="32" cy="55" r="2.5" fill="#78909C" stroke="none"/><circle cx="68" cy="55" r="2.5" fill="#78909C" stroke="none"/><path d="M28 48 L40 52 M72 48 L60 52" stroke-width="2"/><path d="M45 68 L55 68" /><path d="M22 75 L38 75 L38 88 Q30 93 22 88 Z" fill="#ECEFF1" />`)
        };

        // (Data)
        let state = { phase: 'SELECT', type: null, cards: [] };

        const render = () => {
            container.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.className = 'dbt-wrapper';

            if(state.phase === 'SELECT') renderSelect(wrapper);
            else if(state.phase === 'CAROUSEL') renderCarousel(wrapper);
            else if(state.phase === 'RIP') renderRip(wrapper);
            else if(state.phase === 'REVEAL') renderReveal(wrapper);
            else if(state.phase === 'SUMMARY') renderSummary(wrapper);

            container.appendChild(wrapper);
            updateBackLogic();
        };

        const updateBackLogic = () => {
            window.currentFeatureBack = () => {
                if (state.phase === 'SELECT') return false;
                if (state.phase === 'SUMMARY') state.phase = 'SELECT';
                else if (state.phase === 'REVEAL') state.phase = 'RIP';
                else if (state.phase === 'RIP') state.phase = 'CAROUSEL';
                else if (state.phase === 'CAROUSEL') state.phase = 'SELECT';
                render();
                return true;
            };
        };

        const go = (phase, data = {}) => {
            state = { ...state, phase, ...data };
            render();
        };

        const getMeta = (type) => {
            const map = {
                'mindfulness': { color: '#9B6E9F', bg: '#F3E5F5', title: '正念覺察', icon: svgs.mindfulness },
                'interpersonal': { color: '#6E8F9F', bg: '#E1F5FE', title: '人際效能', icon: svgs.interpersonal },
                'emotion': { color: '#D67D68', bg: '#FFEBEE', title: '情緒調節', icon: svgs.emotion },
                'distress': { color: '#78909C', bg: '#ECEFF1', title: '痛苦耐受', icon: svgs.distress }
            };
            return map[type] || map['mindfulness'];
        };

        // 1. SELECT
        const renderSelect = (root) => {
            root.innerHTML = `
                <div class="dbt-stage">
                    <div style="font-size:1.1rem; margin-bottom:15px; opacity:0.8; font-weight:bold;" class="letterpress-text">你需要哪方面的指引？</div>
                    <div class="dough-grid">
                        ${['mindfulness','interpersonal','emotion','distress'].map(type => {
                            const meta = getMeta(type);
                            return `
                            <div class="dough-btn" onclick="window.dbtToCarousel('${type}')">
                                <div class="dough-svg">${meta.icon}</div>
                                <div class="dough-label" style="color:${meta.color}">${meta.title}</div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            `;
            window.dbtToCarousel = (type) => go('CAROUSEL', { type });
        };

        // 2. CAROUSEL (Fix: 強化音效觸發)
        const renderCarousel = (root) => {
            const meta = getMeta(state.type);
            const tz = 250; 
            root.innerHTML = `
                <div class="dbt-stage">
                    <div class="carousel-container" id="c-stage">
                        <div class="pack-carousel" id="c-pack">
                            ${Array(8).fill(0).map((_, i) => `
                                <div class="pack-3d-item pack-visual" style="transform: rotateY(${i * 45}deg) translateZ(${tz}px);">
                                    <div class="pack-side"></div>
                                    <div class="pack-crimp-top"></div>
                                    <div class="pack-sticker">
                                        <div style="width:55px; height:55px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${meta.icon}</div>
                                        <div style="font-weight:bold; margin-top:5px; color:${meta.color}; font-size:0.9rem;" class="letterpress-text">${meta.title}</div>
                                    </div>
                                    <div class="pack-crimp-bottom"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div style="opacity:0.6; margin-top:5px; font-size:0.8rem;">左右滑動 • 點擊選擇</div>
                </div>
            `;
            
            const stage = root.querySelector('#c-stage');
            const pack = root.querySelector('#c-pack');
            let startX = 0, lastX = 0, currentRot = 0, isDragging = false, didDrag = false;
            let lastIdx = 0;
            let activePointerId = null;

            const update = () => pack.style.transform = `rotateY(${currentRot}deg)`;

            stage.style.touchAction = 'none';

            const startInteraction = (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                isDragging = true;
                didDrag = false;
                activePointerId = e.pointerId;
                startX = e.clientX;
                lastX = e.clientX;
                stage.setPointerCapture?.(e.pointerId);
                if (typeof resumeAudioContext === 'function') resumeAudioContext();
                else if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
            };

            const move = (x) => {
                if(!isDragging) return;
                const diff = x - lastX;
                if (Math.abs(x - startX) > 6) didDrag = true;
                currentRot += diff * 0.5;
                lastX = x;
                update();

                const currentIdx = Math.round(currentRot / 45);
                if (currentIdx !== lastIdx) {
                    playSound('ratchet');
                    lastIdx = currentIdx;
                }
            };

            const end = (e) => {
                if (!isDragging) return;
                isDragging = false;
                if (activePointerId !== null) stage.releasePointerCapture?.(activePointerId);
                activePointerId = null;
                const snap = Math.round(currentRot / 45) * 45;
                currentRot = snap;
                update();

                // A quick tap (not a swipe) advances to the tear-open stage.
                if (!didDrag) {
                    if(checkSfxEnabled() && navigator.vibrate) navigator.vibrate(40);
                    go('RIP');
                }
            };

            stage.addEventListener('pointerdown', startInteraction);
            stage.addEventListener('pointermove', e => { if (e.isPrimary !== false) { e.preventDefault(); move(e.clientX); } });
            stage.addEventListener('pointerup', end);
            stage.addEventListener('pointercancel', end);
        };

        // 3. RIP
        const renderRip = (root) => {
            const meta = getMeta(state.type);
            root.innerHTML = `
                <div class="dbt-stage">
                    <div class="rip-container" id="rip-container-3d">
                        <div class="rip-strip-touch" id="rip-strip-touch"></div>
                        <div class="rip-hint-text" id="rip-hint">➤ 向右撕開包裝 ➤</div>
                        
                        <div class="rip-strip-moving" id="rip-strip-vis">
                            <div class="pack-crimp-top" style="width:100%; top:0;"></div>
                        </div>

                        <div class="rip-pack-main pack-visual" id="pack-body" style="width:100%; height:100%; position:absolute; transition: transform 0.1s ease-out;">
                            <div class="pack-crimp-top"></div>
                            <div style="margin-top:0px; transform:scale(1.1); display:flex; flex-direction:column; align-items:center;" class="pack-sticker">
                                <div style="width:80px; height:80px; filter:drop-shadow(0 5px 10px rgba(0,0,0,0.1));">${meta.icon}</div>
                                <h3 style="color:${meta.color}; margin-top:10px; font-size:1.3rem;" class="letterpress-text">${meta.title}</h3>
                            </div>
                            <div class="pack-crimp-bottom"></div>
                            <div class="rip-trace-top" id="rip-trace"></div>
                        </div>
                    </div>
                </div>
            `;

            const container3d = root.querySelector('#rip-container-3d');
            const packBody = root.querySelector('#pack-body');
            const touchArea = root.querySelector('#rip-strip-touch');
            const visStrip = root.querySelector('#rip-strip-vis');
            const trace = root.querySelector('#rip-trace');
            const hint = root.querySelector('#rip-hint');
            
            let startX = 0, isDragging = false, didDrag = false, activePointerId = null;
            const packWidth = 220;

            const updateParallax = (cx, cy) => {
                const rect = container3d.getBoundingClientRect();
                const x = cx - rect.left - rect.width / 2;
                const y = cy - rect.top - rect.height / 2;
                packBody.style.transform = `rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg)`;
            };

            const update = (x, y) => {
                if(!isDragging) {
                     updateParallax(x, y);
                     return;
                }
                
                let delta = x - startX;
                if(delta < 0) delta = 0;
                const progress = Math.min(delta / (packWidth * 0.9), 1);
                
                if(progress > 0.1) {
                    visStrip.style.opacity = 1; hint.style.opacity = 0;
                }
                visStrip.style.transform = `translateX(${delta}px) rotate(${delta * 0.05}deg)`;
                trace.style.width = `${delta + 10}px`;
                trace.style.opacity = progress * 0.8;
                if (progress > 0 && progress < 0.9 && delta % 20 < 2) {
                    playSound('rip');
                    if(checkSfxEnabled() && navigator.vibrate) navigator.vibrate([15]);
                }
                if(progress >= 1) { isDragging = false; finishRip(); }
            };

            const finishRip = () => {
                if(checkSfxEnabled() && navigator.vibrate) navigator.vibrate([50]);
                visStrip.style.transition = '0.4s ease-out';
                visStrip.style.transform = `translateX(${packWidth + 60}px) rotate(20deg)`;
                visStrip.style.opacity = '0';
                
                setTimeout(() => {
                    packBody.style.transition = '0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
                    packBody.style.transform = 'scale(1.1) rotate(5deg)';
                    packBody.style.opacity = '0';
                    const pool = dbt_data.filter(c => c.type === state.type);
                    const picks = [];
                    const temp = [...pool];
                    for(let i=0; i<3; i++) {
                        if(temp.length) {
                            const idx = Math.floor(Math.random() * temp.length);
                            picks.push(temp[idx]); temp.splice(idx,1);
                        }
                    }
                    setTimeout(() => go('REVEAL', { cards: picks }), 400);
                }, 200);
            };

            touchArea.style.touchAction = 'none';

            const start = (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                isDragging = true;
                didDrag = false;
                activePointerId = e.pointerId;
                startX = e.clientX;
                touchArea.setPointerCapture?.(e.pointerId);
                if (typeof resumeAudioContext === 'function') resumeAudioContext();
            };

            const end = (e) => {
                if(!isDragging) return;
                isDragging = false;
                if (activePointerId !== null) touchArea.releasePointerCapture?.(activePointerId);
                activePointerId = null;
                if (didDrag && (e.clientX - startX) < packWidth * 0.9) {
                    visStrip.style.transition = '0.3s';
                    visStrip.style.transform = 'translateX(0)';
                    visStrip.style.opacity = 0;
                    trace.style.width = '0';
                    hint.style.opacity = 0.5;
                }
            };

            touchArea.addEventListener('pointerdown', start);
            touchArea.addEventListener('pointermove', e => {
                if (!isDragging) return;
                e.preventDefault();
                if (Math.abs(e.clientX - startX) > 6) didDrag = true;
                update(e.clientX, e.clientY);
            });
            touchArea.addEventListener('pointerup', end);
            touchArea.addEventListener('pointercancel', end);
            container3d.addEventListener('pointermove', e => {
                if (!isDragging && e.pointerType === 'mouse') updateParallax(e.clientX, e.clientY);
            });
            container3d.addEventListener('pointerleave', () => {
                if (!isDragging) packBody.style.transform = 'rotateY(0deg) rotateX(0deg)';
            });
        };

        // 4. REVEAL (Fix: 粒子增量 + 無縫過場)
        const renderReveal = (root) => {
            const meta = getMeta(state.type);
            let idx = 0;
            root.innerHTML = `
                <div class="dbt-stage" id="reveal-stage">
                    <div class="real-card-stack" id="stack"></div>
                    <div style="margin-top:25px; font-size:0.9rem; opacity:0.7;" id="hint">點擊卡片翻開</div>
                </div>
            `;
            const stack = root.querySelector('#stack');
            state.cards.forEach((c, i) => {
                const el = document.createElement('div');
                el.className = 'real-card-item';
                el.style.zIndex = 10 - i;
                el.id = `card-${i}`;
                el.innerHTML = `
                    <div class="real-card-face real-card-front card-face-style" id="front-${i}">
                        <div class="card-border-inner"></div>
                        <div class="shine-inner"></div>
                        <div style="display:flex; flex-direction:column; align-items:center; position:relative; z-index:2;">
                            <div style="width:65px; height:65px; margin-bottom:15px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${meta.icon}</div>
                            <h3 style="color:${meta.color}; font-size:1.4rem; margin-bottom:5px; text-align:center;" class="letterpress-text">${c.title}</h3>
                            <div style="font-size:0.9rem; opacity:0.6; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:5px; width:80%; text-align:center;">${c.subtitle}</div>
                            <p style="text-align:justify; line-height:1.6; color:var(--dbt-text); font-size:0.95rem; width:100%; margin:0;" class="letterpress-text">${c.desc}</p>
                        </div>
                    </div>
                    <div class="real-card-face real-card-back" style="--card-theme-bg: ${meta.bg}">
                        <div style="width:80px; opacity:0.6; filter:grayscale(0.3); transform: scale(1.1);">${meta.icon}</div>
                    </div>
                `;
                stack.appendChild(el);
            });

            // Affirmation Logic
            const showAffirmation = () => {
                const name = (typeof userNickname !== 'undefined' && userNickname && userNickname.trim() !== "") ? userNickname : "";
                
                const overlay = document.createElement('div');
                overlay.className = 'affirmation-overlay';
                overlay.innerHTML = `
                    <div class="affirmation-content">
                        <div class="affirmation-text" style="text-align: center;">
                        <span style="color: #7A9F6E; font-weight: bold;">${name}</span> 謝謝你願意為自己打開卡包，<br>
                            無論此刻你做與不做任何事情，<br>
                            光是你想讓自己變好的心，<br>
                            就讓人十分佩服💖<br><br>
                            有時候停在原地也很棒，<br>
                            不用急著變好也很棒，<br>
                            如果什麼都不想做，就讓自己躺平吧！<br>
                            
                            <div style="text-align: center; font-family: Arial, sans-serif; margin-top: 10px;">
                                (❁´◡\`❁)
                            </div>
                            <div class="affirmation-close">點擊任意處繼續</div>
                        </div>
                        </div>
                `;
                
                // 產生懸浮微塵 (數量更多，大小隨機)
                for(let k=0; k<30; k++) {
                    const p = document.createElement('div');
                    p.className = 'floating-particle';
                    // 尺寸加大 (4px ~ 9px)
                    const size = Math.random() * 5 + 4;
                    p.style.width = size+'px'; p.style.height = size+'px';
                    p.style.left = Math.random()*100+'%'; p.style.top = Math.random()*100+'%';
                    // 動畫時間隨機
                    p.style.animation = `dbtFadeIn ${Math.random()*3+2}s infinite alternate`;
                    // 隨機延遲出現，避免同時閃爍
                    p.style.animationDelay = `${Math.random()*2}s`;
                    overlay.appendChild(p);
                }

                root.appendChild(overlay);
                
                // 動畫進場
                setTimeout(() => {
                    overlay.classList.add('affirmation-active');
                    if(checkSfxEnabled() && navigator.vibrate) navigator.vibrate([10, 50, 10]);
                }, 100);

                // --- 修正：無縫過場邏輯 ---
                overlay.onclick = () => {
                    // 1. 先把透明度變為 0，並讓滑鼠事件穿透 (pointer-events: none)
                    overlay.style.opacity = 0;
                    overlay.style.pointerEvents = 'none';
                    
                    // 2. "立刻" 渲染總覽頁面 (go SUMMARY)，這樣它會出現在正在淡出的 overlay 下方
                    go('SUMMARY');

                    // 3. 等待淡出動畫結束後，再移除 overlay DOM
                    setTimeout(() => {
                        overlay.remove();
                    }, 800); 
                };
            };

            let step = 'FLIP';
            root.querySelector('#reveal-stage').onclick = () => {
                if(idx >= 3) return;
                const card = stack.querySelector(`#card-${idx}`);
                const front = stack.querySelector(`#front-${idx}`);
                const shine = front.querySelector('.shine-inner');
                const hint = root.querySelector('#hint');

                if(step === 'FLIP') {
                    card.classList.add('flipped');
                    playSound('swish'); 
                    if(checkSfxEnabled() && navigator.vibrate) navigator.vibrate(30); 
                    setTimeout(() => shine.classList.add('shine-active'), 150); 
                    hint.innerText = idx < 2 ? "再次點擊收起" : "再次點擊查看結果";
                    step = 'NEXT';
                } else {
                    card.classList.add('discarded');
                    idx++;
                    step = 'FLIP';
                    if(idx >= 3) {
                        setTimeout(() => showAffirmation(), 600); 
                    } else {
                        hint.innerText = "點擊下一張";
                    }
                }
            };
        };

        // 5. SUMMARY
        const renderSummary = (root) => {
            const meta = getMeta(state.type);
            root.innerHTML = `
                <div class="dbt-stage" style="justify-content: flex-start; padding-top: 20px;">
                    <h2 style="color:${meta.color}; margin-bottom:5px;" class="letterpress-text">今日指引</h2>
                    <div style="font-size:0.85rem; opacity:0.6; margin-bottom:15px;">點擊卡片放大查看</div>
                    <div class="summary-grid">
                        ${state.cards.map((c, i) => `
                            <div class="mini-card card-face-style" onclick="window.dbtZoom(${i})" style="border-top: 4px solid ${meta.color}">
                                <div class="card-border-inner" style="top:5px; left:5px; right:5px; bottom:5px;"></div>
                                <div style="width:40px; height:40px; margin-bottom:8px; position:relative; z-index:2;">${meta.icon}</div>
                                <div style="font-weight:bold; margin-bottom:5px; color:${meta.color}; font-size:0.9rem; position:relative; z-index:2;" class="letterpress-text">${c.title}</div>
                                <div style="font-size:0.7rem; line-height:1.4; text-align:justify; overflow:hidden; height:70px; opacity:0.8; position:relative; z-index:2;" class="letterpress-text">${c.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="dbt-btn" onclick="window.dbtBackToSelect()">回到選擇</button>
                </div>
                <div id="zoom-modal-container"></div>
            `;
            
            window.dbtBackToSelect = () => go('SELECT');
            window.dbtZoom = (index) => {
                const c = state.cards[index];
                const modalContainer = root.querySelector('#zoom-modal-container');
                modalContainer.innerHTML = `
                    <div class="card-lightbox" onclick="this.remove()">
                        <div class="lightbox-content" onclick="event.stopPropagation()">
                             <div class="lightbox-card-face card-face-style">
                                <div class="card-border-inner"></div>
                                <div style="width:80px; height:80px; margin-bottom:20px; flex-shrink:0; position:relative; z-index:2;">${meta.icon}</div>
                                <h3 style="color:${meta.color}; font-size:1.5rem; margin-bottom:10px; text-align:center; position:relative; z-index:2;" class="letterpress-text">${c.title}</h3>
                                <div style="font-size:1rem; opacity:0.6; margin-bottom:20px; border-bottom:1px solid #ccc; padding-bottom:5px; width:80%; text-align:center; position:relative; z-index:2;">${c.subtitle}</div>
                                <p style="text-align:justify; line-height:1.6; font-size:1rem; color:var(--dbt-text); margin:0; position:relative; z-index:2;" class="letterpress-text">${c.desc}</p>
                                <div style="margin-top:30px; font-size:0.8rem; opacity:0.5; position:relative; z-index:2;">點擊背景關閉</div>
                             </div>
                        </div>
                    </div>
                `;
            };
        };

        render();
};
