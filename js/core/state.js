/*
 * Safe Space - Global application state + DOM references.
 * Kept in one place so feature modules share the same state without duplicating it.
 */

// 狀態變數
let favorites = SafeStorage.getJSON('safeSpaceFavs', []);
let userNickname = SafeStorage.getText('safeSpaceName', '');
let isMusicOn = SafeStorage.getJSON('safeSpaceMusicOn', true);
let isSfxOn = SafeStorage.getJSON('safeSpaceSfxOn', true);
let isPetActive = SafeStorage.getJSON('safeSpacePetActive', true);
let isDarkMode = SafeStorage.getJSON('safeSpaceDarkMode', false);

let selectedMoods = new Set();
let isFavFilterActive = false;
let searchKeyword = "";

// DOM Elements
const toolboxEl = document.getElementById('toolbox');
const moodGrid = document.getElementById('mood-grid-container');
const searchInput = document.getElementById('search-input');
const favFabBtn = document.getElementById('fav-fab-btn');
const petEl = document.getElementById('spirit-pet');
const greetingTitle = document.getElementById('greeting-title');
const splashScreen = document.getElementById('splash-screen');

// 設定相關 DOM
const settingsModal = document.getElementById('settings-modal');
const nicknameInput = document.getElementById('nickname-input');
const musicToggle = document.getElementById('setting-music-toggle');
const sfxToggle = document.getElementById('setting-sfx-toggle');
const petToggle = document.getElementById('setting-pet-toggle');
const darkToggle = document.getElementById('setting-dark-toggle');
