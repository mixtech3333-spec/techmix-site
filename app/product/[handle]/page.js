import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct, money } from '../../../lib/shopify';
import { addAction } from '../../../lib/actions';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const p = await getProduct(params.handle).catch(() => null);
  return { title: p ? `${p.title} | Techmix` : 'Product' };
}

export default async function ProductPage({ params }) {
  const p = await getProduct(params.handle);
  if (!p) notFound();
  const variants = p.variants.nodes;
  return (
    <div className="wrap product">
      <div className="gallery">
        <div className="main">{p.featuredImage && <Image src={p.featuredImage.url} alt={p.title} fill priority sizes="540px" />}</div>
        <div className="thumbs">{p.images.nodes.slice(1).map((im) => <div key={im.url}><Image src={im.url} alt="" fill sizes="64px" /></div>)}</div>
      </div>
      <div>
        <h1>{p.title}</h1>
        <div className="p">{money(p.priceRange.minVariantPrice)}</div>
        <form action={addAction}>
          {variants.length > 1 ? (
            <select name="variantId" defaultValue={(variants.find((v) => v.availableForSale) || variants[0]).id}>
              {variants.map((v) => <option key={v.id} value={v.id} disabled={!v.availableForSale}>{v.title} — {money(v.price)}{v.availableForSale ? '' : ' (sold out)'}</option>)}
            </select>
          ) : <input type="hidden" name="variantId" value={variants[0].id} />}
          <button className="btn" disabled={!p.availableForSale}>{p.availableForSale ? 'Add to cart' : 'Sold out'}</button>
        </form>
        <div className="desc" dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} />
      </div>
    </div>
  );
}
