import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Old SiteSettings structure (without Shopify integration).
  type OldSiteSettings = {
    heroBannerImageUrl : Text;
    storeName : Text;
    contactEmail : Text;
    address : Text;
    currency : Text;
  };

  // Old Actor structure (without Shopify integration).
  type OldActor = {
    products : Map.Map<Nat, {
      id : Nat;
      name : Text;
      category : Text;
      description : Text;
      price : Nat;
      imageUrl : Text;
      stock : Nat;
      featured : Bool;
    }>;
    nextProductId : Nat;
    siteSettings : OldSiteSettings;
  };

  // New SiteSettings structure with Shopify integration.
  type NewSiteSettings = {
    heroBannerImageUrl : Text;
    storeName : Text;
    contactEmail : Text;
    address : Text;
    currency : Text;
    shopifyStoreDomain : Text;
    shopifyStorefrontAccessToken : Text;
    shopifyEnabled : Bool;
  };

  // New Actor structure with Shopify integration.
  type NewActor = {
    products : Map.Map<Nat, {
      id : Nat;
      name : Text;
      category : Text;
      description : Text;
      price : Nat;
      imageUrl : Text;
      stock : Nat;
      featured : Bool;
    }>;
    nextProductId : Nat;
    siteSettingsPersistent : NewSiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    // Migrate old SiteSettings by adding Shopify fields with default values.
    let newSiteSettings = {
      old.siteSettings with
      shopifyStoreDomain = "";
      shopifyStorefrontAccessToken = "";
      shopifyEnabled = false;
    };

    // Update the actor state to use new SiteSettings structure.
    { old with siteSettingsPersistent = newSiteSettings };
  };
};
