import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchProfile(session.user.id);
      else { setUser(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setUser(data);
    setLoading(false);
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup = async (username, email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        bio: '',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      });
      if (profileError) throw new Error(profileError.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (error) throw new Error(error.message);
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};