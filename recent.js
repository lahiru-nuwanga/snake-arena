/**
 * Recent scores page — reads from localStorage and renders list.
 */
(function () {
  const STORAGE_KEYS = {
    recentScores: 'snake_recentScores',
    highScore: 'snake_highScore',
    theme: 'snake_theme',
  };

  function getStored(key, fallback) {
    try {
      const v = localStorage.getItem(STORAGE_KEYS[key]);
      if (v != null) return v;
    } catch (_) {}
    return fallback;
  }

  function getStoredJSON(key, fallback) {
    try {
      const v = localStorage.getItem(STORAGE_KEYS[key]);
      if (v != null) return JSON.parse(v);
    } catch (_) {}
    return fallback != null ? fallback : [];
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function applyTheme() {
    const theme = getStored('theme', 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function render() {
    const listEl = document.getElementById('recentScoresList');
    if (!listEl) return;
    const recent = getStoredJSON('recentScores', []);
    const best = parseInt(getStored('highScore', '0'), 10) || 0;
    listEl.innerHTML = recent.length === 0
      ? '<li class="score-list-empty">No games yet. Play to see your scores here.</li>'
      : recent.map(({ score: s, name }) => {
          const isBest = s === best && best > 0;
          return `<li class="score-list-item ${isBest ? 'score-list-item--highlight' : ''}"><span class="score-list-name">${escapeHtml(name)}</span><span class="score-list-value">${s}</span>${isBest ? ' <span class="score-list-badge">Best</span>' : ''}</li>`;
        }).join('');
  }

  applyTheme();
  render();
})();
