/* 共用：飲品卡片 HTML */
function renderDrinkCard(product) {
  const badges = [];
  if (product.recommended) badges.push('<span class="badge">推薦</span>');
  if (product.category === 'wu') badges.push('<span class="badge">無咖啡因</span>');
  return `
    <a class="drink-card" href="customize.html?id=${product.id}">
      <div class="frame">${renderDrinkArt(product, { suffix: 'card' })}</div>
      <div class="info">
        <div class="badges">${badges.join('')}</div>
        <h3>${product.name}</h3>
        <div class="price">${formatPrice(product)}</div>
      </div>
    </a>`;
}
