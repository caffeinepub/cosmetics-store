import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration"; // Reference the migration module

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Add the migration attribute
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
    colorScheme : Text;
    promoBannerText : Text;
    promoBannerEnabled : Bool;
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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let products = Map.empty<Nat, Product>();
  var nextProductId = 0;

  var siteSettings : SiteSettings = {
    heroBannerImageUrl = "/default-hero-image.jpg";
    storeName = "";
    contactEmail = "";
    address = "";
    currency = "";
    shopifyStoreDomain = "";
    shopifyStorefrontAccessToken = "";
    shopifyEnabled = false;
    colorScheme = "default";
    promoBannerText = "/icp Commerce: First 20 customers get 5% off shipping";
    promoBannerEnabled = true;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func importShopifyProduct(
    title : Text,
    category : Text,
    description : Text,
    price : Nat,
    imageUrl : Text,
    stock : Nat,
    featured : Bool,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can import products from Shopify.");
    };

    if (not siteSettings.shopifyEnabled) {
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

  public query func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(newSettings : SiteSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: ICP Store: Access denied");
    };
    siteSettings := newSettings;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
