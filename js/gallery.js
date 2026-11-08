// Photo gallery (swipeable strip with credits) and a full-screen viewer.
// Swiping uses native CSS scroll-snap, which feels natural on iPhone and needs no library.

import { escapeHtml } from './map-core.js';

const srcset = (files) => Object.entries(files).map(([w, p]) => `${p} ${w}w`).join(', ');
const smallest = (files) => files[Object.keys(files).sort((a, b) => a - b).find((w) => +w >= 800) ?? Object.keys(files).pop()];

// Vietnamese labels for licence names that are words rather than codes (CC codes stay as is).
export function licenseLabel(name = '') {
  const n = name.trim().toLowerCase();
  if (n === 'unsplash license') return 'Giấy phép Unsplash';
  if (n === 'pexels license') return 'Giấy phép Pexels';
  if (n.startsWith('public domain')) return 'Phạm vi công cộng';
  return name;
}

export function licenseHtml(p) {
  const label = escapeHtml(licenseLabel(p.license));
  return p.licenseUrl ? `<a href="${escapeHtml(p.licenseUrl)}" target="_blank" rel="noopener">${label}</a>` : label;
}

function creditHtml(p) {
  const who = p.creator ? `<a href="${escapeHtml(p.source)}" target="_blank" rel="noopener">${escapeHtml(p.creator)}</a>` : '';
  const via = p.sourceName && p.sourceName !== 'Wikimedia Commons' ? ` (${escapeHtml(p.sourceName)})` : '';
  return `${p.illustrative ? '<span class="tag">Ảnh minh họa</span> ' : ''}Ảnh: ${who}${via} · ${licenseHtml(p)}`;
}

const ARROW = (dir) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${dir === 'prev'
  ? 'M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z'
  : 'M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z'}"/></svg>`;

function slidesHtml(images, sizes, eagerFirst) {
  return images.map((p, i) => {
    const portrait = p.height > p.width;
    return `
      <figure class="gallery__slide${portrait ? ' is-portrait' : ''}" data-index="${i}">
        <img src="${smallest(p.files)}" srcset="${srcset(p.files)}" sizes="${sizes}"
          alt="${escapeHtml(p.alt || '')}" ${i === 0 && eagerFirst ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"
          width="${p.width}" height="${p.height}">
      </figure>`;
  }).join('');
}

// Gallery markup for a list of resolved images (see data.imagesOf).
// `thumbs` adds a strip of small previews under the photo (for galleries with many photos).
export function galleryHtml(images, { sizes = '100vw', label = 'Ảnh', thumbs = false } = {}) {
  if (!images.length) return '';
  const multi = images.length > 1;
  return `
    <section class="gallery${thumbs && multi ? ' has-thumbs' : ''}" data-gallery aria-roledescription="bộ sưu tập ảnh" aria-label="${escapeHtml(label)}">
      <div class="gallery__stage">
        <div class="gallery__track" tabindex="0">${slidesHtml(images, sizes, true)}</div>
        ${multi ? `
          <button type="button" class="gallery__nav gallery__nav--prev" data-dir="-1" aria-label="Ảnh trước">${ARROW('prev')}</button>
          <button type="button" class="gallery__nav gallery__nav--next" data-dir="1" aria-label="Ảnh tiếp theo">${ARROW('next')}</button>
          <div class="gallery__count" aria-live="polite"><span data-current>1</span>/${images.length}</div>` : ''}
      </div>
      ${thumbs && multi ? `
        <div class="gallery__thumbs" role="tablist" aria-label="Chọn ảnh">
          ${images.map((p, i) => `<button type="button" class="gallery__thumb" role="tab" data-thumb="${i}" aria-selected="${i === 0}" aria-label="Ảnh ${i + 1}">
            <img src="${escapeHtml(p.files['400'])}" alt="" loading="lazy" decoding="async"></button>`).join('')}
        </div>` : ''}
      <p class="gallery__credit" data-credit>${creditHtml(images[0])}</p>
    </section>`;
}

function wireStrip(root, images, onIndex) {
  const track = root.querySelector('.gallery__track');
  const current = root.querySelector('[data-current]');
  const credit = root.querySelector('[data-credit]');
  const thumbs = [...root.querySelectorAll('[data-thumb]')];
  let index = 0;
  const update = () => {
    const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    if (i === index || i < 0 || i >= images.length) return;
    index = i;
    if (current) current.textContent = String(i + 1);
    if (credit) credit.innerHTML = creditHtml(images[i]);
    thumbs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    thumbs[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    onIndex?.(i);
  };
  thumbs.forEach((t) => t.addEventListener('click', (e) => {
    e.stopPropagation();
    track.scrollTo({ left: Number(t.dataset.thumb) * track.clientWidth, behavior: 'smooth' });
  }));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  const go = (i) => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  root.querySelectorAll('.gallery__nav').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    go(Math.max(0, Math.min(images.length - 1, index + Number(b.dataset.dir))));
  }));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { go(Math.min(images.length - 1, index + 1)); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(Math.max(0, index - 1)); e.preventDefault(); }
  });
  return { track, getIndex: () => index, jump: (i) => { track.scrollLeft = i * track.clientWidth; index = -1; update(); } };
}

// Activate a gallery rendered by galleryHtml inside `container`.
export function initGallery(container, images) {
  const root = container.querySelector('[data-gallery]');
  if (!root) return;
  wireStrip(root, images);
  root.querySelectorAll('.gallery__slide').forEach((slide) =>
    slide.addEventListener('click', () => openViewer(images, Number(slide.dataset.index))));
}

// ---------- full-screen viewer ----------
let viewer = null;
let lastFocus = null;

function openViewer(images, start) {
  closeViewer();
  lastFocus = document.activeElement;
  viewer = document.createElement('div');
  viewer.className = 'viewer';
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', 'Xem ảnh toàn màn hình');
  viewer.innerHTML = `
    <div class="viewer__inner" data-gallery>
      <div class="gallery__track viewer__track" tabindex="0">${slidesHtml(images, '100vw', false)}</div>
      ${images.length > 1 ? `
        <button type="button" class="gallery__nav gallery__nav--prev" data-dir="-1" aria-label="Ảnh trước">${ARROW('prev')}</button>
        <button type="button" class="gallery__nav gallery__nav--next" data-dir="1" aria-label="Ảnh tiếp theo">${ARROW('next')}</button>` : ''}
      <div class="viewer__bar">
        <p class="viewer__caption"><span class="viewer__alt" data-alt>${escapeHtml(images[start].alt || '')}</span>
          <span class="gallery__credit viewer__credit" data-credit>${creditHtml(images[start])}</span></p>
        ${images.length > 1 ? `<span class="viewer__count"><span data-current>${start + 1}</span>/${images.length}</span>` : ''}
      </div>
      <button type="button" class="viewer__close" aria-label="Đóng">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>`;
  document.body.appendChild(viewer);
  // Lazy images in the viewer should load right away around the start index.
  viewer.querySelectorAll('img').forEach((img) => img.removeAttribute('loading'));
  const alt = viewer.querySelector('[data-alt]');
  const strip = wireStrip(viewer.querySelector('[data-gallery]'), images, (i) => { alt.textContent = images[i].alt || ''; });
  strip.jump(start);
  viewer.querySelector('.viewer__close').addEventListener('click', closeViewer);
  viewer.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(); });
  requestAnimationFrame(() => viewer?.classList.add('is-open'));
  strip.track.focus({ preventScroll: true });
}

export function closeViewer() {
  if (!viewer) return;
  viewer.remove();
  viewer = null;
  lastFocus?.focus?.({ preventScroll: true });
}
