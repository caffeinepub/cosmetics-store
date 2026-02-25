import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
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

  type OldActor = {
    products : Map.Map<Nat, Product>;
    nextProductId : Nat;
    carts : Map.Map<Text, [CartItem]>;
    orders : Map.Map<Nat, Order>;
    nextOrderId : Nat;
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    items : [CartItem];
    totalPrice : Nat;
    status : Text;
    timestamp : Int;
  };

  type NewActor = {
    products : Map.Map<Nat, Product>;
    nextProductId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      products = old.products;
      nextProductId = old.nextProductId;
    };
  };
};
