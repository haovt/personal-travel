// "Nguồn ảnh & bản quyền": full-screen page listing every photo's author, licence and source,
// plus credits for map data, fonts and libraries. Built from data files only.

import { escapeHtml } from './map-core.js';

const OTHER_CREDITS = [
  {
    title: 'Dữ liệu bản đồ',
    items: [
      { name: 'Bản đồ Việt Nam', by: 'Natural Earth', license: 'Phạm vi công cộng', url: 'https://www.naturalearthdata.com/' },
      { name: 'Bản đồ chi tiết Đà Nẵng', by: '© Những người đóng góp OpenStreetMap', license: 'ODbL 1.0', url: 'https://www.openstreetmap.org/copyright' },
    ],
  },
  {
    title: 'Phông chữ và thư viện',
    items: [
      { name: 'Be Vietnam Pro', by: 'The Be Vietnam Pro Project Authors', license: 'SIL Open Font License 1.1', url: 'https://github.com/bettergui/BeVietnamPro' },
      { name: 'Noto Serif', by: 'The Noto Project Authors', license: 'SIL Open Font License 1.1', url: 'https://github.com/notofonts/latin-greek-cyrillic' },
      { name: 'Leaflet', by: 'Volodymyr Agafonkin và cộng đồng Leaflet', license: 'BSD-2-Clause', url: 'https://leafletjs.com/' },
    ],
  },
];

export function createCreditsPage(data, { onBack }) {
  const page = document.createElement('section');
  page.className = 'page';
  page.id = 'credits-page';
  page.hidden = true;
  page.setAttribute('aria-labelledby', 'credits-title');
  document.body.appendChild(page);

  const ownerName = (p) => (p.ownerType === 'destination'
    ? data.destinationById(p.owner)?.name
    : data.locationById(p.owner)?.name) ?? p.owner;

  function render() {
    // Group photos by the place they illustrate, in data order.
    const groups = new Map();
    for (const p of data.photos) {
      if (!groups.has(p.owner)) groups.set(p.owner, []);
      groups.get(p.owner).push(p);
    }
    page.innerHTML = `
      <header class="page__bar">
        <button type="button" class="icon-btn" data-back aria-label="Quay lại">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>
        </button>
        <h1 id="credits-title">Nguồn ảnh &amp; bản quyền</h1>
      </header>
      <div class="page__body">
        <p class="lead">Tất cả ảnh là ảnh thật, dùng theo giấy phép tự do của tác giả. Ảnh đã được thu nhỏ kích thước để hiển thị trên web.</p>
        ${[...groups].map(([owner, photos]) => `
          <h2>${escapeHtml(ownerName(photos[0]))}</h2>
          <ul class="credit-list">
            ${photos.map((p) => `
              <li class="credit">
                <img src="${escapeHtml(p.files['400'])}" alt="" loading="lazy" decoding="async">
                <div>
                  <p><strong>${escapeHtml(p.creator || 'Không rõ tác giả')}</strong></p>
                  <p>${p.licenseUrl
                    ? `<a href="${escapeHtml(p.licenseUrl)}" target="_blank" rel="noopener">${escapeHtml(p.license)}</a>`
                    : escapeHtml(p.license)} · ${escapeHtml(p.modified || '')}</p>
                  <p><a href="${escapeHtml(p.source)}" target="_blank" rel="noopener">Xem ảnh gốc trên Wikimedia Commons</a></p>
                </div>
              </li>`).join('')}
          </ul>`).join('')}
        ${OTHER_CREDITS.map((g) => `
          <h2>${escapeHtml(g.title)}</h2>
          <ul class="plain-list">
            ${g.items.map((it) => `<li><strong>${escapeHtml(it.name)}</strong>: ${escapeHtml(it.by)} · <a href="${escapeHtml(it.url)}" target="_blank" rel="noopener">${escapeHtml(it.license)}</a></li>`).join('')}
          </ul>`).join('')}
      </div>`;
    page.querySelector('[data-back]').addEventListener('click', onBack);
  }

  return {
    show() {
      if (!page.innerHTML) render();
      page.hidden = false;
      page.scrollTop = 0;
      page.querySelector('[data-back]').focus({ preventScroll: true });
    },
    hide() { page.hidden = true; },
  };
}
