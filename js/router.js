// Hash-based routing. Works on any static host (GitHub Pages needs no rewrite rules) and keeps
// browser back / iPhone swipe-back meaningful.
//
//   #/                         Vietnam overview
//   #/<destinationId>          destination local map
//   #/<destinationId>/<locId>  location detail (Phase 3)

export const CREDITS_SLUG = 'nguon-anh';   // #/nguon-anh — reserved, not a destination id

export function parseHash(hash = location.hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { view: 'country' };
  if (parts[0] === CREDITS_SLUG) return { view: 'credits' };
  if (parts.length === 1) return { view: 'destination', destinationId: parts[0] };
  return { view: 'location', destinationId: parts[0], locationId: parts[1] };
}

export function hrefFor(route) {
  if (route.view === 'credits') return `#/${CREDITS_SLUG}`;
  if (route.view === 'destination') return `#/${encodeURIComponent(route.destinationId)}`;
  if (route.view === 'location') {
    return `#/${encodeURIComponent(route.destinationId)}/${encodeURIComponent(route.locationId)}`;
  }
  return '#/';
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
// otherwise (deep link) go to the parent level.
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
