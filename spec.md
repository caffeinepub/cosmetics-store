# Specification

## Summary
**Goal:** Add color scheme selection to the Admin Site Settings, allowing the store owner to choose from predefined palettes that apply site-wide.

**Planned changes:**
- Extend the backend `SiteSettings` record in `main.mo` with a `colorScheme` Text field; update `getSiteSettings` and `updateSiteSettings` to include it
- Update the `SiteSettings` TypeScript interface and query/mutation hooks to include `colorScheme: string`
- Add a "Color Scheme" subsection to the Admin Site Settings tab with at least 4 selectable swatches (e.g., "Default (Ivory & Gold)", "Rose Petal", "Midnight Luxe", "Sage & Cream"), each visually previewing its palette; save via `updateSiteSettings` with success/error toasts
- On app load, read the active `colorScheme` from `getSiteSettings` and inject corresponding CSS custom property overrides onto the document root, covering navigation, hero banner, buttons, and product cards

**User-visible outcome:** Admins can pick a color scheme in Site Settings, save it, and see the entire storefront update to the chosen palette; the default ivory/blush/gold theme is preserved with no visual regression.
