/*
 * Safe Space - Global Audio System
 * Extracted without changing the original sound behavior.
 */

let audioCtx = null;
let bgmTimeout;
let lastFreq = 220;
const scaleFreqs = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];

function resumeAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playExhaleSound() {
    if(!isSfxOn) return;
    resumeAudioContext();
    const duration = 4.0;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioCtx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + duration);
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    noise.connect(filter); filter.connect(gainNode); gainNode.connect(audioCtx.destination);
    noise.start(); noise.stop(audioCtx.currentTime + duration);
}

function playNextNote() {
    if (!isMusicOn) return;
    resumeAudioContext();

    // 選擇音高邏輯
    let possibleIndices = [];
    const currentIdx = scaleFreqs.indexOf(lastFreq);
    [-2, -1, 1, 2].forEach(step => {
        const idx = currentIdx + step;
        if (idx >= 0 && idx < scaleFreqs.length) possibleIndices.push(idx);
    });
    if (possibleIndices.length === 0) possibleIndices = [3, 4, 5, 6];
    const nextIdx = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
    const freq = scaleFreqs[nextIdx];
    lastFreq = freq;

    // 產生聲音
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const now = audioCtx.currentTime;
    const duration = 10.0;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(now + duration);

    // 預約下一個音
    const nextTime = 2000 + Math.random() * 1500;
    bgmTimeout = setTimeout(playNextNote, nextTime);
}
