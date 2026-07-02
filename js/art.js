/* 青山 Peak Tea — 風格化飲品插畫產生器
   目前無實拍商品照，改以品牌色系繪製的向量杯身圖，
   維持統一的「石景 + 山形」攝影棚氛圍。 */

function drinkArtSVG(product, opts = {}) {
  const art = product.art || {};
  const uid = `art-${product.id}-${opts.suffix || 'a'}`;
  const base = art.base || '#c1652f';
  const base2 = art.base2 || '#e8965a';
  const cream = art.cream || null;
  const boba = art.boba || null;
  const bits = art.bits || null;

  const iceCubes = [
    { x: 128, y: 118, r: 8 }, { x: 152, y: 132, r: 7 }, { x: 118, y: 148, r: 6 },
    { x: 168, y: 108, r: 6 }, { x: 140, y: 96, r: 5 },
  ].map(c => `<rect x="${c.x - c.r}" y="${c.y - c.r}" width="${c.r * 2}" height="${c.r * 2}" rx="3"
      fill="#ffffff" fill-opacity="0.35" transform="rotate(${(c.x * 7) % 40 - 20} ${c.x} ${c.y})"/>`).join('');

  const bobaDots = boba ? Array.from({ length: 9 }).map((_, i) => {
    const x = 108 + (i % 5) * 20 + (Math.floor(i / 5) % 2) * 10;
    const y = 214 + Math.floor(i / 5) * 16;
    return `<circle cx="${x}" cy="${y}" r="6.5" fill="${boba}"/>`;
  }).join('') : '';

  const bitDots = bits ? Array.from({ length: 7 }).map((_, i) => {
    const x = 112 + (i * 13) % 90;
    const y = 150 + ((i * 23) % 70);
    return `<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="${bits}" fill-opacity="0.85"/>`;
  }).join('') : '';

  const creamCap = cream ? `
    <path d="M104 108 C104 92 120 82 150 82 C180 82 196 92 196 108 L196 122 C196 130 180 136 150 136 C120 136 104 130 104 122 Z"
      fill="${cream}"/>
    <path d="M104 108 C104 92 120 82 150 82 C180 82 196 92 196 108" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
    <path d="M118 118 q10 10 20 0" stroke="${base}" stroke-opacity="0.35" stroke-width="2" fill="none"/>
    <path d="M162 120 q10 10 20 0" stroke="${base}" stroke-opacity="0.35" stroke-width="2" fill="none"/>
  ` : '';

  const liquidTop = cream ? 132 : 96;

  return `
  <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name}">
    <defs>
      <radialGradient id="${uid}-bg" cx="70%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#f6ddb8"/>
        <stop offset="100%" stop-color="#eecf9f"/>
      </radialGradient>
      <linearGradient id="${uid}-liquid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${base2}"/>
        <stop offset="100%" stop-color="${base}"/>
      </linearGradient>
      <linearGradient id="${uid}-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="12%" stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="88%" stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.45"/>
      </linearGradient>
      <clipPath id="${uid}-cup">
        <path d="M100 90 L200 90 L188 250 Q150 262 112 250 Z"/>
      </clipPath>
    </defs>

    <rect width="300" height="300" fill="url(#${uid}-bg)"/>
    <circle cx="215" cy="70" r="46" fill="#e7a86b" fill-opacity="0.55"/>
    <path d="M0 235 L90 150 L140 200 L185 140 L300 235 L300 300 L0 300 Z" fill="#7d8a72" fill-opacity="0.4"/>
    <ellipse cx="70" cy="262" rx="34" ry="12" fill="#4a4438" fill-opacity="0.35"/>
    <ellipse cx="235" cy="258" rx="26" ry="9" fill="#4a4438" fill-opacity="0.3"/>

    <g>
      <path d="M100 90 L200 90 L188 250 Q150 262 112 250 Z" fill="#f2ede2" fill-opacity="0.5"/>
      <g clip-path="url(#${uid}-cup)">
        <rect x="100" y="${liquidTop}" width="100" height="180" fill="url(#${uid}-liquid)"/>
        ${bitDots}
        ${bobaDots}
        ${iceCubes}
      </g>
      <path d="M100 90 L200 90 L188 250 Q150 262 112 250 Z" fill="url(#${uid}-glass)"/>
      <path d="M100 90 L200 90 L188 250 Q150 262 112 250 Z" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
      <ellipse cx="150" cy="90" rx="50" ry="8" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="2"/>
    </g>

    ${creamCap}

    <rect x="152" y="52" width="10" height="56" rx="5" fill="#eef0e6" stroke="#cfd0c2" stroke-width="1.5" transform="rotate(-8 157 80)"/>

    ${product.recommended ? `<g transform="translate(226,20)"><circle r="16" fill="#c1602f"/><text x="0" y="5" text-anchor="middle" font-size="11" fill="#fff" font-family="'Noto Sans TC', sans-serif">推薦</text></g>` : ''}
  </svg>`;
}

function renderDrinkArt(product, opts = {}) {
  if (product.photo) {
    return `<img src="${product.photo}" alt="${product.name}" loading="lazy">`;
  }
  return drinkArtSVG(product, opts);
}
