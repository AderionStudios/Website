/* Apply the saved theme before styles render to avoid a bright flash. */
(() => {
  let theme = 'light';
  try {
    if (localStorage.getItem('aderion-theme') === 'dark') theme = 'dark';
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
