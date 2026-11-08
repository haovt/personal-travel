// Level 1: the Vietnam overview layer — land, islands, labels, destination pins and
// reference cities. Everything is driven by data files; nothing here is destination-specific.
/* global L */

import { pinSvg, escapeHtml } from './map-core.js';

const STYLE = {
  // No outline: like a road map, land vs. water contrast is enough, and an SVG stroke would be
  // scaled into a thick band during fly-in animations.
  vietnam:   { stroke: false, fillColor: '#f8f9fa', fillOpacity: 1 },
  neighbour: { stroke: false, fillColor: '#eceff1', fillOpacity: 1 },
};
const ISLAND_DOT = {
  pane: 'country', radius: 2.5, stroke: true, color: '#80868b', weight: 1, fillColor: '#f8f9fa', fillOpacity: 1,
  interactive: false,
};
const DESTINATION_COLOR = '#c8402f';

export function createVietnamLayer(map, data, { onSelectDestination }) {
  const group = L.layerGroup().addTo(map);

  // Land: neighbours first, Vietnam on top.
  const features = data.vietnamGeo.features;
  const land = (role) => ({
    type: 'FeatureCollection',
    features: features.filter((f) => f.properties.role === role),
  });
  L.geoJSON(land('neighbour'), { pane: 'country', style: STYLE.neighbour, interactive: false }).addTo(group);
  L.geoJSON(land('vietnam'), { pane: 'country', style: STYLE.vietnam, interactive: false }).addTo(group);

  // Island dots (Hoàng Sa, Trường Sa) stay visible at country zoom.
  const dotsByGroup = {};
  for (const f of features.filter((x) => x.properties.role === 'island-dot')) {
    const [lon, lat] = f.geometry.coordinates;
    L.circleMarker([lat, lon], ISLAND_DOT).addTo(group);
    (dotsByGroup[f.properties.group] ||= []).push([lat, lon]);
  }

  // Text labels (seas, neighbouring countries, island groups).
  for (const lab of data.mapLabels) {
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
  const pinMarkers = new Map();
  const refMarkers = new Map();
  for (const d of data.destinations) {
    const latlng = [d.coordinates.lat, d.coordinates.lon];
    if (d.status === 'published') {
      const m = L.marker(latlng, {
        title: d.name,
        alt: d.name,
        riseOnHover: true,
        keyboard: true,
        icon: L.divIcon({
          className: 'dest-pin layer-country-label',
          html: `${pinSvg(DESTINATION_COLOR, 'dest-pin__svg')}<span class="dest-pin__label">${escapeHtml(d.name)}</span>`,
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

  // Region highlight: dim everything outside the selected region.
  function setRegion(regionId) {
    for (const d of data.destinations) {
      const dim = regionId != null && d.region !== regionId;
      const els = [];
      if (pinMarkers.has(d.id)) els.push(pinMarkers.get(d.id).getElement());
      if (refMarkers.has(d.id)) els.push(...refMarkers.get(d.id).map((m) => m.getElement()));
      els.forEach((el) => el?.classList.toggle('is-dimmed', dim));
    }
  }

  function setActive(destinationId) {
    for (const [id, m] of pinMarkers) m.getElement()?.classList.toggle('is-active', id === destinationId);
  }

  // Bounds of all destinations (published + reference) in a region, for "explore by region".
  function regionPoints(regionId) {
    return data.destinations
      .filter((d) => d.region === regionId && d.status !== 'hidden')
      .map((d) => [d.coordinates.lat, d.coordinates.lon]);
  }

  return { group, setRegion, setActive, regionPoints };
}
