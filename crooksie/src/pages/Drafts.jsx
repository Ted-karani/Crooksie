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

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadDrafts();
  }, [user]);

  const loadDrafts = async () => {
    try {
      const data = await recipeService.getDrafts(user.id);
      setDrafts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id) => {
    try {
      await recipeService.deleteRecipe(id);
      setDrafts(drafts.filter(d => d.id !== id));
      toast.success('Draft deleted');
    } catch { toast.error('Could not delete draft'); }
  };

  const publishDraft = async (draft) => {
    try {
      await recipeService.saveRecipe({ ...draft, is_draft: false });
      toast.success('Recipe published!');
      navigate('/');
    } catch { toast.error('Could not publish'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A07', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, color: '#E8832A', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Your Kitchen</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, color: '#F5EDD8', margin: '0 0 8px' }}>Drafts</h1>
          <p style={{ color: 'rgba(245,237,216,0.3)', fontSize: 14 }}>Recipes saved but not yet published.</p>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(245,237,216,0.3)', fontFamily: 'Cormorant Garamond, serif', fontSize: 20 }}>Loading…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {drafts.map(draft => (
              <div key={draft.id} style={{
                background: '#1C1612', border: '1px solid rgba(245,237,216,0.05)', borderRadius: 16,
                padding: 20, display: 'flex', alignItems: 'center', gap: 16,
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,237,216,0.1)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(245,237,216,0.05)'}
              >
                <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={draft.photo_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&auto=format&fit=crop'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, background: 'rgba(232,131,42,0.1)', color: '#E8832A', padding: '3px 10px', borderRadius: 99 }}>{draft.category}</span>
                    <span style={{ fontSize: 11, color: 'rgba(245,237,216,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} />{new Date(draft.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5EDD8', fontSize: 18, margin: '0 0 2px' }}>{draft.title || 'Untitled Recipe'}</h3>
                  <p style={{ color: 'rgba(245,237,216,0.3)', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.description || 'No description yet…'}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => navigate(`/post/${draft.id}`)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(245,237,216,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,237,216,0.4)' }} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteDraft(draft.id)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(248,113,113,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(248,113,113,0.5)' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                  <button onClick={() => publishDraft(draft)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#E8832A', color: '#0D0A07', border: 'none', borderRadius: 99, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                    Publish <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}

            {drafts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(245,237,216,0.08)', borderRadius: 20 }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>📝</p>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: 'rgba(245,237,216,0.3)', marginBottom: 20 }}>No drafts saved</p>
                <button onClick={() => navigate('/post')} style={{ background: '#E8832A', color: '#0D0A07', border: 'none', borderRadius: 99, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  Create New Recipe
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};