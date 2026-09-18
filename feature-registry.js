/*
 * Safe Space - Feature Registry
 * Feature modules register themselves here.
 */
var renderers = window.SafeSpaceRenderers = window.SafeSpaceRenderers || {};

renderers.renderDefault = (container) => {
    container.innerHTML = `
         <p style="font-size: 1.1rem; color: var(--text-sub);">✨ 輕輕地吸氣，慢慢地吐氣 ✨</p>
         <p style="font-size: 0.9rem; color: #CCC; margin-top:10px;">(此功能建置中)</p>
    `;
};
