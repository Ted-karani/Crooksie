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

  useEffect(() => { loadInitial(); }, []);
  useEffect(() => { const t = setTimeout(doSearch, 300); return () => clearTimeout(t); }, [query, country, cost, category]);

  const loadInitial = async () => {
    const data = await recipeService.getRecipes({});
    setResults(data);
    setCountries(['All', ...new Set(data.map(r => r.country).filter(Boolean))]);
  };

  const doSearch = async () => {
    setLoading(true);
    try { setResults(await recipeService.searchRecipes({ query, country, cost, category })); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const sel = { background: 'white', border: '1.5px solid #FED7AA', borderRadius: 99, padding: '10px 16px 10px 34px', color: '#78350F', fontSize: 13, fontWeight: 600, outline: 'none', cursor: 'pointer', appearance: 'none' };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF7' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', borderBottom: '1px solid #FED7AA', padding: '48px 24px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#F97316', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>🔍 Discover</p>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#1C0A00', margin: '0 0 12px', fontWeight: 400 }}>Find your next meal</h1>
        <p style={{ color: '#92400E', fontSize: 15, opacity: 0.7, marginBottom: 32 }}>Search by name, ingredient, country and more.</p>

        {/* Search bar */}
        <div style={{ maxWidth: 600, margin: '0 auto 20px', position: 'relative' }}>
          <SearchIcon size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#F97316' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes, ingredients…" style={{ width: '100%', background: 'white', border: '2px solid #FED7AA', borderRadius: 20, padding: '16px 16px 16px 50px', color: '#1C0A00', fontSize: 15, outline: 'none', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(249,115,22,0.1)', fontFamily: 'DM Sans, sans-serif' }}
            onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 4px 24px rgba(249,115,22,0.2)'; }}
            onBlur={e => { e.target.style.borderColor = '#FED7AA'; e.target.style.boxShadow = '0 4px 20px rgba(249,115,22,0.1)'; }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
          {[
            { icon: Globe, value: country, setter: setCountry, options: countries },
            { icon: DollarSign, value: cost, setter: setCost, options: costs },
            { icon: SlidersHorizontal, value: category, setter: setCategory, options: categories },
          ].map(({ icon: Icon, value, setter, options }, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <Icon size={13} color="#F97316" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <select value={value} onChange={e => setter(e.target.value)} style={sel}>
                {options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${['Countries','Costs','Categories'][i]}` : o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ color: '#F97316', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 28 }}>
          {results.length} recipe{results.length !== 1 ? 's' : ''} found
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#92400E', fontFamily: 'Fraunces, Georgia, serif', fontSize: 20 }}>Searching… 🍳</p>
        ) : results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {results.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 56, marginBottom: 16 }}>🔍</p>
            <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 28, color: '#92400E', marginBottom: 8 }}>No results found</h3>
            <p style={{ color: '#92400E', fontSize: 14, opacity: 0.6 }}>Try different search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};