# Specification

## Summary
**Goal:** Add an Admin Panel page for managing products in the Glow Shop, with full create, edit, and delete capabilities backed by new backend methods.

**Planned changes:**
- Add a `/admin` route rendering an Admin Panel page accessible via direct URL or navigation link
- Display all existing products in a table showing name, category, price, stock, and featured status
- Add an "Add Product" form/modal with fields: name, category, description, price, imageUrl, stock quantity, and featured flag
- Add per-product "Edit" action that pre-fills the form with existing values
- Add per-product "Delete" action with a confirmation prompt before removal
- Show toast notifications for success and error states; validate required fields before submission
- Add `addProduct`, `updateProduct`, and `deleteProduct` methods to the backend actor

**User-visible outcome:** Users can navigate to `/admin` to view all products and add, edit, or delete them. Changes are reflected immediately in the product list.
