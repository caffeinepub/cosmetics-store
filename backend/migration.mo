module {
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

  type OldActor = {
    siteSettingsPersistent : SiteSettings;
  };

  type NewActor = {
    siteSettings : SiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    {
      siteSettings = old.siteSettingsPersistent;
    };
  };
};
