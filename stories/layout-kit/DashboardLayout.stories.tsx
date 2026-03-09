import type { Meta, StoryObj } from '@storybook/react';
import { DashboardLayout } from '../../src/layout-kit/components/DashboardLayout';
import {
  Home,
  Users,
  Settings,
  Package,
  FileText,
  BarChart,
} from 'lucide-react';

const sampleNavigation = [
  {
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        title: 'Users',
        href: '/users',
        icon: Users,
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        title: 'Products',
        href: '/products',
        icon: Package,
      },
      {
        title: 'Reports',
        href: '/reports',
        icon: FileText,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

const DemoContent = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Dashboard Content</h1>
    <p className="text-muted-foreground mb-6">
      This is the main content area of your dashboard. You can place any
      components here.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Card {i}</h3>
          <p className="text-muted-foreground">
            Sample card content. Replace with your own components.
          </p>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta<typeof DashboardLayout> = {
  title: 'Layout-Kit/DashboardLayout',
  component: DashboardLayout,
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
type Story = StoryObj<typeof DashboardLayout>;

export const Default: Story = {
  args: {
    brand: {
      title: 'ARF UI Kit',
      subtitle: 'Component Library',
      url: '/',
      icon: Home,
    },
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://github.com/shadcn.png',
      role: 'Admin',
    },
    navGroups: sampleNavigation,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    children: <DemoContent />,
  },
};

export const WithoutFooter: Story = {
  args: {
    brand: {
      title: 'ARF UI Kit',
      subtitle: 'Component Library',
      url: '/',
      icon: Home,
    },
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://github.com/shadcn.png',
      role: 'Admin',
    },
    navGroups: sampleNavigation,
    showFooter: false,
    children: <DemoContent />,
  },
};

export const WithNotifications: Story = {
  args: {
    brand: {
      title: 'ARF UI Kit',
      subtitle: 'Component Library',
      url: '/',
      icon: Home,
    },
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://github.com/shadcn.png',
      role: 'Admin',
    },
    navGroups: sampleNavigation,
    notificationCount: 5,
    onNotificationClick: () => alert('Notifications clicked'),
    children: <DemoContent />,
  },
};

export const MinimalLayout: Story = {
  args: {
    brand: {
      title: 'App',
      subtitle: 'Dashboard',
      url: '/',
      icon: Home,
    },
    user: {
      name: 'User',
      email: 'user@example.com',
      avatar: 'https://github.com/shadcn.png',
      role: 'User',
    },
    navGroups: [
      {
        title: 'Menu',
        items: [
          { title: 'Home', href: '/', icon: Home },
          { title: 'Settings', href: '/settings', icon: Settings },
        ],
      },
    ],
    children: <DemoContent />,
  },
};
