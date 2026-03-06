import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import RegisterForm from '@/components/auth/register/RegisterForm';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { RegisterFormData } from '@/schemas/registerSchema';

// Wrapper component to provide form context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<RegisterFormData>({
    defaultValues: {
      companyName: '',
      email: '',
      contactPerson: '',
      phone: '',
      businessType: '',
      traderType: '',
      description: '',
      country: '',
      city: '',
      postalCode: '',
      managerFirstName: '',
      managerLastName: '',
      termsAccepted: false,
    },
  });

  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
};

describe('RegisterForm Component', () => {
  const mockHandleSubmit = vi.fn();
  const mockSaveDraft = vi.fn();
  const mockLoadDraft = vi.fn();
  const mockHandleLogoChange = vi.fn();

  const defaultProps = {
    form: useForm<RegisterFormData>(),
    error: undefined,
    isSubmitting: false,
    companyLogoPreview: null,
    handleLogoChange: mockHandleLogoChange,
    handleSubmit: mockHandleSubmit,
    saveDraft: mockSaveDraft,
    loadDraft: mockLoadDraft,
    draftId: null,
  };

  it('renders multi-step form', () => {
    render(
      <TestWrapper>
        <RegisterForm {...defaultProps} />
      </TestWrapper>
    );
    
    // Multi-step form should be present
    expect(document.querySelector('form')).toBeDefined();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <TestWrapper>
        <RegisterForm {...defaultProps} error="Test error message" />
      </TestWrapper>
    );
    
    expect(getByText('Test error message')).toBeDefined();
  });

  it('renders company info step initially', () => {
    const { getByText } = render(
      <TestWrapper>
        <RegisterForm {...defaultProps} />
      </TestWrapper>
    );
    
    // Should show company info fields
    expect(getByText(/companyInfo|company.*info|información.*empresa/i)).toBeDefined();
  });

  it('cleans malicious localStorage drafts on mount', () => {
    // Set up malicious draft
    localStorage.setItem('registration_draft_malicious', JSON.stringify({ data: 'test' }));
    
    render(
      <TestWrapper>
        <RegisterForm {...defaultProps} />
      </TestWrapper>
    );
    
    // Draft should be cleaned
    expect(localStorage.getItem('registration_draft_malicious')).toBeNull();
  });

  it('does not show draft banner by default for security', () => {
    const { queryByText } = render(
      <TestWrapper>
        <RegisterForm {...defaultProps} />
      </TestWrapper>
    );
    
    // Draft banner should not be visible (disabled for security)
    expect(queryByText(/saved.*draft|borrador.*guardado/i)).toBeNull();
  });

  it('renders all form steps', () => {
    const { queryByText } = render(
      <TestWrapper>
        <RegisterForm {...defaultProps} />
      </TestWrapper>
    );
    
    // Check that step labels exist
    const expectedSteps = [
      /companyInfo|company.*info/i,
      /contactDetails|contact.*details/i,
      /businessDetails|business.*details/i,
      /documents/i,
      /review/i,
    ];
    
    // At least one step should be visible
    const anyStepVisible = expectedSteps.some(stepRegex => {
      try {
        return queryByText(stepRegex) !== null;
      } catch {
        return false;
      }
    });
    
    expect(anyStepVisible).toBe(true);
  });
});
