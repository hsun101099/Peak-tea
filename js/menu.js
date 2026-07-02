document.addEventListener('DOMContentLoaded', () => {
  const tabsEl = document.getElementById('categoryTabs');
  const subEl = document.getElementById('categorySub');
  const gridEl = document.getElementById('drinkGrid');

  const params = new URLSearchParams(location.search);
  let activeCat = params.get('cat') || CATEGORIES[0].key;
  if (!CATEGORIES.some(c => c.key === activeCat)) activeCat = CATEGORIES[0].key;

  function renderTabs() {
    tabsEl.innerHTML = CATEGORIES.map(c =>
      `<button data-key="${c.key}" class="${c.key === activeCat ? 'active' : ''}">${c.name}｜${c.sub}</button>`
    ).join('');
    tabsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCat = btn.dataset.key;
        const url = new URL(location.href);
        url.searchParams.set('cat', activeCat);
        history.replaceState(null, '', url);
        renderTabs();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const cat = getCategory(activeCat);
    subEl.textContent = cat.desc;
    const items = PRODUCTS.filter(p => p.category === activeCat);
    gridEl.innerHTML = items.map(renderDrinkCard).join('');
  }

  renderTabs();
  renderGrid();
});
