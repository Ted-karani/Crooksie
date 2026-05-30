import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Globe, Heart, Bookmark, MessageSquare, Share2, ChevronLeft, Trash2, Flag, BarChart2, DollarSign } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const DIFF_COLOR = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171' };

export const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [id, user]);

  const loadRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(id);
      if (!data) { navigate('/'); return; }
      setRecipe(data);
      setLikeCount(data.like_count || 0);
      const comms = await recipeService.getComments(id);
      setComments(comms);
      if (user) {
        setLiked(await recipeService.isLiked(user.id, id));
        setBookmarked(await recipeService.isBookmarked(user.id, id));
      }
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) { toast.error('Log in to like'); return; }
    try {
      await recipeService.toggleLike(user.id, id, liked);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch { toast.error('Something went wrong'); }
  };

  const handleBookmark = async () => {
    if (!user) { toast.error('Log in to bookmark'); return; }
    try {
      await recipeService.toggleBookmark(user.id, id, bookmarked);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked!');
    } catch { toast.error('Something went wrong'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    try {
      const c = await recipeService.addComment({ user_id: user.id, username: user.username, recipe_id: id, content: newComment });
      setComments([...comments, c]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch { toast.error('Could not post comment'); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await recipeService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch { toast.error('Could not delete comment'); }
  };

  const handleReport = async () => {
    if (!user || !reportReason.trim()) return;
    try {
      await recipeService.addReport({ reporter_user_id: user.id, recipe_id: id, reason: reportReason });
      toast.success('Report submitted');
      setReportOpen(false);
      setReportReason('');
    } catch { toast.error('Could not submit report'); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0D0A07', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(245,237,216,0.3)', fontFamily: 'Cormorant Garamond, serif', fontSize: 24 }}>Loading…</p>
    </div>
  );

  if (!recipe) return null;

  const stats = [
    { icon: Globe, label: 'Country', value: recipe.country },
    { icon: Clock, label: 'Time', value: `${recipe.cook_time} mins` },
    { icon: Users, label: 'Serves', value: `${recipe.servings}` },
    { icon: BarChart2, label: 'Level', value: recipe.difficulty, color: DIFF_COLOR[recipe.difficulty] },
    { icon: DollarSign, label: 'Cost', value: recipe.cost },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A07' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '55vh', minHeight: 380, overflow: 'hidden' }}>
        <img src={recipe.photo_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&auto=format&fit=crop'} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0A07, rgba(13,10,7,0.3), transparent)' }} />
        <div style={{ position: 'absolute', top: 24, left: 24 }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            background: 'rgba(13,10,7,0.7)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245,237,216,0.1)', color: 'rgba(245,237,216,0.7)',
            borderRadius: 99, padding: '8px 16px', fontSize: 13,
          }}>
            <ChevronLeft size={16} /> Back
          </Link>
        </div>
        <div style={{ position: 'absolute', top: 24, right: 24, background: '#E8832A', color: '#0D0A07', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 1 }}>
          {recipe.category}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        {/* Title block */}
        <div style={{ marginBottom: 40, marginTop: -80, position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {(recipe.dietary_tags || []).map(tag => (
              <span key={tag} style={{ fontSize: 11, border: '1px solid rgba(245,237,216,0.15)', color: 'rgba(245,237,216,0.5)', borderRadius: 99, padding: '4px 12px' }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 6vw, 60px)', color: '#F5EDD8', margin: '0 0 16px', lineHeight: 1.1 }}>{recipe.title}</h1>
          <p style={{ color: 'rgba(245,237,216,0.5)', fontSize: 16, maxWidth: 600, lineHeight: 1.7, marginBottom: 24 }}>{recipe.description}</p>
          <Link to={`/profile/${recipe.username}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8832A', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.username}`} alt="" style={{ width: '100%', height: '100%' }} />
            </div>
            <div>
              <p style={{ color: '#F5EDD8', fontSize: 13, fontWeight: 600, margin: 0 }}>{recipe.username}</p>
              <p style={{ color: 'rgba(245,237,216,0.3)', fontSize: 11, margin: 0 }}>{new Date(recipe.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'rgba(245,237,216,0.05)', borderRadius: 16, overflow: 'hidden', marginBottom: 48 }}>
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ background: '#1C1612', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Icon size={16} color="#E8832A" />
              <span style={{ fontSize: 10, color: 'rgba(245,237,216,0.3)', textTransform: 'uppercase', letterSpacing: 2 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: color || '#F5EDD8' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Ingredients & Method */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 48, marginBottom: 48 }}>
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, color: '#F5EDD8', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ height: 1, flex: 1, background: 'rgba(245,237,216,0.1)' }} />Ingredients
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: 'rgba(245,237,216,0.65)', fontSize: 14, lineHeight: 1.6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8832A', flexShrink: 0, marginTop: 6 }} />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, color: '#F5EDD8', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ height: 1, flex: 1, background: 'rgba(245,237,216,0.1)' }} />Method
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {(recipe.steps || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 20 }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, color: 'rgba(232,131,42,0.15)', lineHeight: 1, fontWeight: 700, flexShrink: 0, userSelect: 'none' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ color: 'rgba(245,237,216,0.65)', lineHeight: 1.7, fontSize: 14, paddingTop: 8 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px solid rgba(245,237,216,0.05)', borderBottom: '1px solid rgba(245,237,216,0.05)', marginBottom: 48 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: `${likeCount} Likes`, icon: Heart, active: liked, onClick: handleLike, filled: liked },
              { label: 'Save', icon: Bookmark, active: bookmarked, onClick: handleBookmark, filled: bookmarked },
            ].map(({ label, icon: Icon, active, onClick, filled }) => (
              <button key={label} onClick={onClick} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                borderRadius: 99, border: `1px solid ${active ? '#E8832A' : 'rgba(245,237,216,0.1)'}`,
                background: active ? '#E8832A' : 'transparent', cursor: 'pointer',
                color: active ? '#0D0A07' : 'rgba(245,237,216,0.6)', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
              }}>
                <Icon size={16} fill={filled ? 'currentColor' : 'none'} />{label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => toast.success('Link copied!')} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(245,237,216,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,237,216,0.4)' }}>
              <Share2 size={15} />
            </button>
            <button onClick={() => setReportOpen(!reportOpen)} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(245,237,216,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
              <Flag size={15} />
            </button>
          </div>
        </div>

        {/* Report */}
        {reportOpen && (
          <div style={{ background: '#1C1612', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, padding: 24, marginBottom: 40 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#F5EDD8', fontSize: 20, marginBottom: 16 }}>Report Recipe</h3>
            <textarea value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Why are you reporting this?" style={{ width: '100%', background: '#0D0A07', border: '1px solid rgba(245,237,216,0.08)', borderRadius: 12, padding: 16, color: '#F5EDD8', fontSize: 14, resize: 'none', height: 100, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button onClick={handleReport} disabled={!reportReason.trim()} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 99, padding: '8px 20px', cursor: 'pointer', fontSize: 13, opacity: reportReason.trim() ? 1 : 0.4 }}>Submit</button>
              <button onClick={() => setReportOpen(false)} style={{ background: 'none', border: '1px solid rgba(245,237,216,0.1)', borderRadius: 99, padding: '8px 20px', cursor: 'pointer', color: 'rgba(245,237,216,0.4)', fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Comments */}
        <div style={{ maxWidth: 680, paddingBottom: 80 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 30, color: '#F5EDD8', marginBottom: 32 }}>
            Comments <span style={{ color: 'rgba(245,237,216,0.2)', fontSize: 22 }}>({comments.length})</span>
          </h2>

          {user && (
            <form onSubmit={handleComment} style={{ marginBottom: 40 }}>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your thoughts…" style={{ width: '100%', background: '#1C1612', border: '1px solid rgba(245,237,216,0.08)', borderRadius: 16, padding: 20, color: '#F5EDD8', fontSize: 14, resize: 'none', height: 100, outline: 'none', boxSizing: 'border-box' }} />
              <button type="submit" disabled={!newComment.trim()} style={{ marginTop: 10, background: '#E8832A', color: '#0D0A07', border: 'none', borderRadius: 99, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 13, opacity: newComment.trim() ? 1 : 0.4 }}>
                Post Comment
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 14 }}>
                <Link to={`/profile/${c.username}`} style={{ flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#E8832A' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`} alt="" style={{ width: '100%', height: '100%' }} />
                  </div>
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <Link to={`/profile/${c.username}`} style={{ color: '#F5EDD8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{c.username}</Link>
                    <span style={{ color: 'rgba(245,237,216,0.25)', fontSize: 11 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: 'rgba(245,237,216,0.6)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.content}</p>
                  {user?.id === c.user_id && (
                    <button onClick={() => handleDeleteComment(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.5)', fontSize: 11, padding: 0, marginTop: 6 }}>
                      <Trash2 size={11} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};