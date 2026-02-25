import { useState, useEffect } from 'react';
import { Save, ImageIcon, Loader2, ExternalLink, Store, ShoppingBag, Eye, EyeOff, Palette, Check, ShieldAlert, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

// ─── Error Helpers ────────────────────────────────────────────────────────────

/**
 * Detects whether an error from the backend is an authorization/access-denied error.
 * The ICP runtime wraps Runtime.trap messages in a string like:
 * "Canister called ic0.trap with message: Unauthorized: ..."
 */
function isUnauthorizedError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();
  return lower.includes('unauthorized') || lower.includes('access denied');
}

/**
 * Detects whether the error is a "not authenticated" guard error thrown
 * before the backend call (i.e., no identity present).
 */
function isNotAuthenticatedError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return msg === 'Please log in to save settings';
}

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

  // Color scheme — track separately so we can detect unsaved changes
  const [colorScheme, setColorScheme] = useState('default');

  // Promo banner fields
  const [promoBannerEnabled, setPromoBannerEnabled] = useState(true);
  const [promoBannerText, setPromoBannerText] = useState('');

  // Track if the last save attempt was an auth error (to show inline alert)
  const [authError, setAuthError] = useState(false);

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      setHeroBannerImageUrl(settings.heroBannerImageUrl ?? '');
      setStoreName(settings.storeName ?? '');
      setContactEmail(settings.contactEmail ?? '');
      setAddress(settings.address ?? '');
      setCurrency(settings.currency ?? '');
      setShopifyEnabled(settings.shopifyEnabled ?? false);
      setShopifyStoreDomain(settings.shopifyStoreDomain ?? '');
      setShopifyStorefrontAccessToken(settings.shopifyStorefrontAccessToken ?? '');
      setColorScheme(settings.colorScheme || 'default');
      setPromoBannerEnabled(settings.promoBannerEnabled ?? true);
      setPromoBannerText(settings.promoBannerText ?? '');
      setPreviewError(false);
    }
  }, [settings]);

  const previewSrc = heroBannerImageUrl.trim() !== '' ? heroBannerImageUrl : getHeroImage();

  // Build the full settings payload, always including all fields
  const buildSettingsPayload = () => ({
    heroBannerImageUrl,
    storeName,
    contactEmail,
    address,
    currency,
    shopifyEnabled,
    shopifyStoreDomain,
    shopifyStorefrontAccessToken,
    colorScheme,
    promoBannerText,
    promoBannerEnabled,
  });

  const handleSave = () => {
    setAuthError(false);
    const payload = buildSettingsPayload();
    updateSettings.mutate(payload, {
      onSuccess: () => {
        setAuthError(false);
        // Apply color scheme immediately in the browser
        document.documentElement.setAttribute('data-color-scheme', payload.colorScheme);
        toast.success('Site settings saved successfully!');
      },
      onError: (error) => {
        if (isNotAuthenticatedError(error)) {
          setAuthError(true);
          toast.error('Please log in to save settings', {
            icon: <ShieldAlert className="w-4 h-4" />,
            duration: 6000,
          });
        } else if (isUnauthorizedError(error)) {
          setAuthError(true);
          toast.error('Access denied — please ensure you are logged in as an admin', {
            icon: <ShieldAlert className="w-4 h-4" />,
            duration: 6000,
          });
        } else {
          const message = error instanceof Error ? error.message : 'Unknown error';
          toast.error(`Failed to save site settings: ${message}`);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Authorization error banner */}
      {authError && (
        <Alert variant="destructive" className="border-destructive/50">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-sans font-semibold">Access Denied</AlertTitle>
          <AlertDescription className="font-sans text-sm">
            You do not have permission to save site settings. Only admin users can modify these settings.
            Please ensure you are logged in with an admin account and try again.
          </AlertDescription>
        </Alert>
      )}

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
                  className="font-sans flex-1"
                />
                {heroBannerImageUrl.trim() !== '' && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="shrink-0"
                  >
                    <a href={heroBannerImageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Image Preview */}
          <div className="space-y-2">
            <Label className="font-sans text-sm font-medium text-foreground">Preview</Label>
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-blush-deep/20 bg-muted">
              <img
                src={previewError ? getHeroImage() : previewSrc}
                alt="Hero banner preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              <span className="absolute bottom-2 left-3 text-white text-xs font-sans font-medium drop-shadow">
                Hero Banner Preview
              </span>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="font-sans bg-gold hover:bg-gold/90 text-white"
          >
            {updateSettings.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Hero Banner</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Promotional Banner Card */}
      <Card className="border-blush-deep/20 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-gold" />
            </div>
            <div>
              <CardTitle className="font-serif text-lg text-foreground">Promotional Banner</CardTitle>
              <CardDescription className="font-sans text-sm text-muted-foreground">
                Configure the scrolling promotional strip shown at the top of the homepage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-blush-deep/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="promoBannerEnabled" className="font-sans text-sm font-medium text-foreground">
                Enable Promotional Banner
              </Label>
              <p className="font-sans text-xs text-muted-foreground">
                Show or hide the scrolling banner on the homepage.
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-11 rounded-full bg-blush/30" />
            ) : (
              <Switch
                id="promoBannerEnabled"
                checked={promoBannerEnabled}
                onCheckedChange={setPromoBannerEnabled}
              />
            )}
          </div>

          {/* Banner Text */}
          <div className="space-y-2">
            <Label htmlFor="promoBannerText" className="font-sans text-sm font-medium text-foreground">
              Banner Message
            </Label>
            <p className="font-sans text-xs text-muted-foreground">
              Leave empty to use the default promotional messages.
            </p>
            {isLoading ? (
              <Skeleton className="h-20 w-full rounded-lg bg-blush/30" />
            ) : (
              <Textarea
                id="promoBannerText"
                placeholder="e.g. Free shipping on orders over $50 · New arrivals every week · Use code GLOW20 for 20% off"
                value={promoBannerText}
                onChange={(e) => setPromoBannerText(e.target.value)}
                className="font-sans resize-none"
                rows={3}
              />
            )}
          </div>

          {/* Live Preview */}
          {promoBannerEnabled && (
            <div className="space-y-2">
              <Label className="font-sans text-sm font-medium text-foreground">Live Preview</Label>
              <div className="rounded-lg overflow-hidden border border-blush-deep/20">
                <div className="bg-foreground text-background py-2 px-4 text-xs font-sans font-medium overflow-hidden whitespace-nowrap">
                  <span className="inline-block animate-marquee">
                    {promoBannerText.trim() !== ''
                      ? `✨ ${promoBannerText} ✨`
                      : '✨ Free shipping on orders over $50 · New arrivals every week · Use code GLOW20 for 20% off ✨'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="font-sans bg-gold hover:bg-gold/90 text-white"
          >
            {updateSettings.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Promotional Banner</>
            )}
          </Button>
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
                Choose the visual theme for your store.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl bg-blush/30" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setColorScheme(scheme.id)}
                  className={`relative flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    colorScheme === scheme.id
                      ? 'border-gold bg-gold/5 shadow-sm'
                      : 'border-blush-deep/20 hover:border-blush-deep/40 hover:bg-muted/50'
                  }`}
                >
                  {colorScheme === scheme.id && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                  <div className="flex gap-1.5">
                    {scheme.swatches.map((color, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">{scheme.name}</p>
                    <p className="font-sans text-xs text-muted-foreground">{scheme.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="font-sans bg-gold hover:bg-gold/90 text-white"
          >
            {updateSettings.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Color Scheme</>
            )}
          </Button>
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
                Configure your store's basic information and contact details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="My Glow Shop"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="font-sans"
                />
              )}
            </div>

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
                  placeholder="hello@myglowshop.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="font-sans"
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
                  placeholder="USD"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="font-sans"
                />
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="font-sans text-sm font-medium text-foreground">
                Business Address
              </Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
              ) : (
                <Input
                  id="address"
                  placeholder="123 Beauty Lane, New York, NY"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="font-sans"
                />
              )}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="font-sans bg-gold hover:bg-gold/90 text-white"
          >
            {updateSettings.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Merchant Settings</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Shopify Integration Card */}
      <Card className="border-blush-deep/20 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="font-serif text-lg text-foreground">Shopify Integration</CardTitle>
                <Badge
                  variant={shopifyEnabled ? 'default' : 'secondary'}
                  className={`font-sans text-xs ${shopifyEnabled ? 'bg-gold/20 text-gold border-gold/30' : ''}`}
                >
                  {shopifyEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className="font-sans text-sm text-muted-foreground">
                Connect your Shopify store to import products.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-blush-deep/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="shopifyEnabled" className="font-sans text-sm font-medium text-foreground">
                Enable Shopify Integration
              </Label>
              <p className="font-sans text-xs text-muted-foreground">
                Allow importing products from your Shopify store.
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-11 rounded-full bg-blush/30" />
            ) : (
              <Switch
                id="shopifyEnabled"
                checked={shopifyEnabled}
                onCheckedChange={setShopifyEnabled}
              />
            )}
          </div>

          {/* Store Domain */}
          <div className="space-y-2">
            <Label htmlFor="shopifyStoreDomain" className="font-sans text-sm font-medium text-foreground">
              Store Domain
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
            ) : (
              <Input
                id="shopifyStoreDomain"
                placeholder="mystore.myshopify.com"
                value={shopifyStoreDomain}
                onChange={(e) => setShopifyStoreDomain(e.target.value)}
                className="font-sans"
                disabled={!shopifyEnabled}
              />
            )}
          </div>

          {/* Storefront Access Token */}
          <div className="space-y-2">
            <Label htmlFor="shopifyToken" className="font-sans text-sm font-medium text-foreground">
              Storefront Access Token
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-lg bg-blush/30" />
            ) : (
              <div className="flex gap-2">
                <Input
                  id="shopifyToken"
                  type={showToken ? 'text' : 'password'}
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                  value={shopifyStorefrontAccessToken}
                  onChange={(e) => setShopifyStorefrontAccessToken(e.target.value)}
                  className="font-sans flex-1"
                  disabled={!shopifyEnabled}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowToken(!showToken)}
                  className="shrink-0"
                  type="button"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="font-sans bg-gold hover:bg-gold/90 text-white"
          >
            {updateSettings.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Shopify Settings</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
