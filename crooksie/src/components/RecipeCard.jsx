import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Bookmark, Globe } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const DIFF = { Easy: { bg: '#DCFCE7', text: '#166534' }, Medium: { bg: '#FEF9C3', text: '#854D0E' }, Hard: { bg: '#FEE2E2', text: '#991B1B' } };
const CAT_COLOR = { Breakfast: '#FEF9C3', Lunch: '#DCFCE7', Dinner: '#FEE2E2', Snacks: '#E0F2FE', Desserts: '#FAE8FF' };
const CAT_TEXT = { Breakfast: '#854D0E', Lunch: '#166534', Dinner: '#991B1B', Snacks: '#0369A1', Desserts: '#7E22CE' };

export const RecipeCard = ({ recipe, initialLiked = false, initialBookmarked = false }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(recipe.like_count || 0);
  const [hovered, setHovered] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Log in to like recipes'); return; }
    try {
      await recipeService.toggleLike(user.id, recipe.id, liked);
      setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1);
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
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: 20, overflow: 'hidden',
        border: `1.5px solid ${hovered ? '#FED7AA' : '#FEF3C7'}`,
        transition: 'all 0.25s',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 48px rgba(249,115,22,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          <img
            src={recipe.photo_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop'}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            loading="lazy"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />

          {/* Category */}
          <div style={{ position: 'absolute', top: 12, left: 12, background: CAT_COLOR[recipe.category] || '#FFF7ED', color: CAT_TEXT[recipe.category] || '#92400E', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            {recipe.category}
          </div>

          {/* Bookmark */}
          <button onClick={handleBookmark} style={{
            position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%',
            background: bookmarked ? '#F97316' : 'rgba(255,255,255,0.9)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s',
          }}>
            <Bookmark size={14} fill={bookmarked ? 'white' : 'none'} color={bookmarked ? 'white' : '#92400E'} />
          </button>

          {/* Country */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.9)', borderRadius: 99, padding: '4px 10px' }}>
            <Globe size={11} color="#F97316" />
            <span style={{ fontSize: 11, color: '#78350F', fontWeight: 600 }}>{recipe.country}</span>
          </div>
        </div>

        <div style={{ padding: '16px 18px 18px' }}>
          <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 19, color: '#1C0A00', margin: '0 0 6px', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.2s', ...(hovered ? { color: '#EA580C' } : {}) }}>
            {recipe.title}
          </h3>
          <p style={{ fontSize: 13, color: '#92400E', margin: '0 0 14px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: 0.7 }}>
            {recipe.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #FEF3C7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#78350F', background: '#FFF7ED', padding: '3px 8px', borderRadius: 99 }}>
                <Clock size={11} color="#F97316" />{recipe.cook_time}m
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: DIFF[recipe.difficulty]?.bg || '#FFF7ED', color: DIFF[recipe.difficulty]?.text || '#92400E' }}>
                {recipe.difficulty}
              </span>
            </div>
            <button onClick={handleLike} style={{
              display: 'flex', alignItems: 'center', gap: 5, background: liked ? '#FEF2F2' : 'transparent',
              border: liked ? '1px solid #FECACA' : '1px solid transparent', borderRadius: 99,
              padding: '4px 10px', cursor: 'pointer', color: liked ? '#EF4444' : '#92400E', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
            }}>
              <Heart size={13} fill={liked ? '#EF4444' : 'none'} color={liked ? '#EF4444' : '#92400E'} />
              {likeCount}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};