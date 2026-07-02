import { showToast } from './layout.js';

document.addEventListener('DOMContentLoaded', async () => {
  const bodyEl = document.getElementById('ordersBody');
  const titleEl = document.querySelector('.content-page h1');

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
    if (!list.length) {
      bodyEl.innerHTML = `
        <div class="empty-state">
          <h2>目前還沒有人點餐</h2>
          <p>去菜單挑一杯喜歡的茶飲，加入訂單吧。</p>
          <a class="btn btn-primary" href="index.html">前往點餐</a>
        </div>`;
      return;
    }

    const me = getCurrentUser();

    const people = [...new Set(list.map(i => i.person))];
    const groupsHtml = people.map(person => {
      const items = list.filter(item => item.person === person);
      const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
      const canManage = person === me;
      const rows = items.map(item => {
        const lineTotal = item.unitPrice * item.qty;
        const optionText = [item.sizeLabel, item.sweet, item.ice]
          .concat(item.addons.length ? [item.addons.join('、')] : [])
          .join('・');
        return `
          <div class="cart-row">
            <div class="cart-row-main">
              <span class="cart-row-name">${item.name} × ${item.qty}</span>
              <span class="cart-row-opt">${optionText}</span>
            </div>
            <span class="cart-row-price">${lineTotal} 元</span>
            ${canManage ? `<button class="remove" data-id="${item.id}" aria-label="移除">&times;</button>` : '<span class="remove-spacer"></span>'}
          </div>`;
      }).join('');

      return `
        <div class="content-block person-block ${person === me ? 'is-me' : ''}">
          <h2>${person}${person === me ? ' <span class="me-tag">你</span>' : ''} <span class="person-sub">${items.length} 項・${subtotal} 元</span></h2>
          <div class="cart-list">${rows}</div>
        </div>`;
    }).join('');

    const stats = computeStats(list);

    bodyEl.innerHTML = `
      ${groupsHtml}
      <div class="cart-summary">
        <span>共 ${stats.people} 人・${stats.cups} 杯</span>
        <span class="total">總計 ${stats.total} 元</span>
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
  }

  // 管理功能刻意不做成畫面上的按鈕，只能連點兩下標題觸發，密碼驗證後直接清空全部訂單。
  if (titleEl) {
    titleEl.addEventListener('dblclick', () => {
      if (!checkAdminPassword()) return;
      if (!confirm('確定要清空所有人的訂單嗎？此動作無法復原。')) return;
      clearGroupOrder().catch(err => {
        console.error(err);
        alert('清空失敗，請確認網路連線後再試一次。');
      });
    });
  }

  let latestList = [];
  subscribeGroupOrder((list) => {
    latestList = list;
    render(list);
  });

  // 首次訪客可能在姓名輸入完成「前」就先收到初次快照（此時 getCurrentUser() 還是空的），
  // 送出姓名後重新渲染一次，確保「移除」按鈕的權限判斷是最新的身分。
  document.addEventListener('peaktea:user-ready', () => render(latestList));

  const lastAdded = sessionStorage.getItem('peaktea_last_added');
  if (lastAdded) {
    sessionStorage.removeItem('peaktea_last_added');
    showToast(lastAdded);
  }
});
