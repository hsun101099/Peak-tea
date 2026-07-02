document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.recommended).slice(0, 8);
  grid.innerHTML = featured.map(renderDrinkCard).join('');
});
