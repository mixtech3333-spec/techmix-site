import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Techmix | Smart tech & workspace essentials',
  description: 'Quality tech and workspace products, shipped from the UK.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        <header className="site"><div className="wrap">
          <Link href="/" className="logo">Tech<span>mix</span></Link>
          <nav><Link href="/">Shop</Link><Link href="/cart">Cart</Link></nav>
        </div></header>
        <main>{children}</main>
        <footer><div className="wrap">© {new Date().getFullYear()} Techmix Ltd. Secure checkout powered by Shopify.</div></footer>
      </body>
    </html>
  );
}
