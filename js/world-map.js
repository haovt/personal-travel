// World layer (first level): faint world land with one pin per country that has content.
/* global L */

import { pinSvg, escapeHtml } from './map-core.js';
import { DESTINATION_COLOR } from './country-map.js';

const WORLD_LAND = { stroke: false, fillColor: '#eceff1', fillOpacity: 1 };
const COUNTRY_LAND = { stroke: false, fillColor: '#f8f9fa', fillOpacity: 1 };

export function createWorldLayer(map, data, geo, { onSelectCountry }) {
  const group = L.layerGroup();
  const codes = new Set(data.countries.map((c) => c.adm0).filter(Boolean));
  L.geoJSON(geo, {
    pane: 'world', interactive: false,
    style: (f) => (codes.has(f.properties.code) ? COUNTRY_LAND : WORLD_LAND),
  }).addTo(group);

  for (const c of data.countries) {
    const m = L.marker([c.coordinates.lat, c.coordinates.lon], {
      title: c.name, alt: c.name, keyboard: true, riseOnHover: true,
      icon: L.divIcon({
        className: 'dest-pin world-pin',
        html: `${pinSvg(DESTINATION_COLOR, 'dest-pin__svg')}<span class="dest-pin__label">${escapeHtml(c.name)}</span>`,
        iconSize: [44, 44],
        iconAnchor: [22, 36],
      }),
    }).addTo(group);
    m.on('click', () => onSelectCountry(c.id));
  }
  return {
    show() { if (!map.hasLayer(group)) group.addTo(map); },
    hide() { map.removeLayer(group); },
  };
}
