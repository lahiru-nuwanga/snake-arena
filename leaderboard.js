/**
 * Leaderboard page — reads from localStorage and renders top 3 + list + your rank.
 */
(function () {
  const STORAGE_KEYS = {
    leaderboard: 'snake_leaderboard',
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

  function getInitial(name) {
    if (!name || !name.trim()) return '?';
    return String(name.trim()).charAt(0).toUpperCase();
  }

  function applyTheme() {
    const theme = getStored('theme', 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function render() {
    const list = getStoredJSON('leaderboard', []);
    const sorted = [...list].sort((a, b) => b.score - a.score);
    const userBest = parseInt(getStored('highScore', '0'), 10) || 0;
    const top3El = document.getElementById('leaderboardTop3');
    const listEl = document.getElementById('leaderboardList');
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

    if (listEl) {
      const rest = sorted.slice(3);
      listEl.innerHTML = rest.length === 0
        ? ''
        : rest.map((entry, i) => {
            const rank = i + 4;
            const initial = getInitial(entry.name);
            return `<li class="leaderboard-item"><span class="leaderboard-rank">${rank}</span><span class="leaderboard-avatar">${escapeHtml(initial)}</span><span class="leaderboard-name">${escapeHtml(entry.name)}</span><span class="leaderboard-points">${entry.score} points</span></li>`;
          }).join('');
    }

    let yourRank = '—';
    if (sorted.length > 0) {
      const betterCount = sorted.filter(e => e.score > userBest).length;
      yourRank = betterCount + 1;
    }
    if (yourRankNumEl) yourRankNumEl.textContent = yourRank;
    if (yourRankScoreEl) yourRankScoreEl.textContent = userBest;
  }

  applyTheme();
  render();
})();
