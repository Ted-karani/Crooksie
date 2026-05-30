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
      toast.success('Profile updated! ✨');
      navigate(`/profile/${username}`);
    } catch (err) { toast.error(err.message || 'Could not update'); }
    finally { setSaving(false); }
  };

  const inp = { width: '100%', background: '#FFFBF7', border: '1.5px solid #FED7AA', borderRadius: 14, padding: '13px 16px', color: '#1C0A00', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s, box-shadow 0.2s' };
  const focus = (e) => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; };
  const blur = (e) => { e.target.style.borderColor = '#FED7AA'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFF7ED, #FFFBF7)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', padding: '40px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 40, color: 'white', margin: 0, fontWeight: 300 }}>Edit Profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 8 }}>Update your culinary identity</p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px 80px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', fontSize: 14, fontWeight: 600, marginBottom: 32, padding: 0 }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ background: 'white', borderRadius: 28, padding: 36, boxShadow: '0 8px 40px rgba(249,115,22,0.1)', border: '1px solid #FED7AA', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #FB923C, #F97316, #EA580C)' }} />

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', border: '4px solid #F97316', boxShadow: '0 6px 20px rgba(249,115,22,0.25)' }}>
                <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, background: 'linear-gradient(135deg, #EA580C, #F97316)', borderRadius: '50%', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={12} color="white" />
              </div>
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', fontSize: 11, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, textAlign: 'center' }}>Avatar URL</label>
              <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://…" style={{ ...inp, textAlign: 'center' }} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                <User size={12} color="#F97316" /> Username
              </label>
              <input value={username} onChange={e => setUsername(e.target.value)} style={inp} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                <FileText size={12} color="#F97316" /> Bio
              </label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the community about your culinary background…" rows={4} style={{ ...inp, resize: 'none', lineHeight: 1.6 }} onFocus={focus} onBlur={blur} />
            </div>

            <button onClick={handleSave} disabled={saving} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: saving ? '#FCA572' : 'linear-gradient(135deg, #EA580C, #F97316)',
              color: 'white', fontWeight: 700, fontSize: 15, padding: '15px',
              borderRadius: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(249,115,22,0.3)', marginTop: 8,
            }}>
              <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};