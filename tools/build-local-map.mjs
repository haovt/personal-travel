// Build-time tool (not needed at runtime).
// Converts a one-time OpenStreetMap Overpass extract into a compact GeoJSON for a destination's
// local map, styled at runtime like a flat road map.
//
// Usage:
//   node tools/build-local-map.mjs <destination-id> fetch   # one Overpass download -> source-assets/osm/<id>-raw.json
//   node tools/build-local-map.mjs <destination-id> build   # -> assets/maps/<id>.geojson
//
// Settings: data/destinations/<id>/map-config.json
//   bbox        [minLon, minLat, maxLon, maxLat]  area of the local map (= destination "bounds")
//   coreBbox    [minLon, minLat, maxLon, maxLat]  optional: also include residential streets here
//   riverLabels ["Sông …", …]                     optional: named rivers/lakes to label
//   islandLabels ["Hòn …", …]                     optional: named islands/islets to label (OSM name;
//                                                 node, closed coastline way or multipolygon)
//
// Data © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright).
// The output is a derived database and stays under ODbL. Download once per destination; do not
// re-fetch repeatedly (Overpass is a shared free service).
//
// Feature property "k" (kind): land | water | river | green | reserve | airport | road | label
//   road:  "c" = class (motorway, trunk, primary, secondary, tertiary, link, minor)
//   label: "t" = text, "lk" = label kind (area, water, peak)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, mode = 'build'] = process.argv.slice(2);
const configPath = path.join(root, `data/destinations/${id}/map-config.json`);
if (!id || !fs.existsSync(configPath) || !['fetch', 'build'].includes(mode)) {
  console.error('Usage: node tools/build-local-map.mjs <destination-id> fetch|build  (needs data/destinations/<id>/map-config.json)');
  process.exit(1);
}
const { bbox, coreBbox, riverLabels = [], islandLabels = [] } = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const rawPath = path.join(root, `source-assets/osm/${id}-raw.json`);
const output = path.join(root, `assets/maps/${id}.geojson`);

if (mode === 'fetch') {
  const b = (x) => `${x[1]},${x[0]},${x[3]},${x[2]}`; // Overpass wants south,west,north,east
  const query = `[out:json][timeout:180][bbox:${b(bbox)}];
(
  way["natural"="coastline"];
  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|motorway_link|trunk_link|primary_link|secondary_link)$"];
  way["natural"="water"]; relation["natural"="water"];
  way["waterway"="riverbank"]; way["waterway"="river"];
  way["leisure"="park"]; way["landuse"="forest"]; relation["landuse"="forest"];
  way["natural"="wood"]; relation["natural"="wood"]; relation["boundary"="protected_area"];
  way["aeroway"="aerodrome"]; relation["aeroway"="aerodrome"];
  node["place"~"^(suburb|quarter|island|islet)$"]; node["natural"="peak"]["name"];
  ${coreBbox ? `way["highway"~"^(residential|unclassified|living_street)$"](${b(coreBbox)});` : ''}
);
out geom;`;
  fs.mkdirSync(path.dirname(rawPath), { recursive: true });
  fs.writeFileSync(rawPath.replace(/-raw\.json$/, '-query.overpassql'), query);
  console.log('Querying Overpass (this can take a minute)…');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'User-Agent': 'LocalLiveTravel/0.1 (personal non-commercial project)', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });
  if (!res.ok) { console.error('Overpass error', res.status, (await res.text()).slice(0, 300)); process.exit(1); }
  fs.writeFileSync(rawPath, await res.text());
  console.log(`saved ${path.relative(root, rawPath)} (${(fs.statSync(rawPath).size / 1e6).toFixed(1)} MB)`);
  process.exit(0);
}

const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const [minX, minY, maxX, maxY] = bbox;
const W = maxX - minX, H = maxY - minY;
const DEC = 5;
const r5 = (v) => Math.round(v * 10 ** DEC) / 10 ** DEC;

// ---------- geometry helpers ----------

const coordsOf = (way) => way.geometry.map((p) => [p.lon, p.lat]);
const same = (a, b) => a[0] === b[0] && a[1] === b[1];
const inside = ([x, y]) => x >= minX && x <= maxX && y >= minY && y <= maxY;

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
  if (ring.length <= 6) return ring;
  const open = ring.slice(0, -1);
  const half = Math.floor(open.length / 2);
  const a = simplifyLine(open.slice(0, half + 1), tol);
  const b = simplifyLine(open.slice(half).concat([open[0]]), tol);
  const out = a.concat(b.slice(1));
  return out.length >= 4 ? out : null;
}

// Sutherland–Hodgman clip of a closed ring against the bbox.
function clipRing(ring) {
  const tests = [(p) => p[0] >= minX, (p) => p[0] <= maxX, (p) => p[1] >= minY, (p) => p[1] <= maxY];
  const cut = [
    (a, b) => [minX, a[1] + ((minX - a[0]) / (b[0] - a[0])) * (b[1] - a[1])],
    (a, b) => [maxX, a[1] + ((maxX - a[0]) / (b[0] - a[0])) * (b[1] - a[1])],
    (a, b) => [a[0] + ((minY - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), minY],
    (a, b) => [a[0] + ((maxY - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), maxY],
  ];
  let pts = ring.slice(0, -1);
  for (let e = 0; e < 4 && pts.length; e++) {
    const res = [];
    for (let i = 0; i < pts.length; i++) {
      const cur = pts[i], prev = pts[(i + pts.length - 1) % pts.length];
      const ci = tests[e](cur), pi = tests[e](prev);
      if (ci) { if (!pi) res.push(cut[e](prev, cur)); res.push(cur); } else if (pi) res.push(cut[e](prev, cur));
    }
    pts = res;
  }
  return pts.length >= 3 ? pts.concat([pts[0]]) : null;
}

// Liang–Barsky clip of one segment; returns [p, q] inside the bbox or null.
function clipSegment(p, q) {
  let t0 = 0, t1 = 1;
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const checks = [[-dx, p[0] - minX], [dx, maxX - p[0]], [-dy, p[1] - minY], [dy, maxY - p[1]]];
  for (const [pp, qq] of checks) {
    if (pp === 0) { if (qq < 0) return null; continue; }
    const t = qq / pp;
    if (pp < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
  }
  return [[p[0] + t0 * dx, p[1] + t0 * dy], [p[0] + t1 * dx, p[1] + t1 * dy]];
}

// Clip a polyline into the pieces that lie inside the bbox.
function clipLine(pts) {
  const pieces = [];
  let cur = null;
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = clipSegment(pts[i], pts[i + 1]);
    if (!seg) { if (cur) { pieces.push(cur); cur = null; } continue; }
    if (cur && same(cur[cur.length - 1], seg[0])) cur.push(seg[1]);
    else { if (cur) pieces.push(cur); cur = [seg[0], seg[1]]; }
    if (!same(seg[1], pts[i + 1])) { pieces.push(cur); cur = null; } // left the box
  }
  if (cur) pieces.push(cur);
  return pieces.filter((p) => p.length >= 2);
}

// Join open polylines that share endpoints into longer chains / rings.
function joinLines(lines) {
  const chains = lines.map((l) => l.slice());
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < chains.length; i++) {
      const a = chains[i];
      if (same(a[0], a[a.length - 1]) && a.length > 3) continue;
      for (let j = 0; j < chains.length; j++) {
        if (i === j) continue;
        const b = chains[j];
        if (same(a[a.length - 1], b[0])) { chains[i] = a.concat(b.slice(1)); }
        else if (same(b[b.length - 1], a[0])) { chains[i] = b.concat(a.slice(1)); }
        else continue;
        chains.splice(j, 1);
        merged = true;
        break outer;
      }
    }
  }
  return chains;
}

// Join without caring about direction (for multipolygon members).
function joinRings(lines) {
  const chains = lines.map((l) => l.slice());
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < chains.length; i++) {
      const a = chains[i];
      if (same(a[0], a[a.length - 1]) && a.length > 3) continue;
      for (let j = 0; j < chains.length; j++) {
        if (i === j) continue;
        let b = chains[j];
        const aEnd = a[a.length - 1];
        if (same(aEnd, b[b.length - 1])) b = b.slice().reverse();
        if (same(aEnd, b[0])) chains[i] = a.concat(b.slice(1));
        else if (same(a[0], b[b.length - 1])) chains[i] = b.concat(a.slice(1));
        else if (same(a[0], b[0])) chains[i] = b.slice().reverse().concat(a.slice(1));
        else continue;
        chains.splice(j, 1);
        merged = true;
        break outer;
      }
    }
  }
  return chains.filter((c) => c.length > 3 && same(c[0], c[c.length - 1]));
}

// Position along the bbox perimeter, counter-clockwise from the bottom-left corner (0..4).
function perimeterT([x, y]) {
  const eps = 1e-9;
  if (Math.abs(y - minY) < eps) return (x - minX) / W;
  if (Math.abs(x - maxX) < eps) return 1 + (y - minY) / H;
  if (Math.abs(y - maxY) < eps) return 2 + (maxX - x) / W;
  return 3 + (maxY - y) / H;
}
const CORNERS = [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]]; // at t = 0, 1, 2, 3

// Coastline → land polygons. OSM coastlines have land on the left, so land rings run
// counter-clockwise; from each exit point we follow the bbox edge counter-clockwise to the
// next entry point.
function buildLand(coastWays) {
  const chains = joinLines(coastWays.map(coordsOf));
  const rings = [];
  const pieces = [];
  for (const c of chains) {
    if (same(c[0], c[c.length - 1])) {
      const r = clipRing(c);
      if (r) rings.push(r);
    } else {
      for (const p of clipLine(c)) {
        if (!inside(p[0]) || !inside(p[p.length - 1])) continue;
        pieces.push({ pts: p, tIn: perimeterT(p[0]), tOut: perimeterT(p[p.length - 1]), used: false });
      }
    }
  }
  const ccwDist = (from, to) => ((to - from) % 4 + 4) % 4;
  if (process.env.DEBUG) {
    for (const p of pieces) console.log('coast piece', p.pts.length, 'pts, in t=', p.tIn.toFixed(3), 'out t=', p.tOut.toFixed(3));
  }
  for (const start of pieces) {
    if (start.used) continue;
    const ring = [];
    let cur = start;
    for (let guard = 0; guard < 1000; guard++) {
      cur.used = true;
      ring.push(...cur.pts);
      // find the next entry counter-clockwise from this exit
      let best = null, bestD = Infinity;
      for (const p of pieces) {
        const d = ccwDist(cur.tOut, p.tIn);
        if (d > 1e-12 && d < bestD) { bestD = d; best = p; }
      }
      if (!best) break;
      // add the bbox corners passed on the way (corner k sits at perimeter t = k)
      for (let t = Math.floor(cur.tOut) + 1; t - cur.tOut < bestD; t++) ring.push(CORNERS[t % 4]);
      if (best === start) break;
      cur = best;
    }
    ring.push(ring[0]);
    rings.push(ring);
  }
  return rings;
}

// ---------- read elements ----------

const els = raw.elements;
const tag = (e, k) => e.tags && e.tags[k];
const features = [];
const push = (props, geometry) => features.push({ type: 'Feature', properties: props, geometry });

const roundRing = (ring) => ring.map(([x, y]) => [r5(x), r5(y)]);

// Ray-casting point-in-polygon test (ring = closed list of [x, y]).
function pointInRing(ring, [x, y]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function addPolygon(kind, outerRings, innerRings = [], tol = 0.00005) {
  for (const o of outerRings) {
    let ring = same(o[0], o[o.length - 1]) ? o : null;
    if (!ring) continue;
    // A multipolygon can have several outer rings: each hole belongs only to the outer ring that
    // contains it (otherwise a small outer ring would be drawn with every island as a hole).
    const ownHoles = innerRings.filter((h) => pointInRing(o, h[0]) || pointInRing(o, h[Math.floor(h.length / 2)]));
    ring = clipRing(ring);
    if (!ring) continue;
    ring = simplifyRing(ring, tol);
    if (!ring) continue;
    const holes = ownHoles
      .map((h) => clipRing(h))
      .filter(Boolean)
      .map((h) => simplifyRing(h, tol))
      .filter(Boolean)
      .map(roundRing);
    push({ k: kind }, { type: 'Polygon', coordinates: [roundRing(ring), ...holes] });
  }
}

function polygonsFromElement(e) {
  if (e.type === 'way') {
    const c = coordsOf(e);
    return same(c[0], c[c.length - 1]) ? { outer: [c], inner: [] } : null;
  }
  if (e.type === 'relation') {
    const ways = (role) => e.members.filter((m) => m.type === 'way' && m.role === role && m.geometry)
      .map((m) => m.geometry.map((p) => [p.lon, p.lat]));
    return { outer: joinRings(ways('outer')), inner: joinRings(ways('inner')) };
  }
  return null;
}

// Land
const coastWays = els.filter((e) => e.type === 'way' && tag(e, 'natural') === 'coastline');
const land = buildLand(coastWays);
// Inland destination (no sea coast crosses the area): the whole area is land; lakes and rivers
// are drawn on top as water.
if (!coastWays.some((w) => coordsOf(w).some(inside))) {
  land.length = 0;
  land.push([[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY], [minX, minY]]);
  console.log('no coastline in area: using the whole area as land');
}
for (const ring of land) {
  const s = simplifyRing(ring, 0.00004);
  if (s) push({ k: 'land' }, { type: 'Polygon', coordinates: [roundRing(s)] });
}

// Areas (drawn in this order at runtime)
for (const e of els) {
  const t = e.tags || {};
  let kind = null;
  // Maritime protected areas (e.g. the UNESCO zone over Hạ Long Bay) cover open sea: drawing them
  // as a green reserve would make the water look like land.
  if (t.boundary === 'protected_area' || t.leisure === 'nature_reserve') kind = t.maritime === 'yes' ? null : 'reserve';
  else if (t.landuse === 'forest' || t.natural === 'wood') kind = 'green';
  else if (t.leisure === 'park') kind = 'green';
  else if (t.aeroway === 'aerodrome') kind = 'airport';
  else if (t.natural === 'water' || t.waterway === 'riverbank') kind = 'water';
  if (!kind) continue;
  const p = polygonsFromElement(e);
  if (p) addPolygon(kind, p.outer, p.inner, kind === 'water' ? 0.00003 : 0.00008);
}

// Rivers (centre lines, drawn under water polygons)
for (const e of els.filter((x) => x.type === 'way' && tag(x, 'waterway') === 'river')) {
  for (const piece of clipLine(coordsOf(e))) {
    const s = simplifyLine(piece, 0.00005);
    push({ k: 'river' }, { type: 'LineString', coordinates: s.map(([x, y]) => [r5(x), r5(y)]) });
  }
}

// Roads
const ROAD_CLASS = {
  motorway: 'motorway', trunk: 'trunk', primary: 'primary', secondary: 'secondary', tertiary: 'tertiary',
  motorway_link: 'link', trunk_link: 'link', primary_link: 'link', secondary_link: 'link',
  residential: 'minor', unclassified: 'minor', living_street: 'minor',
};
let roadCount = 0;
for (const e of els.filter((x) => x.type === 'way' && tag(x, 'highway'))) {
  const c = ROAD_CLASS[e.tags.highway];
  if (!c) continue;
  for (const piece of clipLine(coordsOf(e))) {
    const s = simplifyLine(piece, c === 'minor' ? 0.00004 : 0.00003);
    push({ k: 'road', c }, { type: 'LineString', coordinates: s.map(([x, y]) => [r5(x), r5(y)]) });
    roadCount++;
  }
}

// Labels
const point = (x, y) => ({ type: 'Point', coordinates: [r5(x), r5(y)] });
for (const e of els.filter((x) => x.type === 'node' && x.tags && x.tags.name && inside([x.lon, x.lat]))) {
  const t = e.tags;
  if (t.place === 'suburb') push({ k: 'label', lk: 'area', t: t.name }, point(e.lon, e.lat));
  else if (t.natural === 'peak') push({ k: 'label', lk: 'peak', t: t.name, ...(t.ele ? { ele: t.ele } : {}) }, point(e.lon, e.lat));
}
// River labels: midpoint of the longest named piece of each listed river.
for (const name of riverLabels) {
  let best = null, bestLen = 0;
  for (const e of els.filter((x) => x.type === 'way' && x.tags && x.tags.name === name && (x.tags.waterway === 'river' || x.tags.natural === 'water'))) {
    for (const piece of clipLine(coordsOf(e))) {
      let len = 0;
      for (let i = 1; i < piece.length; i++) len += Math.hypot(piece[i][0] - piece[i - 1][0], piece[i][1] - piece[i - 1][1]);
      if (len > bestLen) { bestLen = len; best = piece; }
    }
  }
  if (best) {
    const m = best[Math.floor(best.length / 2)];
    push({ k: 'label', lk: 'water', t: name }, point(m[0], m[1]));
  }
}

// Island labels: the listed names, at the island's node, or at the centroid of its outline.
function ringCentroid(ring) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    a += f; cx += (ring[j][0] + ring[i][0]) * f; cy += (ring[j][1] + ring[i][1]) * f;
  }
  return a ? [cx / (3 * a), cy / (3 * a)] : ring[0];
}
const ringArea = (ring) => Math.abs(ring.reduce((s, p, i) => {
  const q = ring[(i + 1) % ring.length];
  return s + p[0] * q[1] - q[0] * p[1];
}, 0)) / 2;
for (const name of islandLabels) {
  const cands = els.filter((x) => x.tags && x.tags.name === name && /^(island|islet)$/.test(x.tags.place || ''));
  let at = null;
  const node = cands.find((x) => x.type === 'node');
  if (node) at = [node.lon, node.lat];
  else {
    // Largest outer ring of the matching ways/relations.
    const rings = cands.flatMap((e) => polygonsFromElement(e)?.outer ?? []);
    const big = rings.sort((r1, r2) => ringArea(r2) - ringArea(r1))[0];
    if (big) { at = ringCentroid(big); if (!pointInRing(big, at)) at = big[Math.floor(big.length / 2)]; }
  }
  if (at && inside(at)) push({ k: 'label', lk: 'area', t: name }, point(at[0], at[1]));
  else console.warn(`island label not found inside the area: ${name}`);
}

const out = {
  type: 'FeatureCollection',
  properties: {
    source: 'OpenStreetMap, Overpass API extract',
    osmTimestamp: raw.osm3s?.timestamp_osm_base,
    license: 'ODbL 1.0 — © OpenStreetMap contributors',
    bbox,
    generatedBy: 'tools/build-local-map.mjs',
  },
  features,
};
fs.writeFileSync(output, JSON.stringify(out));
const count = (k) => features.filter((f) => f.properties.k === k).length;
console.log(`land ${count('land')} | water ${count('water')} | river ${count('river')} | green ${count('green')} | reserve ${count('reserve')} | airport ${count('airport')} | roads ${roadCount} | labels ${count('label')}`);
console.log('size:', (fs.statSync(output).size / 1024).toFixed(0), 'kB');
