import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#1C1612', border: '1px solid rgba(245,237,216,0.08)',
    borderRadius: 12, padding: '14px 14px 14px 44px', color: '#F5EDD8',
    fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0D0A07' }}>
      {/* Left image panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'none' }} className="login-image">
        <img src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1200&auto=format&fit=crop" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0D0A07, rgba(13,10,7,0.4), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 64, left: 64 }}>
          <blockquote style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: '#F5EDD8', lineHeight: 1.3, maxWidth: 340 }}>
            "Cooking is love made visible."
          </blockquote>
          <p style={{ color: '#E8832A', fontSize: 13, marginTop: 16, letterSpacing: 3 }}>— Crooksie</p>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ flex: 1, maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
            <div style={{ width: 28, height: 28, background: '#E8832A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#0D0A07', fontWeight: 700, fontSize: 13 }}>C</span>
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5EDD8', fontSize: 16, letterSpacing: 4, textTransform: 'uppercase' }}>Crooksie</span>
          </Link>

          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: '#F5EDD8', margin: '0 0 8px', fontWeight: 300 }}>Welcome back</h1>
          <p style={{ color: 'rgba(245,237,216,0.35)', fontSize: 14, marginBottom: 40 }}>Sign in to your kitchen.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,237,216,0.2)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(232,131,42,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(245,237,216,0.08)'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: '#E8832A', textDecoration: 'none' }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,237,216,0.2)' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(232,131,42,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(245,237,216,0.08)'}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#E8832A', color: '#0D0A07', fontWeight: 600, fontSize: 14,
              padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: 8,
            }}>
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(245,237,216,0.25)', fontSize: 13, marginTop: 32 }}>
            No account?{' '}
            <Link to="/signup" style={{ color: '#E8832A', textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .login-image { display: block !important; } }
      `}</style>
    </div>
  );
};