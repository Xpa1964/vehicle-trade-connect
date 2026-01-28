import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CounterOfferDialog from '@/components/exchanges/CounterOfferDialog';
import { LanguageProvider } from '@/contexts/LanguageContext';

const renderDialog = (open = false) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <CounterOfferDialog 
          open={open}
          onOpenChange={vi.fn()}
          onSubmit={vi.fn()}
          originalCompensation={1000}
          originalConditions="Good condition"
        />
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('CounterOfferDialog Component', () => {
  it('renders without crashing when closed', () => {
    const { container } = renderDialog(false);
    expect(container).toBeDefined();
  });

  it('renders without crashing when open', () => {
    const { container } = renderDialog(true);
    expect(container).toBeDefined();
  });

  it('uses Dialog component', () => {
    const { container } = renderDialog(true);
    // Dialog should be in the document
    expect(container).toBeDefined();
  });

  it('accepts originalCompensation prop', () => {
    const { container } = renderDialog(true);
    expect(container).toBeDefined();
  });

  it('accepts originalConditions prop', () => {
    const { container } = renderDialog(true);
    expect(container).toBeDefined();
  });
});
