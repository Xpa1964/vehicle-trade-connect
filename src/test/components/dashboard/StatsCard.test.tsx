import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import StatsCard from '@/components/dashboard/StatsCard';
import { Car } from 'lucide-react';

describe('StatsCard Component', () => {
  const defaultProps = {
    title: 'Total Vehicles',
    value: 42,
    icon: Car,
  };

  it('renders with title and value', () => {
    const { getByText } = render(<StatsCard {...defaultProps} />);
    
    expect(getByText('Total Vehicles')).toBeDefined();
    expect(getByText('42')).toBeDefined();
  });

  it('displays description when provided', () => {
    const { getByText } = render(
      <StatsCard {...defaultProps} description="Active vehicles in system" />
    );
    
    expect(getByText('Active vehicles in system')).toBeDefined();
  });

  it('shows loading state', () => {
    const { container } = render(<StatsCard {...defaultProps} isLoading={true} />);
    
    const pulsingElements = container.querySelectorAll('.animate-pulse');
    expect(pulsingElements.length).toBeGreaterThan(0);
  });

  it('displays trend when provided', () => {
    const { getByText } = render(
      <StatsCard 
        {...defaultProps} 
        trend={{ value: 12, isPositive: true }}
      />
    );
    
    expect(getByText(/\+12%/)).toBeDefined();
  });

  it('shows positive trend indicator', () => {
    const { getByText } = render(
      <StatsCard 
        {...defaultProps} 
        trend={{ value: 12, isPositive: true }}
      />
    );
    
    const trendElement = getByText(/\+12%/);
    expect(trendElement.className).toContain('green');
  });

  it('shows negative trend indicator', () => {
    const { getByText } = render(
      <StatsCard 
        {...defaultProps} 
        trend={{ value: 5, isPositive: false }}
      />
    );
    
    const trendElement = getByText(/5%/);
    expect(trendElement.className).toContain('red');
  });

  it('renders icon component', () => {
    const { container } = render(<StatsCard {...defaultProps} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  it('accepts string value', () => {
    const { getByText } = render(
      <StatsCard {...defaultProps} value="€1,500" />
    );
    
    expect(getByText('€1,500')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatsCard {...defaultProps} className="custom-class" />
    );
    
    const card = container.firstChild;
    expect((card as HTMLElement)?.className).toContain('custom-class');
  });

  it('renders with primary variant', () => {
    const { container } = render(
      <StatsCard {...defaultProps} variant="primary" />
    );
    
    expect(container.querySelector('.card-primary')).toBeDefined();
  });

  it('renders with success variant', () => {
    const { container } = render(
      <StatsCard {...defaultProps} variant="success" />
    );
    
    expect(container.querySelector('.card-success')).toBeDefined();
  });

  it('has hover effect styles', () => {
    const { container } = render(<StatsCard {...defaultProps} />);
    
    const card = container.querySelector('[class*="hover:scale"]');
    expect(card).toBeDefined();
  });
});
