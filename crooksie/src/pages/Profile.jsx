import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Edit2, ChefHat, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { RecipeCard } from '../components/RecipeCard';

export const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [postedRecipes, setPostedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(true);
  const isOwn = currentUser?.username === username;

  useEffect(() => { loadProfile(); }, [username, currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await recipeService.getProfile(username);
      setProfileUser(profile);
      setPostedRecipes(await recipeService.getUserRecipes(username));
      if (isOwn && currentUser) setSavedRecipes(await recipeService.getSavedRecipes(currentUser.id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}><p style={{ fontSize: 48 }}>👨‍🍳</p><p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, color: '#92400E', marginTop: 16 }}>Loading profile…</p></div>
    </div>
  );

  if (!profileUser) return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, color: '#92400E' }}>User not found 😕</p>
    </div>
  );

  const totalLikes = postedRecipes.reduce((acc, r) => acc + (r.like_count || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', borderBottom: '2px solid #FED7AA', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 28 }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', border: '4px solid #F97316', boxShadow: '0 6px 24px rgba(249,115,22,0.25)', background: '#FFF7ED' }}>
                <img src={profileUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 4, right: 4, width: 22, height: 22, background: '#22C55E', borderRadius: '50%', border: '3px solid white' }} />
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(28px, 5vw, 44px)', color: '#1C0A00', margin: '0 0 6px', fontWeight: 400 }}>{profileUser.username}</h1>
              <p style={{ color: '#92400E', fontSize: 15, marginBottom: 20, maxWidth: 500, opacity: 0.8 }}>
                {profileUser.bio || "This chef hasn't added a bio yet. They're probably busy cooking! 🍳"}
              </p>
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { label: 'Recipes', value: postedRecipes.length, emoji: '📖' },
                  { label: 'Total Likes', value: totalLikes, emoji: '❤️' },
                ].map(({ label, value, emoji }) => (
                  <div key={label} style={{ background: 'white', border: '1.5px solid #FED7AA', borderRadius: 16, padding: '12px 20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(249,115,22,0.08)' }}>
                    <span style={{ display: 'block', fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, color: '#EA580C' }}>{emoji} {value}</span>
                    <span style={{ fontSize: 11, color: '#92400E', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {isOwn && (
              <Link to="/profile/edit" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #FED7AA', borderRadius: 99, padding: '10px 22px', color: '#78350F', textDecoration: 'none', fontWeight: 600, fontSize: 13, boxShadow: '0 2px 10px rgba(249,115,22,0.1)' }}>
                <Edit2 size={14} color="#F97316" /> Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #FEF3C7', padding: '0 24px', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex' }}>
          {['recipes', ...(isOwn ? ['saved'] : [])].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '16px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: 'none', border: 'none',
              borderBottom: `3px solid ${activeTab === tab ? '#F97316' : 'transparent'}`,
              color: activeTab === tab ? '#EA580C' : '#92400E', transition: 'all 0.2s',
              textTransform: 'capitalize', marginBottom: -2,
            }}>
              {tab === 'recipes' ? '📖 Posted Recipes' : '🔖 Saved'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
        {activeTab === 'recipes' && (
          postedRecipes.length > 0
            ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>{postedRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}</div>
            : <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: 24, border: '2px dashed #FED7AA' }}>
                <p style={{ fontSize: 56, marginBottom: 16 }}>👨‍🍳</p>
                <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, color: '#92400E', marginBottom: 20 }}>No recipes posted yet</p>
                {isOwn && <Link to="/post" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '12px 28px', borderRadius: 99, fontSize: 14 }}>Share your first recipe</Link>}
              </div>
        )}
        {activeTab === 'saved' && (
          savedRecipes.length > 0
            ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>{savedRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}</div>
            : <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: 24, border: '2px dashed #FED7AA' }}>
                <p style={{ fontSize: 56, marginBottom: 16 }}>🔖</p>
                <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, color: '#92400E', marginBottom: 20 }}>No saved recipes yet</p>
                <Link to="/search" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '12px 28px', borderRadius: 99, fontSize: 14 }}>Explore recipes</Link>
              </div>
        )}
      </div>
    </div>
  );
};