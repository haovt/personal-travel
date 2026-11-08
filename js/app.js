// Entry point: loads data, creates the shared map, wires routing, the panel and both map levels.
/* global L */

import { loadData, getJSON } from './data.js';
import { parseHash, navigate, goBack, onRouteChange } from './router.js';
import {
  createMap, viewPadding, prefersReducedMotion, centerForVisible, createAreaLock, VIETNAM_BOUNDS,
} from './map-core.js';
import { createVietnamLayer } from './vietnam-map.js';
import { createLocalLayer } from './local-map.js';
import { createPanel } from './panel.js';
import { createOffscreenHints } from './offscreen-hints.js';
import { createCreditsPage } from './credits.js';

const REGIONAL_ZOOM = 7.5;   // used when a destination has no local map yet
const LOCATION_ZOOM = 15;

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

  // ---------- local layers (one per destination, created on first use) ----------
  const localLayers = new Map();   // id -> Promise<layer|null>
  let activeLocal = null;          // { dest, layer }

  function loadLocal(dest) {
    if (!dest.mapData) return Promise.resolve(null);
    if (!localLayers.has(dest.id)) {
      localLayers.set(dest.id, getJSON(dest.mapData)
        .then((geo) => createLocalLayer(map, data, dest, geo, {
          onSelectLocation: (id) => navigate({ view: 'location', destinationId: dest.id, locationId: id }),
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

  // ---------- views ----------
  function showWholeCountry(withAnimation = true) {
    if (withAnimation) map.flyToBounds(VIETNAM_BOUNDS, flyBoundsOpts(1.2));
    else map.fitBounds(VIETNAM_BOUNDS, { ...viewPadding(), animate: false });
  }

  function showRegion(regionId) {
    if (regionId == null) return showWholeCountry();
    const pts = vietnam.regionPoints(regionId);
    if (!pts.length) return;
    map.flyToBounds(L.latLngBounds(pts).pad(0.6), { ...flyBoundsOpts(1), maxZoom: 6 });
  }

  function flyToLocation(loc, duration = 1.2) {
    const latlng = L.latLng(loc.coordinates.lat, loc.coordinates.lon);
    const z = Math.max(map.getZoom(), LOCATION_ZOOM);
    map.flyTo(centerForVisible(map, latlng, z), z, { animate: animate(), duration });
  }

  const handlers = {
    onSelectDestination: (id) => navigate({ view: 'destination', destinationId: id }),
    onSelectLocation: (id) => navigate({ view: 'location', destinationId: route.destinationId, locationId: id }),
    onBack: () => {
      if (route.view === 'location') goBack({ view: 'destination', destinationId: route.destinationId });
      else goBack({ view: 'country' });
    },
    onBackToCountry: () => navigate({ view: 'country' }),
    onRegion: (regionId) => {
      store.set('region', regionId);
      panel.setRegion(regionId);
      vietnam.setRegion(regionId);
      showRegion(regionId);
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

  const vietnam = createVietnamLayer(map, data, handlers);
  const panel = createPanel(data, handlers);
  const hints = createOffscreenHints(map, document.getElementById('offscreen-hints'), {
    getCandidates: () => (activeLocal && route?.view === 'destination' ? activeLocal.layer.visibleLocations() : []),
    onSelect: (loc) => flyToLocation(loc, 1.6),
  });

  let route = null;

  // Keep the view inside the destination's map data once a flight has landed there.
  const areaLock = createAreaLock(map);
  function lockWhenLanded(dest) {
    if (areaLock.isLocked()) return;
    map.once('moveend', () => {
      if (route.view !== 'country' && route.destinationId === dest.id && activeLocal?.dest.id === dest.id) {
        areaLock.lock(dest.bounds);
      }
    });
  }

  // The credits page overlays the map; the map route underneath stays as it was.
  const credits = createCreditsPage(data, { onBack: () => goBack(route ?? { view: 'country' }) });
  let mapTitle = document.title;
  const setTitle = (t) => { mapTitle = t; document.title = t; };
  const sameRoute = (a, b) => a && b && a.view === b.view
    && a.destinationId === b.destinationId && a.locationId === b.locationId;

  async function render(next) {
    if (next.view === 'credits') {
      credits.show();
      document.title = 'Nguồn ảnh & bản quyền · Khám phá Việt Nam';
      return;
    }
    credits.hide();
    if (sameRoute(route, next)) { document.title = mapTitle; return; }
    const prev = route;
    route = next;

    // ----- Level 1: Vietnam -----
    if (next.view === 'country') {
      vietnam.setActive(null);
      panel.showCountry(store.get('region'));
      setTitle('Khám phá Việt Nam');
      const saved = store.get('country-view');
      if (prev && prev.view !== 'country') {
        // Fade the local map out now (the country layer fades in); remove it after landing.
        areaLock.unlock();
        map.vvSetLocalActive(false);
        const done = () => { if (route.view === 'country') deactivateLocal(); };
        if (saved) map.flyTo(saved.center, saved.zoom, { animate: animate(), duration: 1.6 });
        else showWholeCountry();
        if (animate()) map.once('moveend', done); else done();
      } else if (!prev) {
        showWholeCountry(false);
      }
      return;
    }

    const dest = data.destinationById(next.destinationId);
    if (!dest || dest.status !== 'published') {
      navigate({ view: 'country' }, { replace: true });
      return;
    }
    if (!prev || prev.view === 'country') {
      if (prev) store.set('country-view', { center: map.getCenter(), zoom: map.getZoom() });
      else map.fitBounds(VIETNAM_BOUNDS, { ...viewPadding(), animate: false });
    }
    vietnam.setActive(dest.id);

    // ----- Level 3: location (preview until Phase 3) -----
    if (next.view === 'location') {
      const loc = data.locationById(next.locationId);
      if (!loc || loc.destinationId !== dest.id) {
        navigate({ view: 'destination', destinationId: dest.id }, { replace: true });
        return;
      }
      if (prev?.view === 'destination' && prev.destinationId === dest.id) {
        store.set(`dest-view:${dest.id}`, { center: map.getCenter(), zoom: map.getZoom() });
      }
      panel.showLocation(dest, loc);
      setTitle(`${loc.name} · ${dest.name} · Khám phá Việt Nam`);
      const layer = await activateLocal(dest);
      if (route !== next) return;
      layer?.setActive(loc.id);
      hints.update();
      setTimeout(() => {
        if (layer) lockWhenLanded(dest);
        flyToLocation(loc, prev?.view === 'country' || !prev ? 2 : 1.2);
      }, 0);
      return;
    }

    // ----- Level 2: destination -----
    const layer = await activateLocal(dest);
    if (route !== next) return;
    layer?.setActive(null);
    panel.showDestination(dest, {
      categoryId: layer?.getFilter() ?? null,
      matches: layer?.matches,
    });
    setTitle(`${dest.name} · Khám phá Việt Nam`);

    setTimeout(() => {
      if (layer) lockWhenLanded(dest);
      const back = store.get(`dest-view:${dest.id}`);
      if (layer && prev?.view === 'location' && prev.destinationId === dest.id && back) {
        map.flyTo(back.center, back.zoom, { animate: animate(), duration: 1 });
      } else if (layer) {
        map.flyToBounds(dest.initialView || dest.bounds, flyBoundsOpts(prev ? 1.8 : 2));
      } else {
        // No detailed local map: the country outline is too coarse for city zoom.
        const ll = L.latLng(dest.coordinates.lat, dest.coordinates.lon);
        map.flyTo(centerForVisible(map, ll, REGIONAL_ZOOM), REGIONAL_ZOOM, { animate: animate(), duration: 1.6 });
      }
    }, 0);
  }

  onRouteChange(render);
  await render(parseHash());
  // Markers only have DOM elements once the map has a view, so apply the saved region now.
  vietnam.setRegion(store.get('region'));

  // Warm the cache for published destinations so the first fly-in is smooth.
  setTimeout(() => data.destinations
    .filter((d) => d.status === 'published')
    .forEach((d) => loadLocal(d)), 1200);
}

main().catch((err) => {
  console.error(err);
  const el = document.getElementById('sheet-content');
  if (el) el.innerHTML = '<p class="notice">Không tải được dữ liệu bản đồ. Hãy mở trang qua một máy chủ web tĩnh (ví dụ Live Server) thay vì mở trực tiếp tệp.</p>';
});
