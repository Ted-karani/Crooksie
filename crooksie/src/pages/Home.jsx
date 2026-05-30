import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { recipeService } from '../services/recipeService';
import { Clock, Flame, Sparkles, ArrowRight, Search } from 'lucide-react';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];
const CAT_EMOJI = { All: '🍽️', Breakfast: '🌅', Lunch: '🥗', Dinner: '🍝', Snacks: '🍿', Desserts: '🍰' };

export const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRecipes(); }, [activeCategory, sortBy]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getRecipes({ category: activeCategory, sortBy });
      setRecipes(data);
      if (!featured && data.length > 0) setFeatured([...data].sort((a, b) => b.like_count - a.like_count)[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7' }}>

      {/* HERO */}
      {featured && (
        <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <img src={featured.photo_url} alt={featured.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,10,0,0.85) 0%, rgba(28,10,0,0.4) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,10,0,0.5), transparent 60%)' }} />

          {/* Floating pill */}
          <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 99, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} color="#FEF08A" />
            <span style={{ color: 'white', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Featured Today</span>
          </div>

          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '0 28px 72px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ height: 2, width: 40, background: '#FB923C', borderRadius: 1 }} />
              <span style={{ fontSize: 12, color: '#FB923C', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Most Loved Recipe</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(42px, 8vw, 84px)', color: 'white', margin: '0 0 16px', lineHeight: 1, maxWidth: 900, fontWeight: 300 }}>
              {featured.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 500, marginBottom: 32, lineHeight: 1.7 }}>
              {featured.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <Link to={`/recipe/${featured.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white',
                fontWeight: 700, padding: '14px 32px', borderRadius: 99, textDecoration: 'none',
                fontSize: 15, boxShadow: '0 6px 24px rgba(249,115,22,0.4)',
              }}>
                Cook This <ArrowRight size={16} />
              </Link>
              <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                <span>🕐 {featured.cook_time} mins</span>
                <span>🌍 {featured.country}</span>
                <span>❤️ {featured.like_count}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MAIN */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 12, color: '#F97316', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>🍴 Explore</p>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 40, color: '#1C0A00', fontWeight: 400 }}>All Recipes</h2>
          </div>
          {/* Sort */}
          <div style={{ display: 'flex', background: 'white', border: '1.5px solid #FED7AA', borderRadius: 99, padding: 4, gap: 2, boxShadow: '0 2px 8px rgba(249,115,22,0.08)' }}>
            {[{ label: 'Newest', icon: '🕐' }, { label: 'Most Liked', icon: '✨' }, { label: 'Trending', icon: '🔥' }].map(({ label, icon }) => (
              <button key={label} onClick={() => setSortBy(label)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 99,
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: sortBy === label ? 'linear-gradient(135deg, #EA580C, #F97316)' : 'transparent',
                color: sortBy === label ? 'white' : '#92400E',
                boxShadow: sortBy === label ? '0 3px 10px rgba(249,115,22,0.3)' : 'none',
              }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 40 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap', padding: '10px 20px', borderRadius: 99, fontSize: 13,
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              border: activeCategory === cat ? 'none' : '1.5px solid #FED7AA',
              background: activeCategory === cat ? 'linear-gradient(135deg, #EA580C, #F97316)' : 'white',
              color: activeCategory === cat ? 'white' : '#92400E',
              boxShadow: activeCategory === cat ? '0 4px 14px rgba(249,115,22,0.3)' : '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              {CAT_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: 'white', border: '1.5px solid #FEF3C7' }}>
                <div style={{ aspectRatio: '4/3', background: 'linear-gradient(90deg, #FFF7ED 25%, #FFEDD5 50%, #FFF7ED 75%)', backgroundSize: '1000px 100%', animation: 'shimmer 2s infinite' }} />
                <div style={{ padding: 18 }}>
                  <div style={{ height: 20, background: '#FEF3C7', borderRadius: 6, marginBottom: 10 }} />
                  <div style={{ height: 14, background: '#FEF3C7', borderRadius: 6, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 56, marginBottom: 16 }}>🍽️</p>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, color: '#92400E', marginBottom: 12 }}>No recipes found</h3>
            <button onClick={() => setActiveCategory('All')} style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', border: 'none', borderRadius: 99, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
              Show all recipes
            </button>
          </div>
        )}
      </main>
    </div>
  );
};