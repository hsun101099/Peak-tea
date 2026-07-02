import { showNameModal } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const product = getProductById(params.get('id'));
  const root = document.getElementById('customizeRoot');

  if (!product) {
    root.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><h2>找不到這項飲品</h2><a class="btn btn-primary" href="index.html">回到菜單</a></div>`;
    return;
  }

  const cat = getCategory(product.category);
  document.title = `客製化 ${product.name}｜青山 PEAK TEA`;
  const crumb = document.getElementById('crumbProduct');
  crumb.textContent = product.name;
  crumb.href = `product.html?id=${product.id}`;

  const state = {
    size: product.l ? 'l' : 'm',
    sweet: 'full',
    ice: product.iceFixed || 'full',
    addons: new Set(),
    qty: 1,
  };

  function sizePrice(sizeKey) {
    return sizeKey === 'l' ? product.l : product.m;
  }

  function unitPrice() {
    let p = sizePrice(state.size) || 0;
    state.addons.forEach(key => {
      const addon = ADDONS.find(a => a.key === key);
      if (addon) p += addon.price;
    });
    return p;
  }

  function sweetAllowed(item) {
    if (product.noZeroSugar && item.pct === 0) return false;
    if (product.minSweet && item.pct < product.minSweet) return false;
    return true;
  }

  function iceAllowed(item) {
    if (product.iceFixed) return item.key === product.iceFixed;
    return true;
  }

  root.innerHTML = `
    <div class="customize-preview">
      <div class="frame">${renderDrinkArt(product, { suffix: 'customize' })}</div>
      <span class="cat-badge" style="color:var(--accent); font-size:.82rem; letter-spacing:.2em;">${cat.name}｜${cat.sub}</span>
      <h2>${product.name}</h2>
      <div class="price-live" id="livePrice">0 元</div>
      <p class="hint" id="priceBreakdown"></p>
    </div>

    <div class="customize-options">
      <div class="option-block">
        <h3>杯型</h3>
        <div class="option-pills" id="sizePills"></div>
      </div>

      <div class="option-block">
        <h3>甜度</h3>
        <p class="hint">${product.noZeroSugar ? '鮮果製作，不提供無糖' : (product.minSweet ? '此系列最低糖量為半糖，保留最佳風味' : '正常甜 100% ／少糖 70% ／半糖 50% ／微糖 30% ／1分糖 10% ／無糖 0%')}</p>
        <div class="option-pills" id="sweetPills"></div>
      </div>

      <div class="option-block">
        <h3>冰量</h3>
        <p class="hint">${product.iceFixed ? '本品為鮮奶油特調，固定少冰，恕無法調整' : '正常冰 ／少冰 ／微冰 ／去冰 ／常溫 ／溫熱'}</p>
        <div class="option-pills" id="icePills"></div>
      </div>

      <div class="option-block">
        <h3>加料 <span class="hint" style="margin:0;">（可複選，每項另計費用）</span></h3>
        <div class="addon-list" id="addonList"></div>
      </div>

      <div class="option-block">
        <h3>數量</h3>
        <div class="qty-row">
          <button class="qty-btn" id="qtyMinus">－</button>
          <span class="qty-num" id="qtyNum">1</span>
          <button class="qty-btn" id="qtyPlus">＋</button>
        </div>
      </div>

      <div class="customize-actions">
        <a href="index.html" class="btn btn-outline">繼續選購</a>
        <button class="btn btn-primary btn-block" id="addCartBtn">加入訂單</button>
      </div>
    </div>
  `;

  const sizePillsEl = document.getElementById('sizePills');
  const sweetPillsEl = document.getElementById('sweetPills');
  const icePillsEl = document.getElementById('icePills');
  const addonListEl = document.getElementById('addonList');
  const livePriceEl = document.getElementById('livePrice');
  const breakdownEl = document.getElementById('priceBreakdown');
  const qtyNumEl = document.getElementById('qtyNum');

  function renderSizePills() {
    const sizes = [];
    if (product.m) sizes.push({ key: 'm', label: '中杯 M', price: product.m });
    if (product.l) sizes.push({ key: 'l', label: '大杯 L', price: product.l });
    sizePillsEl.innerHTML = sizes.map(s => `
      <button class="pill ${state.size === s.key ? 'selected' : ''}" data-size="${s.key}">
        ${s.label}<span class="sub">${s.price} 元</span>
      </button>`).join('');
    sizePillsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => { state.size = btn.dataset.size; renderAll(); });
    });
  }

  function renderSweetPills() {
    sweetPillsEl.innerHTML = SWEETNESS.map(s => {
      const allowed = sweetAllowed(s);
      return `<button class="pill ${state.sweet === s.key ? 'selected' : ''}" data-sweet="${s.key}" ${allowed ? '' : 'disabled'}>${s.name}<span class="sub">${s.pct}%</span></button>`;
    }).join('');
    sweetPillsEl.querySelectorAll('button:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => { state.sweet = btn.dataset.sweet; renderAll(); });
    });
  }

  function renderIcePills() {
    icePillsEl.innerHTML = ICE.map(i => {
      const allowed = iceAllowed(i);
      return `<button class="pill ${state.ice === i.key ? 'selected' : ''}" data-ice="${i.key}" ${allowed ? '' : 'disabled'}>${i.name}</button>`;
    }).join('');
    icePillsEl.querySelectorAll('button:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => { state.ice = btn.dataset.ice; renderAll(); });
    });
  }

  function renderAddons() {
    addonListEl.innerHTML = ADDONS.map(a => `
      <div class="addon-row ${state.addons.has(a.key) ? 'selected' : ''}">
        <label>
          <span><input type="checkbox" data-addon="${a.key}" ${state.addons.has(a.key) ? 'checked' : ''}> ${a.name}</span>
          <span class="price-tag">+${a.price} 元</span>
        </label>
      </div>`).join('');
    addonListEl.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) state.addons.add(cb.dataset.addon);
        else state.addons.delete(cb.dataset.addon);
        renderAll();
      });
    });
  }

  function renderPrice() {
    const unit = unitPrice();
    const total = unit * state.qty;
    livePriceEl.textContent = `${total} 元`;
    const addonNames = [...state.addons].map(k => ADDONS.find(a => a.key === k)?.name).filter(Boolean);
    const parts = [`杯型 ${sizePrice(state.size)} 元`];
    if (addonNames.length) parts.push(`加料 ${addonNames.join('、')}`);
    parts.push(`單價 ${unit} 元 × ${state.qty} 杯`);
    breakdownEl.textContent = parts.join('｜');
    qtyNumEl.textContent = state.qty;
  }

  function renderAll() {
    renderSizePills();
    renderSweetPills();
    renderIcePills();
    renderAddons();
    renderPrice();
  }

  document.getElementById('qtyMinus').addEventListener('click', () => {
    state.qty = Math.max(1, state.qty - 1);
    renderPrice();
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    state.qty = Math.min(20, state.qty + 1);
    renderPrice();
  });

  document.getElementById('addCartBtn').addEventListener('click', async (e) => {
    const person = getCurrentUser();
    if (!person) {
      showNameModal('gate');
      return;
    }
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = '送出中…';
    try {
      const { addToGroupOrder } = await import('./group.js');
      await addToGroupOrder({
        person,
        productId: product.id,
        name: product.name,
        category: product.category,
        size: state.size,
        sizeLabel: state.size === 'l' ? '大杯 L' : '中杯 M',
        sweet: SWEETNESS.find(s => s.key === state.sweet).name,
        ice: ICE.find(i => i.key === state.ice).name,
        addons: [...state.addons].map(k => ADDONS.find(a => a.key === k).name),
        qty: state.qty,
        unitPrice: unitPrice(),
      });
      sessionStorage.setItem('peaktea_last_added', `已為「${person}」加入 ${state.qty} 杯「${product.name}」`);
      location.href = 'orders.html';
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = '加入訂單';
      alert('加入訂單失敗，請確認網路連線後再試一次。');
    }
  });

  renderAll();
});
