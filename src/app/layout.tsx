import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { ServiceWorker } from '@/components/ServiceWorker';
import { weddingConfig } from '@/config/wedding';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display'
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600']
});

export const metadata: Metadata = {
  title: `Casamento ${weddingConfig.couple}`,
  description: `Wedding App de ${weddingConfig.couple}`,
  manifest: '/manifest.json',
  openGraph: {
    title: `Casamento ${weddingConfig.couple}`,
    description: weddingConfig.gratitude,
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${cormorant.variable}`}>
      <body className="font-body">
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
