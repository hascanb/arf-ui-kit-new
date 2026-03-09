import type { Meta, StoryObj } from '@storybook/react';
import { ForgotPasswordForm } from '../../src/auth-kit/components/ForgotPasswordForm';
import { AuthKitProvider } from '../../src/auth-kit/context/AuthKitProvider';
import type { AuthKitConfig } from '../../src/auth-kit/context/types';

const mockConfig: AuthKitConfig = {
  onSignIn: async (credentials) => {
    return { success: true };
  },
  onForgotPassword: async (data) => {
    console.log('Forgot password:', data);
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

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Auth-Kit/ForgotPasswordForm',
  component: ForgotPasswordForm,
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
type Story = StoryObj<typeof ForgotPasswordForm>;

export const Default: Story = {
  args: {
    onSuccess: (response) => {
      console.log('Password reset success:', response);
    },
  },
};

export const WithError: Story = {
  args: {
    onError: (error) => {
      console.error('Password reset error:', error);
    },
  },
};
