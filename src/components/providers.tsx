'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

import { AuthProvider } from '@/components/providers/AuthProvider';

interface ProvidersProps {
  children: ReactNode;
  attributes?: {
    html?: Record<string, string>;
  };
}

export const Providers = ({
  children,
  attributes
}: Readonly<ProvidersProps>) => {
  return (
    <AuthProvider>
      <NextThemesProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        {...attributes}
      >
        {children}
      </NextThemesProvider>
    </AuthProvider>
  );
};
