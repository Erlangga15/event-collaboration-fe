'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

import { AuthProvider } from '@/components/providers/AuthProvider';

export interface ProvidersProps {
  children: React.ReactNode;
  attributes?: {
    html?: Record<string, string>;
  };
}

export function Providers({ children, attributes }: Readonly<ProvidersProps>) {
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
}
