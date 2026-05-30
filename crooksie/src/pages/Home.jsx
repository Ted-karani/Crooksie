import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { recipeService } from '../services/recipeService';
import { Clock, Flame, Sparkles, ArrowRight } from 'lucide-react';

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];

export const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, [activeCategory, sortBy]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getRecipes({ category: activeCategory, sortBy });
      setRecipes(data);
      if (!featured && data.length > 0) {
        const top = [...data].sort((a, b) => b.like_count - a.like_count)[0];
        setFeatured(top);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A07' }}>
      {/* Hero */}
      {featured && (
        <section style={{ position: 'relative', height: '85vh', minHeight: 500, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <img src={featured.photo_url} alt={featured.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0A07 0%, rgba(13,10,7,0.6) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,10,7,0.5), transparent)' }} />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '0 24px 64px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ height: 1, width: 32, background: '#E8832A' }} />
              <span style={{ fontSize: 11, color: '#E8832A', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>Featured Recipe</span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px, 8vw, 80px)', color: '#F5EDD8', margin: '0 0 16px', lineHeight: 1, maxWidth: 800 }}>
              {featured.title}
            </h1>
            <p style={{ color: 'rgba(245,237,216,0.55)', fontSize: 16, maxWidth: 480, marginBottom: 32, lineHeight: 1.7 }}>
              {featured.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Link to={`/recipe/${featured.id}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#E8832A', color: '#0D0A07', fontWeight: 600,
                padding: '12px 28px', borderRadius: 99, textDecoration: 'none', fontSize: 14,
              }}>
                View Recipe <ArrowRight size={16} />
              </Link>
              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'rgba(245,237,216,0.4)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} color="#E8832A" />{featured.cook_time}m</span>
                <span>{featured.country}</span>
                <span>❤ {featured.like_count}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, color: '#E8832A', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Explore</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: '#F5EDD8', margin: 0 }}>All Recipes</h2>
          </div>
          {/* Sort */}
          <div style={{ display: 'flex', background: '#1C1612', border: '1px solid rgba(245,237,216,0.05)', borderRadius: 99, padding: 4, gap: 2 }}>
            {[{ label: 'Newest', Icon: Clock }, { label: 'Most Liked', Icon: Sparkles }, { label: 'Trending', Icon: Flame }].map(({ label, Icon }) => (
              <button key={label} onClick={() => setSortBy(label)} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 99,
                border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                background: sortBy === label ? '#E8832A' : 'transparent',
                color: sortBy === label ? '#0D0A07' : 'rgba(245,237,216,0.4)',
              }}>
                <Icon size={12} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 40 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              whiteSpace: 'nowrap', padding: '8px 20px', borderRadius: 99, fontSize: 13,
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
              borderColor: activeCategory === cat ? '#E8832A' : 'rgba(245,237,216,0.1)',
              background: activeCategory === cat ? '#E8832A' : 'transparent',
              color: activeCategory === cat ? '#0D0A07' : 'rgba(245,237,216,0.5)',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#1C1612' }}>
                <div style={{ aspectRatio: '4/3', background: 'linear-gradient(90deg, #1C1612 25%, #2E2620 50%, #1C1612 75%)', backgroundSize: '1000px 100%', animation: 'shimmer 2s infinite' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ height: 20, background: '#2E2620', borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ height: 14, background: '#2E2620', borderRadius: 4, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🍽</p>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: 'rgba(245,237,216,0.3)', marginBottom: 12 }}>No recipes found</h3>
            <button onClick={() => setActiveCategory('All')} style={{ background: 'none', border: 'none', color: '#E8832A', cursor: 'pointer', fontSize: 14 }}>
              Clear filter
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>
    </div>
  );
};