// Level 2: a destination's local map — OSM-derived land, water, green areas, roads and labels
// (drawn on canvas for speed), plus one category pin per location. Generic: everything comes
// from the destination's data and its GeoJSON file.
/* global L */

import { pinSvg, escapeHtml } from './map-core.js';

const COLORS = {
  land: '#f8f9fa', water: '#aadaff', green: '#c8e6c9', reserve: '#dcefd5', airport: '#e8eaed',
};

// Road look by class: fill / casing colours, base width at zoom 13, min zoom to draw.
const ROADS = {
  minor:     { fill: '#ffffff', casing: '#e1e3e6', w: 1.1, min: 13.5 },
  tertiary:  { fill: '#ffffff', casing: '#d5d8dc', w: 1.8, min: 11.5 },
  secondary: { fill: '#ffffff', casing: '#cdd1d6', w: 2.3, min: 10 },
  link:      { fill: '#fde293', casing: '#e9bc62', w: 1.8, min: 12 },
  primary:   { fill: '#fff4c2', casing: '#e6c46c', w: 2.8, min: 9 },
  trunk:     { fill: '#fde293', casing: '#e5b55a', w: 3.2, min: 8 },
  motorway:  { fill: '#fbc85a', casing: '#de982f', w: 3.6, min: 8 },
};
const ROAD_ORDER = ['minor', 'tertiary', 'secondary', 'link', 'primary', 'trunk', 'motorway'];
const widthScale = (z) => Math.min(4, Math.max(0.35, Math.pow(1.5, z - 13)));

// Zoom from which each label kind appears.
const LABEL_MIN_ZOOM = { sea: 10, water: 12, area: 12, peak: 11 };

export function createLocalLayer(map, data, dest, geo, { onSelectLocation }) {
  const renderer = L.canvas({ pane: 'local', padding: 0.4 });
  const base = L.layerGroup();
  const labels = L.layerGroup();
  const markers = L.layerGroup();

  const fc = (pred) => ({ type: 'FeatureCollection', features: geo.features.filter(pred) });
  const area = (k) => L.geoJSON(fc((f) => f.properties.k === k), {
    renderer, interactive: false,
    style: { stroke: false, fillColor: COLORS[k], fillOpacity: 1 },
  }).addTo(base);

  area('land');
  area('reserve');
  area('green');
  area('airport');
  const rivers = L.geoJSON(fc((f) => f.properties.k === 'river'), {
    renderer, interactive: false, style: { color: COLORS.water, weight: 2, lineCap: 'round', lineJoin: 'round' },
  }).addTo(base);
  area('water');

  const roadFeatures = geo.features
    .filter((f) => f.properties.k === 'road')
    .sort((a, b) => ROAD_ORDER.indexOf(a.properties.c) - ROAD_ORDER.indexOf(b.properties.c));
  const roadCasing = L.geoJSON({ type: 'FeatureCollection', features: roadFeatures }, {
    renderer, interactive: false, style: { lineCap: 'round', lineJoin: 'round' },
  }).addTo(base);
  const roadFill = L.geoJSON({ type: 'FeatureCollection', features: roadFeatures }, {
    renderer, interactive: false, style: { lineCap: 'round', lineJoin: 'round' },
  }).addTo(base);

  function restyle() {
    const z = map.getZoom();
    const s = widthScale(z);
    roadCasing.setStyle((f) => {
      const r = ROADS[f.properties.c];
      const on = z >= r.min;
      return { color: r.casing, weight: on ? r.w * s + 1.5 : 0, opacity: on ? 1 : 0 };
    });
    roadFill.setStyle((f) => {
      const r = ROADS[f.properties.c];
      const on = z >= r.min;
      return { color: r.fill, weight: on ? r.w * s : 0, opacity: on ? 1 : 0 };
    });
    rivers.setStyle({ weight: Math.max(1, 2.2 * s) });
  }
  restyle();
  map.on('zoomend', restyle);

  // Labels from the OSM extract and from the destination data.
  const addLabel = (text, kind, latlng, minZoom) => {
    L.marker(latlng, {
      pane: 'localLabels', interactive: false, keyboard: false,
      icon: L.divIcon({
        className: `map-label local-label local-label--${kind}`,
        html: `<span data-minz="${minZoom ?? LABEL_MIN_ZOOM[kind] ?? 12}">${kind === 'peak' ? '▲ ' : ''}${escapeHtml(text)}</span>`,
        iconSize: null,
      }),
    }).addTo(labels);
  };
  for (const f of geo.features.filter((x) => x.properties.k === 'label')) {
    const [lon, lat] = f.geometry.coordinates;
    // Small hills (e.g. the five peaks of Ngũ Hành Sơn) only appear when zoomed in close.
    const smallPeak = f.properties.lk === 'peak' && !(Number(f.properties.ele) >= 300);
    addLabel(f.properties.t, f.properties.lk, [lat, lon], smallPeak ? 14 : undefined);
  }
  for (const l of dest.mapLabels || []) addLabel(l.text, l.kind, [l.lat, l.lon]);

  // Location pins.
  const locations = data.locationsFor(dest);
  const pins = new Map();
  for (const loc of locations) {
    const cat = data.categoryById(loc.category);
    const m = L.marker([loc.coordinates.lat, loc.coordinates.lon], {
      title: loc.name,
      alt: loc.name,
      keyboard: true,
      riseOnHover: true,
      icon: L.divIcon({
        className: 'loc-pin',
        // The body can be shifted off the true point when pins overlap (see spreadPins); the
        // leader and dot then mark the real position.
        html: '<span class="loc-pin__leader"></span><span class="loc-pin__dot"></span>'
          + `<span class="loc-pin__body">${pinSvg(cat?.color ?? '#5f6368', 'loc-pin__svg')}`
          + `<span class="loc-pin__label">${escapeHtml(loc.name)}</span></span>`,
        iconSize: [40, 40],
        iconAnchor: [20, 34],
      }),
    }).addTo(markers);
    m.on('click', () => onSelectLocation(loc.id));
    pins.set(loc.id, m);
  }

  let filter = null;
  let activeId = null;
  const matches = (loc, cat) => cat == null || loc.category === cat || loc.tags?.includes(cat);

  // Label widths, measured once with the label font.
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = '600 13px "Be Vietnam Pro", system-ui, sans-serif';
  const labelWidth = new Map(locations.map((l) => [l.id, Math.ceil(ctx.measureText(l.name).width) + 6]));

  // Places that share (almost) one point, e.g. two dishes at the same market, would hide each
  // other: push their pins apart on screen until the tips are PIN_GAP px apart. Display only.
  const PIN_GAP = 26;
  function spreadPins(visible) {
    const items = visible.map((l) => {
      const p = map.latLngToContainerPoint([l.coordinates.lat, l.coordinates.lon]);
      return { id: l.id, ox: p.x, oy: p.y, x: p.x, y: p.y };
    });
    for (let iter = 0; iter < 20; iter++) {
      let moved = false;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i], b = items[j];
          let dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy);
          if (dist >= PIN_GAP - 0.5) continue;
          if (dist < 0.01) { dx = 1; dy = 0; dist = 1; }
          const push = (PIN_GAP - dist) / 2;
          a.x -= (dx / dist) * push; a.y -= (dy / dist) * push;
          b.x += (dx / dist) * push; b.y += (dy / dist) * push;
          moved = true;
        }
      }
      if (!moved) break;
    }
    const pos = new Map();
    for (const it of items) {
      pos.set(it.id, L.point(it.x, it.y));
      const el = pins.get(it.id).getElement();
      if (!el) continue;
      const dx = it.x - it.ox, dy = it.y - it.oy, len = Math.hypot(dx, dy);
      el.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      el.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      el.style.setProperty('--leader-len', `${len.toFixed(1)}px`);
      el.style.setProperty('--leader-angle', `${Math.atan2(dy, dx)}rad`);
      el.classList.toggle('is-offset', len > 6); // tiny nudges need no leader
    }
    return pos;
  }

  // Show a pin's name only where it does not collide with other names or pins
  // (right side first, then left). The active pin gets priority.
  const LABEL_MIN_Z = 12;
  function layoutLabels() {
    if (!map.hasLayer(markers) || !map._loaded) return;
    const z = map.getZoom();
    const visible = locations.filter((l) => matches(l, filter));
    const pos = spreadPins(visible);
    const pt = (l) => pos.get(l.id);
    const pinBoxes = new Map(visible.map((l) => { const p = pt(l); return [l.id, [p.x - 11, p.y - 28, p.x + 11, p.y]]; }));
    const taken = [];
    const size = map.getSize();
    const offScreen = (b) => b[0] < 4 || b[2] > size.x - 4;
    const hits = (b, selfId) => offScreen(b) ||
      taken.some((t) => b[0] < t[2] && b[2] > t[0] && b[1] < t[3] && b[3] > t[1]) ||
      [...pinBoxes].some(([id, t]) => id !== selfId && b[0] < t[2] && b[2] > t[0] && b[1] < t[3] && b[3] > t[1]);
    const order = [...visible].sort((a, b) => (b.id === activeId) - (a.id === activeId));
    for (const l of locations) {
      const el = pins.get(l.id).getElement();
      el?.classList.remove('show-label', 'label-left');
    }
    for (const l of order) {
      const el = pins.get(l.id).getElement();
      if (!el) continue;
      if (z < LABEL_MIN_Z && l.id !== activeId) continue;
      const p = pt(l), w = labelWidth.get(l.id);
      const right = [p.x + 12, p.y - 27, p.x + 12 + w, p.y - 9];
      const left = [p.x - 12 - w, p.y - 27, p.x - 12, p.y - 9];
      if (!hits(right, l.id)) { taken.push(right); el.classList.add('show-label'); }
      else if (!hits(left, l.id)) { taken.push(left); el.classList.add('show-label', 'label-left'); }
      else if (l.id === activeId) {
        const useLeft = offScreen(right) && !offScreen(left);
        taken.push(useLeft ? left : right);
        el.classList.add('show-label');
        if (useLeft) el.classList.add('label-left');
      }
    }
  }
  map.on('moveend', layoutLabels);
  // On a deep link, Leaflet creates the pin elements only after the first moveend: lay out again
  // once they are added (a microtask, since requestAnimationFrame doesn't run in background tabs).
  let layoutQueued = false;
  const queueLayout = () => {
    if (layoutQueued) return;
    layoutQueued = true;
    queueMicrotask(() => { layoutQueued = false; layoutLabels(); });
  };
  for (const m of pins.values()) m.on('add', queueLayout);

  function applyClasses() {
    for (const loc of locations) {
      const el = pins.get(loc.id).getElement();
      if (!el) continue;
      el.classList.toggle('is-filtered', !matches(loc, filter));
      el.classList.toggle('is-active', loc.id === activeId);
    }
    layoutLabels();
  }

  return {
    locations,
    show() {
      base.addTo(map);
      labels.addTo(map);
      markers.addTo(map);
      restyle();
      applyClasses();
    },
    hide() {
      map.removeLayer(base);
      map.removeLayer(labels);
      map.removeLayer(markers);
    },
    setFilter(cat) { filter = cat; applyClasses(); },
    getFilter: () => filter,
    setActive(id) {
      activeId = id;
      for (const [lid, m] of pins) m.setZIndexOffset(lid === id ? 1000 : 0);
      applyClasses();
    },
    visibleLocations: () => locations.filter((l) => matches(l, filter)),
    matches: (loc) => matches(loc, filter),
  };
}
