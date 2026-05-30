import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Bookmark, Globe } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const DIFF_COLOR = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f87171' };

export const RecipeCard = ({ recipe, initialLiked = false, initialBookmarked = false }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(recipe.like_count || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Log in to like recipes'); return; }
    try {
      await recipeService.toggleLike(user.id, recipe.id, liked);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch { toast.error('Something went wrong'); }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Log in to bookmark'); return; }
    try {
      await recipeService.toggleBookmark(user.id, recipe.id, bookmarked);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked!');
    } catch { toast.error('Something went wrong'); }
  };

  return (
    <article style={{
      background: '#1C1612', borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(232,131,42,0.08)', transition: 'all 0.25s',
      boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,131,42,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,131,42,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          <img
            src={recipe.photo_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop'}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            loading="lazy"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0A07, rgba(13,10,7,0.2), transparent)' }} />

          {/* Category */}
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#E8832A', color: '#0D0A07', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 1 }}>
            {recipe.category}
          </div>

          {/* Bookmark */}
          <button onClick={handleBookmark} style={{
            position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%',
            background: bookmarked ? '#E8832A' : 'rgba(13,10,7,0.6)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            color: bookmarked ? '#0D0A07' : 'rgba(245,237,216,0.7)', transition: 'all 0.2s',
          }}>
            <Bookmark size={14} fill={bookmarked ? '#0D0A07' : 'none'} />
          </button>

          {/* Country */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(13,10,7,0.7)', backdropFilter: 'blur(8px)', borderRadius: 99, padding: '4px 10px', border: '1px solid rgba(245,237,216,0.08)' }}>
            <Globe size={11} color="#E8832A" />
            <span style={{ fontSize: 11, color: 'rgba(245,237,216,0.8)' }}>{recipe.country}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px 20px' }}>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#F5EDD8',
            margin: '0 0 6px', lineHeight: 1.2, transition: 'color 0.2s',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {recipe.title}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(245,237,216,0.4)', margin: '0 0 16px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {recipe.description}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(245,237,216,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(245,237,216,0.45)' }}>
                <Clock size={12} color="#E8832A" />{recipe.cook_time}m
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: DIFF_COLOR[recipe.difficulty] || 'rgba(245,237,216,0.5)' }}>
                {recipe.difficulty}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(245,237,216,0.35)' }}>{recipe.cost}</span>
            </div>
            <button onClick={handleLike} style={{
              display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none',
              cursor: 'pointer', color: liked ? '#E8832A' : 'rgba(245,237,216,0.35)',
              fontSize: 12, fontWeight: 500, transition: 'color 0.2s',
            }}>
              <Heart size={14} fill={liked ? '#E8832A' : 'none'} color={liked ? '#E8832A' : 'rgba(245,237,216,0.35)'} />
              {likeCount}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};