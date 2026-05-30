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
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) { toast.error(error.message); return; }
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'linear-gradient(160deg, #FFF7ED, #FFFBF7)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', fontSize: 14, fontWeight: 600, marginBottom: 48, padding: 0 }}>
          <ArrowLeft size={16} /> Back to login
        </button>

        {!sent ? (
          <div style={{ background: 'white', borderRadius: 28, padding: 40, boxShadow: '0 8px 40px rgba(249,115,22,0.1)', border: '1px solid #FED7AA' }}>
            <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #FEF3C7, #FED7AA)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Mail size={28} color="#F97316" />
            </div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 36, color: '#1C0A00', margin: '0 0 8px', fontWeight: 400 }}>Reset password</h1>
            <p style={{ color: '#92400E', fontSize: 14, marginBottom: 32, opacity: 0.8 }}>We'll send a reset link to your email.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#F97316' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', background: '#FFFBF7', border: '1.5px solid #FED7AA', borderRadius: 14, padding: '14px 14px 14px 46px', color: '#1C0A00', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#FED7AA'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(249,115,22,0.3)' }}>
                Send Reset Link
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 28, padding: 48, boxShadow: '0 8px 40px rgba(249,115,22,0.1)', border: '1px solid #FED7AA', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={36} color="#16A34A" />
            </div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 32, color: '#1C0A00', marginBottom: 12, fontWeight: 400 }}>Check your inbox!</h1>
            <p style={{ color: '#92400E', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
              We sent a reset link to <strong>{email}</strong>
            </p>
            <button onClick={() => navigate('/login')} style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 99, border: 'none', cursor: 'pointer' }}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};