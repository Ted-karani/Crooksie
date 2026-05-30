import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, PlusSquare, User, LogOut, Bookmark, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(255,251,247,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(249,115,22,0.12)' : 'none',
        padding: scrolled ? '10px 0' : '18px 0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #EA580C, #F97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'white', fontWeight: 700, fontSize: 16 }}>C</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1C0A00', fontSize: 20, fontWeight: 600, letterSpacing: -0.5 }}>Crooksie</span>
          </Link>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[['/', 'Home'], ['/search', 'Browse'], ...(user ? [['/post', 'Post Recipe']] : [])].map(([path, label]) => (
              <Link key={path} to={path} style={{
                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                color: isActive(path) ? '#EA580C' : '#78350F',
                borderBottom: isActive(path) ? '2px solid #EA580C' : '2px solid transparent',
                paddingBottom: 2, transition: 'all 0.2s',
              }}>{label}</Link>
            ))}
          </div>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/search" style={{ color: '#92400E', display: 'flex', padding: 8, borderRadius: 10, background: 'rgba(249,115,22,0.06)' }}>
              <Search size={16} />
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                  width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
                  border: '2px solid #F97316', cursor: 'pointer', background: '#FFF7ED',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
                }}>
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#EA580C', fontWeight: 700, fontSize: 14 }}>{user.username?.[0]?.toUpperCase()}</span>
                  }
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 46, width: 200,
                    background: 'white', border: '1px solid rgba(249,115,22,0.15)',
                    borderRadius: 16, overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(249,115,22,0.15)',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #FEF3C7', background: '#FFF7ED' }}>
                      <p style={{ color: '#92400E', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{user.username}</p>
                    </div>
                    {[
                      { icon: User, label: 'Profile', action: () => navigate(`/profile/${user.username}`) },
                      { icon: Bookmark, label: 'Drafts', action: () => navigate('/drafts') },
                      { icon: PlusSquare, label: 'New Recipe', action: () => navigate('/post') },
                    ].map(({ icon: Icon, label, action }) => (
                      <button key={label} onClick={action} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        color: '#78350F', fontSize: 13, textAlign: 'left', transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FFF7ED'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Icon size={14} color="#F97316" />{label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid #FEF3C7' }}>
                      <button onClick={handleLogout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        color: '#EF4444', fontSize: 13, textAlign: 'left',
                      }}>
                        <LogOut size={14} />Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Link to="/login" style={{ color: '#92400E', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>Log in</Link>
                <Link to="/signup" style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 99, textDecoration: 'none', boxShadow: '0 3px 10px rgba(249,115,22,0.3)' }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-nav" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', padding: 8 }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: '#FFFBF7', paddingTop: 80, paddingLeft: 28, paddingRight: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['/', 'Home'], ['/search', 'Browse'], ...(user ? [['/post', 'Post Recipe'], [`/profile/${user?.username}`, 'Profile'], ['/drafts', 'Drafts']] : [])].map(([to, label]) => (
            <Link key={to} to={to} style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 32, color: '#1C0A00', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #FEF3C7' }}>{label}</Link>
          ))}
          <div style={{ marginTop: 24 }}>
            {user
              ? <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, color: '#EF4444', textAlign: 'left', padding: 0 }}>Log out</button>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Link to="/login" style={{ textAlign: 'center', border: '1.5px solid #FED7AA', borderRadius: 99, padding: '14px 0', color: '#78350F', textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>Log in</Link>
                  <Link to="/signup" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #EA580C, #F97316)', borderRadius: 99, padding: '14px 0', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>Sign up</Link>
                </div>
            }
          </div>
        </div>
      )}

      <div style={{ height: 64 }} />
      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-nav { display: none !important; } }
      `}</style>
    </>
  );
};