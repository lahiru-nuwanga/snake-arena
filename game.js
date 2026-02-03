/**
 * Snake Game - Main Logic
 * Dashboard, settings (theme, speed, sound), game loop, navigation.
 */

/* ========== CONFIGURATION ========== */
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const SNAKE_START_LENGTH = 3;

/* Theme colors for canvas (must match CSS themes) */
const THEME_COLORS = {
  dark:   { bg: '#1a1a2e', grid: '#0f3460', snake: '#00d9ff', snakeHead: '#00ff88', food: '#e94560' },
  ocean:  { bg: '#0d1b2a', grid: '#415a77', snake: '#48cae4', snakeHead: '#90e0ef', food: '#ff6b6b' },
  neon:   { bg: '#0f0f23', grid: '#7b2cbf', snake: '#00f5d4', snakeHead: '#7b2cbf', food: '#f72585' },
  forest: { bg: '#1b2838', grid: '#3d5a45', snake: '#8fbc8f', snakeHead: '#98fb98', food: '#ff7f50' },
  sunset: { bg: '#2d1b2e', grid: '#6b3a4a', snake: '#ffb347', snakeHead: '#ffcc70', food: '#ff6b9d' },
  light:  { bg: '#f5f5f5', grid: '#bdbdbd', snake: '#2196f3', snakeHead: '#4caf50', food: '#f44336' },
};

const DEFAULT_SPEED_MS = 120;
const MAX_RECENT = 10;
const MAX_LEADERBOARD = 20;

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe'
];

const STORAGE_KEYS = {
  theme: 'snake_theme', speed: 'snake_speed', sound: 'snake_sound', highScore: 'snake_highScore',
  userName: 'snake_userName', userAge: 'snake_userAge', userCountry: 'snake_userCountry',
  registered: 'snake_registered', recentScores: 'snake_recentScores', leaderboard: 'snake_leaderboard',
  gameRating: 'snake_gameRating',
};

/* ========== DOM ELEMENTS ========== */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const startOverlay = document.getElementById('startOverlay');
const restartBtn = document.getElementById('restartBtn');
const startSmallBtn = document.getElementById('startSmallBtn');
const startFullBtn = document.getElementById('startFullBtn');
const dashboard = document.getElementById('dashboard');
const gameScreen = document.getElementById('gameScreen');
const playBtn = document.getElementById('playBtn');
const menuBtn = document.getElementById('menuBtn');
const gameOverMenuBtn = document.getElementById('gameOverMenuBtn');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const aboutCloseBtn = document.getElementById('aboutCloseBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const helpModal = document.getElementById('helpModal');
const helpCloseBtn = document.getElementById('helpCloseBtn');
const helpListenBtn = document.getElementById('helpListenBtn');
const tourModal = document.getElementById('tourModal');
const tourStepText = document.getElementById('tourStepText');
const tourPrevBtn = document.getElementById('tourPrevBtn');
const tourNextBtn = document.getElementById('tourNextBtn');
const tourVoiceBtn = document.getElementById('tourVoiceBtn');
const tourCloseBtn = document.getElementById('tourCloseBtn');
const tourProgress = document.getElementById('tourProgress');
const autoTourBtn = document.getElementById('autoTourBtn');
const logoutBtnHome = document.getElementById('logoutBtnHome');
const designModal = document.getElementById('designModal');
const designCloseBtn = document.getElementById('designCloseBtn');
const themeOptions = document.getElementById('themeOptions');
const soundToggle = document.getElementById('soundToggle');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const registrationScreen = document.getElementById('registrationScreen');
const registrationForm = document.getElementById('registrationForm');
const regError = document.getElementById('regError');
const userNameDisplay = document.getElementById('userNameDisplay');
const recentScoresList = document.getElementById('recentScoresList');
const leaderboardList = document.getElementById('leaderboardList');
const rateMessage = document.getElementById('rateMessage');

const OVERLAY_HIDDEN_CLASS = 'overlay--hidden';

function hideOverlay(el) {
  if (!el) return;
  el.setAttribute('aria-hidden', 'true');
  el.classList.add(OVERLAY_HIDDEN_CLASS);
}

function showOverlay(el) {
  if (!el) return;
  el.setAttribute('aria-hidden', 'false');
  el.classList.remove(OVERLAY_HIDDEN_CLASS);
}

function isOverlayHidden(el) {
  return el && (el.getAttribute('aria-hidden') === 'true' || el.classList.contains(OVERLAY_HIDDEN_CLASS));
}

/* ========== SETTINGS STATE (from localStorage) ========== */
function getStored(key, fallback) {
  try {
    const v = localStorage.getItem(STORAGE_KEYS[key]);
    if (v != null) return v;
  } catch (_) {}
  return fallback;
}

function setStored(key, value) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], String(value));
  } catch (_) {}
}

function getStoredJSON(key, fallback) {
  try {
    const v = localStorage.getItem(STORAGE_KEYS[key]);
    if (v != null) return JSON.parse(v);
  } catch (_) {}
  return fallback != null ? fallback : [];
}

function setStoredJSON(key, value) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (_) {}
}

let currentTheme = getStored('theme', 'dark');
let speedMs = parseInt(getStored('speed', String(DEFAULT_SPEED_MS)), 10) || DEFAULT_SPEED_MS;
let soundOn = getStored('sound', 'true') === 'true';
let highScore = parseInt(getStored('highScore', '0'), 10) || 0;

/* ========== APPLY SETTINGS TO UI ========== */
function applyTheme(theme) {
  currentTheme = theme;
  setStored('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  if (themeOptions) {
    themeOptions.querySelectorAll('.theme-card').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.theme === theme ? 'true' : 'false');
    });
  }
}

function applySpeed(ms) {
  speedMs = ms;
  setStored('speed', String(ms));
  const radio = document.querySelector(`input[name="speed"][value="${ms}"]`);
  if (radio) radio.checked = true;
}

function applySound(on) {
  soundOn = on;
  setStored('sound', on ? 'true' : 'false');
  if (soundToggle) soundToggle.checked = on;
}

function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    setStored('highScore', String(highScore));
    highScoreDisplay.textContent = highScore;
  }
}

function refreshHighScoreDisplay() {
  highScoreDisplay.textContent = highScore;
}

/* ========== SOUND (Web Audio - no external files) ========== */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, duration, type) {
  if (!soundOn) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type || 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (_) {}
}

function playEatSound() {
  playTone(523, 0.1, 'square');
  setTimeout(() => playTone(659, 0.1, 'square'), 80);
}

function playGameOverSound() {
  playTone(200, 0.2, 'sawtooth');
  setTimeout(() => playTone(150, 0.3, 'sawtooth'), 150);
}

/* ========== GAME STATE ========== */
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let gameOver = false;
let gameLoopId = null;
let gameStarted = false;

/* Direction by key code (e.code) - works in most layouts */
const DIRECTIONS_BY_CODE = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  KeyW: { x: 0, y: -1 }, KeyS: { x: 0, y: 1 }, KeyA: { x: -1, y: 0 }, KeyD: { x: 1, y: 0 },
};
/* Direction by key character (e.key) - for different languages/layouts */
const DIRECTIONS_BY_KEY = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, W: { x: 0, y: -1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
  a: { x: -1, y: 0 }, A: { x: -1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
};

function isOpposite(dir, current) {
  return dir.x === -current.x && dir.y === -current.y;
}

/** Set snake direction (used by keyboard and on-screen buttons). Prevents opposite direction. */
function setDirection(dir) {
  if (!dir || typeof dir.x !== 'number' || typeof dir.y !== 'number') return;
  if (isOpposite(dir, direction)) return;
  nextDirection = { x: dir.x, y: dir.y };
}

function initSnake() {
  const centerX = Math.floor(GRID_SIZE / 2);
  const centerY = Math.floor(GRID_SIZE / 2);
  snake = [];
  for (let i = SNAKE_START_LENGTH - 1; i >= 0; i--) {
    snake.push({ x: centerX - i, y: centerY });
  }
}

function placeFood() {
  const empty = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!snake.some(seg => seg.x === x && seg.y === y)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return;
  const choice = empty[Math.floor(Math.random() * empty.length)];
  food.x = choice.x;
  food.y = choice.y;
}

function resetGame() {
  score = 0;
  gameOver = false;
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  initSnake();
  placeFood();
  if (scoreEl) scoreEl.textContent = score;
}

function endGame() {
  gameOver = true;
  if (gameLoopId) {
    clearInterval(gameLoopId);
    gameLoopId = null;
  }
  updateHighScore(score);
  if (finalScoreEl) finalScoreEl.textContent = score;
  addRecentScore(score);
  addToLeaderboard(score);
  showOverlay(gameOverOverlay);
  playGameOverSound();
}

function addRecentScore(score) {
  const recent = getStoredJSON('recentScores', []);
  const name = getStored('userName', 'Player');
  recent.unshift({ score, name, date: Date.now() });
  setStoredJSON('recentScores', recent.slice(0, MAX_RECENT));
}

function addToLeaderboard(score) {
  const name = (getStored('userName', '') || 'Player').trim() || 'Player';
  const country = (getStored('userCountry', '') || '').trim() || '—';
  const list = getStoredJSON('leaderboard', []);
  list.push({ name, score, country, date: Date.now() });
  list.sort((a, b) => b.score - a.score);
  setStoredJSON('leaderboard', list.slice(0, MAX_LEADERBOARD));
}

function refreshDashboard() {
  if (userNameDisplay) userNameDisplay.textContent = getStored('userName', 'Player') || 'Player';
  refreshHighScoreDisplay();
}

function getGameRating() {
  const r = parseInt(getStored('gameRating', '0'), 10);
  return r >= 1 && r <= 5 ? r : 0;
}

function setGameRating(rating) {
  setStored('gameRating', String(rating));
  renderStarRating();
  if (rateMessage) {
    rateMessage.textContent = 'Thanks for rating!';
    rateMessage.setAttribute('aria-live', 'polite');
  }
}

function renderStarRating() {
  const rating = getGameRating();
  const btns = document.querySelectorAll('.star-btn');
  btns.forEach((btn, i) => {
    const value = parseInt(btn.getAttribute('data-rating'), 10);
    btn.classList.toggle('filled', value <= rating);
    btn.setAttribute('aria-pressed', value <= rating ? 'true' : 'false');
  });
}

function bindStarRating() {
  document.querySelectorAll('.star-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.getAttribute('data-rating'), 10);
      setGameRating(rating);
    });
  });
}

function renderRecentScores() {
  if (!recentScoresList) return;
  const recent = getStoredJSON('recentScores', []);
  const best = highScore;
  recentScoresList.innerHTML = recent.length === 0
    ? '<li class="score-list-empty">No games yet. Play to see your scores here.</li>'
    : recent.map(({ score: s, name }) => {
        const isBest = s === best && best > 0;
        return `<li class="score-list-item ${isBest ? 'score-list-item--highlight' : ''}"><span class="score-list-name">${escapeHtml(name)}</span><span class="score-list-value">${s}</span>${isBest ? ' <span class="score-list-badge">Best</span>' : ''}</li>`;
      }).join('');
}

function getInitial(name) {
  if (!name || !name.trim()) return '?';
  return String(name.trim()).charAt(0).toUpperCase();
}

function renderLeaderboard() {
  const list = getStoredJSON('leaderboard', []);
  const sorted = [...list].sort((a, b) => b.score - a.score);
  const top3El = document.getElementById('leaderboardTop3');
  const yourRankNumEl = document.getElementById('yourRankNum');
  const yourRankScoreEl = document.getElementById('yourRankScore');

  if (top3El) {
    if (sorted.length === 0) {
      top3El.innerHTML = '<p class="leaderboard-empty" style="grid-column:1/-1;text-align:center;color:#8b7355;font-size:0.9rem;">No scores yet.</p>';
    } else {
      top3El.innerHTML = sorted.slice(0, 3).map((entry, i) => {
        const rank = i + 1;
        const initial = getInitial(entry.name);
        return `<div class="leaderboard-top3-item">
          <span class="leaderboard-top3-crown" aria-hidden="true">👑</span>
          <span class="leaderboard-top3-avatar">${escapeHtml(initial)}</span>
          <span class="leaderboard-top3-rank">${rank}</span>
          <span class="leaderboard-top3-name">${escapeHtml(entry.name)}</span>
          <span class="leaderboard-top3-score">${entry.score}</span>
        </div>`;
      }).join('');
    }
  }

  if (leaderboardList) {
    const rest = sorted.slice(3);
    leaderboardList.innerHTML = rest.length === 0
      ? ''
      : rest.map((entry, i) => {
          const rank = i + 4;
          const initial = getInitial(entry.name);
          return `<li class="leaderboard-item"><span class="leaderboard-rank">${rank}</span><span class="leaderboard-avatar">${escapeHtml(initial)}</span><span class="leaderboard-name">${escapeHtml(entry.name)}</span><span class="leaderboard-points">${entry.score} points</span></li>`;
        }).join('');
  }

  const userBest = highScore;
  let yourRank = '—';
  if (sorted.length > 0) {
    const betterCount = sorted.filter(e => e.score > userBest).length;
    yourRank = betterCount + 1;
  }
  if (yourRankNumEl) yourRankNumEl.textContent = yourRank;
  if (yourRankScoreEl) yourRankScoreEl.textContent = userBest;
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function tick() {
  try {
    if (gameOver) return;
    direction = { ...nextDirection };

    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      endGame();
      return;
    }
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      endGame();
      return;
    }

    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
      score += 10;
      scoreEl.textContent = score;
      playEatSound();
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  } catch (err) {
    console.error('Game tick error:', err);
  }
}

function draw() {
  const colors = THEME_COLORS[currentTheme] || THEME_COLORS.dark;
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(canvas.width, i * CELL_SIZE);
    ctx.stroke();
  }

  ctx.fillStyle = colors.food;
  const fx = food.x * CELL_SIZE + CELL_SIZE / 2;
  const fy = food.y * CELL_SIZE + CELL_SIZE / 2;
  ctx.beginPath();
  ctx.arc(fx, fy, CELL_SIZE / 2 - 1, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 1; i < snake.length; i++) {
    const seg = snake[i];
    ctx.fillStyle = colors.snake;
    ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  }
  const h = snake[0];
  ctx.fillStyle = colors.snakeHead;
  ctx.fillRect(h.x * CELL_SIZE + 1, h.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
}

function startLoop() {
  if (gameLoopId) clearInterval(gameLoopId);
  gameLoopId = setInterval(tick, speedMs);
}

function stopAndShowDashboard(fromGameOver) {
  if (gameLoopId) {
    clearInterval(gameLoopId);
    gameLoopId = null;
  }
  gameStarted = false;
  gameOver = false;
  dashboard.setAttribute('aria-hidden', 'false');
  gameScreen.setAttribute('aria-hidden', 'true');
  /* Always show full home page (Tap to play, nav, welcome) when returning via Menu */
  dashboard.classList.remove('dashboard--post-loss');
  refreshDashboard();
  /* Scroll to top so home hero is visible */
  const dashboardContent = document.querySelector('.dashboard-content');
  if (dashboardContent) dashboardContent.scrollTo({ top: 0, behavior: 'smooth' });
  const homeSection = document.getElementById('homeSection');
  if (homeSection) homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ========== NAVIGATION ========== */
playBtn.addEventListener('click', () => {
  dashboard.setAttribute('aria-hidden', 'true');
  gameScreen.setAttribute('aria-hidden', 'false');
  hideOverlay(gameOverOverlay);
  showOverlay(startOverlay);
  resetGame();
  draw();
});

menuBtn.addEventListener('click', () => stopAndShowDashboard(false));
gameOverMenuBtn.addEventListener('click', () => {
  hideOverlay(gameOverOverlay);
  stopAndShowDashboard(true);
});

/* Post-loss home: Play Game, About, Contact, Logout */
const playBtnPostLoss = document.getElementById('playBtnPostLoss');
const aboutBtnPostLoss = document.getElementById('aboutBtnPostLoss');
const logoutBtn = document.getElementById('logoutBtn');

if (playBtnPostLoss) {
  playBtnPostLoss.addEventListener('click', () => {
    dashboard.classList.remove('dashboard--post-loss');
    dashboard.setAttribute('aria-hidden', 'true');
    gameScreen.setAttribute('aria-hidden', 'false');
    hideOverlay(gameOverOverlay);
    showOverlay(startOverlay);
    resetGame();
    draw();
  });
}
if (aboutBtnPostLoss) {
  aboutBtnPostLoss.addEventListener('click', () => openModal(aboutModal));
}
const settingsBtnPostLoss = document.getElementById('settingsBtnPostLoss');
if (settingsBtnPostLoss) {
  settingsBtnPostLoss.addEventListener('click', () => openModal(settingsModal));
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    setStored('registered', 'false');
    dashboard.classList.remove('dashboard--post-loss');
    dashboard.setAttribute('aria-hidden', 'true');
    showRegistration();
  });
}

/* Home nav bar and top-bar settings */
const settingsBtnHome = document.getElementById('settingsBtnHome');
const menuBtnHome = document.getElementById('menuBtnHome');
const dashboardContent = document.querySelector('.dashboard-content');

if (settingsBtnHome) settingsBtnHome.addEventListener('click', () => openModal(settingsModal));

function doLogout() {
  setStored('registered', 'false');
  if (dashboard) dashboard.classList.remove('dashboard--post-loss');
  if (dashboard) dashboard.setAttribute('aria-hidden', 'true');
  showRegistration();
}
if (logoutBtnHome) logoutBtnHome.addEventListener('click', doLogout);

if (menuBtnHome) {
  menuBtnHome.addEventListener('click', () => {
    const homeSection = document.getElementById('homeSection');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (dashboardContent) {
      dashboardContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (typeof window !== 'undefined' && window.location) {
      window.location.hash = 'home';
    }
  });
}

document.querySelectorAll('.home-nav-item[data-action]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const action = el.getAttribute('data-action');
    if (!action) return;
    if (action === 'play') {
      e.preventDefault();
      if (playBtn) playBtn.click();
    } else if (action === 'about') {
      e.preventDefault();
      openModal(aboutModal);
    } else if (action === 'settings') {
      e.preventDefault();
      openModal(settingsModal);
    } else if (action === 'help') {
      e.preventDefault();
      openModal(helpModal);
    } else if (action === 'design') {
      e.preventDefault();
      openModal(designModal);
    } else if (action === 'logout') {
      e.preventDefault();
      doLogout();
    }
  });
});

/* Fullscreen toggle */
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameScreenEl = document.getElementById('gameScreen');

function updateFullscreenButton() {
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  if (fullscreenBtn) {
    fullscreenBtn.classList.toggle('is-fullscreen', isFs);
    fullscreenBtn.setAttribute('aria-label', isFs ? 'Exit full screen' : 'Full screen');
    fullscreenBtn.textContent = isFs ? '✕' : '⛶';
  }
}

function toggleFullscreen() {
  if (!gameScreenEl) return;
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
  if (isFs) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  } else {
    const el = gameScreenEl;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', toggleFullscreen);
}
document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange', updateFullscreenButton);
document.addEventListener('MSFullscreenChange', updateFullscreenButton);

restartBtn.addEventListener('click', () => {
  hideOverlay(gameOverOverlay);
  hideOverlay(startOverlay);
  resetGame();
  draw();
  startLoop();
  if (canvas) {
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
  }
});

function startGame() {
  gameStarted = true;
  hideOverlay(startOverlay);
  resetGame();
  draw();
  startLoop();
  if (canvas) {
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
  }
}

if (startSmallBtn) {
  startSmallBtn.addEventListener('click', () => startGame());
}
if (startFullBtn) {
  startFullBtn.addEventListener('click', () => {
    startGame();
    const gameScreenEl = document.getElementById('gameScreen');
    if (gameScreenEl) {
      if (gameScreenEl.requestFullscreen) gameScreenEl.requestFullscreen();
      else if (gameScreenEl.webkitRequestFullscreen) gameScreenEl.webkitRequestFullscreen();
      else if (gameScreenEl.mozRequestFullScreen) gameScreenEl.mozRequestFullScreen();
      else if (gameScreenEl.msRequestFullscreen) gameScreenEl.msRequestFullscreen();
    }
  });
}

/* ========== MODALS ========== */
function openModal(modal) {
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
}

aboutBtn.addEventListener('click', () => openModal(aboutModal));
aboutCloseBtn.addEventListener('click', () => closeModal(aboutModal));
aboutModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(aboutModal));

settingsBtn.addEventListener('click', () => openModal(settingsModal));
settingsCloseBtn.addEventListener('click', () => closeModal(settingsModal));
settingsModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(settingsModal));

/* Theme selection */
if (themeOptions) {
  themeOptions.querySelectorAll('.theme-card').forEach((btn) => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });
}

/* Speed selection */
document.querySelectorAll('input[name="speed"]').forEach((radio) => {
  radio.addEventListener('change', () => applySpeed(parseInt(radio.value, 10)));
});

if (soundToggle) soundToggle.addEventListener('change', () => applySound(soundToggle.checked));

/* ========== SPEECH (gentle male voice for tutorial / tour) ========== */
let gentleMaleVoice = null;

function initSpeechVoices() {
  const voices = typeof speechSynthesis !== 'undefined' ? speechSynthesis.getVoices() : [];
  const male = voices.find((v) => /male|daniel|david|alex|fred|male/i.test(v.name));
  gentleMaleVoice = male || voices.find((v) => v.lang.startsWith('en')) || voices[0];
}

if (typeof speechSynthesis !== 'undefined') {
  initSpeechVoices();
  speechSynthesis.onvoiceschanged = initSpeechVoices;
}

function speakWithGentleVoice(text, onEnd) {
  if (typeof speechSynthesis === 'undefined' || !text || !text.trim()) return;
  speechSynthesis.cancel();
  initSpeechVoices();
  const u = new SpeechSynthesisUtterance(text.trim());
  u.rate = 0.92;
  u.pitch = 1;
  u.volume = 1;
  if (gentleMaleVoice) u.voice = gentleMaleVoice;
  u.lang = 'en-US';
  if (typeof onEnd === 'function') u.onend = onEnd;
  speechSynthesis.speak(u);
}

function stopSpeech() {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}

/* ========== HELP MODAL (tutorial) ========== */
if (helpCloseBtn) helpCloseBtn.addEventListener('click', () => closeModal(helpModal));
if (helpModal && helpModal.querySelector('.modal-backdrop')) {
  helpModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(helpModal));
}
if (designCloseBtn) designCloseBtn.addEventListener('click', () => closeModal(designModal));
if (designModal && designModal.querySelector('.modal-backdrop')) {
  designModal.querySelector('.modal-backdrop').addEventListener('click', () => closeModal(designModal));
}
if (helpListenBtn) {
  helpListenBtn.addEventListener('click', () => {
    if (!helpModal) return;
    stopSpeech();
    const intro = helpModal.querySelector('.help-intro');
    const list = helpModal.querySelector('.help-list');
    const outro = helpModal.querySelector('.help-outro');
    const parts = [];
    if (intro) parts.push(intro.textContent.trim());
    if (list) {
      list.querySelectorAll('li').forEach((li) => parts.push(li.textContent.trim()));
    }
    if (outro) parts.push(outro.textContent.trim());
    const full = parts.join('. ');
    speakWithGentleVoice(full);
  });
}

/* ========== AUTO TOUR ========== */
const TOUR_STEPS = [
  'Welcome to Snake. This short tour shows you how to get started.',
  'Tap the green "Tap to play" button to start a game. You can also use the Play button in the bar below.',
  'Choose "Small scale" to play in the window, or "Full scale" to play in full screen.',
  'Use the arrow buttons on screen or the Arrow keys or W A S D on your keyboard to move the snake.',
  'Eat the colored food to grow and score points. Avoid the walls and your own tail.',
  'Check "Recent" for your last scores and "Leaderboard" for top players. Use "Help" anytime for the full guide.',
  'That\'s it! Have fun and try to beat your high score.',
];
let tourStepIndex = 0;

function openTour() {
  tourStepIndex = 0;
  if (tourModal) openModal(tourModal);
  updateTourStep();
}

function updateTourStep() {
  if (tourStepText) tourStepText.textContent = TOUR_STEPS[tourStepIndex] || '';
  if (tourProgress) tourProgress.textContent = `Step ${tourStepIndex + 1} of ${TOUR_STEPS.length}`;
  if (tourPrevBtn) tourPrevBtn.disabled = tourStepIndex <= 0;
  if (tourNextBtn) tourNextBtn.disabled = tourStepIndex >= TOUR_STEPS.length - 1;
}

if (autoTourBtn) autoTourBtn.addEventListener('click', openTour);
if (tourCloseBtn) tourCloseBtn.addEventListener('click', () => { stopSpeech(); closeModal(tourModal); });
if (tourModal && tourModal.querySelector('.modal-backdrop')) {
  tourModal.querySelector('.modal-backdrop').addEventListener('click', () => { stopSpeech(); closeModal(tourModal); });
}
if (tourPrevBtn) {
  tourPrevBtn.addEventListener('click', () => {
    if (tourStepIndex > 0) { tourStepIndex--; updateTourStep(); }
  });
}
if (tourNextBtn) {
  tourNextBtn.addEventListener('click', () => {
    if (tourStepIndex < TOUR_STEPS.length - 1) { tourStepIndex++; updateTourStep(); }
  });
}
if (tourVoiceBtn) {
  tourVoiceBtn.addEventListener('click', () => {
    const text = TOUR_STEPS[tourStepIndex];
    if (text) speakWithGentleVoice(text);
  });
}

/* ========== KEYBOARD (works with any layout/language) ========== */
document.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable);
  if (isInput) return;
  const newDir = DIRECTIONS_BY_CODE[e.code] || DIRECTIONS_BY_KEY[e.key];
  if (!newDir) return;
  e.preventDefault();
  setDirection(newDir);
});

/* ========== ON-SCREEN DIRECTION BUTTONS (no keyboard needed) ========== */
function bindDirectionButtons() {
  const dirs = {
    btnUp: { x: 0, y: -1 },
    btnDown: { x: 0, y: 1 },
    btnLeft: { x: -1, y: 0 },
    btnRight: { x: 1, y: 0 },
  };
  Object.keys(dirs).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => setDirection(dirs[id]));
  });
}
bindDirectionButtons();

/* ========== FIRST-TIME REGISTRATION ========== */
function showRegistration() {
  if (registrationScreen) {
    registrationScreen.setAttribute('aria-hidden', 'false');
    registrationScreen.classList.remove(OVERLAY_HIDDEN_CLASS);
  }
  if (dashboard) dashboard.setAttribute('aria-hidden', 'true');
}

function showDashboard() {
  if (registrationScreen) {
    registrationScreen.setAttribute('aria-hidden', 'true');
    registrationScreen.classList.add(OVERLAY_HIDDEN_CLASS);
  }
  if (dashboard) {
    dashboard.setAttribute('aria-hidden', 'false');
    refreshDashboard();
  }
}

if (registrationForm) {
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (regError) regError.textContent = '';
    const name = (document.getElementById('regName') && document.getElementById('regName').value || '').trim();
    const ageRaw = document.getElementById('regAge') && document.getElementById('regAge').value;
    const age = parseInt(ageRaw, 10);
    const country = (document.getElementById('regCountry') && document.getElementById('regCountry').value || '').trim();
    if (!name) {
      if (regError) regError.textContent = 'Please enter your name.';
      return;
    }
    if (!ageRaw || isNaN(age) || age < 3) {
      if (regError) regError.textContent = 'You must be 3 years or older to play.';
      return;
    }
    if (!country) {
      if (regError) regError.textContent = 'Please enter your country.';
      return;
    }
    setStored('userName', name);
    setStored('userAge', String(age));
    setStored('userCountry', country);
    setStored('registered', 'true');
    showDashboard();
  });
}

/* ========== COUNTRY DATALIST ========== */
function fillCountryDatalist() {
  const datalist = document.getElementById('countryDatalist');
  if (!datalist) return;
  COUNTRIES.forEach((country) => {
    const opt = document.createElement('option');
    opt.value = country;
    datalist.appendChild(opt);
  });
}

/* ========== INIT ========== */
fillCountryDatalist();
applyTheme(currentTheme);
applySpeed(speedMs);
applySound(soundOn);
document.documentElement.setAttribute('data-theme', currentTheme);

showOverlay(startOverlay);
hideOverlay(gameOverOverlay);
initSnake();
placeFood();
if (scoreEl) scoreEl.textContent = '0';

if (getStored('registered', '') === 'true') {
  showDashboard();
} else {
  showRegistration();
}
refreshHighScoreDisplay();
draw();
