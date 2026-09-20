import { getProducts } from '../lib/shopify';
import ProductCard from '../components/ProductCard';

export const revalidate = 60;

export default async function Home() {
  let products = [], error = null;
  try { products = await getProducts(); } catch (e) { error = e.message; }
  return (
    <>
      <section className="hero"><div className="wrap">
        <h1>Tech that makes your day easier</h1>
        <p>Handpicked gadgets and workspace essentials, with fast UK delivery and secure checkout.</p>
        <a href="#shop" className="btn">Shop now</a>
      </div></section>
      <div className="wrap" id="shop">
        {error && <div className="notice"><b>Store not connected yet.</b> Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in your environment settings. ({error})</div>}
        <div className="grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </>
  );
}
