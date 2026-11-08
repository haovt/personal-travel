// Country overview layer — land, islands, labels, destination pins and reference cities for one
// country. Driven entirely by data (countries.json + the country GeoJSON); nothing here is
// specific to Vietnam or Switzerland.
/* global L */

import { pinSvg, escapeHtml } from './map-core.js';

// No outline: like a road map, land vs. water contrast is enough, and an SVG stroke would be
// scaled into a thick band during fly-in animations.
const LAND = { stroke: false, fillColor: '#f8f9fa', fillOpacity: 1 };
const ISLAND_DOT = {
  pane: 'country', radius: 2.5, stroke: true, color: '#80868b', weight: 1, fillColor: '#f8f9fa', fillOpacity: 1,
  interactive: false,
};
export const DESTINATION_COLOR = '#c8402f';

export function createCountryLayer(map, data, country, geo, { onSelectDestination }) {
  const group = L.layerGroup();
  const features = geo.features;

  L.geoJSON({ type: 'FeatureCollection', features: features.filter((f) => f.properties.role === 'country') },
    { pane: 'country', style: LAND, interactive: false }).addTo(group);

  // Island dots (e.g. Hoàng Sa, Trường Sa) stay visible at country zoom.
  const dotsByGroup = {};
  for (const f of features.filter((x) => x.properties.role === 'island-dot')) {
    const [lon, lat] = f.geometry.coordinates;
    L.circleMarker([lat, lon], ISLAND_DOT).addTo(group);
    (dotsByGroup[f.properties.group] ||= []).push([lat, lon]);
  }

  // Text labels (seas, island groups, …) from countries.json.
  for (const lab of country.mapLabels || []) {
    let latlng;
    if (lab.group) {
      const pts = dotsByGroup[lab.group];
      if (!pts?.length) continue;
      latlng = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
    } else {
      latlng = [lab.lat, lab.lon];
    }
    const [dx, dy] = lab.offset || [0, 0];
    L.marker(latlng, {
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: `map-label map-label--${lab.kind} layer-country-label`,
        html: `<span style="margin-left:${dx}px;margin-top:${dy}px">${escapeHtml(lab.text)}</span>`,
        iconSize: null,
      }),
    }).addTo(group);
  }

  // Destinations: published ones get a pin; reference ones a small non-clickable dot + label.
  const destinations = data.destinationsOf(country);
  const pinMarkers = new Map();
  const refMarkers = new Map();
  for (const d of destinations) {
    const latlng = [d.coordinates.lat, d.coordinates.lon];
    if (d.status === 'published') {
      const m = L.marker(latlng, {
        title: d.name,
        alt: d.name,
        riseOnHover: true,
        keyboard: true,
        icon: L.divIcon({
          className: 'dest-pin layer-country-label',
          // The body can be shifted away from the true point (see layoutPins); the leader and dot
          // then mark the real position.
          html: '<span class="dest-pin__leader"></span><span class="dest-pin__dot"></span>'
            + `<span class="dest-pin__body">${pinSvg(DESTINATION_COLOR, 'dest-pin__svg')}`
            + `<span class="dest-pin__label">${escapeHtml(d.name)}</span></span>`,
          iconSize: [44, 44],
          iconAnchor: [22, 36],
        }),
      }).addTo(group);
      m.on('click', () => onSelectDestination(d.id));
      pinMarkers.set(d.id, m);
    } else if (d.status === 'reference') {
      const dot = L.marker(latlng, {
        interactive: false, keyboard: false,
        icon: L.divIcon({ className: 'ref-dot layer-country-label', iconSize: [10, 10] }),
      }).addTo(group);
      const label = L.marker(latlng, {
        interactive: false, keyboard: false,
        icon: L.divIcon({
          className: 'map-label map-label--reference layer-country-label',
          html: `<span>${escapeHtml(d.name)}</span>`,
          iconSize: null,
        }),
      }).addTo(group);
      refMarkers.set(d.id, [dot, label]);
    }
  }

  // Nearby destinations (e.g. Đà Nẵng and Hội An, about 25 km apart) fall on almost the same
  // pixel at country zoom. Push overlapping pins apart until their tips are PIN_GAP px apart,
  // then put each name on the right, or on the left if the right side collides. Pure display:
  // the markers' coordinates never change.
  const PIN_GAP = 34;
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = '700 15px "Be Vietnam Pro", system-ui, sans-serif';
  const labelWidth = new Map(destinations.map((d) => [d.id, Math.ceil(ctx.measureText(d.name).width) + 4]));
  let activeId = null;

  function layoutPins() {
    // On a deep link the layer is shown before the map has a view; the first moveend lays out.
    if (!map.hasLayer(group) || !map._loaded) return;
    const items = [...pinMarkers].map(([id, m]) => {
      const p = map.latLngToContainerPoint(m.getLatLng());
      return { id, m, ox: p.x, oy: p.y, x: p.x, y: p.y };
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

    const size = map.getSize();
    const overlaps = (r, t) => r[0] < t[2] && r[2] > t[0] && r[1] < t[3] && r[3] > t[1];
    const taken = items.map((it) => [it.x - 14, it.y - 36, it.x + 14, it.y]);
    const hits = (r) => r[0] < 4 || r[2] > size.x - 4 || taken.some((t) => overlaps(r, t));
    const order = [...items].sort((a, b) => (b.id === activeId) - (a.id === activeId));
    for (const it of order) {
      const el = it.m.getElement();
      if (!el) continue;
      const dx = it.x - it.ox, dy = it.y - it.oy, len = Math.hypot(dx, dy);
      el.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      el.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      el.style.setProperty('--leader-len', `${len.toFixed(1)}px`);
      el.style.setProperty('--leader-angle', `${Math.atan2(dy, dx)}rad`);
      el.classList.toggle('is-offset', len > 6); // tiny nudges need no leader
      const w = labelWidth.get(it.id);
      const right = [it.x + 16, it.y - 30, it.x + 16 + w, it.y - 10];
      const left = [it.x - 16 - w, it.y - 30, it.x - 16, it.y - 10];
      const useLeft = hits(right) && !hits(left);
      taken.push(useLeft ? left : right);
      el.classList.toggle('label-left', useLeft);
    }
  }
  map.on('zoomend moveend resize', layoutPins);
  // Before the map has a view, Leaflet creates marker elements only after the first moveend,
  // so lay out again whenever pins are added (once, after the batch; a microtask rather than
  // requestAnimationFrame, which doesn't run in background tabs).
  let layoutQueued = false;
  const queueLayout = () => {
    if (layoutQueued) return;
    layoutQueued = true;
    queueMicrotask(() => { layoutQueued = false; layoutPins(); });
  };
  for (const m of pinMarkers.values()) m.on('add', queueLayout);

  let region = null;
  function applyRegion() {
    for (const d of destinations) {
      const dim = region != null && d.region !== region;
      const els = [];
      if (pinMarkers.has(d.id)) els.push(pinMarkers.get(d.id).getElement());
      if (refMarkers.has(d.id)) els.push(...refMarkers.get(d.id).map((m) => m.getElement()));
      els.forEach((el) => el?.classList.toggle('is-dimmed', dim));
    }
  }

  return {
    country,
    show() { if (!map.hasLayer(group)) group.addTo(map); applyRegion(); layoutPins(); },
    hide() { map.removeLayer(group); },
    // Region highlight: dim everything outside the selected region.
    setRegion(regionId) { region = regionId; applyRegion(); },
    setActive(destinationId) {
      activeId = destinationId;
      for (const [id, m] of pinMarkers) m.getElement()?.classList.toggle('is-active', id === destinationId);
      layoutPins();
    },
    // Points of all destinations (published + reference) in a region, for "explore by region".
    regionPoints: (regionId) => destinations
      .filter((d) => d.region === regionId)
      .map((d) => [d.coordinates.lat, d.coordinates.lon]),
  };
}
