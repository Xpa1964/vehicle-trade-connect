
import { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserWithMeta } from '@/types/auth';
import { enhanceUser } from '@/utils/userEnhancement';
import { toast } from 'sonner';
import { detectDesynchronization, autoRecovery } from '@/utils/sessionSynchronizer';

export const useAuthSession = () => {
  const [user, setUser] = useState<UserWithMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const authSubscription = useRef<{ unsubscribe: () => void } | null>(null);
  const authInitializing = useRef<boolean>(false);
  const userInitialized = useRef<boolean>(false);
  const enhancementTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncMonitor = useRef<(() => void) | null>(null);
  
  // Add detailed logging for notification debugging
  useEffect(() => {
    if (user) {
      console.log('🔍 [DEBUG NOTIFICATIONS] AuthSession user state:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasProfile: !!user.profile
      });
    } else {
      console.log('🔍 [DEBUG NOTIFICATIONS] AuthSession user is null');
    }
  }, [user]);
  
  // Setup auth state and session check only once on component mount
  useEffect(() => {
    // Set isMounted ref to true when the component mounts
    isMounted.current = true;
    
    const initAuth = async () => {
      // Prevent multiple simultaneous initialization attempts
      if (authInitializing.current) {
        console.log("[useAuthSession] Auth initialization already in progress, skipping...");
        return;
      }
      
      authInitializing.current = true;
      
      try {
        console.log("[useAuthSession] Initializing auth session...");
        setIsLoading(true);
        
        // First, set up the auth state listener to avoid missing events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("[useAuthSession] Auth state changed:", event);
            
            if (!isMounted.current) return;
            
            if (event === 'SIGNED_OUT') {
              console.log("[useAuthSession] User signed out");
              setUser(null);
              setIsLoading(false);
              userInitialized.current = false;
              
              // Clear any role cache when signing out
              for (const key in localStorage) {
                if (key.startsWith('user_role_')) {
                  localStorage.removeItem(key);
                }
              }
              return;
            }
            
            if (session?.user && !userInitialized.current) {
              console.log("[useAuthSession] Processing auth state change with session");
              userInitialized.current = true;
              
              // Use setTimeout to defer enhancement to prevent any deadlocks
              if (enhancementTimeout.current) {
                clearTimeout(enhancementTimeout.current);
              }
              
              enhancementTimeout.current = setTimeout(async () => {
                if (!isMounted.current) return;
                
                try {
                  console.log("[useAuthSession] Enhancing user from auth state change");
                  
                  // NUEVA VALIDACIÓN: Verificar sincronización antes de enhancement
                  console.log('🔍 [useAuthSession] Verificando sincronización frontend-backend...');
                  const isDesync = await detectDesynchronization();
                  
                  if (isDesync) {
                    console.warn('⚠️ [useAuthSession] Desincronización detectada, iniciando recovery...');
                    const recoverySuccess = await autoRecovery();
                    
                    if (!recoverySuccess) {
                      console.error('❌ [useAuthSession] Recovery falló, usando fallback');
                      const fallbackUser = { 
                        ...session.user, 
                        name: session.user.email?.split('@')[0] || `User-${session.user.id.substring(0, 6)}`, 
                        role: 'user' as any, 
                        profile: {} 
                      } as UserWithMeta;
                      setUser(fallbackUser);
                      setIsLoading(false);
                      return;
                    }
                  }
                  
                  const enhancedUser = await enhanceUser(session.user);
                  
                  if (isMounted.current && enhancedUser) {
                    console.log("[useAuthSession] ✅ Setting enhanced user:", 
                      { id: enhancedUser.id, role: enhancedUser.role });
                    console.log('🎯 [DEBUG NOTIFICATIONS] Enhanced user ready for notifications:', enhancedUser.id);
                    setUser(enhancedUser);
                    setIsLoading(false);
                  } else if (isMounted.current) {
                    // CRITICAL: If enhanceUser fails, create a GUARANTEED working fallback
                    console.warn("[useAuthSession] 🚨 enhanceUser returned null, creating fallback");
                    const fallbackUser = { 
                      ...session.user, 
                      name: session.user.email?.split('@')[0] || `User-${session.user.id.substring(0, 6)}`, 
                      role: 'user' as any, 
                      profile: {} 
                    } as UserWithMeta;
                    console.log('🎯 [DEBUG NOTIFICATIONS] Fallback user created for notifications:', fallbackUser.id);
                    setUser(fallbackUser);
                    setIsLoading(false);
                  }
                } catch (error) {
                  console.error("[useAuthSession] 🚨 Critical error enhancing user:", error);
                  if (isMounted.current) {
                    // EMERGENCY FALLBACK: Always ensure we have a user with valid ID
                    const emergencyUser = { 
                      ...session.user, 
                      name: session.user.email?.split('@')[0] || `User-${session.user.id.substring(0, 6)}`, 
                      role: 'user' as any, 
                      profile: {} 
                    } as UserWithMeta;
                    console.log('🎯 [DEBUG NOTIFICATIONS] Emergency user created for notifications:', emergencyUser.id);
                    setUser(emergencyUser);
                    setIsLoading(false);
                    
                    toast.error("Error loading user data", {
                      description: "Using basic profile. Notifications should still work."
                    });
                  }
                }
              }, 100); // Small delay for stability
            } else if (isMounted.current && !userInitialized.current) {
              setIsLoading(false);
            }
          }
        );
        
        // Save the subscription to clean up later
        authSubscription.current = subscription;
        
        // Then check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("[useAuthSession] Error getting session:", sessionError);
          if (isMounted.current) setIsLoading(false);
          authInitializing.current = false;
          return;
        }
        
        console.log("[useAuthSession] Initial session check:", !!session);
        
        if (session?.user && isMounted.current && !userInitialized.current) {
          userInitialized.current = true;
          
          try {
            console.log("[useAuthSession] Enhancing initial user");
            
            // NUEVA VALIDACIÓN: Verificar sincronización al inicio
            console.log('🔍 [useAuthSession] Verificando sincronización inicial...');
            const isDesync = await detectDesynchronization();
            
            if (isDesync) {
              console.warn('⚠️ [useAuthSession] Desincronización inicial detectada, iniciando recovery...');
              const recoverySuccess = await autoRecovery();
              
              if (!recoverySuccess) {
                console.error('❌ [useAuthSession] Recovery inicial falló, usando fallback');
                const fallbackUser = { 
                  ...session.user, 
                  name: session.user.email?.split('@')[0] || `User-${session.user.id.substring(0, 6)}`, 
                  role: 'user' as any, 
                  profile: {} 
                } as UserWithMeta;
                setUser(fallbackUser);
                if (isMounted.current) setIsLoading(false);
                return;
              }
            }
            
            const enhancedUser = await enhanceUser(session.user);
            
            if (isMounted.current && enhancedUser) {
              console.log("[useAuthSession] ✅ Setting initial user:", 
                { id: enhancedUser.id, role: enhancedUser.role });
              console.log('🎯 [DEBUG NOTIFICATIONS] Initial enhanced user ready for notifications:', enhancedUser.id);
              setUser(enhancedUser);
            } else if (isMounted.current) {
              // CRITICAL: Create guaranteed working user for notifications
              console.warn("[useAuthSession] 🚨 Initial enhanceUser failed, creating fallback");
              const fallbackUser = { 
                ...session.user, 
                name: session.user.email?.split('@')[0] || `User-${session.user.id.substring(0, 6)}`, 
                role: 'user' as any, 
                profile: {} 
              } as UserWithMeta;
              console.log('🎯 [DEBUG NOTIFICATIONS] Initial fallback user created for notifications:', fallbackUser.id);
              setUser(fallbackUser);
            }
          } catch (error) {
            console.error("[useAuthSession] 🚨 Critical error enhancing initial user:", error);
            if (isMounted.current) {
              // EMERGENCY FALLBACK: Always create a working user
              const emergencyUser = { 
                ...session.user, 
                name: session.user.email?.split('@')[0] || `User-${session.user.id.substring(0, 6)}`, 
                role: 'user' as any, 
                profile: {} 
              } as UserWithMeta;
              console.log('🎯 [DEBUG NOTIFICATIONS] Initial emergency user created for notifications:', emergencyUser.id);
              setUser(emergencyUser);
              
              toast.error("Error loading user data", {
                description: "Using basic profile. Notifications should still work."
              });
            }
          }
        } else if (isMounted.current && !userInitialized.current) {
          console.log("[useAuthSession] No initial user session found");
          setUser(null);
        }
        
        if (isMounted.current) setIsLoading(false);
        authInitializing.current = false;
      } catch (error) {
        console.error("[useAuthSession] Error initializing auth:", error);
        if (isMounted.current) {
          setIsLoading(false);
          setUser(null);
          userInitialized.current = false;
          
          toast.error("Error al inicializar la autenticación", {
            description: "Intente recargar la página."
          });
        }
        authInitializing.current = false;
      }
    };
    
    initAuth();
    
    // Clean up function to run when component unmounts
    return () => {
      isMounted.current = false;
      if (authSubscription.current) {
        console.log("[useAuthSession] Cleaning up auth subscription");
        authSubscription.current.unsubscribe();
      }
      if (enhancementTimeout.current) {
        clearTimeout(enhancementTimeout.current);
      }
      if (syncMonitor.current) {
        console.log("[useAuthSession] Cleaning up sync monitor");
        syncMonitor.current();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Provide a stable interface
  return { user, setUser, isLoading };
};
