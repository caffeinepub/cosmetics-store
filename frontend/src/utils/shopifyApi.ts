// Shopify Storefront API utility
// Fetches products from a Shopify store using the Storefront GraphQL API.

export interface ShopifyProductImage {
  url: string;
  altText: string | null;
}

export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoneyV2;
  maxVariantPrice: ShopifyMoneyV2;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  productType: string;
  priceRange: ShopifyPriceRange;
  images: {
    edges: Array<{ node: ShopifyProductImage }>;
  };
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchShopifyProducts(
  storeDomain: string,
  storefrontAccessToken: string,
  limit = 50,
): Promise<ShopifyProduct[]> {
  const domain = storeDomain.trim().replace(/\/$/, '');
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken.trim(),
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: { first: limit },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Shopify API request failed: ${response.status} ${response.statusText}. ` +
        'Please verify your store domain and access token.',
    );
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    const msg = json.errors.map((e: { message: string }) => e.message).join(', ');
    throw new Error(`Shopify API error: ${msg}`);
  }

  const edges: Array<{ node: ShopifyProduct }> = json?.data?.products?.edges ?? [];
  return edges.map((edge) => edge.node);
}
