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
    show() { if (!map.hasLayer(group)) group.addTo(map); applyRegion(); },
    hide() { map.removeLayer(group); },
    // Region highlight: dim everything outside the selected region.
    setRegion(regionId) { region = regionId; applyRegion(); },
    setActive(destinationId) {
      for (const [id, m] of pinMarkers) m.getElement()?.classList.toggle('is-active', id === destinationId);
    },
    // Points of all destinations (published + reference) in a region, for "explore by region".
    regionPoints: (regionId) => destinations
      .filter((d) => d.region === regionId)
      .map((d) => [d.coordinates.lat, d.coordinates.lon]),
  };
}
