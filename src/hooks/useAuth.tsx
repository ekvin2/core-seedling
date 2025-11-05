import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener - MUST NOT be async
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only synchronous updates here to prevent deadlock
        setSession(session);
        setUser(session?.user ?? null);

        // Defer async profile fetching with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(async () => {
            try {
              // Single optimized query combining profile and role data
              const [{ data: profileData }, { data: roleData }] = await Promise.all([
                supabase.from('profiles').select('*').eq('user_id', session.user.id).single(),
                supabase.from('user_roles').select('role').eq('user_id', session.user.id).maybeSingle()
              ]);
              
              setProfile({
                ...profileData,
                role: roleData?.role || 'user'
              });
            } catch (error) {
              console.error('Error fetching profile:', error);
              setProfile(null);
            }
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          // Single optimized query combining profile and role data
          const [{ data: profileData }, { data: roleData }] = await Promise.all([
            supabase.from('profiles').select('*').eq('user_id', session.user.id).single(),
            supabase.from('user_roles').select('role').eq('user_id', session.user.id).maybeSingle()
          ]);
          
          setProfile({
            ...profileData,
            role: roleData?.role || 'user'
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Ensure local auth state is cleared immediately after sign out
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};