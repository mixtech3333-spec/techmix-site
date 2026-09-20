const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

export async function shopify(query, variables = {}, revalidate = 60) {
  if (!domain || !token) throw new Error('Missing SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN');
  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml availableForSale
  featuredImage { url altText }
  images(first: 6) { nodes { url altText } }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 50) { nodes { id title availableForSale price { amount currencyCode } } }
`;

export async function getProducts(first = 48) {
  const d = await shopify(`query($first:Int!){ products(first:$first, sortKey:BEST_SELLING){ nodes { ${PRODUCT_FIELDS} } } }`, { first });
  return d.products.nodes;
}
export async function getProduct(handle) {
  const d = await shopify(`query($handle:String!){ product(handle:$handle){ ${PRODUCT_FIELDS} } }`, { handle });
  return d.product;
}

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  lines(first: 50) { nodes { id quantity
    cost { totalAmount { amount currencyCode } }
    merchandise { ... on ProductVariant { id title product { title handle } image { url altText } } } } }
`;
export async function getCart(id) {
  if (!id) return null;
  const d = await shopify(`query($id:ID!){ cart(id:$id){ ${CART_FIELDS} } }`, { id }, 0);
  return d.cart;
}
export async function createCart(variantId, quantity = 1) {
  const d = await shopify(`mutation($lines:[CartLineInput!]){ cartCreate(input:{lines:$lines}){ cart { ${CART_FIELDS} } } }`,
    { lines: [{ merchandiseId: variantId, quantity }] }, 0);
  return d.cartCreate.cart;
}
export async function addToCart(cartId, variantId, quantity = 1) {
  const d = await shopify(`mutation($cartId:ID!,$lines:[CartLineInput!]!){ cartLinesAdd(cartId:$cartId, lines:$lines){ cart { ${CART_FIELDS} } } }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }, 0);
  return d.cartLinesAdd.cart;
}
export async function updateLine(cartId, lineId, quantity) {
  const d = await shopify(`mutation($cartId:ID!,$lines:[CartLineUpdateInput!]!){ cartLinesUpdate(cartId:$cartId, lines:$lines){ cart { ${CART_FIELDS} } } }`,
    { cartId, lines: [{ id: lineId, quantity }] }, 0);
  return d.cartLinesUpdate.cart;
}
export async function removeLine(cartId, lineId) {
  const d = await shopify(`mutation($cartId:ID!,$lineIds:[ID!]!){ cartLinesRemove(cartId:$cartId, lineIds:$lineIds){ cart { ${CART_FIELDS} } } }`,
    { cartId, lineIds: [lineId] }, 0);
  return d.cartLinesRemove.cart;
}

export const money = (m) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: m.currencyCode }).format(Number(m.amount));
