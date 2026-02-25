# Specification

## Summary
**Goal:** Build a cosmetics e-commerce website called "Glow Shop" with product browsing, cart management, and order placement.

**Planned changes:**
- Backend: single Motoko actor with data models and CRUD for products (id, name, category, description, price, imageUrl, stock, featured), cart (keyed by session, with line items), and orders (id, items, totalPrice, status, timestamp)
- Backend methods: addProduct, getProducts, getProductById, updateProduct, deleteProduct, getFeaturedProducts, addToCart, removeFromCart, updateCartItem, getCart, clearCart, placeOrder, getOrders
- Frontend Homepage: full-width hero banner with headline and CTA, featured products grid, promotional marquee/banner strip
- Frontend Product Catalog page: responsive product grid, category and price range filters, product cards with image/name/category/price and Add to Cart button
- Frontend Product Detail page (`/product/:id`): full product info, quantity selector, Add to Cart button (disabled when out of stock)
- Frontend Shopping Cart page: line items with image/name/price/quantity controls/line total, subtotal, Remove per item, Proceed to Checkout button
- Frontend Checkout page: order summary, Place Order button, order confirmation message with order ID, cart cleared on success
- Sticky navigation bar with brand logo, Home/Shop/Cart links, and cart item count badge
- Luxurious visual theme: ivory/blush rose/champagne gold palette, elegant serif headings, smooth hover transitions, generous whitespace
- Static image assets (hero banner, product placeholder, promo banner) served from `frontend/public/assets/generated`

**User-visible outcome:** Users can browse cosmetics products, filter by category and price, view product details, manage a shopping cart, and place orders with a confirmation screen, all within an elegant, luxurious-feeling storefront.
