import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Migration "migration";

(with migration = Migration.run)
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

  let products = Map.empty<Nat, Product>();
  var nextProductId = 0;

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
    let newId = nextProductId;
    nextProductId += 1;
    newId;
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
};
