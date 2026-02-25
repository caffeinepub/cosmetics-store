import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Include migration functionality
(with migration = Migration.run)
actor {
  type SiteSettings = {
    heroBannerImageUrl : Text;
    storeName : Text;
    contactEmail : Text;
    address : Text;
    currency : Text;
    shopifyStoreDomain : Text;
    shopifyStorefrontAccessToken : Text;
    shopifyEnabled : Bool;
  };

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

  type UserProfile = {
    name : Text;
  };

  // MANUAL STEP: must use component import here
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /// Store products as persistent Map.
  let products = Map.empty<Nat, Product>();
  var nextProductId = 0;

  // Persistent site settings incl. Shopify integration
  var siteSettingsPersistent : SiteSettings = {
    heroBannerImageUrl = "/default-hero-image.jpg";
    storeName = "";
    contactEmail = "";
    address = "";
    currency = "";
    shopifyStoreDomain = "";
    shopifyStorefrontAccessToken = "";
    shopifyEnabled = false;
  };

  // Products management
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  // Import Shopify Product (admin-only: requires persistent settings)
  public shared ({ caller }) func importShopifyProduct(title : Text, category : Text, description : Text, price : Nat, imageUrl : Text, stock : Nat, featured : Bool) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can import products from Shopify.");
    };

    if (not siteSettingsPersistent.shopifyEnabled) {
      Runtime.trap("Shopify integration is not enabled. Please enable in site settings first.");
    };

    let product : Product = {
      id = nextProductId;
      name = title;
      category;
      description;
      price;
      imageUrl;
      stock;
      featured;
    };

    let productId = nextProductId;
    nextProductId += 1;

    products.add(productId, product);

    "Product successfully imported from Shopify and added to ICP Store";
  };

  // Site Settings
  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: ICP Store: Access denied");
    };
    siteSettingsPersistent;
  };

  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: ICP Store: Access denied");
    };
    siteSettingsPersistent := settings;
  };
};
