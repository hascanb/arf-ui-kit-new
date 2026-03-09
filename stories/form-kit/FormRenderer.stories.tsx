import type { Meta, StoryObj } from '@storybook/react';
import { SchemaForm } from '../../src/form-kit/components/SchemaForm';
import { FormKitProvider } from '../../src/form-kit/context/FormKitProvider';
import { z } from 'zod';

const meta: Meta<typeof SchemaForm> = {
  title: 'Form-Kit/SchemaForm',
  component: SchemaForm,
  decorators: [
    (Story) => (
      <FormKitProvider>
        <div className="min-h-screen p-8 bg-background">
          <div className="max-w-2xl mx-auto">
            <Story />
          </div>
        </div>
      </FormKitProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SchemaForm>;

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18').max(100, 'Must be under 100'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  country: z.string().min(1, 'Please select a country'),
  newsletter: z.boolean(),
});

export const Default: Story = {
  args: {
    config: {
      schema: userFormSchema,
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'John Doe',
          description: 'Your full name as it appears on your ID',
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'john@example.com',
        },
        {
          name: 'age',
          label: 'Age',
          type: 'number',
          placeholder: '25',
        },
        {
          name: 'bio',
          label: 'Bio',
          type: 'textarea',
          placeholder: 'Tell us about yourself...',
          rows: 4,
        },
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          placeholder: 'Select a country',
          options: [
            { label: 'United States', value: 'us' },
            { label: 'United Kingdom', value: 'uk' },
            { label: 'Canada', value: 'ca' },
            { label: 'Australia', value: 'au' },
            { label: 'Turkey', value: 'tr' },
          ],
        },
        {
          name: 'newsletter',
          label: 'Subscribe to newsletter',
          type: 'checkbox',
        },
      ],
      onSubmit: async (data: z.infer<typeof userFormSchema>) => {
        console.log('Form submitted:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert('Form submitted successfully! Check console for data.');
      },
      submitButton: {
        text: 'Create Account',
      },
    },
  },
};

export const SimpleForm: Story = {
  args: {
    config: {
      schema: z.object({
        name: z.string().min(2),
        email: z.string().email(),
      }),
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
      ],
      onSubmit: async (data: any) => {
        console.log('Simple form:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      submitButton: {
        text: 'Submit',
      },
    },
  },
};

export const WithDefaultValues: Story = {
  args: {
    config: {
      schema: userFormSchema,
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'John Doe',
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'john@example.com',
        },
        {
          name: 'age',
          label: 'Age',
          type: 'number',
          placeholder: '25',
        },
      ],
      defaultValues: {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      },
      onSubmit: async (data: any) => {
        console.log('Form with defaults:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      submitButton: {
        text: 'Update Profile',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    config: {
      schema: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
          disabled: true,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
          disabled: true,
        },
      ],
      defaultValues: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      onSubmit: async (data: any) => {
        console.log('Disabled form:', data);
      },
      submitButton: {
        text: 'Submit',
        disabled: true,
      },
    },
  },
};
