import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

describe('Select Components', () => {
  it('exports Select component', () => {
    expect(Select).toBeDefined();
  });

  it('exports SelectContent component', () => {
    expect(SelectContent).toBeDefined();
  });

  it('exports SelectItem component', () => {
    expect(SelectItem).toBeDefined();
  });

  it('exports SelectTrigger component', () => {
    expect(SelectTrigger).toBeDefined();
  });

  it('exports SelectValue component', () => {
    expect(SelectValue).toBeDefined();
  });

  it('renders Select with trigger', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(container).toBeDefined();
  });

  it('renders SelectValue placeholder', () => {
    const { getByText } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose one" />
        </SelectTrigger>
      </Select>
    );
    
    expect(getByText('Choose one')).toBeDefined();
  });

  it('renders SelectItem with value', () => {
    const { getByText } = render(
      <Select open={true}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test Item</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(getByText('Test Item')).toBeDefined();
  });

  it('renders multiple SelectItems', () => {
    const { getByText } = render(
      <Select open={true}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Item 1</SelectItem>
          <SelectItem value="2">Item 2</SelectItem>
          <SelectItem value="3">Item 3</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(getByText('Item 1')).toBeDefined();
    expect(getByText('Item 2')).toBeDefined();
    expect(getByText('Item 3')).toBeDefined();
  });
});
