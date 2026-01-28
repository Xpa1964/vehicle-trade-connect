import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

describe('Dialog Component', () => {
  it('exports Dialog component', () => {
    expect(Dialog).toBeDefined();
  });

  it('exports DialogContent component', () => {
    expect(DialogContent).toBeDefined();
  });

  it('exports DialogHeader component', () => {
    expect(DialogHeader).toBeDefined();
  });

  it('exports DialogTitle component', () => {
    expect(DialogTitle).toBeDefined();
  });

  it('exports DialogDescription component', () => {
    expect(DialogDescription).toBeDefined();
  });

  it('exports DialogFooter component', () => {
    expect(DialogFooter).toBeDefined();
  });

  it('renders Dialog with content', () => {
    const { container } = render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test description</DialogDescription>
          </DialogHeader>
          <DialogFooter>Footer content</DialogFooter>
        </DialogContent>
      </Dialog>
    );
    
    expect(container).toBeDefined();
  });

  it('DialogTitle renders text', () => {
    const { getByText } = render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>My Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    
    expect(getByText('My Dialog Title')).toBeDefined();
  });

  it('DialogDescription renders text', () => {
    const { getByText } = render(
      <Dialog open={true}>
        <DialogContent>
          <DialogDescription>My dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    
    expect(getByText('My dialog description')).toBeDefined();
  });
});
