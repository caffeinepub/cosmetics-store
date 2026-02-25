import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

actor {
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    stock : Nat;
    featured : Bool;
  };

  // Shopping cart item
  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type ShoppingCart = {
    items : [CartItem];
  };

  // Order type
  type Order = {
    id : Nat;
    items : [CartItem];
    totalPrice : Nat;
    status : Text;
    timestamp : Time.Time;
  };

  // State variables
  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Text, [CartItem]>();
  let orders = Map.empty<Nat, Order>();
  var nextProductId = 0;
  var nextOrderId = 0;

  // Product methods
  public shared ({ caller }) func addProduct(name : Text, category : Text, description : Text, price : Nat, imageUrl : Text, stock : Nat, featured : Bool) : async Nat {
    let product : Product = {
      id = nextProductId;
      name;
      category;
      description;
      price;
      imageUrl;
      stock;
      featured;
    };
    products.add(nextProductId, product);
    let id = nextProductId;
    nextProductId += 1;
    id;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductById(id : Nat) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, category : Text, description : Text, price : Nat, imageUrl : Text, stock : Nat, featured : Bool) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          category;
          description;
          price;
          imageUrl;
          stock;
          featured;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    products.remove(id);
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.featured });
  };

  // Shopping cart methods
  public shared ({ caller }) func addToCart(sessionId : Text, productId : Nat, quantity : Nat) : async () {
    let currentCart = switch (carts.get(sessionId)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    let updatedCart = currentCart.concat([{ productId; quantity }]);
    carts.add(sessionId, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(sessionId : Text, productId : Nat) : async () {
    switch (carts.get(sessionId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?items) {
        let filteredItems = items.filter(func(item) { item.productId != productId });
        carts.add(sessionId, filteredItems);
      };
    };
  };

  public shared ({ caller }) func updateCartItem(sessionId : Text, productId : Nat, quantity : Nat) : async () {
    switch (carts.get(sessionId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?items) {
        let updatedItems = items.map(func(item) { if (item.productId == productId) { { productId; quantity } } else { item } });
        carts.add(sessionId, updatedItems);
      };
    };
  };

  public query ({ caller }) func getCart(sessionId : Text) : async ShoppingCart {
    switch (carts.get(sessionId)) {
      case (null) { { items = [] } };
      case (?items) { { items } };
    };
  };

  public shared ({ caller }) func clearCart(sessionId : Text) : async () {
    carts.remove(sessionId);
  };

  // Orders methods
  public shared ({ caller }) func placeOrder(sessionId : Text) : async Nat {
    let cart = switch (carts.get(sessionId)) {
      case (null) { [] };
      case (?items) { items };
    };

    var totalPrice = 0;
    for (item in cart.values()) {
      switch (products.get(item.productId)) {
        case (null) {};
        case (?product) { totalPrice += product.price * item.quantity };
      };
    };

    let order : Order = {
      id = nextOrderId;
      items = cart;
      totalPrice;
      status = "pending";
      timestamp = Time.now();
    };

    orders.add(nextOrderId, order);
    let id = nextOrderId;
    nextOrderId += 1;
    id;
  };

  public query ({ caller }) func getOrders() : async [Order] {
    orders.values().toArray();
  };
};
