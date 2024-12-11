import { Metadata } from 'next';

import { AuthLayout } from '@/components/layouts/AuthLayout';

import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
  openGraph: {
    title: 'Login | EventHub',
    description: 'Login to your EventHub account',
    type: 'website'
  }
} as const;

const LoginPage = () => {
  return (
    <AuthLayout
      heading='Welcome back'
      subheading='Enter your email to sign in to your account'
      illustration={{
        src: '/images/auth/login-illustration.webp',
        alt: 'Event management dashboard illustration'
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
