# Project Specification: Interactive Virtual Vietnam Travel

> This is the owner's original specification (received 2026-11-08), stored verbatim so any session can
> resume from it. Later decisions and amendments are in the "Amendments" section at the end and in
> `CLAUDE.md` (status/decision log). Where they conflict, the amendments win.

## 1. Project Overview

Build a static, interactive website that allows users to virtually explore Vietnam through an interactive map.

The experience should feel like exploring a digital travel atlas. Users start with a map of Vietnam, select a destination, zoom into its local map, and discover famous places, attractions, food, culture, and local experiences.

The website should prioritize visual exploration through real photographs, interactive maps, and informative location details.

This is a personal virtual travel experience, NOT:
- An online travel booking website.
- A travel agency or commercial tourism platform.
- A conventional blog or article directory.
- A Google Maps clone.
- A 3D game or virtual reality application.

## 2. Core Experience and Navigation

The website has three levels of exploration.

### Level 1: Vietnam overview map

The homepage displays an interactive map of Vietnam.

Requirements:
- Show Vietnam's recognizable geographical shape.
- Display major cities and popular travel destinations using map pins.
- Include destination names.
- Distinguish major cities from individual attractions.
- Allow users to zoom and pan.
- Clicking a destination should smoothly transition to its local map.
- Include a title such as "Discover Vietnam" and a short introduction.
- Provide an optional regional filter: North, Central, South.

Initial destinations:

**Northern Vietnam**
- Hanoi
- Ha Long Bay
- Ninh Binh
- Sapa
- Ha Giang

**Central Vietnam**
- Hue
- Da Nang
- Hoi An
- Phong Nha
- Quy Nhon

**Southern Vietnam**
- Ho Chi Minh City
- Mekong Delta
- Phu Quoc
- Con Dao
- Da Lat

These are initial examples, not a limit. Keep the destination data extensible.

### Level 2: Destination local map

When users select a destination, transition to a closer map view.

For example, selecting Da Nang should open a local map of Da Nang.

The map should display interesting locations using interactive markers.

Each marker should represent a real destination, such as:
- Tourist attractions.
- Historical landmarks.
- Beaches and natural scenery.
- Famous restaurants or local food areas.
- Markets and shopping streets.
- Cultural experiences.

Example: Da Nang

Attractions:
- My Khe Beach
- Marble Mountains
- Dragon Bridge
- Son Tra Peninsula
- Linh Ung Pagoda
- Ba Na Hills

Food:
- Mi Quang
- Bun Cha Ca
- Banh Xeo
- Banh Trang Cuon Thit Heo

Each location should have its own marker and category.

Users should be able to:
- Zoom and pan around the local map.
- Click a marker to see location details.
- Filter markers by category.
- Return to the Vietnam overview.
- Switch to another destination.

Important: Markers must use geographically accurate coordinates. Do not invent coordinates or place markers arbitrarily for visual convenience.

### Level 3: Location detail experience

Clicking a marker opens a detailed information panel or immersive detail view.

Each location should support:

**Visual content**
- Large, high-quality real photographs.
- Multiple photographs in a gallery.
- Optional panoramic or landscape images.
- Clear location name.
- Category and destination.

**Information**
- Short introduction.
- Why the location is famous.
- What visitors can see or experience.
- Cultural or historical background when relevant.
- Famous local food and specialties, where applicable.
- Practical visiting information, when verified.

**Audio**
- Optional audio narration introducing the location.
- Play, pause, and progress controls.
- Optional background ambient sounds.
- Audio must be user-controlled.
- Provide text even when audio is unavailable.

Audio should be optional, not a dependency for using the website.

Use local audio files whenever possible. Do not depend on external APIs or cloud text-to-speech services at runtime.

## 3. Visual Design Direction

The visual experience is extremely important.

I want a realistic, visually rich travel experience.

### Design principles

- Use real photographs of actual Vietnamese destinations.
- Prefer beautiful landscape photography and authentic travel photographs.
- Avoid cartoon illustrations.
- Avoid game-like environments.
- Avoid generic AI-generated representations of real places.
- Avoid excessive decorative UI elements.
- Avoid a conventional corporate tourism website appearance.

The map should be clean, readable, and geographically recognizable.

The detail experience should feel like opening a travel magazine or exploring a beautiful travel documentary.

### Suggested visual direction

- Modern editorial travel atlas.
- Clean typography.
- Warm, natural colors.
- Large photography.
- Subtle animations and transitions.
- Minimal controls.
- Clear visual hierarchy.

The website should look good on desktop and remain usable on tablets and mobile devices.

## 4. Map Interaction and Technical Approach

Map interaction is a core feature. Do not implement it as a collection of unrelated static pages.

Evaluate the most suitable solution before implementation.

Possible approaches:

**Option A: Interactive SVG maps**
- Use an SVG map of Vietnam.
- Place destination markers using geographic coordinates.
- Use separate SVG maps or map layers for local destinations.
- Implement zoom and pan interactions.
- Fully local and easy to customize.

**Option B: Leaflet with local map data**
- Use Leaflet for map interaction.
- Use local GeoJSON and locally available map assets.
- Avoid depending on online map tiles if offline operation is required.
- Verify that the map assets and their licenses permit the intended use.

Choose the simplest solution that provides accurate geography, smooth zooming, and reliable local execution.

Do not use a map provider that requires an API key or paid service.

Avoid making the application dependent on internet access at runtime.

If a fully detailed local map is impractical for the first version, use a geographically accurate simplified map rather than inventing a map.

### Navigation behavior

The expected flow:

```text
Vietnam overview
    → Select destination
        → Destination map
            → Select attraction or food location
                → Location detail
            → Select another location
        → Return to Vietnam overview
```

Transitions should feel smooth and intuitive.

Preserve the selected destination and navigation context when returning to a previous level.

## 5. Content and Data Structure

The website must be data-driven.

Do not hardcode destination content directly into UI components.

Suggested structure:

```text
virtual-vietnam/
├── index.html
├── css/
│   ├── main.css
│   ├── map.css
│   ├── destinations.css
│   ├── details.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── navigation.js
│   ├── vietnam-map.js
│   ├── local-map.js
│   ├── locations.js
│   ├── gallery.js
│   └── audio.js
├── data/
│   ├── destinations.json
│   ├── locations.json
│   └── categories.json
└── assets/
    ├── maps/
    ├── destinations/
    ├── locations/
    ├── audio/
    ├── icons/
    └── fonts/
```

Example destination data:

```json
{
  "id": "da-nang",
  "name": "Da Nang",
  "region": "central",
  "coordinates": {
    "latitude": 16.0544,
    "longitude": 108.2022
  },
  "description": "A coastal city in Central Vietnam.",
  "map": "assets/maps/da-nang.svg",
  "coverImage": "assets/destinations/da-nang/cover.jpg",
  "locationIds": [
    "my-khe-beach",
    "marble-mountains",
    "dragon-bridge"
  ]
}
```

Example location data:

```json
{
  "id": "my-khe-beach",
  "destinationId": "da-nang",
  "name": "My Khe Beach",
  "category": "nature",
  "coordinates": {
    "latitude": 16.0471,
    "longitude": 108.2470
  },
  "description": "A popular beach in Da Nang.",
  "introduction": "A longer introduction about the beach...",
  "images": [
    "assets/locations/my-khe-beach/01.jpg",
    "assets/locations/my-khe-beach/02.jpg"
  ],
  "audio": "assets/audio/my-khe-beach.mp3"
}
```

These are illustrative data examples. Verify coordinates and factual descriptions before publishing.

Design the data model so that adding a new destination or location does not require changing the application logic.

## 6. Location Categories

Provide categories that users can filter on the local map.

Suggested categories:

| Category | Examples |
|---|---|
| Attractions | Ba Na Hills, VinWonders |
| Nature | Beaches, mountains, waterfalls |
| Food | Mi Quang, Pho, Bun Bo Hue |
| Culture | Pagodas, museums, traditional villages |
| Historical | Imperial City, historical landmarks |
| Markets | Local markets, night markets |
| Experiences | Boat trips, cable cars, walking streets |

Use category-specific marker styles that are visually distinguishable but not distracting.

Food locations should be treated as destinations worth exploring, not simply restaurant listings.

## 7. Additional Features

Implement these after the core experience works.

### Search
- Search for a destination or attraction.
- Show matching results.
- Selecting a result navigates to the appropriate destination and location.

### Favorites
- Allow users to bookmark interesting places.
- Store favorites in LocalStorage.
- Provide a list of saved destinations and attractions.

### Explore by region
- North, Central, South.
- Highlight destinations belonging to the selected region.

### Featured destinations
- Show a small selection of recommended destinations on the homepage.
- Use real photographs.

### Travel discovery
- Allow users to discover nearby attractions within the currently selected destination.
- If a location has associated local food, show related food suggestions.

Do not implement route planning or navigation instructions in the initial version.

## 8. Technical Constraints

This is a local, static, single-user website.

Use:
- HTML5
- CSS3
- Vanilla JavaScript
- JSON for content data
- SVG for custom map layers where appropriate
- LocalStorage for favorites and simple preferences

Avoid:
- React
- Angular
- Vue
- Backend services
- Database servers
- Authentication
- Node.js application servers
- Python servers
- External APIs required for normal operation
- Cloud services
- Paid map services

A simple local static development server, such as VS Code Live Server, is acceptable.

All required assets should be stored locally.

The application should continue to work offline after the assets have been collected.

Use modular JavaScript files and keep the implementation understandable and maintainable.

## 9. Asset Requirements and Copyright

Real photography is essential to the experience.

Before collecting assets:
1. Identify the images required for each destination.
2. Find suitable real photographs of the actual places.
3. Check each image's license and permitted usage.
4. Record the original source and attribution requirements.
5. Download and store approved assets locally.
6. Keep an asset manifest.

Do not assume that an image is free to reuse simply because it appears in an image search.

Do not scrape entire photo libraries or bulk-download assets from websites whose terms prohibit it.

Do not replace real photographs with illustrations or generic AI-generated images without explicit approval.

If a suitable image cannot be found, mark it as missing and report the issue rather than silently using an unrelated image.

Suggested asset manifest fields:

```json
{
  "id": "my-khe-beach-01",
  "path": "assets/locations/my-khe-beach/01.jpg",
  "source": "Original source URL",
  "creator": "Photographer name",
  "license": "License name",
  "attributionRequired": true
}
```

## 10. Development Phases

Do not implement everything in one step.

### Phase 0 — Research and Architecture

Start here.

- Evaluate map implementation options.
- Identify suitable map assets.
- Research real photographic assets.
- Define the destination and location data model.
- Plan navigation and zoom behavior.
- Define the visual design direction.
- Identify missing assets and licensing concerns.
- Create a realistic implementation plan.

Deliverables:
- Architecture proposal.
- Map implementation recommendation.
- Initial destination list.
- Initial location list.
- Asset inventory and sourcing strategy.
- Proposed project structure.
- Development roadmap.

Present the proposal for review before implementation.

### Phase 1 — Interactive Vietnam Map

Implement:
- Homepage.
- Vietnam overview map.
- Geographically accurate destination pins.
- Destination labels.
- Zoom and pan.
- Region filtering.
- Click destination to enter local map.

Initially support:
- Hanoi.
- Da Nang.
- Ho Chi Minh City.

The other destinations can be added later.

### Phase 2 — Local Destination Maps

Implement:
- Individual destination map views.
- Geographically accurate local markers.
- Category filters.
- Map navigation.
- Back-to-Vietnam navigation.
- Smooth transitions.

Initially complete Da Nang as the reference implementation.

### Phase 3 — Location Details

Implement:
- Detail panel or immersive detail view.
- Real photo galleries.
- Descriptions.
- Categories.
- Audio narration.
- Audio playback controls.

Use a small but high-quality set of locations first.

### Phase 4 — Discovery Features

Implement:
- Search.
- Favorites.
- Featured destinations.
- Region exploration.
- Related attractions and food.

### Phase 5 — Quality and Optimization

Verify:
- Desktop and mobile layouts.
- Map accuracy.
- Navigation consistency.
- Image loading and optimization.
- Audio playback.
- Offline operation.
- Browser compatibility.
- Performance.

## 11. Initial Content Scope

Do not attempt to cover every destination in Vietnam immediately.

Start with:

- 1 Vietnam overview map.
- 3 fully implemented destinations: Hanoi, Da Nang, Ho Chi Minh City.
- Approximately 5–8 interesting locations per destination.
- At least 2–4 suitable photographs per location where available.
- A few food locations for each destination.
- Audio for selected locations, not necessarily all of them.

Prioritize content quality and geographical accuracy over quantity.

## 12. Definition of Done

The first complete version should allow a user to:

1. Open the website locally.
2. See an interactive map of Vietnam.
3. Select Hanoi, Da Nang, or Ho Chi Minh City.
4. See a geographically accurate local map.
5. Explore attractions and food using clickable markers.
6. Open a location and see its real photographs.
7. Read a useful introduction.
8. Play optional local audio narration when available.
9. Return to the destination map and explore another place.
10. Return to the Vietnam overview and select another destination.

The website must:
- Run without a backend.
- Use local data and assets.
- Work offline after setup.
- Have no mandatory API keys.
- Be easy to extend with new destinations and locations.

---

# Initial Instructions to Claude Code

You are responsible for implementing this project incrementally.

First, execute Phase 0 only.

Do not immediately start writing the entire application.

I want you to investigate the technical and content challenges before implementation, especially:

1. How to represent Vietnam and individual cities accurately on interactive maps without relying on online map services.
2. How to implement smooth zooming and navigation between the country map and destination maps.
3. How to source real photographs of actual Vietnamese destinations legally.
4. How to organize location information, photographs, coordinates, and audio.
5. How to make the experience visually engaging without turning it into a conventional tourism website.

Be factual. Do not invent coordinates, descriptions, image sources, licenses, or asset availability.

When proposing a technical solution, explain why it is appropriate and identify its limitations.

Present the Phase 0 deliverables and wait for my review.

After approval, implement the project phase by phase. At the end of each phase, show what works, what remains incomplete, and any decisions that require my input.

## Important Scope and Language Adjustments

### 1. Language: Vietnamese only

The entire website must use **Vietnamese as its primary and default language**.

Requirements:
- All UI labels, buttons, menus, navigation, categories, descriptions, and location details must be in Vietnamese.
- All destination names and food names should use their commonly recognized Vietnamese names.
- Use natural, fluent Vietnamese, not machine-translated or awkward wording.
- Use correct Vietnamese accents and Unicode.
- Currency and local measurements should follow Vietnamese conventions where relevant.
- Do not mix English and Vietnamese in the user interface, except for proper names that are conventionally written in another language.
- Source code identifiers, variable names, filenames, and technical documentation may remain in English.

Example UI labels:
- Khám phá Việt Nam
- Điểm đến
- Địa danh
- Ẩm thực
- Văn hóa
- Thiên nhiên
- Lịch sử
- Giới thiệu
- Quay lại bản đồ Việt Nam
- Khám phá địa điểm
- Nghe thuyết minh
- Địa điểm yêu thích

### 2. Start with only ONE destination

Do not implement three cities or the entire Vietnam travel database in the first version.

First, implement:
- One Vietnam overview map.
- One selected destination.
- One detailed local map.
- Approximately 5–8 attractions, food locations, or interesting places within that destination.

Keep the architecture extensible so additional destinations can be added later through data files without rewriting the application.

Do not spend time implementing incomplete pages for other destinations.

### 3. Complete one destination before expanding

The first destination must demonstrate the entire experience:

1. Open the Vietnam map.
2. Click the selected destination.
3. Zoom into its local map.
4. Explore its locations.
5. Click a location.
6. View real photographs and Vietnamese descriptions.
7. Play optional Vietnamese audio narration.
8. Return to the local map.
9. Return to the Vietnam overview.

Only after this complete flow works should we consider adding another destination.

### 4. Vietnamese audio narration

Where audio is available:
- Narration must be in Vietnamese.
- Prefer a natural Vietnamese voice.
- Provide play, pause, and progress controls.
- Keep audio files local.
- Do not require an online text-to-speech service at runtime.
- If audio is unavailable, retain the written Vietnamese introduction.

### 5. Initial implementation instruction

Before starting development, ask me which ONE destination I want to implement first.

Do not assume the destination.

After I select it, complete Phase 0 research and planning for that destination only, then present the proposal for review.

---

# Amendments (added after the original specification)

These override the original text where they conflict.

| Date | Amendment |
|---|---|
| 2026-11-08 | **First destination: Đà Nẵng** (owner's choice). Sections 10 (Phase 1 "Hanoi, Da Nang, HCMC") and 11/12 ("3 destinations") are superseded by "Scope adjustment 2": one destination only until the full flow works. |
| 2026-11-08 | **Mobile is a primary target, especially iPhone 13** (iOS Safari). The site must be fully usable and look good on iPhone 13, not just "remain usable". See `CLAUDE.md` → "Target devices" for the concrete requirements. |
| 2026-11-08 | **Hosting: GitHub Pages** (static HTTPS), used from a PC and an iPhone 13. This replaces "local static server only" for production; Live Server stays for development. Offline use after the first visit is done with a service worker. Screen size, safe areas and control positions must be designed per device (`CLAUDE.md` → "Layout and position per device", "Hosting and deployment"). |
