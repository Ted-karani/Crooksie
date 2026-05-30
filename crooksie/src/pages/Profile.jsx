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

  useEffect(() => {
    loadProfile();
  }, [username, currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await recipeService.getProfile(username);
      setProfileUser(profile);
      const recipes = await recipeService.getUserRecipes(username);
      setPostedRecipes(recipes);
      if (isOwn && currentUser) {
        const saved = await recipeService.getSavedRecipes(currentUser.id);
        setSavedRecipes(saved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0D0A07', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(245,237,216,0.3)', fontFamily: 'Cormorant Garamond, serif', fontSize: 24 }}>Loading…</p>
    </div>
  );

  if (!profileUser) return (
    <div style={{ minHeight: '100vh', background: '#0D0A07', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(245,237,216,0.3)', fontFamily: 'Cormorant Garamond, serif', fontSize: 24 }}>User not found</p>
    </div>
  );

  const totalLikes = postedRecipes.reduce((acc, r) => acc + (r.like_count || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A07' }}>
      {/* Header */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {postedRecipes[0]?.photo_url && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src={postedRecipes[0].photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08, filter: 'blur(20px)', transform: 'scale(1.1)' }} />
          </div>
        )}
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '64px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 28 }}>
            {/* Avatar */}
            <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(232,131,42,0.3)', flexShrink: 0, background: '#E8832A' }}>
              <img src={profileUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#F5EDD8', margin: '0 0 8px' }}>{profileUser.username}</h1>
              <p style={{ color: 'rgba(245,237,216,0.4)', fontSize: 14, marginBottom: 20, maxWidth: 500 }}>
                {profileUser.bio || "This chef hasn't added a bio yet."}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div>
                  <span style={{ display: 'block', fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: '#E8832A' }}>{postedRecipes.length}</span>
                  <span style={{ fontSize: 10, color: 'rgba(245,237,216,0.3)', textTransform: 'uppercase', letterSpacing: 3 }}>Recipes</span>
                </div>
                <div style={{ width: 1, height: 32, background: 'rgba(245,237,216,0.1)' }} />
                <div>
                  <span style={{ display: 'block', fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: '#E8832A' }}>{totalLikes}</span>
                  <span style={{ fontSize: 10, color: 'rgba(245,237,216,0.3)', textTransform: 'uppercase', letterSpacing: 3 }}>Total Likes</span>
                </div>
              </div>
            </div>

            {isOwn && (
              <Link to="/profile/edit" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                padding: '10px 20px', border: '1px solid rgba(245,237,216,0.1)', borderRadius: 99,
                color: 'rgba(245,237,216,0.5)', fontSize: 13, transition: 'all 0.2s',
              }}>
                <Edit2 size={14} /> Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(245,237,216,0.05)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex' }}>
          {['recipes', ...(isOwn ? ['saved'] : [])].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '16px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? '#E8832A' : 'transparent'}`,
              color: activeTab === tab ? '#E8832A' : 'rgba(245,237,216,0.35)', transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}>
              {tab === 'recipes' ? 'Posted Recipes' : 'Saved'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        {activeTab === 'recipes' && (
          postedRecipes.length > 0
            ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>{postedRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}</div>
            : <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <ChefHat size={48} color="rgba(245,237,216,0.1)" style={{ marginBottom: 16 }} />
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: 'rgba(245,237,216,0.3)' }}>No recipes posted yet</p>
                {isOwn && <Link to="/post" style={{ display: 'inline-block', marginTop: 16, background: '#E8832A', color: '#0D0A07', textDecoration: 'none', fontWeight: 600, padding: '10px 24px', borderRadius: 99, fontSize: 13 }}>Share your first recipe</Link>}
              </div>
        )}

        {activeTab === 'saved' && (
          savedRecipes.length > 0
            ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>{savedRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}</div>
            : <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <Bookmark size={48} color="rgba(245,237,216,0.1)" style={{ marginBottom: 16 }} />
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: 'rgba(245,237,216,0.3)' }}>No saved recipes yet</p>
                <Link to="/search" style={{ display: 'inline-block', marginTop: 16, background: '#E8832A', color: '#0D0A07', textDecoration: 'none', fontWeight: 600, padding: '10px 24px', borderRadius: 99, fontSize: 13 }}>Explore recipes</Link>
              </div>
        )}
      </div>
    </div>
  );
};