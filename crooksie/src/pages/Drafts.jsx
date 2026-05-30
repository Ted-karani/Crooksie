import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { toast } from 'sonner';

export const DraftsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!user) { navigate('/login'); return; } loadDrafts(); }, [user]);

  const loadDrafts = async () => {
    try { setDrafts(await recipeService.getDrafts(user.id)); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteDraft = async (id) => {
    try { await recipeService.deleteRecipe(id); setDrafts(drafts.filter(d => d.id !== id)); toast.success('Draft deleted'); }
    catch { toast.error('Could not delete'); }
  };

  const publishDraft = async (draft) => {
    try { await recipeService.saveRecipe({ ...draft, is_draft: false }); toast.success('Published! 🎉'); navigate('/'); }
    catch { toast.error('Could not publish'); }
  };

  const CAT_COLOR = { Breakfast: '#FEF9C3', Lunch: '#DCFCE7', Dinner: '#FEE2E2', Snacks: '#E0F2FE', Desserts: '#FAE8FF' };
  const CAT_TEXT = { Breakfast: '#854D0E', Lunch: '#166534', Dinner: '#991B1B', Snacks: '#0369A1', Desserts: '#7E22CE' };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', borderBottom: '2px solid #FED7AA', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#F97316', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>📝 Your Kitchen</p>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 48, color: '#1C0A00', margin: '0 0 8px', fontWeight: 400 }}>Drafts</h1>
          <p style={{ color: '#92400E', fontSize: 15, opacity: 0.7 }}>Recipes saved but not yet published.</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#92400E', fontFamily: 'Fraunces, Georgia, serif', fontSize: 20 }}>Loading drafts… 📝</p>
        ) : drafts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: 24, border: '2px dashed #FED7AA' }}>
            <p style={{ fontSize: 56, marginBottom: 16 }}>📝</p>
            <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, color: '#92400E', marginBottom: 20 }}>No drafts saved</p>
            <button onClick={() => navigate('/post')} style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', border: 'none', borderRadius: 99, padding: '12px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
              Create New Recipe
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {drafts.map(draft => (
              <div key={draft.id} style={{ background: 'white', border: '1.5px solid #FED7AA', borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 12px rgba(249,115,22,0.07)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F97316'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(249,115,22,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#FED7AA'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(249,115,22,0.07)'; }}
              >
                <div style={{ width: 76, height: 76, borderRadius: 14, overflow: 'hidden', flexShrink: 0, border: '2px solid #FEF3C7' }}>
                  <img src={draft.photo_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&auto=format&fit=crop'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 11, background: CAT_COLOR[draft.category] || '#FFF7ED', color: CAT_TEXT[draft.category] || '#92400E', padding: '3px 10px', borderRadius: 99, fontWeight: 700 }}>{draft.category}</span>
                    <span style={{ fontSize: 11, color: '#92400E', opacity: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} />{new Date(draft.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1C0A00', fontSize: 19, margin: '0 0 3px' }}>{draft.title || 'Untitled Recipe'}</h3>
                  <p style={{ color: '#92400E', fontSize: 12, margin: 0, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.description || 'No description yet…'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => navigate(`/post/${draft.id}`)} style={{ width: 38, height: 38, borderRadius: 12, border: '1.5px solid #FED7AA', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#92400E' }} title="Edit">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => deleteDraft(draft.id)} style={{ width: 38, height: 38, borderRadius: 12, border: '1.5px solid #FECACA', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }} title="Delete">
                    <Trash2 size={15} />
                  </button>
                  <button onClick={() => publishDraft(draft)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', border: 'none', borderRadius: 99, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
                    Publish <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};