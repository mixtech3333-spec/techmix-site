'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addToCart, createCart, updateLine, removeLine } from './shopify';

const opts = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 10 };

export async function addAction(formData) {
  const variantId = formData.get('variantId');
  const jar = cookies();
  const id = jar.get('cartId')?.value;
  let cart;
  if (id) { try { cart = await addToCart(id, variantId, 1); } catch { cart = null; } }
  if (!cart) cart = await createCart(variantId, 1);
  jar.set('cartId', cart.id, opts);
  redirect('/cart');
}
export async function updateAction(formData) {
  const id = cookies().get('cartId')?.value;
  const qty = Number(formData.get('quantity'));
  const lineId = formData.get('lineId');
  if (id) qty > 0 ? await updateLine(id, lineId, qty) : await removeLine(id, lineId);
  revalidatePath('/cart');
}
export async function removeAction(formData) {
  const id = cookies().get('cartId')?.value;
  if (id) await removeLine(id, formData.get('lineId'));
  revalidatePath('/cart');
}
