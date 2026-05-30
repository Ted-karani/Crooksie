import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Globe, DollarSign, SlidersHorizontal } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { RecipeCard } from '../components/RecipeCard';

const costs = ['All', 'Cheap', 'Moderate', 'Expensive'];
const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('All');
  const [cost, setCost] = useState('All');
  const [category, setCategory] = useState('All');
  const [results, setResults] = useState([]);
  const [countries, setCountries] = useState(['All']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    const timer = setTimeout(doSearch, 300);
    return () => clearTimeout(timer);
  }, [query, country, cost, category]);

  const loadInitial = async () => {
    const data = await recipeService.getRecipes({});
    setResults(data);
    const unique = ['All', ...new Set(data.map(r => r.country).filter(Boolean))];
    setCountries(unique);
  };

  const doSearch = async () => {
    setLoading(true);
    try {
      const data = await recipeService.searchRecipes({ query, country, cost, category });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    background: '#1C1612', border: '1px solid rgba(245,237,216,0.1)', borderRadius: 99,
    padding: '9px 16px 9px 32px', color: '#F5EDD8', fontSize: 13, outline: 'none',
    cursor: 'pointer', appearance: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A07', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, color: '#E8832A', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Discover</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 6vw, 56px)', color: '#F5EDD8', margin: '0 0 12px' }}>Find your next meal</h1>
          <p style={{ color: 'rgba(245,237,216,0.3)', fontSize: 14 }}>Search recipes by name, ingredient, country and more.</p>
        </div>

        {/* Search input */}
        <div style={{ maxWidth: 600, margin: '0 auto 24px', position: 'relative' }}>
          <SearchIcon size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,237,216,0.25)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients…"
            style={{
              width: '100%', background: '#1C1612', border: '1px solid rgba(245,237,216,0.08)',
              borderRadius: 16, padding: '16px 16px 16px 50px', color: '#F5EDD8',
              fontSize: 15, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
          {[
            { icon: Globe, value: country, setter: setCountry, options: countries },
            { icon: DollarSign, value: cost, setter: setCost, options: costs },
            { icon: SlidersHorizontal, value: category, setter: setCategory, options: categories },
          ].map(({ icon: Icon, value, setter, options }, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <Icon size={13} color="#E8832A" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <select value={value} onChange={e => setter(e.target.value)} style={selectStyle}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Count */}
        <p style={{ color: 'rgba(245,237,216,0.2)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 32 }}>
          {results.length} recipe{results.length !== 1 ? 's' : ''} found
        </p>

        {/* Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'rgba(245,237,216,0.3)', fontFamily: 'Cormorant Garamond, serif', fontSize: 20 }}>Searching…</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
            {results.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: 'rgba(245,237,216,0.3)' }}>No results</h3>
            <p style={{ color: 'rgba(245,237,216,0.2)', fontSize: 14 }}>Try different terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};