/*
 * Safe Space - Storage Service
 * Centralizes localStorage access while remaining compatible with the
 * original storage keys used by v1.3.
 */
const SafeStorage = Object.freeze({
    getJSON(key, fallback) {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        try {
            return JSON.parse(raw);
        } catch (error) {
            return fallback;
        }
    },

    setJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getText(key, fallback = '') {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : raw;
    },

    setText(key, value) {
        localStorage.setItem(key, String(value));
    },

    remove(key) {
        localStorage.removeItem(key);
    }
});
