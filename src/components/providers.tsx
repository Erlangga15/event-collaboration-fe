'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export interface ProvidersProps {
  children: React.ReactNode;
  attributes?: {
    html?: Record<string, string>;
  };
}

export const Providers = ({ children, attributes }: ProvidersProps) => {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      {...attributes}
    >
      {children}
    </NextThemesProvider>
  );
};
