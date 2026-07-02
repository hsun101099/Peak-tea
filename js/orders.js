import { showToast } from './layout.js';

document.addEventListener('DOMContentLoaded', async () => {
  const bodyEl = document.getElementById('ordersBody');
  let checkedOut = false;

  let group;
  try {
    group = await import('./group.js');
  } catch (err) {
    console.error('無法載入揪團訂單模組（Firebase）', err);
    bodyEl.innerHTML = `<div class="empty-state"><h2>無法連線到訂單系統</h2><p>請檢查網路連線後重新整理頁面再試一次。</p></div>`;
    return;
  }
  const { subscribeGroupOrder, removeFromGroupOrder, clearGroupOrder, computeStats } = group;

  function render(list) {
    if (checkedOut) return;

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
      const items = list.filter(item => item.person === person);
      const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
      const rows = items.map(item => {
        const product = getProductById(item.productId);
        const lineTotal = item.unitPrice * item.qty;
        const optionText = [item.sizeLabel, `甜度：${item.sweet}`, `冰量：${item.ice}`]
          .concat(item.addons.length ? [`加料：${item.addons.join('、')}`] : [])
          .join('｜');
        return `
          <div class="cart-item">
            <div class="frame">${product ? renderDrinkArt(product, { suffix: 'order' + item.id }) : ''}</div>
            <div class="meta">
              <h3>${item.name}</h3>
              <p>${optionText}</p>
              <p>單價 ${item.unitPrice} 元 × ${item.qty} 杯</p>
              <button class="remove" data-id="${item.id}">移除</button>
            </div>
            <div class="line-price">${lineTotal} 元</div>
          </div>`;
      }).join('');

      return `
        <div class="content-block">
          <h2>${person} <span style="color:var(--muted); font-weight:400; font-size:.85rem;">（${items.length} 項・${subtotal} 元）</span></h2>
          <div class="cart-list">${rows}</div>
        </div>`;
    }).join('');

    const stats = computeStats(list);

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
        btn.disabled = true;
        removeFromGroupOrder(btn.dataset.id).catch(err => {
          console.error(err);
          btn.disabled = false;
          alert('移除失敗，請確認網路連線後再試一次。');
        });
      });
    });

    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!confirm('確定要清空所有人的訂單嗎？')) return;
        clearBtn.disabled = true;
        clearGroupOrder().catch(err => {
          console.error(err);
          clearBtn.disabled = false;
          alert('清空失敗，請確認網路連線後再試一次。');
        });
      });
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        checkoutBtn.disabled = true;
        clearGroupOrder().then(() => {
          checkedOut = true;
          bodyEl.innerHTML = `<div class="empty-state"><h2>感謝大家的訂購！</h2><p>訂單已經彙整完成，可以出發去買飲料囉。</p><a class="btn btn-primary" href="index.html">回到菜單</a></div>`;
        }).catch(err => {
          console.error(err);
          checkoutBtn.disabled = false;
          alert('送出失敗，請確認網路連線後再試一次。');
        });
      });
    }
  }

  subscribeGroupOrder(render);

  const lastAdded = sessionStorage.getItem('peaktea_last_added');
  if (lastAdded) {
    sessionStorage.removeItem('peaktea_last_added');
    showToast(lastAdded);
  }
});
