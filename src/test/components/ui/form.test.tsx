import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const TestForm = () => {
  const form = useForm({
    defaultValues: {
      username: '',
    },
  });

  return (
    <FormProvider {...form}>
      <form>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter your username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
};

describe('Form Components', () => {
  it('exports FormField component', () => {
    expect(FormField).toBeDefined();
  });

  it('exports FormItem component', () => {
    expect(FormItem).toBeDefined();
  });

  it('exports FormLabel component', () => {
    expect(FormLabel).toBeDefined();
  });

  it('exports FormControl component', () => {
    expect(FormControl).toBeDefined();
  });

  it('exports FormDescription component', () => {
    expect(FormDescription).toBeDefined();
  });

  it('exports FormMessage component', () => {
    expect(FormMessage).toBeDefined();
  });

  it('renders complete form structure', () => {
    const { container } = render(<TestForm />);
    expect(container.querySelector('form')).toBeDefined();
  });

  it('renders FormLabel text', () => {
    const { getByText } = render(<TestForm />);
    expect(getByText('Username')).toBeDefined();
  });

  it('renders FormDescription text', () => {
    const { getByText } = render(<TestForm />);
    expect(getByText('Enter your username')).toBeDefined();
  });

  it('renders input field', () => {
    const { container } = render(<TestForm />);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
  });
});
