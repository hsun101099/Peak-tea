/* 青山 Peak Tea — 共用頁首 / 頁尾 / 揪團點餐工具列
   注意：getCurrentUser / setCurrentUser 來自 js/user.js（純本機資料，
   在 <script> 中先載入，不依賴 Firebase，確保網路異常時導覽列仍可運作）。
   Firestore 相關功能一律用動態 import()，失敗時優雅降級，不影響頁首頁尾渲染。 */

function logoMarkSVG() {
  return `<svg class="mark" viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="46" cy="8" r="6" fill="#c1602f"/>
    <path d="M4 40 L22 12 L30 24 L38 8 L56 40 Z" fill="none" stroke="#2f5d50" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

const NAV_LEFT = [
  { href: 'story.html', label: '品牌故事' },
  { href: 'index.html', label: '茶飲介紹' },
  { href: 'news.html', label: '品牌動態' },
];
const NAV_RIGHT = [
  { href: 'franchise.html', label: '加盟資訊' },
  { href: 'stores.html', label: '門市資訊' },
  { href: 'contact.html', label: '聯絡我們' },
];

let latestOrderList = [];
let orderSyncFailed = false;
let groupApiPromise = null;

function loadGroupApi() {
  if (!groupApiPromise) {
    groupApiPromise = import('./group.js').catch((err) => {
      console.error('無法載入揪團訂單模組（Firebase）', err);
      orderSyncFailed = true;
      return null;
    });
  }
  return groupApiPromise;
}

function renderUtilityBar() {
  const el = document.getElementById('utility-bar');
  if (!el) return;
  const user = getCurrentUser();

  if (orderSyncFailed) {
    el.innerHTML = `
      <div class="utility-inner">
        <button class="user-pill" id="switchUserBtn" title="換人">
          <span class="user-icon">&#128100;</span> ${user || '尚未設定'}
        </button>
        <div class="utility-right">
          <span class="stat-pill" style="color:#f2b8a0;">訂單同步失敗，請重新整理</span>
          <button class="util-link util-btn" id="switchUserBtn2">換人</button>
        </div>
      </div>`;
  } else {
    const stats = computeStats(latestOrderList);
    el.innerHTML = `
      <div class="utility-inner">
        <button class="user-pill" id="switchUserBtn" title="換人">
          <span class="user-icon">&#128100;</span> ${user || '尚未設定'}
        </button>
        <div class="utility-right">
          <span class="stat-pill">${stats.people} 人已點</span>
          <span class="stat-pill">${stats.cups} 杯</span>
          <span class="stat-pill">$${stats.total}</span>
          <a href="orders.html" class="util-link">訂單管理</a>
          <button class="util-link util-btn" id="switchUserBtn2">換人</button>
        </div>
      </div>`;
  }
  const openSwitch = () => showNameModal('switch');
  document.getElementById('switchUserBtn').addEventListener('click', openSwitch);
  document.getElementById('switchUserBtn2').addEventListener('click', openSwitch);
}

function computeStats(list) {
  const people = new Set(list.map(i => i.person)).size;
  const cups = list.reduce((sum, i) => sum + i.qty, 0);
  const total = list.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  return { people, cups, total };
}

async function startOrderSubscription() {
  const group = await loadGroupApi();
  if (!group) {
    renderUtilityBar();
    return;
  }
  group.subscribeGroupOrder((list) => {
    latestOrderList = list;
    renderUtilityBar();
  });
}

export function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const current = document.body.dataset.page || '';
  const navHtml = (items) => items.map(i =>
    `<a href="${i.href}" class="${current === i.href ? 'active' : ''}">${i.label}</a>`).join('');

  el.innerHTML = `
    <div id="utility-bar" class="utility-bar"></div>
    <header class="site-header">
      <div class="header-inner">
        <button class="mobile-toggle" id="navToggle" aria-label="選單">&#9776;</button>
        <nav class="nav-group left" id="navLeft">${navHtml(NAV_LEFT)}</nav>
        <a href="index.html" class="brand-logo">
          ${logoMarkSVG()}
          <span class="word">青&nbsp;山</span>
        </a>
        <nav class="nav-group right" id="navRight">
          ${navHtml(NAV_RIGHT)}
        </nav>
      </div>
    </header>`;

  const toggle = document.getElementById('navToggle');
  const left = document.getElementById('navLeft');
  const right = document.getElementById('navRight');
  toggle.addEventListener('click', () => {
    left.classList.toggle('mobile-open');
    right.classList.toggle('mobile-open');
  });

  renderUtilityBar();
  startOrderSubscription();
}

export function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <h4>青山 PEAK TEA</h4>
          <p style="color:#cfc7b3; font-size:.9rem; max-width:280px;">取自高山茶區的四季風味，以茶入景，一杯茶，一座山的高度。</p>
        </div>
        <div>
          <h4>探索</h4>
          <a href="story.html">品牌故事</a>
          <a href="index.html">茶飲介紹</a>
          <a href="news.html">品牌動態</a>
        </div>
        <div>
          <h4>服務</h4>
          <a href="franchise.html">加盟資訊</a>
          <a href="stores.html">門市資訊</a>
          <a href="orders.html">訂單管理</a>
        </div>
      </div>
      <div class="footer-bottom">&copy; ${new Date().getFullYear()} 青山 PEAK TEA. All rights reserved.</div>
    </footer>`;
}

export function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

export function showNameModal(mode) {
  let modal = document.getElementById('nameGateModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'nameGateModal';
  modal.className = 'modal-overlay';
  const isSwitch = mode === 'switch';
  modal.innerHTML = `
    <div class="modal-card">
      ${isSwitch ? '<button class="modal-close" id="modalCloseBtn" aria-label="關閉">&times;</button>' : ''}
      <div class="modal-icon">&#127861;</div>
      <h2>青山 點餐去！</h2>
      <p class="modal-sub">先填你的名字，等等飲料來的時候才知道是誰的喔～</p>
      <label class="modal-label" for="nameInput">你的名字</label>
      <input class="modal-input" id="nameInput" type="text" placeholder="請輸入你的名字" value="${isSwitch ? '' : getCurrentUser()}" maxlength="12">
      <button class="btn btn-primary btn-block" id="nameSubmitBtn">${isSwitch ? '確認換人 →' : '開始點餐 →'}</button>
    </div>`;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');

  const input = document.getElementById('nameInput');
  input.focus();

  function submit() {
    const name = input.value.trim();
    if (!name) {
      input.classList.add('input-error');
      input.focus();
      return;
    }
    setCurrentUser(name);
    modal.remove();
    document.body.classList.remove('modal-open');
    renderUtilityBar();
    document.dispatchEvent(new CustomEvent('peaktea:user-ready'));
  }

  document.getElementById('nameSubmitBtn').addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  input.addEventListener('input', () => input.classList.remove('input-error'));

  if (isSwitch) {
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
      modal.remove();
      document.body.classList.remove('modal-open');
    });
  }
}

export function ensureUserGate() {
  if (!getCurrentUser()) {
    showNameModal('gate');
  } else {
    document.dispatchEvent(new CustomEvent('peaktea:user-ready'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  ensureUserGate();
});

/* 相容舊版 classic script 內嵌呼叫（例如 contact.html 的表單提交） */
window.showToast = showToast;
window.showNameModal = showNameModal;
