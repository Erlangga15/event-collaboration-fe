import { Metadata } from 'next';
import { Encode_Sans, Mulish } from 'next/font/google';
import { Toaster } from 'sonner';

import '@/styles/globals.css';

import { MainLayout } from '@/components/layouts/MainLayout';
import { Providers } from '@/components/providers';

import { siteConfig } from '@/constant/config';

const encodeSans = Encode_Sans({
  subsets: ['latin'],
  variable: '--font-encode-sans'
});

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-mulish'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png'
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`]
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <html lang='en' className={`${encodeSans.variable} ${mulish.variable}`}>
      <body className='min-h-screen bg-background font-body antialiased'>
        <Providers
          attributes={{
            html: { class: 'antialiased' }
          }}
        >
          <MainLayout>{children}</MainLayout>
          <Toaster
            position='top-center'
            toastOptions={{
              style: {
                background: 'white',
                color: '#3b82f6'
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
