/* 青山 Peak Tea — 共用頁首 / 頁尾 / 購物車小工具 */

function logoMarkSVG() {
  return `<svg class="mark" viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="46" cy="8" r="6" fill="#c1602f"/>
    <path d="M4 40 L22 12 L30 24 L38 8 L56 40 Z" fill="none" stroke="#2f5d50" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

const NAV_LEFT = [
  { href: 'story.html', label: '品牌故事' },
  { href: 'menu.html', label: '茶飲介紹' },
  { href: 'news.html', label: '品牌動態' },
];
const NAV_RIGHT = [
  { href: 'franchise.html', label: '加盟資訊' },
  { href: 'stores.html', label: '門市資訊' },
  { href: 'contact.html', label: '聯絡我們' },
];

function cartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('peaktea_cart') || '[]');
    return cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  } catch (e) { return 0; }
}

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const current = document.body.dataset.page || '';
  const navHtml = (items) => items.map(i =>
    `<a href="${i.href}" class="${current === i.href ? 'active' : ''}">${i.label}</a>`).join('');

  el.innerHTML = `
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
          <a href="cart.html" class="cart-link" title="購物車">
            購物車<span class="cart-badge" id="cartBadge">${cartCount()}</span>
          </a>
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
}

function renderFooter() {
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
          <a href="menu.html">茶飲介紹</a>
          <a href="news.html">品牌動態</a>
        </div>
        <div>
          <h4>服務</h4>
          <a href="franchise.html">加盟資訊</a>
          <a href="stores.html">門市資訊</a>
          <a href="contact.html">聯絡我們</a>
        </div>
      </div>
      <div class="footer-bottom">&copy; ${new Date().getFullYear()} 青山 PEAK TEA. All rights reserved.</div>
    </footer>`;
}

function showToast(msg) {
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

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});
