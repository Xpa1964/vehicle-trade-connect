import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

// Mock AuthContext
const mockLogin = vi.fn();
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      isLoading: false,
      isAuthenticated: false,
    }),
  };
});

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with all fields', () => {
    const { getByLabelText, getByRole } = renderLogin();
    
    expect(getByLabelText(/email/i)).toBeDefined();
    expect(getByLabelText(/password/i)).toBeDefined();
    expect(getByRole('button', { name: /login|iniciar/i })).toBeDefined();
  });

  it('displays logo image', () => {
    const { getByAltText } = renderLogin();
    
    const logo = getByAltText(/kontact vo logo/i);
    expect(logo).toBeDefined();
  });

  it('shows error when submitting empty form', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderLogin();
    
    const submitButton = getByRole('button', { name: /login|iniciar/i });
    await user.click(submitButton);
    
    // Form validation should prevent submission
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login function with correct credentials', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(true);
    
    const { getByLabelText, getByRole } = renderLogin();
    
    const emailInput = getByLabelText(/email/i);
    const passwordInput = getByLabelText(/password/i);
    const submitButton = getByRole('button', { name: /login|iniciar/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('shows link to register page', () => {
    const { getByRole } = renderLogin();
    
    const registerLink = getByRole('link', { name: /register|registr/i });
    expect(registerLink).toBeDefined();
    expect(registerLink.getAttribute('href')).toBe('/register');
  });

  it('shows link to forgot password', () => {
    const { getByRole } = renderLogin();
    
    const forgotPasswordLink = getByRole('link', { name: /forgot.*password|olvid/i });
    expect(forgotPasswordLink).toBeDefined();
    expect(forgotPasswordLink.getAttribute('href')).toBe('/forgot-password');
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));
    
    const { getByLabelText, getByRole } = renderLogin();
    
    const emailInput = getByLabelText(/email/i);
    const passwordInput = getByLabelText(/password/i);
    const submitButton = getByRole('button', { name: /login|iniciar/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(submitButton).toHaveProperty('disabled', true);
  });
});
