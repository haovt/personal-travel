// Creates the single Leaflet map shared by all levels, plus shared helpers.
/* global L */

export const VIETNAM_BOUNDS = [[8.4, 102.1], [23.4, 116.0]];
export const WORLD_MAX_BOUNDS = [[-60, -180], [80, 180]];
export const WORLD_BOUNDS = [[6, 2], [50, 128]];   // frames both countries
export const COUNTRY_MIN_ZOOM = 1;
export const LOCAL_ZOOM_THRESHOLD = 8; // at or above this zoom the map is "local"

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createMap(el) {
  const map = L.map(el, {
    zoomControl: false,
    attributionControl: true,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 90,
    minZoom: COUNTRY_MIN_ZOOM,
    maxZoom: 17,
    maxBounds: WORLD_MAX_BOUNDS,
    maxBoundsViscosity: 0.9,
    inertia: true,
    bounceAtZoomLimits: false,
  });

  L.control.zoom({ position: 'bottomright', zoomInTitle: 'Phóng to', zoomOutTitle: 'Thu nhỏ' }).addTo(map);
  // Short attribution: required credits (OpenStreetMap, when the local map is shown) plus a link
  // to the full credits page, which also credits Natural Earth and Leaflet.
  map.attributionControl.setPrefix('<a href="#/nguon-anh">Nguồn &amp; bản quyền</a>');

  // Panes: the country layer and a destination's local layer cross-fade (see map.css).
  map.createPane('world').style.zIndex = 290;
  map.createPane('country').style.zIndex = 300;
  map.createPane('local').style.zIndex = 320;
  map.createPane('localLabels').style.zIndex = 450;

  // Container classes for CSS:
  //   is-local  — a local map is active and the zoom is at city level
  //   z10..z16  — zoom bands, used to show labels progressively
  const updateLevelClass = () => {
    const z = map.getZoom();
    el.classList.toggle('is-local', z >= LOCAL_ZOOM_THRESHOLD && el.dataset.local === '1');
    for (let b = 10; b <= 16; b++) el.classList.toggle(`z${b}`, z >= b);
  };
  // Only on zoomend: during a flight the canvas still holds geometry simplified for the
  // starting zoom, so the local layer must not appear until the flight has landed.
  map.on('zoomend', updateLevelClass);
  map.whenReady(updateLevelClass);
  map.vvSetLocalActive = (on) => {
    el.dataset.local = on ? '1' : '0';
    updateLevelClass();
  };

  return map;
}

// Padding that keeps content clear of the floating top bar and the info sheet,
// whichever side of the screen the sheet is on (bottom on phones, left on desktop).
export function viewPadding() {
  const gap = 16;
  const w = window.innerWidth, h = window.innerHeight;
  let top = gap, left = gap, right = gap, bottom = gap;

  const topbar = document.getElementById('topbar');
  const sheet = document.getElementById('sheet');
  const tb = topbar?.getBoundingClientRect();
  const sh = sheet?.getBoundingClientRect();

  if (sh && sh.width > 0) {
    if (sh.width > w * 0.8) {
      bottom = Math.min(h - sh.top, h * 0.85) + gap; // bottom sheet (phones, any height)
      if (tb) top = tb.bottom + gap;
    } else if (sh.left < w * 0.3) {
      left = sh.right + gap;                       // left side panel (desktop)
    } else {
      right = w - sh.left + gap;                   // right side panel (phone landscape)
      if (tb) top = tb.bottom + gap;
    }
  }
  return { paddingTopLeft: [left, top], paddingBottomRight: [right, bottom] };
}

// Teardrop pin drawn as inline SVG (own artwork).
export function pinSvg(color, className = '') {
  return `<svg class="${className}" viewBox="0 0 28 36" aria-hidden="true">
    <path d="M14 0C6.27 0 0 6.2 0 13.86 0 24.26 14 36 14 36s14-11.74 14-22.14C28 6.2 21.73 0 14 0z" fill="${color}"/>
    <path d="M14 0C6.27 0 0 6.2 0 13.86 0 24.26 14 36 14 36s14-11.74 14-22.14C28 6.2 21.73 0 14 0z" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>
    <circle cx="14" cy="13.5" r="5" fill="#fff"/>
  </svg>`;
}

// Keep the view inside a destination's data area: no panning past its edges and no zooming out
// so far that the empty area beyond them shows. Recomputed when the window size changes.
export function createAreaLock(map) {
  let bounds = null;
  const apply = () => {
    if (!bounds) return;
    const z = map.getBoundsZoom(bounds, true);           // smallest zoom where the area fills the view
    const snap = map.options.zoomSnap || 1;
    map.setMinZoom(Math.ceil(z / snap) * snap);
  };
  map.on('resize', apply);
  return {
    lock(b) {
      bounds = L.latLngBounds(b);
      map.options.maxBoundsViscosity = 1;
      map.setMaxBounds(bounds);
      apply();
    },
    unlock() {
      if (!bounds) return;
      bounds = null;
      map.options.maxBoundsViscosity = 0.9;
      map.setMinZoom(COUNTRY_MIN_ZOOM);
      map.setMaxBounds(WORLD_MAX_BOUNDS);
    },
    isLocked: () => bounds != null,
  };
}

// Great-circle distance in km.
export function distanceKm(a, b) {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Vietnamese number format: "8,5 km", "26 km".
export function formatKm(km) {
  return km < 10 ? `${km.toFixed(1).replace('.', ',')} km` : `${Math.round(km)} km`;
}

// Screen rectangle not covered by the top bar / sheet, in container pixels.
export function visibleRect(map) {
  const size = map.getSize();
  const { paddingTopLeft: [l, t], paddingBottomRight: [r, b] } = viewPadding();
  return { left: l, top: t, right: size.x - r, bottom: size.y - b };
}

// Map centre that puts `latlng` in the middle of the visible rectangle at zoom `z`.
export function centerForVisible(map, latlng, z) {
  const size = map.getSize();
  const v = visibleRect(map);
  const dx = (v.left + v.right) / 2 - size.x / 2;
  const dy = (v.top + v.bottom) / 2 - size.y / 2;
  return map.unproject(map.project(latlng, z).subtract([dx, dy]), z);
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
