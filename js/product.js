document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const product = getProductById(params.get('id'));
  const detailEl = document.getElementById('productDetail');
  const relatedEl = document.getElementById('relatedSection');

  if (!product) {
    detailEl.innerHTML = `<div class="empty-state"><h2>找不到這項飲品</h2><p>可能已下架，請回到菜單重新選擇。</p><a class="btn btn-primary" href="menu.html">回到菜單</a></div>`;
    return;
  }

  const cat = getCategory(product.category);
  document.title = `${product.name}｜青山 PEAK TEA`;
  document.getElementById('crumbCat').innerHTML = `<a href="menu.html?cat=${cat.key}">${cat.name}｜${cat.sub}</a>`;
  document.getElementById('crumbName').textContent = product.name;

  const notices = [];
  if (product.iceFixed) notices.push(`本品為鮮奶油特調，${ICE.find(i => i.key === product.iceFixed).name}固定，無法調整冰量`);
  if (product.noZeroSugar) notices.push('鮮果製作，不提供無糖選項');
  if (product.minSweet) notices.push(`最低糖量為半糖，喝出最佳風味`);
  if (!product.m) notices.push('僅供大杯（L）');
  if (!product.l) notices.push('僅供中杯（M）');

  detailEl.innerHTML = `
    <div class="frame">${renderDrinkArt(product, { suffix: 'detail' })}</div>
    <div class="product-info">
      <span class="cat-badge">${cat.name}｜${cat.sub}</span>
      <h1>${product.name}</h1>
      <div class="price">${formatPrice(product)}</div>
      <p class="desc">${product.desc}</p>
      ${notices.length ? `<ul class="notice-list">${notices.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}
      <a class="btn btn-primary btn-block" href="customize.html?id=${product.id}">選擇規格 · 開始客製</a>
    </div>`;

  const related = getRelatedProducts(product, 4);
  if (related.length) {
    relatedEl.innerHTML = `<h2>相關商品</h2><div class="drink-grid">${related.map(renderDrinkCard).join('')}</div>`;
  }
});
