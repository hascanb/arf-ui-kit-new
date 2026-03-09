import type { Meta, StoryObj } from '@storybook/react';
import { SignInForm } from '../../src/auth-kit/components/SignInForm';
import { AuthKitProvider } from '../../src/auth-kit/context/AuthKitProvider';
import type { AuthKitConfig } from '../../src/auth-kit/context/types';

const mockConfig: AuthKitConfig = {
  onSignIn: async (credentials) => {
    console.log('Sign in:', credentials);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  },
  routes: {
    afterSignIn: '/dashboard',
    signIn: '/signin',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
};

const meta: Meta<typeof SignInForm> = {
  title: 'Auth-Kit/SignInForm',
  component: SignInForm,
  decorators: [
    (Story) => (
      <AuthKitProvider config={mockConfig}>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="w-full max-w-md">
            <Story />
          </div>
        </div>
      </AuthKitProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SignInForm>;

export const Default: Story = {
  args: {
    onSuccess: (response) => {
      console.log('Sign in success:', response);
    },
  },
};

export const WithError: Story = {
  args: {
    onError: (error) => {
      console.error('Sign in error:', error);
    },
  },
};

export const CustomClass: Story = {
  args: {
    className: 'custom-signin-form',
    onSuccess: (response) => {
      console.log('Sign in success:', response);
    },
  },
};
