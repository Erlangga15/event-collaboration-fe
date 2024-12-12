import { Metadata } from 'next';

import { AuthLayout } from '@/components/layouts/AuthLayout';

import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create your EventHub account',
  openGraph: {
    title: 'Register | EventHub',
    description: 'Create your EventHub account and start managing events',
    type: 'website'
  }
};

const RegisterPage = () => {
  return (
    <AuthLayout
      heading='Create an account'
      subheading='Enter your details to create your account'
      illustration={{
        src: '/images/auth/register-illustration.webp',
        alt: 'People collaborating on event planning'
      }}
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
