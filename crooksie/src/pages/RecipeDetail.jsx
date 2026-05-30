import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Globe, Heart, Bookmark, Share2, ChevronLeft, Trash2, Flag, BarChart2, DollarSign } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const DIFF = { Easy: { bg: '#DCFCE7', text: '#166534' }, Medium: { bg: '#FEF9C3', text: '#854D0E' }, Hard: { bg: '#FEE2E2', text: '#991B1B' } };

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

  useEffect(() => { loadRecipe(); }, [id, user]);

  const loadRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(id);
      if (!data) { navigate('/'); return; }
      setRecipe(data); setLikeCount(data.like_count || 0);
      setComments(await recipeService.getComments(id));
      if (user) {
        setLiked(await recipeService.isLiked(user.id, id));
        setBookmarked(await recipeService.isBookmarked(user.id, id));
      }
    } catch { navigate('/'); }
    finally { setLoading(false); }
  };

  const handleLike = async () => {
    if (!user) { toast.error('Log in to like'); return; }
    await recipeService.toggleLike(user.id, id, liked);
    setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = async () => {
    if (!user) { toast.error('Log in to bookmark'); return; }
    await recipeService.toggleBookmark(user.id, id, bookmarked);
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked! 🔖');
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    try {
      const c = await recipeService.addComment({ user_id: user.id, username: user.username, recipe_id: id, content: newComment });
      setComments([...comments, c]); setNewComment('');
      toast.success('Comment posted!');
    } catch { toast.error('Could not post comment'); }
  };

  const handleReport = async () => {
    if (!user || !reportReason.trim()) return;
    await recipeService.addReport({ reporter_user_id: user.id, recipe_id: id, reason: reportReason });
    toast.success('Report submitted'); setReportOpen(false); setReportReason('');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🍳</p>
        <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, color: '#92400E' }}>Loading recipe…</p>
      </div>
    </div>
  );
  if (!recipe) return null;

  const stats = [
    { icon: Globe, label: 'Country', value: recipe.country, emoji: '🌍' },
    { icon: Clock, label: 'Time', value: `${recipe.cook_time} mins`, emoji: '⏱️' },
    { icon: Users, label: 'Serves', value: `${recipe.servings}`, emoji: '👥' },
    { icon: BarChart2, label: 'Level', value: recipe.difficulty, emoji: '📊', diff: true },
    { icon: DollarSign, label: 'Cost', value: recipe.cost, emoji: '💰' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '60vh', minHeight: 400, overflow: 'hidden' }}>
        <img src={recipe.photo_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&auto=format&fit=crop'} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,10,0,0.8), rgba(28,10,0,0.2), transparent)' }} />
        <div style={{ position: 'absolute', top: 24, left: 24 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: 99, padding: '8px 18px', textDecoration: 'none', color: '#78350F', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <ChevronLeft size={16} /> Back
          </Link>
        </div>
        <div style={{ position: 'absolute', top: 24, right: 24, background: '#F97316', color: 'white', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 1 }}>
          {recipe.category}
        </div>
        {/* Title over image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 32px 40px' }}>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(32px, 5vw, 56px)', color: 'white', margin: 0, lineHeight: 1.1, maxWidth: 800 }}>{recipe.title}</h1>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        {/* Info strip */}
        <div style={{ background: 'white', borderRadius: 24, padding: '24px 32px', margin: '-28px 0 40px', boxShadow: '0 8px 40px rgba(249,115,22,0.12)', border: '1px solid #FED7AA', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 5 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(recipe.dietary_tags || []).map(tag => (
              <span key={tag} style={{ fontSize: 12, background: '#FFF7ED', border: '1px solid #FED7AA', color: '#92400E', borderRadius: 99, padding: '4px 12px', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
          <Link to={`/profile/${recipe.username}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#FFF7ED', border: '2px solid #F97316' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.username}`} alt="" style={{ width: '100%', height: '100%' }} />
            </div>
            <div>
              <p style={{ color: '#1C0A00', fontSize: 13, fontWeight: 700, margin: 0 }}>{recipe.username}</p>
              <p style={{ color: '#92400E', fontSize: 11, margin: 0, opacity: 0.6 }}>{new Date(recipe.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </Link>
        </div>

        {/* Description */}
        <p style={{ color: '#78350F', fontSize: 17, lineHeight: 1.8, marginBottom: 40, maxWidth: 680 }}>{recipe.description}</p>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 48 }}>
          {stats.map(({ label, value, emoji, diff }) => (
            <div key={label} style={{ background: 'white', border: '1.5px solid #FED7AA', borderRadius: 16, padding: '16px 12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(249,115,22,0.06)' }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{emoji}</span>
              <span style={{ fontSize: 10, color: '#92400E', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, display: 'block', marginBottom: 4 }}>{label}</span>
              <span style={{
                fontSize: 12, fontWeight: 700, display: 'block',
                ...(diff ? { background: DIFF[value]?.bg, color: DIFF[value]?.text, borderRadius: 99, padding: '2px 8px' } : { color: '#1C0A00' })
              }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Ingredients & Method */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 32, marginBottom: 48 }}>
          <div style={{ background: 'white', border: '1.5px solid #FED7AA', borderRadius: 24, padding: 28, boxShadow: '0 4px 20px rgba(249,115,22,0.07)' }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, color: '#1C0A00', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>🥗 Ingredients</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#78350F', lineHeight: 1.5 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #FB923C, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                  </span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'white', border: '1.5px solid #FED7AA', borderRadius: 24, padding: 28, boxShadow: '0 4px 20px rgba(249,115,22,0.07)' }}>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, color: '#1C0A00', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>👨‍🍳 Method</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(recipe.steps || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 40, color: 'rgba(249,115,22,0.2)', lineHeight: 1, fontWeight: 700, flexShrink: 0, userSelect: 'none' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ color: '#78350F', lineHeight: 1.7, fontSize: 14, paddingTop: 6 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderTop: '2px solid #FEF3C7', borderBottom: '2px solid #FEF3C7', marginBottom: 48 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleLike} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 99,
              border: liked ? 'none' : '1.5px solid #FED7AA',
              background: liked ? 'linear-gradient(135deg, #EF4444, #F87171)' : 'white',
              color: liked ? 'white' : '#78350F', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              boxShadow: liked ? '0 4px 14px rgba(239,68,68,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s',
            }}>
              <Heart size={16} fill={liked ? 'white' : 'none'} />{likeCount} Likes
            </button>
            <button onClick={handleBookmark} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 99,
              border: bookmarked ? 'none' : '1.5px solid #FED7AA',
              background: bookmarked ? 'linear-gradient(135deg, #F97316, #FB923C)' : 'white',
              color: bookmarked ? 'white' : '#78350F', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              boxShadow: bookmarked ? '0 4px 14px rgba(249,115,22,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s',
            }}>
              <Bookmark size={16} fill={bookmarked ? 'white' : 'none'} />Save
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => toast.success('Link copied!')} style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #FED7AA', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#92400E' }}>
              <Share2 size={15} />
            </button>
            <button onClick={() => setReportOpen(!reportOpen)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #FECACA', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
              <Flag size={15} />
            </button>
          </div>
        </div>

        {/* Report */}
        {reportOpen && (
          <div style={{ background: 'white', border: '1.5px solid #FECACA', borderRadius: 20, padding: 24, marginBottom: 40 }}>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1C0A00', fontSize: 20, marginBottom: 14 }}>🚩 Report Recipe</h3>
            <textarea value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Why are you reporting this?" style={{ width: '100%', background: '#FFFBF7', border: '1.5px solid #FED7AA', borderRadius: 12, padding: 14, color: '#1C0A00', fontSize: 14, resize: 'none', height: 100, outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button onClick={handleReport} disabled={!reportReason.trim()} style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: 99, padding: '9px 22px', cursor: 'pointer', fontWeight: 700, fontSize: 13, opacity: reportReason.trim() ? 1 : 0.4 }}>Submit Report</button>
              <button onClick={() => setReportOpen(false)} style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 99, padding: '9px 22px', cursor: 'pointer', color: '#92400E', fontSize: 13 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Comments */}
        <div style={{ maxWidth: 680, paddingBottom: 80 }}>
          <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 32, color: '#1C0A00', marginBottom: 28 }}>
            💬 Comments <span style={{ color: '#FCA572', fontSize: 24 }}>({comments.length})</span>
          </h2>

          {user ? (
            <form onSubmit={handleComment} style={{ marginBottom: 36, background: 'white', borderRadius: 20, padding: 20, border: '1.5px solid #FED7AA', boxShadow: '0 4px 16px rgba(249,115,22,0.07)' }}>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your thoughts on this recipe…" style={{ width: '100%', background: '#FFFBF7', border: '1.5px solid #FED7AA', borderRadius: 12, padding: 14, color: '#1C0A00', fontSize: 14, resize: 'none', height: 90, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
              <button type="submit" disabled={!newComment.trim()} style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', border: 'none', borderRadius: 99, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 13, opacity: newComment.trim() ? 1 : 0.4 }}>
                Post Comment
              </button>
            </form>
          ) : (
            <div style={{ background: '#FFF7ED', border: '1.5px dashed #FED7AA', borderRadius: 16, padding: 20, textAlign: 'center', marginBottom: 32 }}>
              <p style={{ color: '#92400E', fontSize: 14 }}>
                <Link to="/login" style={{ color: '#EA580C', fontWeight: 700 }}>Log in</Link> to leave a comment
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 12, background: 'white', borderRadius: 16, padding: 16, border: '1px solid #FEF3C7' }}>
                <Link to={`/profile/${c.username}`} style={{ flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', background: '#FFF7ED', border: '2px solid #FED7AA' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`} alt="" style={{ width: '100%', height: '100%' }} />
                  </div>
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <Link to={`/profile/${c.username}`} style={{ color: '#1C0A00', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>{c.username}</Link>
                    <span style={{ color: '#92400E', fontSize: 11, opacity: 0.5 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: '#78350F', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.content}</p>
                  {user?.id === c.user_id && (
                    <button onClick={async () => { await recipeService.deleteComment(c.id); setComments(comments.filter(x => x.id !== c.id)); }} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 11, padding: 0, marginTop: 6, opacity: 0.7 }}>
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