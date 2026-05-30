import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success('Reset link sent!');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#0D0A07' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <button onClick={() => navigate('/login')} style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
          cursor: 'pointer', color: 'rgba(245,237,216,0.35)', fontSize: 13, marginBottom: 48, padding: 0,
        }}>
          <ArrowLeft size={15} /> Back to login
        </button>

        {!sent ? (
          <>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: '#F5EDD8', margin: '0 0 8px', fontWeight: 300 }}>Reset password</h1>
            <p style={{ color: 'rgba(245,237,216,0.35)', fontSize: 14, marginBottom: 40 }}>We'll send a link to your email.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,237,216,0.2)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{
                    width: '100%', background: '#1C1612', border: '1px solid rgba(245,237,216,0.08)',
                    borderRadius: 12, padding: '14px 14px 14px 44px', color: '#F5EDD8',
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }} />
                </div>
              </div>
              <button type="submit" style={{
                background: '#E8832A', color: '#0D0A07', fontWeight: 600, fontSize: 14,
                padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer',
              }}>
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={56} color="#E8832A" style={{ marginBottom: 24 }} />
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, color: '#F5EDD8', marginBottom: 12 }}>Check your inbox</h1>
            <p style={{ color: 'rgba(245,237,216,0.35)', fontSize: 14, marginBottom: 32 }}>
              We sent a reset link to <span style={{ color: '#F5EDD8' }}>{email}</span>
            </p>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#E8832A', cursor: 'pointer', fontSize: 14 }}>
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};