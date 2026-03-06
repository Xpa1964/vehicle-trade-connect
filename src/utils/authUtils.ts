
/**
 * Generate a secure random password for new users
 */
export const generatePassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  // Ensure we have at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 52)]; // letter
  password += '0123456789'[Math.floor(Math.random() * 10)]; // number
  password += '!@#$%^&*()-_=+'[Math.floor(Math.random() * 14)]; // special
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

/**
 * Safely sign out from Supabase ensuring proper cleanup
 * This helps prevent issues with token refreshing and auth state
 */
export const safeSignOut = async (supabaseClient: any) => {
  try {
    console.log('Performing safe sign out');
    
    // First clear any stored session data
    localStorage.removeItem('supabase.auth.token');
    
    // Then perform the actual sign out
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error during safe sign out:', error);
    // Still return true to indicate that the client-side session was cleared
    return true;
  }
};

/**
 * Send confirmation email for registration
 */
export const sendRegistrationConfirmationEmail = async (email: string, companyName: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'confirmation',
        data: {
          email,
          companyName
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send confirmation email');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

/**
 * Notify admins about new registration
 */
export const notifyAdminsAboutRegistration = async (email: string, companyName: string) => {
  try {
    // Here we would ideally fetch admin emails from the database
    // But for simplicity we'll send to a predefined address
    const adminEmail = "admin@example.com"; // This should be fetched from configuration
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'notification',
        data: {
          email: adminEmail,
          companyName
        }
      })
    });
    
    if (!response.ok) {
      console.warn('Failed to notify admins, but continuing');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error notifying admins:', error);
    return false; // Don't throw as this is non-critical
  }
};
