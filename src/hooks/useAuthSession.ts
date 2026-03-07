
import { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserWithMeta } from '@/types/auth';
import { enhanceUser } from '@/utils/userEnhancement';
import { toast } from 'sonner';
import { detectDesynchronization, autoRecovery } from '@/utils/sessionSynchronizer';
import { clearCachedRole } from '@/utils/roles/roleCache';

export const useAuthSession = () => {
  const [user, setUser] = useState<UserWithMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const authSubscription = useRef<{ unsubscribe: () => void } | null>(null);
  const authInitializing = useRef<boolean>(false);
  const userInitialized = useRef<boolean>(false);
  const enhancingUser = useRef<boolean>(false);
  const enhancementTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncMonitor = useRef<(() => void) | null>(null);
  
  const createFallbackUser = (sessionUser: any): UserWithMeta => ({
    ...sessionUser,
    name: sessionUser.email?.split('@')[0] || `User-${sessionUser.id.substring(0, 6)}`,
    role: 'user' as any,
    profile: {}
  } as UserWithMeta);

  const handleDesyncRecovery = async (session: Session): Promise<UserWithMeta | null> => {
    const isDesync = await detectDesynchronization();
    if (isDesync) {
      const recoverySuccess = await autoRecovery();
      if (!recoverySuccess) {
        return createFallbackUser(session.user);
      }
    }
    return null; // No desync, proceed normally
  };

  // Setup auth state and session check only once on component mount
  useEffect(() => {
    isMounted.current = true;
    
    const initAuth = async () => {
      if (authInitializing.current) return;
      authInitializing.current = true;
      
      try {
        setIsLoading(true);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!isMounted.current) return;
            
            if (event === 'SIGNED_OUT') {
              setUser(null);
              setIsLoading(false);
              userInitialized.current = false;
              for (const key in localStorage) {
                if (key.startsWith('user_role_')) {
                  localStorage.removeItem(key);
                }
              }
              return;
            }
            
            if (session?.user && !userInitialized.current) {
              userInitialized.current = true;
              enhancingUser.current = true;
              
              if (enhancementTimeout.current) {
                clearTimeout(enhancementTimeout.current);
              }
              
              enhancementTimeout.current = setTimeout(async () => {
                if (!isMounted.current) return;
                
                try {
                  clearCachedRole(session.user.id);
                  
                  const desyncFallback = await handleDesyncRecovery(session);
                  if (desyncFallback) {
                    setUser(desyncFallback);
                    setIsLoading(false);
                    enhancingUser.current = false;
                    return;
                  }
                  
                  const enhancedUser = await enhanceUser(session.user);
                  
                  if (isMounted.current) {
                    setUser(enhancedUser || createFallbackUser(session.user));
                    setIsLoading(false);
                    enhancingUser.current = false;
                  }
                } catch (error) {
                  console.error("[useAuthSession] Critical error enhancing user:", error);
                  if (isMounted.current) {
                    setUser(createFallbackUser(session.user));
                    setIsLoading(false);
                    enhancingUser.current = false;
                    toast.error("Error loading user data", {
                      description: "Using basic profile. Notifications should still work."
                    });
                  }
                }
              }, 100);
            } else if (isMounted.current && !userInitialized.current) {
              setIsLoading(false);
            }
          }
        );
        
        authSubscription.current = subscription;
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[useAuthSession] Error getting session:", sessionError);
          if (isMounted.current) setIsLoading(false);
          authInitializing.current = false;
          return;
        }
        
        if (session?.user && isMounted.current && !userInitialized.current) {
          userInitialized.current = true;
          enhancingUser.current = true;
          
          try {
            clearCachedRole(session.user.id);
            
            const desyncFallback = await handleDesyncRecovery(session);
            if (desyncFallback) {
              setUser(desyncFallback);
              if (isMounted.current) setIsLoading(false);
              enhancingUser.current = false;
              return;
            }
            
            const enhancedUser = await enhanceUser(session.user);
            
            if (isMounted.current) {
              setUser(enhancedUser || createFallbackUser(session.user));
            }
          } catch (error) {
            console.error("[useAuthSession] Critical error enhancing initial user:", error);
            if (isMounted.current) {
              setUser(createFallbackUser(session.user));
              toast.error("Error loading user data", {
                description: "Using basic profile. Notifications should still work."
              });
            }
          } finally {
            enhancingUser.current = false;
          }
        } else if (isMounted.current && !userInitialized.current) {
          setUser(null);
        }

        if (isMounted.current && !enhancingUser.current) setIsLoading(false);
        authInitializing.current = false;
      } catch (error) {
        console.error("[useAuthSession] Error initializing auth:", error);
        if (isMounted.current) {
          setIsLoading(false);
          setUser(null);
          userInitialized.current = false;
          enhancingUser.current = false;
          toast.error("Error al inicializar la autenticación", {
            description: "Intente recargar la página."
          });
        }
        authInitializing.current = false;
      }
    };
    
    initAuth();
    
    return () => {
      isMounted.current = false;
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
      if (enhancementTimeout.current) {
        clearTimeout(enhancementTimeout.current);
      }
      if (syncMonitor.current) {
        syncMonitor.current();
      }
    };
  }, []);

  return { user, setUser, isLoading };
};
