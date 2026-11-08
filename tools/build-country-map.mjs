// Build-time tool (not needed at runtime).
// Turns the Natural Earth 1:10m admin-0 countries file, Vietnam point-of-view variant
// (public domain, https://www.naturalearthdata.com/), into small GeoJSON files:
//
//   node tools/build-country-map.mjs <country-id>   -> assets/maps/country-<country-id>.geojson
//   node tools/build-country-map.mjs world          -> assets/maps/world.geojson
//
// Input: source-assets/naturalearth/ne_10m_admin_0_countries_vnm.geojson (v5.1.1), downloaded
// from https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.1/geojson/
//
// Country maps contain only that country (owner decision: no neighbouring countries).
// The Vietnam point-of-view file draws Hoàng Sa and Trường Sa inside Vietnam's polygon; each small
// island there also becomes an "island-dot" point so it stays visible at country zoom.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COUNTRIES = {
  'viet-nam': {
    adm0: 'VNM',
    tolerance: 0.006,
    islandGroups: {
      'hoang-sa': [111, 15.6, 113, 17.2],
      'truong-sa': [111.3, 7.3, 116.2, 11.8],
    },
    // Đảo Trường Sa Lớn is not in Natural Earth 1:10m. Coordinates: Wikidata Q3273381 (P625).
    extraIslandDots: [
      { group: 'truong-sa', name_vi: 'Đảo Trường Sa Lớn', lon: 111.92, lat: 8.64472, source: 'https://www.wikidata.org/wiki/Q3273381' },
    ],
  },
  'thuy-si': { adm0: 'CHE', tolerance: 0.003 },
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'source-assets/naturalearth/ne_10m_admin_0_countries_vnm.geojson');
const id = process.argv[2];
if (id !== 'world' && !COUNTRIES[id]) {
  console.error(`Usage: node tools/build-country-map.mjs <${Object.keys(COUNTRIES).join('|')}|world>`);
  process.exit(1);
}
const src = JSON.parse(fs.readFileSync(input, 'utf8'));

const inBox = ([x, y], b) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3];
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
const polygonsOf = (geom) => (geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates);
const centroid = (ring) => {
  const pts = ring.slice(0, -1);
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
};
const ringBox = (ring) => {
  const xs = ring.map((c) => c[0]), ys = ring.map((c) => c[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

// Douglas–Peucker
function simplifyLine(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    let maxD = -1, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0;
      const d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function simplifyRing(ring, tol) {
  if (ring.length <= 8) return ring;
  const open = ring.slice(0, -1);
  let far = 0, fd = -1;
  for (let i = 1; i < open.length; i++) {
    const d = Math.hypot(open[i][0] - open[0][0], open[i][1] - open[0][1]);
    if (d > fd) { fd = d; far = i; }
  }
  const a = simplifyLine(open.slice(0, far + 1), tol);
  const b = simplifyLine(open.slice(far).concat([open[0]]), tol);
  const out = a.concat(b.slice(1));
  return out.length >= 4 ? out : ring;
}

function write(file, fc) {
  const out = path.join(root, 'assets/maps', file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(fc));
  console.log(`${file}: ${fc.features.length} features, ${(fs.statSync(out).size / 1024).toFixed(0)} kB`);
}

const SOURCE = 'Natural Earth v5.1.1, ne_10m_admin_0_countries_vnm (Vietnam point of view), public domain';

if (id === 'world') {
  // Faint world land for the first level. Strongly simplified; tiny islands and Antarctica dropped.
  const features = [];
  for (const f of src.features) {
    const code = f.properties.ADM0_A3_VN;
    if (code === 'ATA') continue;
    const polys = [];
    for (const poly of polygonsOf(f.geometry)) {
      const b = ringBox(poly[0]);
      if ((b[2] - b[0]) * (b[3] - b[1]) < 0.5) continue;
      const r = simplifyRing(poly[0], 0.25).map(([x, y]) => [round(x, 1), round(y, 1)]);
      if (r.length >= 4) polys.push([r]);
    }
    if (polys.length) features.push({ type: 'Feature', properties: { code }, geometry: { type: 'MultiPolygon', coordinates: polys } });
  }
  write('world.geojson', { type: 'FeatureCollection', properties: { source: SOURCE, generatedBy: 'tools/build-country-map.mjs' }, features });
} else {
  const cfg = COUNTRIES[id];
  const f = src.features.find((x) => x.properties.ADM0_A3_VN === cfg.adm0);
  const features = [];
  const polys = [];
  const dots = [];
  for (const poly of polygonsOf(f.geometry)) {
    polys.push(poly.map((ring) => simplifyRing(ring, cfg.tolerance).map(([x, y]) => [round(x, 4), round(y, 4)])));
    for (const [group, box] of Object.entries(cfg.islandGroups || {})) {
      const c = centroid(poly[0]);
      if (inBox(c, box)) dots.push({ group, c });
    }
  }
  features.push({ type: 'Feature', properties: { role: 'country', code: cfg.adm0, name_vi: f.properties.NAME_VI }, geometry: { type: 'MultiPolygon', coordinates: polys } });
  for (const d of dots) {
    features.push({ type: 'Feature', properties: { role: 'island-dot', group: d.group, source: 'Natural Earth 10m VNM POV' }, geometry: { type: 'Point', coordinates: d.c.map((v) => round(v, 4)) } });
  }
  for (const e of cfg.extraIslandDots || []) {
    features.push({ type: 'Feature', properties: { role: 'island-dot', group: e.group, name_vi: e.name_vi, source: e.source }, geometry: { type: 'Point', coordinates: [e.lon, e.lat] } });
  }
  write(`country-${id}.geojson`, { type: 'FeatureCollection', properties: { source: SOURCE, generatedBy: 'tools/build-country-map.mjs' }, features });
}
