import './globals.css';
import Header from '../components/Header';

export const metadata = { title: 'Azure Food Shop', description: 'Magazin online hostat pe Azure' };

export default function RootLayout({ children }) {
  return <html lang="ro"><body><Header />{children}</body></html>;
}
