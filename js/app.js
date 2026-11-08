// Entry point: loads data, creates the shared map, wires routing, the panel and the map levels:
//   world → country → destination (local map) → location (detail)
/* global L */

import { loadData, getJSON } from './data.js';
import { parseHash, parentOf, navigate, goBack, onRouteChange } from './router.js';
import {
  createMap, viewPadding, prefersReducedMotion, centerForVisible, createAreaLock, WORLD_BOUNDS,
} from './map-core.js';
import { createWorldLayer } from './world-map.js';
import { createCountryLayer } from './country-map.js';
import { createLocalLayer } from './local-map.js';
import { createPanel } from './panel.js';
import { createOffscreenHints } from './offscreen-hints.js';
import { createCreditsPage } from './credits.js';

const REGIONAL_ZOOM = 7.5;   // used when a destination has no local map yet
const LOCATION_ZOOM = 15;
const SITE_TITLE = 'Tập bản đồ du lịch';

// ---------- small session store (survives reloads in the same tab) ----------
const store = {
  get(key) { try { return JSON.parse(sessionStorage.getItem(`vv:${key}`)); } catch { return null; } },
  set(key, v) { try { sessionStorage.setItem(`vv:${key}`, JSON.stringify(v)); } catch { /* private mode */ } },
};

async function main() {
  const data = await loadData();
  const mapEl = document.getElementById('map');
  const map = createMap(mapEl);

  // Debug handle for local development only.
  if (['localhost', '127.0.0.1'].includes(location.hostname)) window.__vv = { map, data };

  const animate = () => !prefersReducedMotion();
  const flyBoundsOpts = (duration) => ({ ...viewPadding(), animate: animate(), duration, easeLinearity: 0.2 });
  const saveView = (key) => store.set(key, { center: map.getCenter(), zoom: map.getZoom() });
  const afterLanding = (fn) => { if (animate()) map.once('moveend', fn); else setTimeout(fn, 0); };

  let route = null;

  // ---------- level class on the map container (drives pane cross-fades in map.css) ----------
  let level = null;
  function setLevel(next) {
    level = next;
    mapEl.classList.toggle('level-world', next === 'world');
    mapEl.classList.toggle('level-country', next === 'country');
  }

  // ---------- world layer (lazy) ----------
  let worldPromise = null;
  const loadWorld = () => (worldPromise ||= getJSON('assets/maps/world.geojson')
    .then((geo) => createWorldLayer(map, data, geo, {
      onSelectCountry: (id) => navigate({ view: 'country', countryId: id }),
    })));

  // ---------- country layers (one per country, lazy) ----------
  const countryLayers = new Map();
  let activeCountry = null;
  function loadCountry(country) {
    if (!countryLayers.has(country.id)) {
      countryLayers.set(country.id, getJSON(country.mapData).then((geo) => createCountryLayer(map, data, country, geo, {
        onSelectDestination: (id) => navigate({ view: 'destination', countryId: country.id, destinationId: id }),
      })));
    }
    return countryLayers.get(country.id);
  }
  async function activateCountry(country) {
    const layer = await loadCountry(country);
    if (activeCountry && activeCountry !== layer) activeCountry.hide();
    activeCountry = layer;
    layer.show();
    layer.setRegion(store.get(`region:${country.id}`) ?? null);
    return layer;
  }

  // ---------- local layers (one per destination, lazy) ----------
  const localLayers = new Map();
  let activeLocal = null;          // { dest, layer }

  function loadLocal(dest) {
    if (!dest.mapData) return Promise.resolve(null);
    if (!localLayers.has(dest.id)) {
      localLayers.set(dest.id, getJSON(dest.mapData)
        .then((geo) => createLocalLayer(map, data, dest, geo, {
          onSelectLocation: (id) => navigate({ view: 'location', countryId: dest.countryId, destinationId: dest.id, locationId: id }),
        }))
        .catch((err) => { console.warn('Local map unavailable:', err); return null; }));
    }
    return localLayers.get(dest.id);
  }

  async function activateLocal(dest) {
    if (activeLocal?.dest.id === dest.id) return activeLocal.layer;
    deactivateLocal();
    const layer = await loadLocal(dest);
    if (!layer) return null;
    layer.show();
    layer.setFilter(store.get(`category:${dest.id}`) ?? null);
    activeLocal = { dest, layer };
    map.vvSetLocalActive(true);
    if (dest.mapAttribution) map.attributionControl.addAttribution(dest.mapAttribution);
    hints.update();
    return layer;
  }

  function deactivateLocal() {
    if (!activeLocal) return;
    const { dest, layer } = activeLocal;
    map.vvSetLocalActive(false);
    layer.hide();
    if (dest.mapAttribution) map.attributionControl.removeAttribution(dest.mapAttribution);
    activeLocal = null;
    hints.update();
  }

  // Leave a destination: fade its local map out now, remove it after the flight.
  function leaveLocal() {
    areaLock.unlock();
    map.vvSetLocalActive(false);
    afterLanding(() => { if (route.view === 'world' || route.view === 'country') deactivateLocal(); });
  }

  // ---------- camera helpers ----------
  function showCountryBounds(country, withAnimation = true) {
    if (withAnimation) map.flyToBounds(country.bounds, flyBoundsOpts(1.4));
    else map.fitBounds(country.bounds, { ...viewPadding(), animate: false });
  }

  function showRegion(country, regionId) {
    if (regionId == null) return showCountryBounds(country);
    const pts = activeCountry?.regionPoints(regionId) || [];
    if (!pts.length) return;
    map.flyToBounds(L.latLngBounds(pts).pad(0.6), { ...flyBoundsOpts(1), maxZoom: 6 });
  }

  function flyToLocation(loc, duration = 1.2) {
    const latlng = L.latLng(loc.coordinates.lat, loc.coordinates.lon);
    const z = Math.max(map.getZoom(), LOCATION_ZOOM);
    map.flyTo(centerForVisible(map, latlng, z), z, { animate: animate(), duration });
  }

  // ---------- UI handlers ----------
  const handlers = {
    onSelectCountry: (id) => navigate({ view: 'country', countryId: id }),
    onSelectDestination: (id) => navigate({ view: 'destination', countryId: route.countryId, destinationId: id }),
    onSelectLocation: (id) => navigate({ view: 'location', countryId: route.countryId, destinationId: route.destinationId, locationId: id }),
    onBack: () => goBack(parentOf(route)),
    onBackToCountry: () => navigate({ view: 'country', countryId: route.countryId }),
    onBackToWorld: () => navigate({ view: 'world' }),
    onRegion: (regionId) => {
      const country = data.countryById(route.countryId);
      store.set(`region:${country.id}`, regionId);
      panel.setRegion(regionId);
      activeCountry?.setRegion(regionId);
      showRegion(country, regionId);
    },
    onCategory: (catId) => {
      if (!activeLocal) return;
      store.set(`category:${activeLocal.dest.id}`, catId);
      activeLocal.layer.setFilter(catId);
      panel.setCategory(catId, activeLocal.layer.matches);
      hints.update();
    },
    // Sheet expanded/collapsed: keep the selected place visible above it.
    onSheetResize: () => setTimeout(recenterLocation, 320),
  };

  // Put the open location back in the middle of the visible map (after rotation, window
  // resize or sheet resize), without animation.
  function recenterLocation() {
    if (route?.view !== 'location') return;
    const loc = data.locationById(route.locationId);
    if (!loc) return;
    const z = map.getZoom();
    map.setView(centerForVisible(map, L.latLng(loc.coordinates.lat, loc.coordinates.lon), z), z, { animate: false });
  }
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recenterLocation, 200);
  });

  const panel = createPanel(data, handlers);
  const hints = createOffscreenHints(map, document.getElementById('offscreen-hints'), {
    getCandidates: () => (activeLocal && route?.view === 'destination' ? activeLocal.layer.visibleLocations() : []),
    onSelect: (loc) => flyToLocation(loc, 1.6),
  });

  // Keep the view inside the destination's map data once a flight has landed there.
  const areaLock = createAreaLock(map);
  function lockWhenLanded(dest) {
    if (areaLock.isLocked()) return;
    map.once('moveend', () => {
      if ((route.view === 'destination' || route.view === 'location') && route.destinationId === dest.id
          && activeLocal?.dest.id === dest.id) {
        areaLock.lock(dest.bounds);
      }
    });
  }

  // The credits page overlays the map; the map route underneath stays as it was.
  const credits = createCreditsPage(data, { onBack: () => goBack(route ?? { view: 'world' }) });
  let mapTitle = document.title;
  const setTitle = (t) => { mapTitle = t; document.title = t; };
  const sameRoute = (a, b) => a && b && a.view === b.view && a.countryId === b.countryId
    && a.destinationId === b.destinationId && a.locationId === b.locationId;

  async function render(next) {
    if (next.view === 'credits') {
      credits.show();
      document.title = `Nguồn ảnh & bản quyền · ${SITE_TITLE}`;
      return;
    }
    credits.hide();
    if (sameRoute(route, next)) { document.title = mapTitle; return; }
    const prev = route;
    route = next;

    // ----- World -----
    if (next.view === 'world') {
      panel.showWorld();
      setTitle(SITE_TITLE);
      if (prev && prev.view !== 'country') leaveLocal();
      if (prev?.view === 'country') saveView(`country-view:${prev.countryId}`);
      setLevel('world');
      const world = await loadWorld();
      world.show();
      // Always frame all countries (a saved view may come from another screen size).
      if (!prev) map.fitBounds(WORLD_BOUNDS, { ...viewPadding(), animate: false });
      else map.flyToBounds(WORLD_BOUNDS, flyBoundsOpts(1.6));
      afterLanding(() => { if (route.view === 'world') { deactivateLocal(); activeCountry?.hide(); activeCountry = null; } });
      return;
    }

    const country = data.countryById(next.countryId);
    if (!country) { navigate({ view: 'world' }, { replace: true }); return; }
    const countryLayer = await activateCountry(country);
    if (route !== next) return;
    setLevel('country');
    afterLanding(() => { if (level === 'country') worldPromise?.then((w) => w.hide()); });

    // ----- Country -----
    if (next.view === 'country') {
      countryLayer.setActive(null);
      panel.showCountry(country, store.get(`region:${country.id}`) ?? null);
      setTitle(`${country.title} · ${SITE_TITLE}`);
      const saved = store.get(`country-view:${country.id}`);
      if (!prev) showCountryBounds(country, false);
      else if (prev.view === 'world') showCountryBounds(country);
      else {
        leaveLocal();
        if (saved) map.flyTo(saved.center, saved.zoom, { animate: animate(), duration: 1.6 });
        else showCountryBounds(country);
      }
      return;
    }

    const dest = data.destinationById(next.destinationId);
    if (!dest || dest.status !== 'published' || dest.countryId !== country.id) {
      navigate({ view: 'country', countryId: country.id }, { replace: true });
      return;
    }
    if (prev?.view === 'country' && prev.countryId === country.id) saveView(`country-view:${country.id}`);
    // Jumping straight from another destination (history, shared link): release that
    // destination's area lock first, or the flight can't leave the old area.
    if (prev?.destinationId && prev.destinationId !== dest.id) areaLock.unlock();
    if (!prev) map.fitBounds(country.bounds, { ...viewPadding(), animate: false });
    countryLayer.setActive(dest.id);

    // ----- Location -----
    if (next.view === 'location') {
      const loc = data.locationById(next.locationId);
      if (!loc || loc.destinationId !== dest.id) {
        navigate({ view: 'destination', countryId: country.id, destinationId: dest.id }, { replace: true });
        return;
      }
      if (prev?.view === 'destination' && prev.destinationId === dest.id) saveView(`dest-view:${dest.id}`);
      panel.showLocation(dest, loc);
      setTitle(`${loc.name} · ${dest.name} · ${SITE_TITLE}`);
      const layer = await activateLocal(dest);
      if (route !== next) return;
      layer?.setActive(loc.id);
      hints.update();
      setTimeout(() => {
        if (layer) lockWhenLanded(dest);
        flyToLocation(loc, !prev || prev.view === 'world' || prev.view === 'country' ? 2 : 1.2);
      }, 0);
      return;
    }

    // ----- Destination -----
    const layer = await activateLocal(dest);
    if (route !== next) return;
    layer?.setActive(null);
    panel.showDestination(dest, { categoryId: layer?.getFilter() ?? null, matches: layer?.matches });
    setTitle(`${dest.name} · ${country.name} · ${SITE_TITLE}`);

    setTimeout(() => {
      if (layer) lockWhenLanded(dest);
      const back = store.get(`dest-view:${dest.id}`);
      if (layer && prev?.view === 'location' && prev.destinationId === dest.id && back) {
        map.flyTo(back.center, back.zoom, { animate: animate(), duration: 1 });
      } else if (layer) {
        map.flyToBounds(dest.initialView || dest.bounds, flyBoundsOpts(prev ? 1.8 : 2));
      } else {
        // No detailed local map yet: the country outline is too coarse for city zoom.
        const ll = L.latLng(dest.coordinates.lat, dest.coordinates.lon);
        map.flyTo(centerForVisible(map, ll, REGIONAL_ZOOM), REGIONAL_ZOOM, { animate: animate(), duration: 1.6 });
      }
    }, 0);
  }

  onRouteChange(render);
  await render(parseHash());

  // Warm the cache for published destinations so the first fly-in is smooth.
  setTimeout(() => data.destinations
    .filter((d) => d.status === 'published')
    .forEach((d) => loadLocal(d)), 1500);
}

main().catch((err) => {
  console.error(err);
  const el = document.getElementById('sheet-content');
  if (el) el.innerHTML = '<p class="notice">Không tải được dữ liệu bản đồ. Hãy mở trang qua một máy chủ web tĩnh (ví dụ Live Server) thay vì mở trực tiếp tệp.</p>';
});
