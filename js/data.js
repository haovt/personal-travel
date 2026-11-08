// Loads the JSON content files. Paths are resolved relative to this module so the site also
// works under a sub-path (e.g. GitHub Pages project sites: /<repo>/).

const url = (rel) => new URL(`../${rel}`, import.meta.url);

async function getJSON(rel) {
  const res = await fetch(url(rel));
  if (!res.ok) throw new Error(`Không tải được ${rel} (${res.status})`);
  return res.json();
}

export async function loadData() {
  const [destinations, locations, photos, regions, categories, mapLabels, vietnamGeo] = await Promise.all([
    getJSON('data/destinations.json'),
    getJSON('data/locations.json'),
    getJSON('data/photo-credits.json'),
    getJSON('data/regions.json'),
    getJSON('data/categories.json'),
    getJSON('data/map-labels.json'),
    getJSON('assets/maps/vietnam.geojson'),
  ]);
  const published = locations.filter((l) => l.status === 'published');
  return {
    destinations,
    locations: published,
    regions,
    categories,
    mapLabels: mapLabels.labels,
    vietnamGeo,
    destinationById: (id) => destinations.find((d) => d.id === id),
    regionById: (id) => regions.find((r) => r.id === id),
    categoryById: (id) => categories.find((c) => c.id === id),
    // Locations in the order the destination lists them.
    locationsFor: (dest) => dest.locationIds
      .map((id) => published.find((l) => l.id === id && l.destinationId === dest.id))
      .filter(Boolean),
    locationById: (id) => published.find((l) => l.id === id),
    photos,
    // Resolve an item's `images` ({photo, alt, illustrative}) to full photo records.
    imagesOf: (item) => (item.images || [])
      .map((img) => ({ ...photos.find((p) => p.id === img.photo), ...img }))
      .filter((p) => p.files),
  };
}

export { getJSON, url as assetUrl };
