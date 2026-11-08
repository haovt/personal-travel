// Build-time tool (not needed at runtime).
// Turns the Natural Earth 1:10m admin-0 countries file, Vietnam point-of-view variant
// (public domain, https://www.naturalearthdata.com/), into a small GeoJSON for the overview map.
//
// Usage: node tools/build-vietnam-map.mjs
// Input:  source-assets/naturalearth/ne_10m_admin_0_countries_vnm.geojson (v5.1.1)
// Output: assets/maps/vietnam.geojson
//
// - Vietnam: full geometry (mainland + all islands, incl. Hoàng Sa and Trường Sa as included
//   by the Vietnam POV file), lightly simplified. Island polygons are never dropped.
// - Neighbouring countries: clipped to a frame around Vietnam and simplified more strongly;
//   drawn as context only.
// - Island groups: one "island-dot" point per small Vietnamese island polygon in the Hoàng Sa and
//   Trường Sa areas, so the islands stay visible at country zoom.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const input = path.join(root, 'source-assets/naturalearth/ne_10m_admin_0_countries_vnm.geojson');
const output = path.join(root, 'assets/maps/vietnam.geojson');

// Owner decision 2026-11-08: show Vietnam only, no neighbouring countries. Set to true to add
// them back as context (clipped to FRAME).
const INCLUDE_NEIGHBOURS = false;
const FRAME = [96, 2, 124, 28]; // lon/lat frame kept for neighbours
const PARACEL_BOX = [111, 15.6, 113, 17.2];
const SPRATLY_BOX = [111.3, 7.3, 116.2, 11.8];
const VN_TOLERANCE = 0.006;      // degrees (~650 m)
const NEIGHBOUR_TOLERANCE = 0.03;
const DECIMALS = 4;

const src = JSON.parse(fs.readFileSync(input, 'utf8'));

const inBox = ([x, y], b) => x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3];
const round = (v) => Math.round(v * 10 ** DECIMALS) / 10 ** DECIMALS;

// Douglas–Peucker on an open polyline.
function simplifyLine(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let maxD = -1, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d;
      if (len2 === 0) d = Math.hypot(px - ax, py - ay);
      else {
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
        d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
      }
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

// Simplify a closed ring; tiny rings (islands) are kept as they are.
function simplifyRing(ring, tol) {
  if (ring.length <= 8) return ring;
  const open = ring.slice(0, -1);
  // split at the point farthest from the first one so DP has two anchors
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

// Sutherland–Hodgman clip of a ring against an axis-aligned rectangle.
function clipRing(ring, [minX, minY, maxX, maxY]) {
  const edges = [
    (p) => p[0] >= minX, (p) => p[0] <= maxX, (p) => p[1] >= minY, (p) => p[1] <= maxY,
  ];
  const cut = [
    (a, b) => { const t = (minX - a[0]) / (b[0] - a[0]); return [minX, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (maxX - a[0]) / (b[0] - a[0]); return [maxX, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (minY - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), minY]; },
    (a, b) => { const t = (maxY - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), maxY]; },
  ];
  let pts = ring.slice(0, -1);
  for (let e = 0; e < 4 && pts.length; e++) {
    const inside = edges[e];
    const res = [];
    for (let i = 0; i < pts.length; i++) {
      const cur = pts[i], prev = pts[(i + pts.length - 1) % pts.length];
      const ci = inside(cur), pi = inside(prev);
      if (ci) { if (!pi) res.push(cut[e](prev, cur)); res.push(cur); }
      else if (pi) res.push(cut[e](prev, cur));
    }
    pts = res;
  }
  if (pts.length < 3) return null;
  return pts.concat([pts[0]]);
}

const polygonsOf = (geom) => (geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates);
const roundRing = (ring) => ring.map(([x, y]) => [round(x), round(y)]);
const ringBox = (ring) => {
  const xs = ring.map((c) => c[0]), ys = ring.map((c) => c[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};
const boxOverlaps = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
const centroid = (ring) => {
  const pts = ring.slice(0, -1);
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
};

const features = [];
const islandDots = [];

for (const f of src.features) {
  const code = f.properties.ADM0_A3_VN;
  const isVN = code === 'VNM';
  if (!isVN && !INCLUDE_NEIGHBOURS) continue;
  const polys = [];
  for (const poly of polygonsOf(f.geometry)) {
    if (!isVN && !boxOverlaps(ringBox(poly[0]), FRAME)) continue;
    const rings = [];
    for (const [i, ring] of poly.entries()) {
      let r = isVN ? ring : clipRing(ring, FRAME);
      if (!r) { if (i === 0) break; else continue; }
      r = simplifyRing(r, isVN ? VN_TOLERANCE : NEIGHBOUR_TOLERANCE);
      rings.push(roundRing(r));
    }
    if (rings.length) polys.push(rings);
    if (isVN) {
      const c = centroid(poly[0]);
      if (inBox(c, PARACEL_BOX)) islandDots.push({ group: 'hoang-sa', c });
      if (inBox(c, SPRATLY_BOX)) islandDots.push({ group: 'truong-sa', c });
    }
  }
  if (!polys.length) continue;
  features.push({
    type: 'Feature',
    properties: { role: isVN ? 'vietnam' : 'neighbour', code, name_vi: f.properties.NAME_VI },
    geometry: { type: 'MultiPolygon', coordinates: polys },
  });
}

for (const d of islandDots) {
  features.push({
    type: 'Feature',
    properties: { role: 'island-dot', group: d.group, source: 'Natural Earth 10m VNM POV' },
    geometry: { type: 'Point', coordinates: d.c.map(round) },
  });
}

// Đảo Trường Sa Lớn is not in Natural Earth 1:10m. Coordinates from Wikidata Q3273381 (P625).
features.push({
  type: 'Feature',
  properties: { role: 'island-dot', group: 'truong-sa', name_vi: 'Đảo Trường Sa Lớn',
    source: 'https://www.wikidata.org/wiki/Q3273381' },
  geometry: { type: 'Point', coordinates: [111.92, 8.64472] },
});

const out = {
  type: 'FeatureCollection',
  properties: {
    source: 'Natural Earth v5.1.1, ne_10m_admin_0_countries_vnm (Vietnam point of view), public domain',
    generatedBy: 'tools/build-vietnam-map.mjs',
  },
  features,
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(out));
const vn = features.find((f) => f.properties.role === 'vietnam');
console.log('features:', features.length,
  '| vietnam polygons:', vn.geometry.coordinates.length,
  '| island dots:', islandDots.length + 1,
  '| size:', (fs.statSync(output).size / 1024).toFixed(0), 'kB');
console.log('neighbours:', features.filter((f) => f.properties.role === 'neighbour').map((f) => f.properties.code).join(', '));
