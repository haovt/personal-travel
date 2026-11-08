// Small pills at the edge of the visible map pointing to locations that are outside the view
// (e.g. Bà Nà Hills, ~26 km from the centre of Đà Nẵng). Tapping a pill flies there.
/* global L */

import { visibleRect, distanceKm, formatKm, escapeHtml } from './map-core.js';

const MAX_HINTS = 3;
const INSET = 34;

export function createOffscreenHints(map, container, { getCandidates, onSelect }) {
  let current = [];

  function update() {
    const candidates = getCandidates();
    if (!candidates.length) { container.innerHTML = ''; current = []; return; }

    const v = visibleRect(map);
    const box = { left: v.left + INSET, top: v.top + INSET, right: v.right - INSET, bottom: v.bottom - INSET };
    if (box.right <= box.left || box.bottom <= box.top) { container.innerHTML = ''; return; }
    const cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2;
    const centre = map.containerPointToLatLng([cx, cy]);
    const mapRect = map.getContainer().getBoundingClientRect();

    const out = [];
    for (const loc of candidates) {
      const p = map.latLngToContainerPoint([loc.coordinates.lat, loc.coordinates.lon]);
      const inView = p.x >= v.left && p.x <= v.right && p.y >= v.top && p.y <= v.bottom;
      if (inView) continue;
      // Intersect the ray centre→point with the inset visible box.
      const dx = p.x - cx, dy = p.y - cy;
      const tx = dx > 0 ? (box.right - cx) / dx : dx < 0 ? (box.left - cx) / dx : Infinity;
      const ty = dy > 0 ? (box.bottom - cy) / dy : dy < 0 ? (box.top - cy) / dy : Infinity;
      const t = Math.min(tx, ty);
      out.push({
        loc,
        x: cx + dx * t + mapRect.left,
        y: cy + dy * t + mapRect.top,
        angle: Math.atan2(dy, dx) * 180 / Math.PI,
        km: distanceKm({ lat: centre.lat, lon: centre.lng }, loc.coordinates),
      });
    }
    out.sort((a, b) => a.km - b.km);
    current = out.slice(0, MAX_HINTS);

    container.innerHTML = current.map((h, i) => `
      <button type="button" class="offscreen-hint" data-i="${i}" style="left:${h.x}px;top:${h.y}px"
        aria-label="${escapeHtml(h.loc.name)}, cách ${formatKm(h.km)}">
        <svg class="offscreen-hint__arrow" viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(${h.angle}deg)"><path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4z"/></svg>
        <span class="offscreen-hint__text">${escapeHtml(h.loc.name)}</span>
        <span class="offscreen-hint__km">${formatKm(h.km)}</span>
      </button>`).join('');

    // Keep each pill fully inside the visible map area (it is centred on its anchor), and drop
    // pills that would overlap a nearer one (places in the same direction).
    const margin = 8;
    const placed = [];
    container.querySelectorAll('.offscreen-hint').forEach((el) => {
      const w = el.offsetWidth / 2, h = el.offsetHeight / 2;
      const minX = mapRect.left + v.left + margin + w, maxX = mapRect.left + v.right - margin - w;
      const minY = mapRect.top + v.top + margin + h, maxY = mapRect.top + v.bottom - margin - h;
      const x = Math.min(maxX, Math.max(minX, parseFloat(el.style.left)));
      const y = Math.min(maxY, Math.max(minY, parseFloat(el.style.top)));
      const box = [x - w - 4, y - h - 4, x + w + 4, y + h + 4];
      if (placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) {
        el.remove();
        return;
      }
      placed.push(box);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    });
  }

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.offscreen-hint');
    if (btn) onSelect(current[Number(btn.dataset.i)].loc);
  });

  map.on('moveend zoomend resize', update);
  map.on('movestart zoomstart', () => { container.innerHTML = ''; });
  window.addEventListener('resize', update);

  return { update };
}
