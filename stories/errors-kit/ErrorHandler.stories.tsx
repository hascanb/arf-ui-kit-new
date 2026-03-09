import type { Meta, StoryObj } from '@storybook/react';
import { ErrorsKitProvider, useErrorHandler } from '../../src/errors-kit';
import type { ErrorMap, HandlerConfig } from '../../src/errors-kit';
import { Button } from '../../playground/components/ui/button';

// Simple error page components
const NotFoundPage = () => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
    <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
  </div>
);

const ServerErrorPage = () => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">500 - Server Error</h1>
    <p className="text-muted-foreground">Something went wrong on our end.</p>
  </div>
);

const errorMap: ErrorMap = {
  'not-found': NotFoundPage,
  'internal-server-error': ServerErrorPage,
};

// Demo component that uses the error handler
const ErrorDemo = ({ errorType }: { errorType: 'low' | 'medium' | 'high' | 'critical' }) => {
  const { handleError } = useErrorHandler();

  const triggerError = () => {
    const errors = {
      low: new Error('This is a low priority error (toast notification)'),
      medium: new Error('This is a medium priority error (redirect to error page)'),
      high: new Error('This is a high priority error (reload required)'),
      critical: new Error('This is a critical error (modal with forced action)'),
    };

    const error = errors[errorType];
    // Add status code to simulate API error
    (error as any).response = { status: errorType === 'low' ? 400 : errorType === 'medium' ? 404 : errorType === 'high' ? 500 : 503 };

    handleError(error, {
      level: errorType,
    });
  };

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-2xl font-bold">
        {errorType.charAt(0).toUpperCase() + errorType.slice(1)} Priority Error
      </h2>
      <p className="text-muted-foreground">
        Click the button below to trigger a {errorType} priority error.
      </p>
      <Button onClick={triggerError} variant={errorType === 'critical' ? 'destructive' : 'default'}>
        Trigger {errorType.charAt(0).toUpperCase() + errorType.slice(1)} Error
      </Button>
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Expected Behavior:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {errorType === 'low' && (
            <>
              <li>Shows a toast notification</li>
              <li>User can continue working</li>
              <li>Example: Form validation error</li>
            </>
          )}
          {errorType === 'medium' && (
            <>
              <li>Redirects to error page</li>
              <li>User can navigate back</li>
              <li>Example: 404 Not Found</li>
            </>
          )}
          {errorType === 'high' && (
            <>
              <li>Shows toast and reloads page</li>
              <li>Data might be lost</li>
              <li>Example: Server error (500)</li>
            </>
          )}
          {errorType === 'critical' && (
            <>
              <li>Shows modal dialog</li>
              <li>User must acknowledge</li>
              <li>Example: Service unavailable</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

const meta: Meta<typeof ErrorsKitProvider> = {
  title: 'Errors-Kit/ErrorHandler',
  component: ErrorsKitProvider,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorsKitProvider>;

const mockHandlerConfig: HandlerConfig = {
  onToast: (message: string) => console.log('Toast:', message),
  onRedirect: (path: string) => console.log('Redirect to:', path),
  on401: '/login',
};

export const LowPriorityError: Story = {
  render: () => (
    <ErrorsKitProvider errorMap={errorMap} handlerConfig={mockHandlerConfig}>
      <ErrorDemo errorType="low" />
    </ErrorsKitProvider>
  ),
};

export const MediumPriorityError: Story = {
  render: () => (
    <ErrorsKitProvider errorMap={errorMap} handlerConfig={mockHandlerConfig}>
      <ErrorDemo errorType="medium" />
    </ErrorsKitProvider>
  ),
};

export const HighPriorityError: Story = {
  render: () => (
    <ErrorsKitProvider errorMap={errorMap} handlerConfig={mockHandlerConfig}>
      <ErrorDemo errorType="high" />
    </ErrorsKitProvider>
  ),
};

export const CriticalError: Story = {
  render: () => (
    <ErrorsKitProvider errorMap={errorMap} handlerConfig={mockHandlerConfig}>
      <ErrorDemo errorType="critical" />
    </ErrorsKitProvider>
  ),
};

export const AllErrorLevels: Story = {
  render: () => (
    <ErrorsKitProvider errorMap={errorMap} handlerConfig={mockHandlerConfig}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <ErrorDemo errorType="low" />
        <ErrorDemo errorType="medium" />
        <ErrorDemo errorType="high" />
        <ErrorDemo errorType="critical" />
      </div>
    </ErrorsKitProvider>
  ),
};

export const CustomConfiguration: Story = {
  render: () => {
    const customConfig: HandlerConfig = {
      onToast: (msg: string) => alert(`Toast: ${msg}`),
      onRedirect: (path: string) => alert(`Redirect to: ${path}`),
      on401: '/login',
    };

    return (
      <ErrorsKitProvider errorMap={errorMap} handlerConfig={customConfig}>
        <ErrorDemo errorType="low" />
      </ErrorsKitProvider>
    );
  },
};
