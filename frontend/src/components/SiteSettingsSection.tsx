import { useState, useEffect } from 'react';
import { Save, ImageIcon, Loader2, ExternalLink, Store, ShoppingBag, Eye, EyeOff, Palette, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useGetSiteSettings, useUpdateSiteSettings } from '../hooks/useQueries';
import { getHeroImage } from '../utils/imageHelpers';

// ─── Color Scheme Definitions ─────────────────────────────────────────────────

interface ColorSchemeOption {
  id: string;
  name: string;
  description: string;
  swatches: string[]; // CSS color values for preview swatches
}

const COLOR_SCHEMES: ColorSchemeOption[] = [
  {
    id: 'default',
    name: 'Ivory & Gold',
    description: 'Warm ivory tones with champagne gold accents',
    swatches: ['#f9f3ec', '#e8c9b8', '#c9a96e', '#5c3d2e'],
  },
  {
    id: 'rose-petal',
    name: 'Rose Petal',
    description: 'Soft rose and dusty pink with berry accents',
    swatches: ['#fdf0f3', '#f2c4ce', '#d4607a', '#7a1e35'],
  },
  {
    id: 'midnight-luxe',
    name: 'Midnight Luxe',
    description: 'Deep navy and charcoal with silver highlights',
    swatches: ['#f0f2f7', '#c8cfe8', '#4a5580', '#1a1f3a'],
  },
  {
    id: 'sage-cream',
    name: 'Sage & Cream',
    description: 'Earthy sage greens with warm cream tones',
    swatches: ['#f4f7f2', '#c8d9c4', '#6b9e6b', '#2d4a2d'],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SiteSettingsSection() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [heroBannerImageUrl, setHeroBannerImageUrl] = useState('');
  const [storeName, setStoreName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('');
  const [previewError, setPreviewError] = useState(false);

  // Shopify fields
  const [shopifyEnabled, setShopifyEnabled] = useState(false);
  const [shopifyStoreDomain, setShopifyStoreDomain] = useState('');
  const [shopifyStorefrontAccessToken, setShopifyStorefrontAccessToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Color scheme
  const [colorScheme, setColorScheme] = useState('default');

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      setHeroBannerImageUrl(settings.heroBannerImageUrl);
      setStoreName(settings.storeName ?? '');
      setContactEmail(settings.contactEmail ?? '');
      setAddress(settings.address ?? '');
      setCurrency(settings.currency ?? '');
      setShopifyEnabled(settings.shopifyEnabled ?? false);
      setShopifyStoreDomain(settings.shopifyStoreDomain ?? '');
      setShopifyStorefrontAccessToken(settings.shopifyStorefrontAccessToken ?? '');
      setColorScheme(settings.colorScheme || 'default');
      setPreviewError(false);
    }
  }, [settings]);

  const previewSrc = heroBannerImageUrl.trim() !== '' ? heroBannerImageUrl : getHeroImage();

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        heroBannerImageUrl,
        storeName,
        contactEmail,
        address,
        currency,
        shopifyEnabled,
        shopifyStoreDomain,
        shopifyStorefrontAccessToken,
        colorScheme,
      });
      // Apply color scheme immediately after save
      document.documentElement.setAttribute('data-color-scheme', colorScheme);
      toast.success('Site settings saved successfully!');
    } catch {
      toast.error('Failed to save site settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Card */}
      <Card className="border-blush-deep/20 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-gold" />
            </div>
            <div>
              <CardTitle className="font-serif text-lg text-foreground">Hero Banner</CardTitle>
              <CardDescription className="font-sans text-sm text-muted-foreground">
                Set the background image displayed on the homepage hero section.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Image URL Input */}
          <div className="space-y-2">
            <Label htmlFor="heroBannerImageUrl" className="font-sans text-sm font-medium text-foreground">
              Hero Banner Image URL
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
            ) : (
              <div className="flex gap-2">
                <Input
                  id="heroBannerImageUrl"
                  type="url"
                  placeholder="https://example.com/banner.jpg"
                  value={heroBannerImageUrl}
                  onChange={(e) => {
                    setHeroBannerImageUrl(e.target.value);
                    setPreviewError(false);
                  }}
                  className="font-sans border-blush-deep/30 focus-visible:ring-rose-dark/30 bg-white/60"
                />
                {heroBannerImageUrl.trim() !== '' && (
                  <a
                    href={heroBannerImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-blush-deep/30 bg-white/60 hover:bg-blush/40 transition-colors shrink-0"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="w-4 h-4 text-foreground/60" />
                  </a>
                )}
              </div>
            )}
            <p className="font-sans text-xs text-muted-foreground">
              Enter a full URL to an image. Leave empty to use the default banner.
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="font-sans text-sm font-medium text-foreground">Preview</Label>
            <div className="relative w-full rounded-xl overflow-hidden border border-blush-deep/20 bg-blush/10" style={{ aspectRatio: '14/5' }}>
              {isLoading ? (
                <Skeleton className="absolute inset-0 bg-blush/30" />
              ) : (
                <>
                  <img
                    key={previewSrc}
                    src={previewError ? getHeroImage() : previewSrc}
                    alt="Hero banner preview"
                    className="w-full h-full object-cover object-center"
                    onError={() => setPreviewError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-dark/60 via-rose-dark/30 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="font-sans text-xs text-ivory/70 bg-rose-dark/50 px-2 py-1 rounded-md">
                      {previewError || heroBannerImageUrl.trim() === '' ? 'Default banner' : 'Custom banner'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme Card */}
      <Card className="border-blush-deep/20 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-gold" />
            </div>
            <div>
              <CardTitle className="font-serif text-lg text-foreground">Color Scheme</CardTitle>
              <CardDescription className="font-sans text-sm text-muted-foreground">
                Choose a color palette that defines the look and feel of your storefront.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl bg-blush/30" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COLOR_SCHEMES.map((scheme) => {
                const isSelected = colorScheme === scheme.id;
                return (
                  <button
                    key={scheme.id}
                    type="button"
                    onClick={() => setColorScheme(scheme.id)}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-rose-dark bg-blush/30 shadow-sm'
                        : 'border-blush-deep/20 bg-white/50 hover:border-blush-deep/40 hover:bg-blush/10'
                    }`}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-1 shrink-0">
                      {scheme.swatches.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-10 rounded-md first:rounded-l-lg last:rounded-r-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Scheme info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-semibold text-foreground leading-tight">
                        {scheme.name}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-snug">
                        {scheme.description}
                      </p>
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-dark flex items-center justify-center">
                        <Check className="w-3 h-3 text-ivory" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <p className="font-sans text-xs text-muted-foreground">
            The selected color scheme will be applied across the entire storefront after saving.
          </p>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending || isLoading}
              className="bg-rose-dark hover:bg-rose-dark/90 text-ivory font-sans shadow-sm"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Merchant Settings Card */}
      <Card className="border-blush-deep/20 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-gold" />
            </div>
            <div>
              <CardTitle className="font-serif text-lg text-foreground">Merchant Settings</CardTitle>
              <CardDescription className="font-sans text-sm text-muted-foreground">
                Configure your store's business information and preferences.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="font-sans text-sm font-medium text-foreground">
                Store Name
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
              ) : (
                <Input
                  id="storeName"
                  type="text"
                  placeholder="e.g. Glow Shop"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="font-sans border-blush-deep/30 focus-visible:ring-rose-dark/30 bg-white/60"
                />
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="font-sans text-sm font-medium text-foreground">
                Currency
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
              ) : (
                <Input
                  id="currency"
                  type="text"
                  placeholder="e.g. USD"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="font-sans border-blush-deep/30 focus-visible:ring-rose-dark/30 bg-white/60"
                />
              )}
              <p className="font-sans text-xs text-muted-foreground">
                ISO 4217 currency code (e.g. USD, EUR, GBP).
              </p>
            </div>
          </div>

          <Separator className="bg-blush-deep/15" />

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="font-sans text-sm font-medium text-foreground">
              Contact Email
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
            ) : (
              <Input
                id="contactEmail"
                type="email"
                placeholder="e.g. hello@glowshop.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="font-sans border-blush-deep/30 focus-visible:ring-rose-dark/30 bg-white/60"
              />
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="font-sans text-sm font-medium text-foreground">
              Address
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
            ) : (
              <Input
                id="address"
                type="text"
                placeholder="e.g. 123 Beauty Lane, New York, NY 10001"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-sans border-blush-deep/30 focus-visible:ring-rose-dark/30 bg-white/60"
              />
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending || isLoading}
              className="bg-rose-dark hover:bg-rose-dark/90 text-ivory font-sans shadow-sm"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shopify Integration Card */}
      <Card className="border-blush-deep/20 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#96bf48]/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#96bf48]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="font-serif text-lg text-foreground">Shopify Integration</CardTitle>
                {!isLoading && (
                  <Badge
                    variant={shopifyEnabled ? 'default' : 'outline'}
                    className={
                      shopifyEnabled
                        ? 'bg-[#96bf48]/20 text-[#5a7a1e] border-[#96bf48]/40 font-sans text-xs'
                        : 'border-blush-deep/30 text-muted-foreground font-sans text-xs'
                    }
                  >
                    {shopifyEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                )}
              </div>
              <CardDescription className="font-sans text-sm text-muted-foreground">
                Connect your Shopify store to import products directly into your catalog.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-blush/20 border border-blush-deep/15">
            <div>
              <p className="font-sans text-sm font-medium text-foreground">Enable Shopify Integration</p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                Allow importing products from your Shopify storefront.
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-11 rounded-full bg-blush/30" />
            ) : (
              <Switch
                checked={shopifyEnabled}
                onCheckedChange={setShopifyEnabled}
                className="data-[state=checked]:bg-[#96bf48]"
              />
            )}
          </div>

          <Separator className="bg-blush-deep/15" />

          {/* Store Domain */}
          <div className="space-y-2">
            <Label htmlFor="shopifyStoreDomain" className="font-sans text-sm font-medium text-foreground">
              Shopify Store Domain
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
            ) : (
              <Input
                id="shopifyStoreDomain"
                type="text"
                placeholder="mystore.myshopify.com"
                value={shopifyStoreDomain}
                onChange={(e) => setShopifyStoreDomain(e.target.value)}
                disabled={!shopifyEnabled}
                className="font-sans border-blush-deep/30 focus-visible:ring-rose-dark/30 bg-white/60 disabled:opacity-50"
              />
            )}
            <p className="font-sans text-xs text-muted-foreground">
              Your Shopify store's .myshopify.com domain (e.g. mystore.myshopify.com).
            </p>
          </div>

          {/* Storefront Access Token */}
          <div className="space-y-2">
            <Label htmlFor="shopifyStorefrontAccessToken" className="font-sans text-sm font-medium text-foreground">
              Storefront Access Token
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
            ) : (
              <div className="flex gap-2">
                <Input
                  id="shopifyStorefrontAccessToken"
                  type={showToken ? 'text' : 'password'}
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                  value={shopifyStorefrontAccessToken}
                  onChange={(e) => setShopifyStorefrontAccessToken(e.target.value)}
                  disabled={!shopifyEnabled}
                  className="font-sans border-blush-deep/30 focus-visible:ring-rose-dark/30 bg-white/60 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowToken((v) => !v)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-blush-deep/30 bg-white/60 hover:bg-blush/40 transition-colors shrink-0 disabled:opacity-50"
                  disabled={!shopifyEnabled}
                  title={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? (
                    <EyeOff className="w-4 h-4 text-foreground/60" />
                  ) : (
                    <Eye className="w-4 h-4 text-foreground/60" />
                  )}
                </button>
              </div>
            )}
            <p className="font-sans text-xs text-muted-foreground">
              Create a Storefront API access token in your Shopify admin under Apps &amp; Sales Channels → Develop apps.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending || isLoading}
              className="bg-rose-dark hover:bg-rose-dark/90 text-ivory font-sans shadow-sm"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
