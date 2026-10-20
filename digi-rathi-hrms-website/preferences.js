/* Storage may be unavailable or contain an old/invalid value. Never block startup. */
window.hrmsPreferences = {
  read(key, fallback) { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } },
  write(key, value) { try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); } catch {} },
  theme() { try { const value = localStorage.getItem('drTheme'); if (value === 'dark' || value === 'light') return value; } catch {} return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
};
document.documentElement.dataset.theme = window.hrmsPreferences.theme();
