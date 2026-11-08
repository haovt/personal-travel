// Top bar, filter chips and the info sheet (bottom sheet on phones, side panel on desktop).
// All visible text is Vietnamese.

import { pinSvg, escapeHtml } from './map-core.js';
import { galleryHtml, initGallery, closeViewer } from './gallery.js';

// Sheet width is 100vw on phones and 420 px on desktop; the location detail panel is wider.
const SHEET_IMG_SIZES = '(min-width: 768px) 420px, 100vw';
const DETAIL_IMG_SIZES = '(min-width: 768px) min(56vw, 980px), 100vw';

const MAPS_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>';

// Google Maps URL (no API key): opens the place in Google Maps, where its own photos and
// reviews can be browsed. See CLAUDE.md "Photo source decision".
function googleMapsUrl(loc, dest) {
  const q = loc.mapsQuery
    || [loc.venue?.name || loc.name, loc.venue?.address, dest.name].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

// Small square thumbnail for list cards (falls back to a pin when there is no photo).
function thumbHtml(img, color) {
  if (!img) return pinSvg(color, 'dest-card__pin');
  return `<span class="thumb"><img src="${escapeHtml(img.files['400'])}" alt="" loading="lazy" decoding="async">${
    color ? `<span class="thumb__dot" style="background:${color}"></span>` : ''}</span>`;
}

const $ = (id) => document.getElementById(id);
const CHEVRON = '<svg class="dest-card__go" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>';
const ARROW_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>';

export function createPanel(data, handlers) {
  const titleEl = $('page-title');
  const backBtn = $('back-btn');
  const chipsEl = $('region-chips');
  const sheet = $('sheet');
  const content = $('sheet-content');
  const handle = $('sheet-handle');

  backBtn.addEventListener('click', () => handlers.onBack());

  // Keep the desktop side panel just below the top bar, whatever the top bar's height.
  const topbar = $('topbar');
  const syncTopbar = () => document.documentElement.style.setProperty(
    '--topbar-bottom', `${Math.round(topbar.getBoundingClientRect().bottom)}px`);
  new ResizeObserver(syncTopbar).observe(topbar);
  syncTopbar();

  const phonePortrait = window.matchMedia('(max-width: 767px) and (orientation: portrait)');
  function setCollapsed(collapsed) {
    sheet.classList.toggle('is-collapsed', collapsed);
    handle.setAttribute('aria-expanded', String(!collapsed));
  }
  handle.addEventListener('click', () => {
    setCollapsed(!sheet.classList.contains('is-collapsed'));
    handlers.onSheetResize?.();
  });

  // --- Chips: regions on the overview, categories on a destination ---
  let chipMode = 'region';
  let chipItems = [];
  let chipValue = null;

  function renderChips() {
    chipsEl.setAttribute('aria-label', chipMode === 'region' ? 'Lọc theo vùng miền' : 'Lọc theo loại địa điểm');
    chipsEl.innerHTML = [{ id: null, name: 'Tất cả' }, ...chipItems]
      .map((c) => `<button type="button" class="chip" data-value="${escapeHtml(c.id ?? '')}" aria-pressed="${c.id === chipValue}">${
        c.color ? `<span class="chip__dot" style="background:${c.color}"></span>` : ''}${escapeHtml(c.name)}</button>`)
      .join('');
  }
  chipsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    const v = btn.dataset.value || null;
    const next = v === chipValue ? null : v;
    if (chipMode === 'region') handlers.onRegion(next);
    else handlers.onCategory(next);
  });

  let currentCountry = null;

  function setRegion(regionId) {
    chipValue = regionId;
    if (chipMode === 'region') renderChips();
    content.querySelectorAll('.dest-card[data-region]').forEach((card) => {
      card.classList.toggle('is-dimmed', regionId != null && card.dataset.region !== regionId);
    });
    const empty = content.querySelector('[data-empty-region]');
    if (empty && currentCountry) {
      const published = data.destinationsOf(currentCountry).filter((d) => d.status === 'published');
      const hasAny = published.some((d) => regionId == null || d.region === regionId);
      empty.hidden = hasAny;
      if (!hasAny) {
        empty.textContent = regionId == null
          ? 'Các điểm đến đang được chuẩn bị.'
          : `${data.regionById(currentCountry.id, regionId)?.name ?? ''} chưa có điểm đến trong phiên bản này.`;
      }
    }
  }

  function setCategory(catId, matches) {
    chipValue = catId;
    if (chipMode === 'category') renderChips();
    let shown = 0;
    content.querySelectorAll('.loc-card').forEach((card) => {
      const loc = data.locationById(card.dataset.id);
      const on = matches(loc);
      card.closest('li').hidden = !on;
      if (on) shown++;
    });
    const count = content.querySelector('[data-count]');
    if (count) count.textContent = `${shown} địa điểm`;
  }

  // --- Views ---
  function setMode(mode) {
    sheet.classList.toggle('sheet--detail', mode === 'detail');
    document.body.classList.toggle('is-detail', mode === 'detail');  // widens panel + top bar
    closeViewer();
  }

  // First level: pick a country.
  function showWorld() {
    setMode('list');
    currentCountry = null;
    titleEl.textContent = 'Tập bản đồ du lịch';
    backBtn.hidden = true;
    chipsEl.hidden = true;
    setCollapsed(false);
    content.innerHTML = `
      <div class="sheet__peek peek">
        <p class="eyebrow">Tập bản đồ du lịch</p>
        <h2>Bạn muốn khám phá nơi nào?</h2>
      </div>
      <ul class="dest-list peek">
        ${data.countries.map((c) => {
          const dests = data.destinationsOf(c).filter((d) => d.status === 'published');
          const img = dests.map((d) => data.imagesOf(d)[0]).find(Boolean);
          return `
          <li>
            <button type="button" class="dest-card" data-country="${escapeHtml(c.id)}"
              aria-label="${escapeHtml(`${c.name}, ${dests.length ? `${dests.length} điểm đến` : 'Đang chuẩn bị'}`)}">
              ${thumbHtml(img, null)}
              <span class="dest-card__body">
                <span class="dest-card__name">${escapeHtml(c.name)}</span>
                <span class="dest-card__meta">${dests.length ? `${dests.length} điểm đến` : 'Đang chuẩn bị'}</span>
              </span>
              ${CHEVRON}
            </button>
          </li>`;
        }).join('')}
      </ul>
      <p class="fine-print"><a href="#/nguon-anh">Nguồn ảnh &amp; bản quyền</a></p>`;
    content.querySelectorAll('[data-country]').forEach((btn) =>
      btn.addEventListener('click', () => handlers.onSelectCountry(btn.dataset.country)));
  }

  function showCountry(country, regionId) {
    setMode('list');
    currentCountry = country;
    titleEl.textContent = country.title;
    backBtn.hidden = false;
    backBtn.setAttribute('aria-label', 'Quay lại chọn quốc gia');
    chipMode = 'region';
    chipItems = country.regions || [];
    chipsEl.hidden = chipItems.length === 0;
    chipValue = regionId ?? null;
    renderChips();
    setCollapsed(phonePortrait.matches);

    const published = data.destinationsOf(country).filter((d) => d.status === 'published');
    content.innerHTML = `
      <div class="sheet__peek peek">
        <p class="eyebrow">${escapeHtml(country.eyebrow || '')}</p>
        <h2>${escapeHtml(country.heading || country.name)}</h2>
      </div>
      <p class="lead">${escapeHtml(country.intro || '')}</p>
      <h3 class="section-title peek">Điểm đến</h3>
      <ul class="dest-list peek">
        ${published.map((d) => `
          <li>
            <button type="button" class="dest-card" data-id="${escapeHtml(d.id)}" data-region="${escapeHtml(d.region || '')}"
              aria-label="${escapeHtml(`${d.name}, ${data.regionById(country.id, d.region)?.name ?? country.name}`)}">
              ${thumbHtml(data.imagesOf(d)[0], null)}
              <span class="dest-card__body">
                <span class="dest-card__name">${escapeHtml(d.name)}</span>
                <span class="dest-card__meta">${escapeHtml(data.regionById(country.id, d.region)?.name ?? country.name)}</span>
              </span>
              ${CHEVRON}
            </button>
          </li>`).join('')}
      </ul>
      <p class="notice peek" data-empty-region hidden></p>
      <p class="fine-print"><a href="#/nguon-anh">Nguồn ảnh &amp; bản quyền</a></p>`;
    content.querySelectorAll('.dest-card[data-id]').forEach((btn) =>
      btn.addEventListener('click', () => handlers.onSelectDestination(btn.dataset.id)));
    setRegion(chipValue);
  }

  function showDestination(dest, { categoryId, matches, collapse }) {
    setMode('list');
    const country = data.countryById(dest.countryId);
    titleEl.textContent = dest.name;
    backBtn.hidden = false;
    backBtn.setAttribute('aria-label', `Quay lại bản đồ ${country?.name ?? ''}`);
    const locations = data.locationsFor(dest);

    // Category chips: only the categories this destination has.
    const used = new Set(locations.flatMap((l) => [l.category, ...(l.tags || [])]));
    chipMode = 'category';
    chipItems = data.categories.filter((c) => used.has(c.id));
    chipValue = categoryId ?? null;
    chipsEl.hidden = locations.length === 0;
    renderChips();
    setCollapsed(collapse ?? phonePortrait.matches);

    const region = data.regionById(dest.countryId, dest.region);
    const destImages = data.imagesOf(dest);
    content.innerHTML = `
      ${galleryHtml(destImages, { sizes: SHEET_IMG_SIZES, label: `Ảnh ${dest.name}` })}
      <div class="sheet__peek peek">
        <p class="eyebrow">${escapeHtml(region?.name ?? '')}</p>
        <h2>${escapeHtml(dest.name)}</h2>
        ${locations.length ? `<p class="sheet__meta" data-count>${locations.length} địa điểm</p>` : ''}
      </div>
      <p class="lead">${escapeHtml(dest.summary)}</p>
      ${locations.length === 0
        ? `<p class="notice">Bản đồ chi tiết và các địa điểm của ${escapeHtml(dest.name)} đang được hoàn thiện.</p>`
        : `<h3 class="section-title">Địa điểm</h3>
           <ul class="dest-list">
             ${locations.map((loc) => {
               const cat = data.categoryById(loc.category);
               return `
               <li>
                 <button type="button" class="dest-card loc-card" data-id="${escapeHtml(loc.id)}"
                   aria-label="${escapeHtml([loc.name, cat?.name, loc.venue?.name].filter(Boolean).join(', '))}">
                   ${thumbHtml(data.imagesOf(loc)[0], cat?.color ?? '#5f6368')}
                   <span class="dest-card__body">
                     <span class="dest-card__name">${escapeHtml(loc.name)}</span>
                     <span class="dest-card__meta">${escapeHtml(cat?.name ?? '')}${loc.venue?.name ? ` · ${escapeHtml(loc.venue.name)}` : ''}</span>
                   </span>
                   ${CHEVRON}
                 </button>
               </li>`;
             }).join('')}
           </ul>`}
      <button type="button" class="btn" data-back>${ARROW_BACK}Quay lại bản đồ ${escapeHtml(country?.name ?? "")}</button>`;
    content.querySelector('[data-back]').addEventListener('click', () => handlers.onBackToCountry());
    content.querySelectorAll('.loc-card').forEach((btn) =>
      btn.addEventListener('click', () => handlers.onSelectLocation(btn.dataset.id)));
    initGallery(content, destImages);
    if (matches) setCategory(chipValue, matches);
  }

  // Location detail: photos first, then a one-line summary and a few fact lines.
  function showLocation(dest, loc) {
    setMode('detail');
    titleEl.textContent = loc.name;
    backBtn.hidden = false;
    backBtn.setAttribute('aria-label', `Quay lại bản đồ ${dest.name}`);
    chipsEl.hidden = true;
    setCollapsed(false);

    const cat = data.categoryById(loc.category);
    const images = data.imagesOf(loc);
    const facts = (loc.facts || [])
      .map((f) => `<div class="facts__row"><dt>${escapeHtml(f.label)}</dt><dd>${escapeHtml(f.value)}</dd></div>`)
      .join('');
    content.innerHTML = `
      ${galleryHtml(images, { sizes: DETAIL_IMG_SIZES, label: `Ảnh ${loc.name}`, thumbs: images.length > 2 })}
      <div class="detail__body peek">
        <div class="detail__main">
          <div class="sheet__peek">
            <p class="eyebrow"><span class="eyebrow__dot" style="background:${cat?.color ?? '#5f6368'}"></span>${escapeHtml(cat?.name ?? '')} · ${escapeHtml(dest.name)}</p>
            <h2>${escapeHtml(loc.name)}</h2>
          </div>
          <p class="lead">${escapeHtml(loc.summary)}</p>
          ${images.length === 0 ? '<p class="notice">Chưa có ảnh phù hợp cho địa điểm này.</p>' : ''}
          <div class="detail__actions">
            <a class="btn btn--primary" href="${escapeHtml(googleMapsUrl(loc, dest))}" target="_blank" rel="noopener">${MAPS_ICON}Xem trên Google Maps</a>
            <button type="button" class="btn" data-back>${ARROW_BACK}Quay lại bản đồ ${escapeHtml(dest.name)}</button>
          </div>
        </div>
        ${facts ? `<dl class="facts">${facts}</dl>` : ''}
      </div>`;
    content.querySelector('[data-back]').addEventListener('click', () => handlers.onBack());
    content.scrollTop = 0;
    initGallery(content, images);
  }

  return { showWorld, showCountry, showDestination, showLocation, setRegion, setCategory };
}
