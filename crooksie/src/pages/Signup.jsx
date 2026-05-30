import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await signup(username, email, password); toast.success('Welcome to Crooksie! 🎉'); navigate('/'); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', background: '#FFFBF7', border: '1.5px solid #FED7AA', borderRadius: 14, padding: '14px 14px 14px 46px', color: '#1C0A00', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif' };
  const focus = (e) => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; };
  const blur = (e) => { e.target.style.borderColor = '#FED7AA'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#FFFBF7' }}>
      <div className="auth-image" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'none' }}>
        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(234,88,12,0.85), rgba(249,115,22,0.6))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 64 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.2)' }}>
            <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, color: 'white', lineHeight: 1.4, marginBottom: 16 }}>"Every great cook started by sharing one recipe."</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>— Join thousands of creators</p>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #EA580C, #F97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Fraunces, serif', color: 'white', fontWeight: 700, fontSize: 16 }}>C</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', color: '#1C0A00', fontSize: 20, fontWeight: 600 }}>Crooksie</span>
          </Link>

          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 42, color: '#1C0A00', margin: '0 0 8px', fontWeight: 400 }}>Join Crooksie 🍳</h1>
          <p style={{ color: '#92400E', fontSize: 15, marginBottom: 36, opacity: 0.8 }}>Start your culinary journey today.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'Username', icon: User, type: 'text', value: username, setter: setUsername, placeholder: 'janes_kitchen' },
              { label: 'Email', icon: Mail, type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
              { label: 'Password', icon: Lock, type: 'password', value: password, setter: setPassword, placeholder: '••••••••' },
            ].map(({ label, icon: Icon, type, value, setter, placeholder }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 12, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#F97316' }} />
                  <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} required style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', fontWeight: 700, fontSize: 15, padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer', marginTop: 4, boxShadow: '0 6px 20px rgba(249,115,22,0.35)', opacity: loading ? 0.8 : 1 }}>
              {loading ? 'Creating account…' : <><span>Sign Up Free</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#92400E', fontSize: 14, marginTop: 28, opacity: 0.7 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#EA580C', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>
      <style>{`@media(min-width:768px){.auth-image{display:block!important}}`}</style>
    </div>
  );
};