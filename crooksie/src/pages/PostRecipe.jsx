import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Camera, MapPin, Clock, Users, BarChart2, DollarSign, Save, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { toast } from 'sonner';

// ── OUTSIDE component so they never remount on keystroke ──
const Section = ({ title, icon, children }) => (
  <div style={{
    background: '#fff',
    borderRadius: 24,
    padding: '32px',
    marginBottom: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(251,146,60,0.06)',
    border: '1px solid rgba(251,146,60,0.1)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #FB923C, #F97316, #EA580C)' }} />
    <h2 style={{
      fontFamily: "'Fraunces', Georgia, serif",
      fontSize: 20, fontWeight: 600,
      color: '#1C0A00', margin: '0 0 24px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);

const Label = ({ children }) => (
  <label style={{
    display: 'block', fontSize: 11,
    color: '#92400E',
    textTransform: 'uppercase', letterSpacing: '0.12em',
    fontWeight: 700, marginBottom: 7,
  }}>
    {children}
  </label>
);

const DIETARY = ['Vegan', 'Halal', 'Gluten-free', 'Dairy-free', 'Keto', 'Vegetarian'];
const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const COSTS = ['Cheap', 'Moderate', 'Expensive'];

const inputStyle = {
  width: '100%',
  background: '#FFFBF7',
  border: '1.5px solid #FED7AA',
  borderRadius: 12,
  padding: '12px 16px',
  color: '#1C0A00',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: "'DM Sans', sans-serif",
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F97316' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
};

export const PostRecipePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [cost, setCost] = useState('Moderate');
  const [difficulty, setDifficulty] = useState('Medium');
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [dietaryTags, setDietaryTags] = useState([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (id) loadExisting();
  }, [id, user]);

  const loadExisting = async () => {
    try {
      const ex = await recipeService.getRecipeById(id);
      if (ex && ex.user_id === user.id) {
        setTitle(ex.title); setDescription(ex.description);
        setIngredients(ex.ingredients?.length ? ex.ingredients : ['']);
        setSteps(ex.steps?.length ? ex.steps : ['']);
        setCountry(ex.country); setCategory(ex.category); setCost(ex.cost);
        setDifficulty(ex.difficulty); setCookTime(ex.cook_time);
        setServings(ex.servings); setDietaryTags(ex.dietary_tags || []);
        setPhotoUrl(ex.photo_url || '');
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (isDraft) => {
    if (!user) return;
    if (!isDraft && (!title.trim() || !description.trim())) {
      toast.error('Please fill in title and description');
      return;
    }
    setSaving(true);
    try {
      const recipe = {
        user_id: user.id, username: user.username,
        title, description,
        ingredients: ingredients.filter(i => i.trim()),
        steps: steps.filter(s => s.trim()),
        country, category, cost, difficulty,
        cook_time: cookTime, servings,
        dietary_tags: dietaryTags,
        photo_url: photoUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop',
        is_draft: isDraft,
      };
      if (id) recipe.id = id;
      await recipeService.saveRecipe(recipe);
      toast.success(isDraft ? 'Saved to drafts!' : id ? 'Recipe updated!' : 'Recipe published! 🎉');
      navigate(isDraft ? '/drafts' : '/');
    } catch (err) {
      toast.error('Could not save recipe');
    } finally {
      setSaving(false);
    }
  };

  const focusInput = (e) => {
    e.target.style.borderColor = '#F97316';
    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
  };
  const blurInput = (e) => {
    e.target.style.borderColor = '#FED7AA';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFF7ED 0%, #FFFBF7 40%, #FFF1E6 100%)' }}>

      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)',
        padding: '56px 24px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 16 }}>
            <Sparkles size={14} color="white" />
            <span style={{ color: 'white', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>{id ? 'Edit Recipe' : 'New Recipe'}</span>
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(32px, 6vw, 52px)',
            color: 'white', margin: '0 0 12px',
            fontWeight: 300, letterSpacing: -1,
          }}>
            {id ? 'Edit Your Recipe' : 'Share Your Secret'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>
            {id ? 'Update your culinary masterpiece.' : 'Write it down and inspire the world to cook.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>

        <Section title="General Information" icon="🍽️">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <Label>Recipe Title *</Label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Grandma's Famous Lasagna"
                style={{ ...inputStyle, fontSize: 16, fontWeight: 500 }}
                onFocus={focusInput} onBlur={blurInput}
              />
            </div>
            <div>
              <Label>Description *</Label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="What makes this recipe special? Tell the story…"
                rows={3}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                onFocus={focusInput} onBlur={blurInput}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <Label>Country of Origin</Label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={14} color="#F97316" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    value={country} onChange={e => setCountry(e.target.value)}
                    placeholder="Italy, Japan…"
                    style={{ ...inputStyle, paddingLeft: 36 }}
                    onFocus={focusInput} onBlur={blurInput}
                  />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Recipe Details" icon="⚙️">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { icon: Clock, label: 'Time (min)', value: cookTime, setter: setCookTime },
              { icon: Users, label: 'Servings', value: servings, setter: setServings },
            ].map(({ icon: Icon, label, value, setter }) => (
              <div key={label}>
                <Label><Icon size={10} style={{ display: 'inline', marginRight: 4 }} />{label}</Label>
                <input
                  type="number" value={value}
                  onChange={e => setter(Number(e.target.value))}
                  style={{ ...inputStyle, textAlign: 'center', fontWeight: 600, fontSize: 16 }}
                  onFocus={focusInput} onBlur={blurInput}
                />
              </div>
            ))}
            <div>
              <Label><BarChart2 size={10} style={{ display: 'inline', marginRight: 4 }} />Difficulty</Label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={selectStyle}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label><DollarSign size={10} style={{ display: 'inline', marginRight: 4 }} />Cost</Label>
              <select value={cost} onChange={e => setCost(e.target.value)} style={selectStyle}>
                {COSTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Dietary Tags</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {DIETARY.map(tag => {
                const active = dietaryTags.includes(tag);
                return (
                  <button key={tag} type="button"
                    onClick={() => setDietaryTags(active ? dietaryTags.filter(t => t !== tag) : [...dietaryTags, tag])}
                    style={{
                      padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                      border: `1.5px solid ${active ? '#F97316' : '#FED7AA'}`,
                      background: active ? '#FFF7ED' : 'white',
                      color: active ? '#EA580C' : '#92400E',
                      cursor: 'pointer', transition: 'all 0.15s',
                      boxShadow: active ? '0 0 0 3px rgba(249,115,22,0.1)' : 'none',
                    }}>
                    {active ? '✓ ' : ''}{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Ingredients" icon="🥗">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #FB923C, #F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                </div>
                <input
                  value={ing}
                  onChange={e => { const n = [...ingredients]; n[i] = e.target.value; setIngredients(n); }}
                  placeholder={`Ingredient ${i + 1}…`}
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={focusInput} onBlur={blurInput}
                />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}
                    style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Trash2 size={13} color="#EF4444" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIngredients([...ingredients, ''])}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF7ED', border: '1.5px dashed #FED7AA', borderRadius: 10, padding: '9px 16px', cursor: 'pointer', color: '#EA580C', fontSize: 13, fontWeight: 600, width: '100%', justifyContent: 'center' }}>
            <Plus size={15} /> Add Ingredient
          </button>
        </Section>

        <Section title="Step-by-Step Method" icon="👨‍🍳">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '1.5px solid #FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif", color: '#EA580C', fontWeight: 700, fontSize: 15 }}>{i + 1}</span>
                </div>
                <textarea
                  value={step}
                  onChange={e => { const n = [...steps]; n[i] = e.target.value; setSteps(n); }}
                  placeholder={`Describe step ${i + 1}…`}
                  rows={2}
                  style={{ ...inputStyle, flex: 1, resize: 'none', lineHeight: 1.6 }}
                  onFocus={focusInput} onBlur={blurInput}
                />
                {steps.length > 1 && (
                  <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                    style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                    <Trash2 size={13} color="#EF4444" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setSteps([...steps, ''])}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF7ED', border: '1.5px dashed #FED7AA', borderRadius: 10, padding: '9px 16px', cursor: 'pointer', color: '#EA580C', fontSize: 13, fontWeight: 600, width: '100%', justifyContent: 'center' }}>
            <Plus size={15} /> Add Step
          </button>
        </Section>

        <Section title="Recipe Photo" icon="📸">
          <Label>Image URL (Optional)</Label>
          <div style={{ position: 'relative' }}>
            <Camera size={14} color="#F97316" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/…"
              style={{ ...inputStyle, paddingLeft: 36 }}
              onFocus={focusInput} onBlur={blurInput}
            />
          </div>
          {photoUrl ? (
            <div style={{ marginTop: 14, borderRadius: 16, overflow: 'hidden', height: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <img src={photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ marginTop: 14, borderRadius: 16, height: 120, background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '2px dashed #FED7AA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Camera size={28} color="#FED7AA" />
              <span style={{ color: '#FCA572', fontSize: 13 }}>Paste an image URL above to preview</span>
            </div>
          )}
        </Section>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button type="button" onClick={() => handleSubmit(true)} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 24px', border: '1.5px solid #FED7AA', borderRadius: 14, background: 'white', color: '#92400E', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            <Save size={15} /> Save Draft
          </button>
          <button type="button" onClick={() => handleSubmit(false)} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 28px', border: 'none', borderRadius: 14, background: saving ? '#FCA572' : 'linear-gradient(135deg, #EA580C, #F97316)', color: 'white', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
            {saving ? 'Saving…' : <>{id ? 'Update' : 'Publish'} Recipe <ChevronRight size={16} /></>}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        input::placeholder, textarea::placeholder { color: #D4956A; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
      `}</style>
    </div>
  );
};