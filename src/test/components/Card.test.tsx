import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      const { getByText } = render(<Card>Card Content</Card>);
      expect(getByText('Card Content')).toBeDefined();
    });

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-class');
    });

    it('has default styling', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('rounded-lg');
      expect(card.className).toContain('bg-white');
    });
  });

  describe('CardHeader', () => {
    it('renders correctly', () => {
      const { getByText } = render(<CardHeader>Header Content</CardHeader>);
      expect(getByText('Header Content')).toBeDefined();
    });

    it('has correct spacing', () => {
      const { container } = render(<CardHeader>Content</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain('p-6');
    });
  });

  describe('CardTitle', () => {
    it('renders as h3 element', () => {
      const { getByText } = render(<CardTitle>Title Text</CardTitle>);
      const title = getByText('Title Text');
      expect(title.tagName).toBe('H3');
    });

    it('has correct typography', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const title = container.querySelector('h3');
      expect(title?.className).toContain('text-xl');
      expect(title?.className).toContain('font-light');
    });
  });

  describe('CardDescription', () => {
    it('renders as paragraph', () => {
      const { getByText } = render(<CardDescription>Description text</CardDescription>);
      const desc = getByText('Description text');
      expect(desc.tagName).toBe('P');
    });

    it('has muted styling', () => {
      const { container } = render(<CardDescription>Text</CardDescription>);
      const desc = container.querySelector('p');
      expect(desc?.className).toContain('text-sm');
      expect(desc?.className).toContain('text-gray-600');
    });
  });

  describe('CardContent', () => {
    it('renders children', () => {
      const { getByText } = render(<CardContent>Content Area</CardContent>);
      expect(getByText('Content Area')).toBeDefined();
    });

    it('has no top padding', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.firstChild as HTMLElement;
      expect(content.className).toContain('pt-0');
    });
  });

  describe('CardFooter', () => {
    it('renders footer content', () => {
      const { getByText } = render(<CardFooter>Footer Content</CardFooter>);
      expect(getByText('Footer Content')).toBeDefined();
    });

    it('uses flexbox layout', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer.className).toContain('flex');
      expect(footer.className).toContain('items-center');
    });
  });

  describe('Complete Card', () => {
    it('renders all parts together', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(getByText('Test Card')).toBeDefined();
      expect(getByText('Test Description')).toBeDefined();
      expect(getByText('Test Content')).toBeDefined();
      expect(getByText('Test Footer')).toBeDefined();
    });
  });
});
