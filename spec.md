# Specification

## Summary
**Goal:** Add a Shopify integration interface to the Glow Shop admin panel, allowing admins to configure Shopify credentials and import products from a Shopify Storefront into the ICP store.

**Planned changes:**
- Extend the backend `SiteSettings` record with `shopifyStoreDomain` (Text), `shopifyStorefrontAccessToken` (Text), and `shopifyEnabled` (Bool) fields; update `getSiteSettings` and `updateSiteSettings` accordingly
- Update the frontend `SiteSettings` TypeScript type and `updateSiteSettings` mutation payload to include the three new Shopify fields
- Add a "Shopify Integration" subsection to the Site Settings tab in the Admin page with an enable/disable toggle, a Store Domain input, and a Storefront Access Token input; pre-populate from `getSiteSettings` and save via `updateSiteSettings` with success/error toasts
- Add a "Shopify Import" tab/panel in the Admin page that fetches products from the Shopify Storefront GraphQL API (using stored credentials) and displays each product with title, thumbnail, and price; includes an "Import" button per product that calls the backend `addProduct` method with success/error toasts; shows a configuration prompt when Shopify is disabled or credentials are missing

**User-visible outcome:** Admins can enable Shopify integration, enter their store domain and access token in Site Settings, then browse and import products from their Shopify storefront directly into the ICP product catalog via a dedicated Shopify Import panel.
