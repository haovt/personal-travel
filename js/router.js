// Hash-based routing. Works on any static host (GitHub Pages needs no rewrite rules) and keeps
// browser back / iPhone swipe-back meaningful.
//
//   #/                                  world (pick a country)
//   #/<countryId>                       country overview map
//   #/<countryId>/<destinationId>       destination local map
//   #/<countryId>/<destinationId>/<locationId>   location detail
//   #/nguon-anh                         credits page (overlay)

export const CREDITS_SLUG = 'nguon-anh';   // reserved, never a country id

export function parseHash(hash = location.hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { view: 'world' };
  if (parts[0] === CREDITS_SLUG) return { view: 'credits' };
  const [countryId, destinationId, locationId] = parts;
  if (!destinationId) return { view: 'country', countryId };
  if (!locationId) return { view: 'destination', countryId, destinationId };
  return { view: 'location', countryId, destinationId, locationId };
}

export function hrefFor(r) {
  const e = encodeURIComponent;
  switch (r.view) {
    case 'credits': return `#/${CREDITS_SLUG}`;
    case 'country': return `#/${e(r.countryId)}`;
    case 'destination': return `#/${e(r.countryId)}/${e(r.destinationId)}`;
    case 'location': return `#/${e(r.countryId)}/${e(r.destinationId)}/${e(r.locationId)}`;
    default: return '#/';
  }
}

// The level above a route (used by "back" when there is no in-app history).
export function parentOf(r) {
  switch (r?.view) {
    case 'location': return { view: 'destination', countryId: r.countryId, destinationId: r.destinationId };
    case 'destination': return { view: 'country', countryId: r.countryId };
    default: return { view: 'world' };
  }
}

let internalNavigations = 0;

// In-app links (<a href="#/...">) also count as internal navigation, so "back" can use history.
document.addEventListener('click', (e) => {
  if (e.target.closest?.('a[href^="#/"]')) internalNavigations++;
});

export function navigate(route, { replace = false } = {}) {
  const href = hrefFor(route);
  if (href === (location.hash || '#/')) return;
  if (replace) {
    history.replaceState(null, '', href);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    internalNavigations++;
    location.hash = href;
  }
}

// "Back" inside the app: use browser history when we navigated here ourselves,
// otherwise (deep link) go to the given parent level.
export function goBack(parentRoute) {
  if (internalNavigations > 0) {
    internalNavigations--;
    history.back();
  } else {
    navigate(parentRoute, { replace: true });
  }
}

export function onRouteChange(handler) {
  window.addEventListener('hashchange', () => handler(parseHash()));
}
