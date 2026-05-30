import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, FileText, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const EditProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const handleSave = async () => {
    if (!username.trim()) { toast.error('Username is required'); return; }
    setSaving(true);
    try {
      await updateProfile({ username, bio, avatar_url: avatarUrl });
      toast.success('Profile updated!');
      navigate(`/profile/${username}`);
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#0D0A07', border: '1px solid rgba(245,237,216,0.08)',
    borderRadius: 12, padding: '12px 16px', color: '#F5EDD8', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A07', padding: '48px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,237,216,0.35)', fontSize: 13, marginBottom: 40, padding: 0 }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ background: '#1C1612', border: '1px solid rgba(245,237,216,0.05)', borderRadius: 20, padding: 36 }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: '#F5EDD8', margin: '0 0 32px' }}>Edit Profile</h1>

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(232,131,42,0.3)', marginBottom: 16 }}>
              <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <Camera size={20} color="white" />
              </div>
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8, textAlign: 'center' }}>Avatar URL</label>
              <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://…" style={{ ...inputStyle, textAlign: 'center' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>
                <User size={11} color="#E8832A" /> Username
              </label>
              <input value={username} onChange={e => setUsername(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(232,131,42,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,237,216,0.08)'}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>
                <FileText size={11} color="#E8832A" /> Bio
              </label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the community about yourself…" rows={4} style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(232,131,42,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,237,216,0.08)'}
              />
            </div>

            <button onClick={handleSave} disabled={saving} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#E8832A', color: '#0D0A07', fontWeight: 600, fontSize: 14,
              padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              opacity: saving ? 0.7 : 1, marginTop: 8,
            }}>
              <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};