/*
 * Safe Space - Shared SVG icon rendering helpers
 * These functions intentionally keep their original global names because
 * the current home UI and future feature cards use them directly.
 */
        // --- SVG 元件 ---
        const DOUGH_BODY = `<path d="M50 15C30 15 10 30 10 60C10 85 25 95 50 95C75 95 90 85 90 60C90 30 70 15 50 15Z" fill="#FFFFFF" stroke="#5C5552" stroke-width="2.5"/>`;
        const CHEEKS = `<circle cx="28" cy="62" r="3.5" fill="#FFD1DC" opacity="0.9"/><circle cx="72" cy="62" r="3.5" fill="#FFD1DC" opacity="0.9"/>`;

        function getMoodIcon(moodId) {
            let content = '';
            switch(moodId) {
                case 'anxious': 
                    content = `${DOUGH_BODY} ${CHEEKS}<g style="animation: sway 0.2s infinite"><circle cx="35" cy="55" r="4" fill="#5C5552"/><circle cx="65" cy="55" r="4" fill="#5C5552"/><path d="M45 68 Q50 72 55 68" stroke="#5C5552" stroke-width="2" fill="none"/></g><path d="M20 30 Q20 40 25 40 Q30 40 30 30" fill="#A0C4FF" style="animation: tearDrop 1s infinite"/>`;
                    break;
                case 'low': 
                    content = `<path d="M50 35C30 35 10 45 10 70C10 90 25 95 50 95C75 95 90 90 90 70C90 45 70 35 50 35Z" fill="#FFFFFF" stroke="#5C5552" stroke-width="2.5"/>${CHEEKS}<path d="M30 60 L40 65" stroke="#5C5552" stroke-width="2" stroke-linecap="round"/><path d="M70 60 L60 65" stroke="#5C5552" stroke-width="2" stroke-linecap="round"/><path d="M45 75 Q50 70 55 75" stroke="#5C5552" stroke-width="2" fill="none"/>`;
                    break;
                case 'angry':
                    content = `${DOUGH_BODY}<path d="M30 50 L40 55" stroke="#5C5552" stroke-width="2.5"/><path d="M70 50 L60 55" stroke="#5C5552" stroke-width="2.5"/><circle cx="35" cy="60" r="3" fill="#5C5552"/><circle cx="65" cy="60" r="3" fill="#5C5552"/><path d="M45 75 Q50 70 55 75" stroke="#5C5552" stroke-width="2" fill="none"/><path d="M50 10 L50 5" stroke="#FF6B6B" stroke-width="3" style="animation: floatItem 0.5s infinite"/><path d="M60 12 L62 6" stroke="#FF6B6B" stroke-width="3" style="animation: floatItem 0.6s infinite"/>`;
                    break;
                case 'numb':
                    content = `<path d="M50 15C30 15 10 30 10 60C10 85 25 95 50 95C75 95 90 85 90 60C90 30 70 15 50 15Z" fill="#FFFFFF" stroke="#5C5552" stroke-width="2.5" stroke-dasharray="4 4"/><circle cx="28" cy="62" r="3.5" fill="#DDD" opacity="0.9"/><circle cx="72" cy="62" r="3.5" fill="#DDD" opacity="0.9"/><circle cx="35" cy="55" r="4" stroke="#5C5552" stroke-width="2" fill="none"/><circle cx="65" cy="55" r="4" stroke="#5C5552" stroke-width="2" fill="none"/><line x1="45" y1="70" x2="55" y2="70" stroke="#5C5552" stroke-width="2"/>`;
                    break;
                case 'confused':
                    content = `${DOUGH_BODY} ${CHEEKS}<g style="animation: spinEye 3s linear infinite; transform-origin: 35px 55px"><path d="M35 55 m-3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" stroke="#5C5552" stroke-width="1.5" fill="none"/></g><g style="animation: spinEye 3s linear infinite reverse; transform-origin: 65px 55px"><path d="M65 55 m-3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0" stroke="#5C5552" stroke-width="1.5" fill="none"/></g><path d="M48 70 Q50 68 52 70" stroke="#5C5552" stroke-width="2"/>`;
                    break;
                case 'panic': 
                    content = `<g style="animation: panicWave 0.2s infinite">${DOUGH_BODY} ${CHEEKS}<circle cx="35" cy="55" r="5" fill="#5C5552"/><circle cx="65" cy="55" r="5" fill="#5C5552"/><ellipse cx="50" cy="72" rx="6" ry="8" fill="#5C5552"/><path d="M10 60 L0 50" stroke="#5C5552" stroke-width="3"/><path d="M90 60 L100 50" stroke="#5C5552" stroke-width="3"/></g>`;
                    break;
            }
            return `<svg viewBox="0 0 100 100" fill="none" class="mood-icon-svg">${content}</svg>`;
        }

        function getFeatureIcon(id) {
            let content = '';
            let eyes = `<circle cx="35" cy="55" r="4" fill="#5C5552"/><circle cx="65" cy="55" r="4" fill="#5C5552"/>`;
            let mouth = `<path d="M45 68 Q50 72 55 68" stroke="#5C5552" stroke-width="2" fill="none"/>`;

            switch(id) {
                case 'dbt_cards':
                    content = `${DOUGH_BODY} ${CHEEKS} ${eyes} <path d="M45 65 Q50 75 55 65" stroke="#5C5552" stroke-width="2" fill="none"/><rect x="60" y="40" width="20" height="30" rx="2" fill="white" stroke="#5C5552" stroke-width="2" transform="rotate(15 60 40)" style="animation: floatItem 2s infinite"/><path d="M65 45 L75 50" stroke="#FFD1DC" stroke-width="2"/>`;
                    break;
                case 'quotes':
                    content = `${DOUGH_BODY} ${CHEEKS} <path d="M30 55 Q35 50 40 55" stroke="#5C5552" stroke-width="2" fill="none"/><path d="M60 55 Q65 50 70 55" stroke="#5C5552" stroke-width="2" fill="none"/><circle cx="50" cy="68" r="4" fill="#5C5552"/><path d="M70 20 H90 V35 H70 L65 40 V20 Z" fill="white" stroke="#5C5552" stroke-width="2"/><circle cx="76" cy="28" r="1.5" fill="#5C5552"/><circle cx="80" cy="28" r="1.5" fill="#5C5552"/><circle cx="84" cy="28" r="1.5" fill="#5C5552"/>`;
                    break;
                case 'tarot':
                    content = `${DOUGH_BODY} ${CHEEKS} <path d="M30 55 L40 55" stroke="#5C5552" stroke-width="2"/><path d="M60 55 L70 55" stroke="#5C5552" stroke-width="2"/><circle cx="50" cy="80" r="12" fill="#E0F7FA" stroke="#5C5552" stroke-width="1.5" opacity="0.8"/><path d="M50 75 L52 77" stroke="white" stroke-width="2"/>`;
                    break;
                case 'answer_book':
                    content = `${DOUGH_BODY} ${CHEEKS} ${eyes} ${mouth} <circle cx="35" cy="55" r="7" stroke="#5C5552" stroke-width="1.5" fill="none"/><circle cx="65" cy="55" r="7" stroke="#5C5552" stroke-width="1.5" fill="none"/><line x1="42" y1="55" x2="58" y2="55" stroke="#5C5552" stroke-width="1.5"/><rect x="75" y="50" width="15" height="25" fill="#5C5552" transform="rotate(10)"/><rect x="78" y="52" width="2" height="21" fill="white" transform="rotate(10)"/>`;
                    break;
                case 'questions':
                    content = `${DOUGH_BODY} ${CHEEKS} <path d="M30 58 L40 58" stroke="#5C5552" stroke-width="2"/><path d="M60 58 L70 58" stroke="#5C5552" stroke-width="2"/><text x="15" y="30" font-size="20" fill="#5C5552" style="animation: floatItem 2s infinite">?</text><text x="75" y="30" font-size="16" fill="#5C5552" style="animation: floatItem 3s infinite reverse">?</text>`;
                    break;
                case 'jokes':
                    content = `${DOUGH_BODY} ${CHEEKS} <path d="M30 50 L35 55 L40 50" stroke="#5C5552" stroke-width="2" fill="none"/><path d="M60 50 L65 55 L70 50" stroke="#5C5552" stroke-width="2" fill="none"/><path d="M40 65 Q50 80 60 65" fill="#5C5552"/><path d="M10 60 Q5 50 15 50" stroke="#5C5552" stroke-width="2" fill="none" style="animation: sway 0.5s infinite"/><path d="M90 60 Q95 50 85 50" stroke="#5C5552" stroke-width="2" fill="none" style="animation: sway 0.5s infinite"/>`;
                    break;
                case 'animals':
                    content = `${DOUGH_BODY} ${CHEEKS} ${eyes} ${mouth} <path d="M30 20 L40 5 L50 20" fill="white" stroke="#5C5552" stroke-width="2.5"/><path d="M50 20 L60 5 L70 20" fill="white" stroke="#5C5552" stroke-width="2.5"/><line x1="20" y1="60" x2="5" y2="55" stroke="#5C5552" stroke-width="1.5"/><line x1="20" y1="65" x2="5" y2="70" stroke="#5C5552" stroke-width="1.5"/><line x1="80" y1="60" x2="95" y2="55" stroke="#5C5552" stroke-width="1.5"/><line x1="80" y1="65" x2="95" y2="70" stroke="#5C5552" stroke-width="1.5"/><path d="M85 80 Q95 80 95 60" stroke="#5C5552" stroke-width="3" fill="none" stroke-linecap="round" style="animation: sway 2s infinite"/>`;
                    break;
                case 'tasks':
                    content = `<g style="animation: muscleFlex 1.5s infinite">${DOUGH_BODY} ${CHEEKS} <line x1="30" y1="48" x2="40" y2="55" stroke="#5C5552" stroke-width="2.5"/><line x1="70" y1="48" x2="60" y2="55" stroke="#5C5552" stroke-width="2.5"/><path d="M45 70 H55" stroke="#5C5552" stroke-width="2"/><path d="M15 60 Q5 50 15 40" stroke="#5C5552" stroke-width="4" fill="none"/><path d="M85 60 Q95 50 85 40" stroke="#5C5552" stroke-width="4" fill="none"/></g>`;
                    break;
                case 'breathing':
                    content = `<g style="animation: breathe 4s ease-in-out infinite">${DOUGH_BODY} ${CHEEKS} <path d="M30 55 Q35 50 40 55" stroke="#5C5552" stroke-width="2" fill="none"/><path d="M60 55 Q65 50 70 55" stroke="#5C5552" stroke-width="2" fill="none"/><circle cx="50" cy="70" r="3" fill="#5C5552"/><path d="M48 85 Q50 90 52 85" stroke="#5C5552" stroke-width="2"/></g>`;
                    break;
                case 'clicker':
                    content = `${DOUGH_BODY} ${CHEEKS} ${mouth} <circle cx="35" cy="55" r="4" fill="#5C5552"/><circle cx="37" cy="53" r="1.5" fill="white"/><circle cx="65" cy="55" r="4" fill="#5C5552"/><circle cx="67" cy="53" r="1.5" fill="white"/><circle cx="80" cy="40" r="5" stroke="#5C5552" fill="white" opacity="0.7"/><circle cx="20" cy="80" r="4" stroke="#5C5552" fill="white" opacity="0.7"/><path d="M80 60 L85 50" stroke="#5C5552" stroke-width="2.5" style="animation: floatItem 0.5s infinite"/>`;
                    break;
                case 'whiteboard':
                    content = `${DOUGH_BODY} ${CHEEKS} ${eyes} ${mouth} <path d="M30 20 Q50 5 70 20 H30 Z" fill="#5C5552"/><rect x="48" y="10" width="4" height="6" fill="#5C5552"/><circle cx="20" cy="70" r="10" fill="white" stroke="#5C5552" stroke-width="1.5"/><circle cx="18" cy="68" r="2" fill="#FF6B6B"/><circle cx="22" cy="72" r="2" fill="#4ECDC4"/><line x1="80" y1="70" x2="90" y2="60" stroke="#5C5552" stroke-width="2"/>`;
                    break;
                case 'conveyor':
                    content = `${DOUGH_BODY} ${CHEEKS} ${eyes} <path d="M45 68 Q50 72 55 68" stroke="#5C5552" stroke-width="2" fill="none"/><rect x="60" y="30" width="15" height="10" rx="2" stroke="#5C5552" fill="white" style="animation: conveyorMove 2s linear infinite"/><line x1="10" y1="85" x2="90" y2="85" stroke="#5C5552" stroke-width="2" stroke-dasharray="5 5"/>`;
                    break;
                case 'worry_jar':
                    content = `<path d="M50 35C30 35 10 45 10 60C10 85 25 95 50 95C75 95 90 85 90 60C90 45 70 35 50 35Z" fill="#FFFFFF" stroke="#5C5552" stroke-width="1.5" stroke-dasharray="2 2"/> ${CHEEKS} ${eyes} ${mouth} <g style="animation: lidOpen 3s infinite"> <path d="M50 35 C30 35 10 45 10 50 L90 50 C90 45 70 35 50 35Z" fill="white" stroke="#5C5552" stroke-width="2"/> </g>`;
                    break;
                case 'sos':
                    content = `${DOUGH_BODY} ${CHEEKS} <path d="M35 55 L40 50 L35 45" stroke="#5C5552" stroke-width="2" fill="none"/><path d="M65 55 L60 50 L65 45" stroke="#5C5552" stroke-width="2" fill="none"/><path d="M45 70 Q50 65 55 70" stroke="#5C5552" stroke-width="2" fill="none"/><rect x="20" y="80" width="60" height="15" fill="#FF6B6B" stroke="#5C5552" rx="2"/><text x="32" y="91" font-family="Arial" font-weight="bold" font-size="10" fill="white">SOS</text><path d="M20 75 L20 80" stroke="#5C5552" stroke-width="2"/><path d="M80 75 L80 80" stroke="#5C5552" stroke-width="2"/>`;
                    break;
                default: 
                    content = `${DOUGH_BODY} ${CHEEKS} ${eyes} ${mouth}`;
                    break;
            }
            return `<svg viewBox="0 0 100 100" fill="none" class="feature-svg">${content}</svg>`;
        }
