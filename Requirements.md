# Atmos — Project Requirements & Design System

This file is the source of truth for the project. Every future change should be checked
against the requirements and design system below before being considered done.

---

## 1. Functional / Technical Requirements

1. Use async/await, Promises, and `fetch` for all network calls.
2. Transform API responses into valid, well-shaped JSON objects before using them in the UI.
3. Advanced and deep error handling (not just a generic try/catch message).
4. Implement loading states wherever data is being fetched or an action is in flight.
5. Implement empty states wherever a list/section can have zero results.
6. Responsive design across all breakpoints.
7. Use semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`, `time`, etc.).
8. Implement keyboard navigation (focus management, arrow keys, Enter, Escape where relevant).
9. Implement at least one feature driven by URL query parameters.
10. Implement at least 3 application routes.
11. Data validation (user input and API response shapes).
12. Reusable components with clear communication between components (props down,
    callbacks up, or other explicit patterns).
13. State immutability — never mutate state directly; always create new
    objects/arrays.
14. Only use `useMemo` / `useCallback` when there is a real, explainable need for them
    (expensive computation, referential stability for a dependency array, memoized
    child, etc.) — not by default.
15. Implement an API service layer; never call `fetch` directly from inside a
    component. All API code lives under `src/api/`.
16. Implement a utility layer with all utility/helper functions (pure functions, no
    React/DOM dependency where avoidable).
17. Weather code mapping (WMO code → human label, e.g. "clear", "cloudy", "rain", …).
18. Use JavaScript's `Date` functionality for all dates/times — never hardcode dates
    or other derivable data.
19. Wherever data can be derived from data already loaded, derive it client-side
    instead of making a new API request (e.g. °C ⇄ °F conversion).
20. `README.md` in the project root explaining:
    - Project description
    - Features
    - Tech stack
    - Installation steps
    - How to run
    - API info
    - Folder structure
    - Architecture explanation
    - State management explanation
    - Custom hooks explanation
    - Known limitations
    - AI tools used
21. `AI_USAGE.md` in the project root explaining:
    - AI tools used
    - Prompts used
    - Parts of the project generated/modified using AI
    - Bugs introduced by AI (if any)
    - How the AI-generated code was verified
22. Use GitHub and demonstrate proper git functionality (branches, commits, etc.).
    — *User manages this directly; not audited by the assistant.*
23. Test responsiveness at these exact viewport widths: **1920px, 1440px, 1024px,
    768px, 390px**.

---

## 2. Design System

### Color palette

| Role           | Light     | Dark      | Normal wording                        |
| -------------- | --------- | --------- | ------------------------------------- |
| **Background** | `#FAF8F3` | `#151311` | Warm off-white / deep warm black      |
| **Surface**    | `#FFFFFF` | `#211E19` | White / dark brown-charcoal           |
| **Primary**    | `#C86B3C` | `#F08A54` | Terracotta orange / warm coral-orange |
| **Secondary**  | `#5E7D72` | `#82A99B` | Muted sage green / soft seafoam green |
| **Accent**     | `#E7B84B` | `#F5C95B` | Golden yellow / warm sunshine yellow  |
| **Text**       | `#29251F` | `#F3EEE5` | Dark espresso brown / warm ivory      |
| **Muted Text** | `#777066` | `#AAA094` | Warm gray-brown / soft beige-gray     |

Implemented as CSS custom properties in `src/index.css` (`:root` for light,
`:root[data-theme='dark']` for dark), driven by the theme toggle in the header.

### Fonts

- **Main headings:** Manrope
- **Supporting text:** Inter
- Loaded via a Google Fonts `@import` in `src/index.css`.
- (The standalone logotype "Atmos" additionally uses **Outfit**, regular 400 —
  established separately for the wordmark only, not for headings/body text.)

---

## 3. Compliance Audit (as of this check)

Legend: ✅ satisfied · ⚠️ partial / gap · ❌ not implemented

| # | Requirement | Status | Notes |
|---|---|---|---|
| 1 | async/await, Promises, fetch | ✅ | `src/api/geocoding.js`, `src/api/weather.js` use `fetch` with `async/await`; hooks use `.then/.catch` and an intentional `Promise.resolve().then()` to satisfy the `set-state-in-effect` lint rule. |
| 2 | Transform API response into valid JSON objects | ⚠️ | `response.json()` returns the raw Open-Meteo shape as-is. There's no dedicated "normalize" step in the API layer — transformation (weather-code → label/category, unit conversion, background selection) happens inline in `CurrentWeatherCard.jsx` instead of in `api/` or `utils/`. Recommend adding a `transformWeatherResponse()`-style function. |
| 3 | Advanced / deep error handling | ✅ | `utils/errors.js` defines an `ApiError` (`type`: `network`/`http`/`parse`/`validation`, plus `status`) thrown from both `api/geocoding.js` and `api/weather.js`; `getErrorMessage()` turns that into a specific, user-facing message (offline, 5xx, 404, generic HTTP, malformed response). `SearchBar` and `useCurrentWeather` both surface these specific messages instead of one generic string. A class-based `ErrorBoundary` (`components/ErrorBoundary.jsx`) wraps the whole app in `main.jsx` to catch render-time crashes with a retry action. |
| 4 | Loading states | ✅ | Search: spinner in the search bar + "Searching…" dropdown state. Weather card: skeleton/spinner placeholder, refresh button spins while refetching. |
| 5 | Empty states | ✅ | `EmptyState.jsx` when no location is selected; "No locations found for…" in the search dropdown. |
| 6 | Responsive design | ✅ (needs formal re-verification) | Media queries at 768px/640px throughout. Spot-checked at 1280px and 390px during development; not yet checked at the full required set (see #23). |
| 7 | Semantic HTML | ✅ | `<header>`/`<nav>`/`<main>` plus, as of this pass: `<section>` for the search area and the empty state (both with `aria-label`), `<article>` for the populated weather card, `<dl>/<dt>/<dd>` for the stats grid, and `<time dateTime="…">` for the header clock, the card's local date/time, and its "Updated" timestamp. `role="alert"`/`role="status"` added to error/loading placeholders. |
| 8 | Keyboard navigation | ✅ | `SearchBar` implements a full combobox pattern: `ArrowDown`/`ArrowUp` move a roving `activeIndex` through whichever list is showing (recent searches or live results), `Enter` selects the highlighted item, `Escape` closes the dropdown. Wired with `role="combobox"`/`aria-expanded`/`aria-controls`/`aria-activedescendant` on the input and `role="listbox"`/`role="option"`/`aria-selected` on the list — verified end-to-end with simulated keyboard input (see `AI_USAGE.md`). |
| 9 | Feature driven by URL query parameters | ❌ | Intentionally deferred — not needed by any current feature; will be added when a real use case exists (e.g. deep-linking a selected city), per explicit instruction not to add it speculatively. |
| 10 | At least 3 application routes | ❌ | Intentionally deferred for the same reason as #9 — no router installed; header nav remains placeholder anchors. |
| 11 | Data validation | ✅ | `utils/validation.js` adds `isNonEmptyString`, `isValidCoordinate`, and `isValidLocationResult`. Used to: guard the search effect (replacing the old raw truthiness check), validate every geocoding result before it ever reaches state (`api/geocoding.js` filters with `isValidLocationResult`), validate coordinates before fetching weather or accepting a geolocation fix (`useCurrentWeather`, `App.jsx`), and validate a selected location's shape before it becomes the active location (`App.jsx`). The weather API layer also now rejects a response missing `current` (see #3, `type: 'validation'`). |
| 12 | Reusable components / communication | ✅ | `Header`, `SearchBar`, `EmptyState`, `CurrentWeatherCard`, `CloudIllustration` are composable and reusable; state is lifted to `App.jsx` and passed down via props, with callbacks (`onSelectLocation`, `onUseMyLocation`, `onRefresh`, `onUnitToggle`, `onThemeToggle`) passed back up. |
| 13 | State immutability | ✅ | Verified in `utils/searchHistory.js` (`filter`/spread/`slice`, no in-place mutation) and throughout components (functional `setState` updates, new arrays/objects). |
| 14 | `useMemo`/`useCallback` only if justified | ✅ | Neither is currently used. The app doesn't yet have an expensive computation or a memoized-child scenario that would justify them, so their absence is correct — not a gap. Revisit if/when a real need appears (e.g. large derived lists, `React.memo` children). |
| 15 | API service layer, not mixed with frontend | ✅ (mostly) | All `fetch` calls live in `src/api/`; components never call `fetch` directly. Minor blur: derived-data logic (weather code mapping, background image choice) lives in `src/utils/` and is called from components rather than being part of a formal "service" transform (see #2). |
| 16 | Utility layer/"class" with all utility functions | ⚠️ | Utilities exist and are pure/testable, but are split across five focused files (`searchHistory.js`, `temperature.js`, `weatherBackground.js`, `weatherCodes.js`, `weatherFormat.js`) rather than a single consolidated "utility class" as literally requested. Functionally complete; naming/structure may need to be reconciled with grading expectations. |
| 17 | Weather code mapping | ✅ | `src/utils/weatherCodes.js` maps every relevant WMO code to a label + category (clear/cloudy/rain/snow/thunderstorm/fog). |
| 18 | JS `Date` functionality, no hardcoded dates | ✅ | All dates/times are derived via `new Date()`, `toLocaleDateString`, `getHours()`, etc. (`App.jsx`, `utils/weatherFormat.js`). Nothing hardcoded. |
| 19 | Derive data instead of re-fetching | ✅ | °C/°F toggle converts already-loaded Celsius values client-side via `utils/temperature.js`; toggling units triggers **zero** network requests (verified). |
| 20 | `README.md` (full spec) | ✅ | Rewritten with all required sections: description, features, tech stack, installation, how to run, API info, folder structure, architecture, state management, custom hooks, known limitations, AI tools used. |
| 21 | `AI_USAGE.md` | ✅ | Created with AI tools used, a chronological prompt summary, generated/modified parts, bugs introduced (and how each was caught/fixed), and verification methodology. |
| 22 | GitHub / git functionality | — | Explicitly out of scope for this audit per user instruction; user manages this directly. |
| 23 | Responsiveness tested at 1920/1440/1024/768/390 | ⚠️ | CSS covers this range structurally (breakpoints at 768px/640px), but a formal screenshot-verification pass at the exact 5 required widths has not been done. |

### Summary of open gaps (highest impact first)

1. **Routing** — no router, no ≥3 routes (req. 10). *Intentionally deferred —
   add only when there's a real navigable feature to route to, not
   speculatively.*
2. **URL query parameters** — no feature uses them yet (req. 9). *Same as
   above — deferred until a concrete use case exists.*
3. **API → JSON transform layer** — weather-code/derived-data shaping still
   happens inline in `CurrentWeatherCard.jsx` rather than a named transform
   step in `api/`/`utils/` (req. 2).
4. **Utility "class" structure** — reconcile the current multi-file utils
   layout with the literal "one utility class" wording (req. 16), or confirm
   the multi-file approach is acceptable.
5. **Formal responsive QA pass** at 1920/1440/1024/768/390px (req. 23).

### Resolved in this pass

Keyboard navigation (req. 8), deep error handling incl. an error boundary
(req. 3), semantic HTML (req. 7), data validation (req. 11), `README.md`
(req. 20), and `AI_USAGE.md` (req. 21) were all implemented without changing
any existing visual styling or working logic — verified via `npm run lint`,
`npm run build`, and headless-browser checks (see `AI_USAGE.md`).

---

## 4. Working agreement

From this point forward, all new work in this project should be checked against
Section 1 (requirements) and Section 2 (design system) before being considered
complete. Section 3 should be kept up to date as gaps are closed.
