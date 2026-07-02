document.addEventListener('DOMContentLoaded', () => {
  const bodyEl = document.getElementById('ordersBody');

  function render() {
    const list = getGroupOrder();
    if (!list.length) {
      bodyEl.innerHTML = `
        <div class="empty-state">
          <h2>目前還沒有人點餐</h2>
          <p>去菜單挑一杯喜歡的茶飲，加入訂單吧。</p>
          <a class="btn btn-primary" href="index.html">前往點餐</a>
        </div>`;
      return;
    }

    const people = [...new Set(list.map(i => i.person))];
    const groupsHtml = people.map(person => {
      const items = list
        .map((item, idx) => ({ item, idx }))
        .filter(({ item }) => item.person === person);
      const subtotal = items.reduce((sum, { item }) => sum + item.unitPrice * item.qty, 0);
      const rows = items.map(({ item, idx }) => {
        const product = getProductById(item.productId);
        const lineTotal = item.unitPrice * item.qty;
        const optionText = [item.sizeLabel, `甜度：${item.sweet}`, `冰量：${item.ice}`]
          .concat(item.addons.length ? [`加料：${item.addons.join('、')}`] : [])
          .join('｜');
        return `
          <div class="cart-item">
            <div class="frame">${product ? renderDrinkArt(product, { suffix: 'order' + idx }) : ''}</div>
            <div class="meta">
              <h3>${item.name}</h3>
              <p>${optionText}</p>
              <p>單價 ${item.unitPrice} 元 × ${item.qty} 杯 = <strong>${lineTotal} 元</strong></p>
              <button class="remove" data-idx="${idx}">移除</button>
            </div>
            <div class="line-price" style="font-weight:700; color:var(--primary-dark);">${lineTotal} 元</div>
          </div>`;
      }).join('');

      return `
        <div class="content-block">
          <h2>${person} <span style="color:var(--muted); font-weight:400; font-size:.85rem;">（${items.length} 項・${subtotal} 元）</span></h2>
          <div class="cart-list">${rows}</div>
        </div>`;
    }).join('');

    const stats = groupStats();

    bodyEl.innerHTML = `
      ${groupsHtml}
      <div class="cart-summary">
        <span>共 ${stats.people} 人・${stats.cups} 杯</span>
        <span class="total">總計 ${stats.total} 元</span>
        <button class="btn btn-outline" id="clearAllBtn">清空全部</button>
        <button class="btn btn-primary" id="checkoutBtn">送出訂單</button>
      </div>`;

    bodyEl.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromGroupOrder(Number(btn.dataset.idx));
        renderUtilityBar();
        render();
      });
    });

    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('確定要清空所有人的訂單嗎？')) {
          clearGroupOrder();
          renderUtilityBar();
          render();
        }
      });
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        clearGroupOrder();
        renderUtilityBar();
        bodyEl.innerHTML = `<div class="empty-state"><h2>感謝大家的訂購！</h2><p>訂單已經彙整完成，可以出發去買飲料囉。</p><a class="btn btn-primary" href="index.html">回到菜單</a></div>`;
      });
    }
  }

  render();
});
