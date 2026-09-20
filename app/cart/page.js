import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { getCart, money } from '../../lib/shopify';
import { updateAction, removeAction } from '../../lib/actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your cart | Techmix' };

export default async function CartPage() {
  const cart = await getCart(cookies().get('cartId')?.value).catch(() => null);
  const lines = cart?.lines.nodes || [];
  return (
    <div className="wrap" style={{ padding: '40px 20px 64px' }}>
      <h1>Your cart</h1>
      {!lines.length ? (
        <p>Your cart is empty. <Link href="/" style={{ textDecoration: 'underline' }}>Keep shopping</Link></p>
      ) : (
        <>
          <table><tbody>
            {lines.map((l) => {
              const m = l.merchandise;
              return (
                <tr key={l.id}>
                  <td><div className="line">
                    <div className="t">{m.image && <Image src={m.image.url} alt="" fill sizes="64px" />}</div>
                    <div><Link href={`/product/${m.product.handle}`}><b>{m.product.title}</b></Link><div className="price">{m.title !== 'Default Title' && m.title}</div></div>
                  </div></td>
                  <td>
                    <form action={updateAction} className="qty">
                      <input type="hidden" name="lineId" value={l.id} />
                      <input type="number" name="quantity" min="0" defaultValue={l.quantity} />
                      <button className="btn ghost" style={{ padding: '8px 12px' }}>Update</button>
                    </form>
                    <form action={removeAction}><input type="hidden" name="lineId" value={l.id} /><button className="link">Remove</button></form>
                  </td>
                  <td style={{ textAlign: 'right' }}>{money(l.cost.totalAmount)}</td>
                </tr>
              );
            })}
          </tbody></table>
          <div className="summary">
            <div className="price">Subtotal</div>
            <div className="tot">{money(cart.cost.subtotalAmount)}</div>
            <div className="price" style={{ marginBottom: 12 }}>Shipping and taxes calculated at checkout.</div>
            <a className="btn" href={cart.checkoutUrl}>Checkout securely</a>
          </div>
        </>
      )}
    </div>
  );
}
