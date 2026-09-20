import Link from 'next/link';
import Image from 'next/image';
import { money } from '../lib/shopify';

export default function ProductCard({ p }) {
  return (
    <Link href={`/product/${p.handle}`} className="card">
      <div className="img">
        {p.featuredImage && <Image src={p.featuredImage.url} alt={p.featuredImage.altText || p.title} fill sizes="260px" />}
        {!p.availableForSale && <span className="sold">Sold out</span>}
      </div>
      <div className="body"><h3>{p.title}</h3><div className="price">From {money(p.priceRange.minVariantPrice)}</div></div>
    </Link>
  );
}
