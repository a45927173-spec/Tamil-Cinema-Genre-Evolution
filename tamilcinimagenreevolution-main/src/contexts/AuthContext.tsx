import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const currentUser = localStorage.getItem("tamil_cinema_current_user");
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        // Create a minimal User-like object
        setUser({
          id: userData.email,
          email: userData.email,
          user_metadata: { username: userData.username },
          app_metadata: {},
          aud: "authenticated",
          confirmation_sent_at: null,
          email_change: null,
          email_change_confirmation_token: null,
          email_change_token: null,
          email_change_token_new: null,
          email_confirmed_at: null,
          identities: [],
          last_sign_in_at: null,
          phone: null,
          phone_change: null,
          phone_change_confirmation_token: null,
          phone_change_token: null,
          phone_change_token_new: null,
          phone_confirmed_at: null,
          recovery_sent_at: null,
          role: "authenticated",
          updated_at: userData.createdAt,
          created_at: userData.createdAt,
        } as any);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem("tamil_cinema_current_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
