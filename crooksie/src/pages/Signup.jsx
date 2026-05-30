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
    try {
      await signup(username, email, password);
      toast.success('Welcome to Crooksie!');
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

  const fields = [
    { label: 'Username', icon: User, type: 'text', value: username, setter: setUsername, placeholder: 'janes_kitchen' },
    { label: 'Email', icon: Mail, type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
    { label: 'Password', icon: Lock, type: 'password', value: password, setter: setPassword, placeholder: '••••••••' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0D0A07' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'none' }} className="signup-image">
        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0D0A07, rgba(13,10,7,0.4), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 64, left: 64 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: '#F5EDD8', lineHeight: 1.3, maxWidth: 340 }}>
            Share your recipes with the world.
          </h2>
          <p style={{ color: '#E8832A', fontSize: 13, marginTop: 16, letterSpacing: 3 }}>— Join thousands of cooks</p>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
            <div style={{ width: 28, height: 28, background: '#E8832A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#0D0A07', fontWeight: 700, fontSize: 13 }}>C</span>
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5EDD8', fontSize: 16, letterSpacing: 4, textTransform: 'uppercase' }}>Crooksie</span>
          </Link>

          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: '#F5EDD8', margin: '0 0 8px', fontWeight: 300 }}>Create account</h1>
          <p style={{ color: 'rgba(245,237,216,0.35)', fontSize: 14, marginBottom: 40 }}>Start your culinary journey.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {fields.map(({ label, icon: Icon, type, value, setter, placeholder }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,237,216,0.2)' }} />
                  <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(232,131,42,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(245,237,216,0.08)'}
                  />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#E8832A', color: '#0D0A07', fontWeight: 600, fontSize: 14,
              padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: 8,
            }}>
              {loading ? 'Creating account…' : <><span>Sign Up</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(245,237,216,0.25)', fontSize: 13, marginTop: 32 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#E8832A', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .signup-image { display: block !important; } }
      `}</style>
    </div>
  );
};