import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldSiteSettings = {
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

  type OldActor = {
    products : Map.Map<Nat, Product>;
    nextProductId : Nat;
    siteSettingsPersistent : OldSiteSettings;
  };

  type NewSiteSettings = {
    heroBannerImageUrl : Text;
    storeName : Text;
    contactEmail : Text;
    address : Text;
    currency : Text;
    shopifyStoreDomain : Text;
    shopifyStorefrontAccessToken : Text;
    shopifyEnabled : Bool;
    colorScheme : Text; // New field for color scheme
  };

  type NewActor = {
    products : Map.Map<Nat, Product>;
    nextProductId : Nat;
    siteSettingsPersistent : NewSiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    let newSiteSettings : NewSiteSettings = {
      old.siteSettingsPersistent with
      colorScheme = "default"; // Set default color scheme for existing data
    };

    {
      old with
      siteSettingsPersistent = newSiteSettings
    };
  };
};
