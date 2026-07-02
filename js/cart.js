document.addEventListener('DOMContentLoaded', () => {
  const bodyEl = document.getElementById('cartBody');

  function loadCart() {
    return JSON.parse(localStorage.getItem('peaktea_cart') || '[]');
  }
  function saveCart(cart) {
    localStorage.setItem('peaktea_cart', JSON.stringify(cart));
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = cartCount();
  }

  function render() {
    const cart = loadCart();
    if (!cart.length) {
      bodyEl.innerHTML = `
        <div class="empty-state">
          <h2>購物車是空的</h2>
          <p>去菜單挑選一杯喜歡的茶飲吧。</p>
          <a class="btn btn-primary" href="menu.html">前往菜單</a>
        </div>`;
      return;
    }

    const rows = cart.map((item, idx) => {
      const product = getProductById(item.productId);
      const lineTotal = item.unitPrice * item.qty;
      const optionText = [item.sizeLabel, `甜度：${item.sweet}`, `冰量：${item.ice}`]
        .concat(item.addons.length ? [`加料：${item.addons.join('、')}`] : [])
        .join('｜');
      return `
        <div class="cart-item">
          <div class="frame">${product ? renderDrinkArt(product, { suffix: 'cart' + idx }) : ''}</div>
          <div class="meta">
            <h3>${item.name}</h3>
            <p>${optionText}</p>
            <p>單價 ${item.unitPrice} 元 × ${item.qty} 杯 = <strong>${lineTotal} 元</strong></p>
            <button class="remove" data-idx="${idx}">移除</button>
          </div>
          <div class="line-price" style="font-weight:700; color:var(--primary-dark);">${lineTotal} 元</div>
        </div>`;
    }).join('');

    const total = cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

    bodyEl.innerHTML = `
      <div class="cart-list">${rows}</div>
      <div class="cart-summary">
        <span>共 ${cart.reduce((s, i) => s + i.qty, 0)} 杯</span>
        <span class="total">總計 ${total} 元</span>
        <button class="btn btn-primary" id="checkoutBtn">送出訂單</button>
      </div>`;

    bodyEl.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart2 = loadCart();
        cart2.splice(Number(btn.dataset.idx), 1);
        saveCart(cart2);
        render();
      });
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        saveCart([]);
        bodyEl.innerHTML = `<div class="empty-state"><h2>感謝您的訂購！</h2><p>我們已收到您的訂單，將盡快為您準備茶飲。</p><a class="btn btn-primary" href="menu.html">繼續選購</a></div>`;
      });
    }
  }

  render();
});
