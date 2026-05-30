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

  useEffect(() => setMobileOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(13,10,7,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(232,131,42,0.1)' : 'none',
        padding: scrolled ? '12px 0' : '20px 0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: '#E8832A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#0D0A07', fontWeight: 700, fontSize: 14 }}>C</span>
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5EDD8', fontSize: 18, letterSpacing: 4, textTransform: 'uppercase' }}>Crooksie</span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {[['/', 'Home'], ['/search', 'Browse'], ...(user ? [['/post', 'Post Recipe']] : [])].map(([path, label]) => (
              <Link key={path} to={path} style={{
                textDecoration: 'none', fontSize: 13, fontWeight: 500, letterSpacing: 1,
                color: isActive(path) ? '#E8832A' : 'rgba(245,237,216,0.6)',
                transition: 'color 0.2s',
              }}>{label}</Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="desktop-nav">
            <Link to="/search" style={{ color: 'rgba(245,237,216,0.4)', display: 'flex' }}>
              <Search size={16} />
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: 34, height: 34, borderRadius: '50%', overflow: 'hidden',
                    border: '2px solid rgba(232,131,42,0.4)', cursor: 'pointer', background: '#E8832A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#0D0A07', fontWeight: 700, fontSize: 13 }}>{user.username?.[0]?.toUpperCase()}</span>
                  }
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 44, width: 200,
                    background: '#1C1612', border: '1px solid rgba(232,131,42,0.15)',
                    borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(245,237,216,0.06)' }}>
                      <p style={{ color: 'rgba(245,237,216,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }}>{user.username}</p>
                    </div>
                    {[
                      { icon: User, label: 'Profile', action: () => { navigate(`/profile/${user.username}`); setDropdownOpen(false); } },
                      { icon: Bookmark, label: 'Drafts', action: () => { navigate('/drafts'); setDropdownOpen(false); } },
                      { icon: PlusSquare, label: 'New Recipe', action: () => { navigate('/post'); setDropdownOpen(false); } },
                    ].map(({ icon: Icon, label, action }) => (
                      <button key={label} onClick={action} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(245,237,216,0.7)', fontSize: 13, textAlign: 'left',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,131,42,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Icon size={14} color="#E8832A" />{label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(245,237,216,0.06)' }}>
                      <button onClick={handleLogout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        color: '#f87171', fontSize: 13, textAlign: 'left',
                      }}>
                        <LogOut size={14} />Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link to="/login" style={{ color: 'rgba(245,237,216,0.5)', fontSize: 13, textDecoration: 'none' }}>Log in</Link>
                <Link to="/signup" style={{
                  background: '#E8832A', color: '#0D0A07', fontSize: 13, fontWeight: 600,
                  padding: '7px 18px', borderRadius: 99, textDecoration: 'none',
                }}>Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-nav" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,237,216,0.7)' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40, background: '#0D0A07',
          paddingTop: 80, paddingLeft: 24, paddingRight: 24,
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          {[['/', 'Home'], ['/search', 'Browse'], ...(user ? [['/post', 'Post Recipe'], [`/profile/${user.username}`, 'Profile'], ['/drafts', 'Drafts']] : [])].map(([to, label]) => (
            <Link key={to} to={to} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: '#F5EDD8', textDecoration: 'none' }}>{label}</Link>
          ))}
          {user
            ? <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: '#f87171', textAlign: 'left', padding: 0 }}>Log out</button>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                <Link to="/login" style={{ textAlign: 'center', border: '1px solid rgba(245,237,216,0.15)', borderRadius: 99, padding: '12px 0', color: '#F5EDD8', textDecoration: 'none', fontSize: 16 }}>Log in</Link>
                <Link to="/signup" style={{ textAlign: 'center', background: '#E8832A', borderRadius: 99, padding: '12px 0', color: '#0D0A07', fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>Sign up</Link>
              </div>
          }
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