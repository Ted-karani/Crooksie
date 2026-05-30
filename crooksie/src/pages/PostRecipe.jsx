import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Camera, MapPin, Clock, Users, BarChart2, DollarSign, Save, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { toast } from 'sonner';

const DIETARY = ['Vegan', 'Halal', 'Gluten-free', 'Dairy-free', 'Keto', 'Vegetarian'];
const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const costs = ['Cheap', 'Moderate', 'Expensive'];

const inputStyle = {
  width: '100%', background: '#0D0A07', border: '1px solid rgba(245,237,216,0.08)',
  borderRadius: 12, padding: '12px 16px', color: '#F5EDD8', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const selectStyle = {
  ...inputStyle, appearance: 'none', cursor: 'pointer',
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
        setIngredients(ex.ingredients || ['']); setSteps(ex.steps || ['']);
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
        user_id: user.id,
        username: user.username,
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
      toast.success(isDraft ? 'Saved to drafts!' : id ? 'Recipe updated!' : 'Recipe published!');
      navigate(isDraft ? '/drafts' : '/');
    } catch (err) {
      toast.error('Could not save recipe');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ title: t, children }) => (
    <div style={{ background: '#1C1612', border: '1px solid rgba(245,237,216,0.05)', borderRadius: 20, padding: 28, marginBottom: 20 }}>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: '#F5EDD8', margin: '0 0 24px' }}>{t}</h2>
      {children}
    </div>
  );

  const Label = ({ children }) => (
    <label style={{ display: 'block', fontSize: 11, color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>{children}</label>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A07', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, color: '#E8832A', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{id ? 'Edit' : 'Create'}</p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, color: '#F5EDD8', margin: 0 }}>{id ? 'Edit Recipe' : 'Share Your Recipe'}</h1>
        </div>

        {/* General info */}
        <Section title="General Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label>Recipe Title *</Label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Grandma's Famous Lasagna" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(232,131,42,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,237,216,0.08)'}
              />
            </div>
            <div>
              <Label>Description *</Label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What makes this recipe special?" rows={3} style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(232,131,42,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,237,216,0.08)'}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <Label>Country of Origin</Label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={13} color="#E8832A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Italy, Japan…" style={{ ...inputStyle, paddingLeft: 36 }} />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </Section>

        {/* Details */}
        <Section title="Recipe Details">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { icon: Clock, label: 'Time (min)', value: cookTime, setter: setCookTime, type: 'number' },
              { icon: Users, label: 'Servings', value: servings, setter: setServings, type: 'number' },
            ].map(({ icon: Icon, label, value, setter, type }) => (
              <div key={label}>
                <Label><Icon size={11} color="#E8832A" style={{ display: 'inline', marginRight: 4 }} />{label}</Label>
                <input type={type} value={value} onChange={e => setter(Number(e.target.value))} style={inputStyle} />
              </div>
            ))}
            <div>
              <Label><BarChart2 size={11} color="#E8832A" style={{ display: 'inline', marginRight: 4 }} />Difficulty</Label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={selectStyle}>
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label><DollarSign size={11} color="#E8832A" style={{ display: 'inline', marginRight: 4 }} />Cost</Label>
              <select value={cost} onChange={e => setCost(e.target.value)} style={selectStyle}>
                {costs.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Dietary Tags</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DIETARY.map(tag => {
                const active = dietaryTags.includes(tag);
                return (
                  <button key={tag} type="button" onClick={() => setDietaryTags(active ? dietaryTags.filter(t => t !== tag) : [...dietaryTags, tag])} style={{
                    padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                    border: `1px solid ${active ? '#E8832A' : 'rgba(245,237,216,0.1)'}`,
                    background: active ? '#E8832A' : 'transparent',
                    color: active ? '#0D0A07' : 'rgba(245,237,216,0.4)', cursor: 'pointer', transition: 'all 0.2s',
                  }}>{tag}</button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Ingredients */}
        <Section title="Ingredients">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input value={ing} onChange={e => { const n = [...ingredients]; n[i] = e.target.value; setIngredients(n); }} placeholder={`Ingredient ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.5)', padding: '0 8px' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIngredients([...ingredients, ''])} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#E8832A', fontSize: 13 }}>
            <Plus size={14} /> Add Ingredient
          </button>
        </Section>

        {/* Steps */}
        <Section title="Step-by-Step Method">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 14 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#0D0A07', border: '1px solid rgba(232,131,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#E8832A', flexShrink: 0, marginTop: 4 }}>{i + 1}</span>
                <textarea value={step} onChange={e => { const n = [...steps]; n[i] = e.target.value; setSteps(n); }} placeholder={`Describe step ${i + 1}…`} rows={2} style={{ ...inputStyle, flex: 1, resize: 'none' }} />
                {steps.length > 1 && (
                  <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.5)', paddingTop: 8 }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setSteps([...steps, ''])} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#E8832A', fontSize: 13 }}>
            <Plus size={14} /> Add Step
          </button>
        </Section>

        {/* Photo */}
        <Section title="Recipe Photo">
          <div>
            <Label>Image URL (Optional)</Label>
            <div style={{ position: 'relative' }}>
              <Camera size={13} color="#E8832A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://images.unsplash.com/…" style={{ ...inputStyle, paddingLeft: 36 }} />
            </div>
            {photoUrl && <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', height: 160 }}><img src={photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
          </div>
        </Section>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
          <button type="button" onClick={() => handleSubmit(true)} disabled={saving} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
            border: '1px solid rgba(245,237,216,0.1)', borderRadius: 99, background: 'transparent',
            color: 'rgba(245,237,216,0.5)', cursor: 'pointer', fontSize: 13,
          }}>
            <Save size={14} /> Save Draft
          </button>
          <button type="button" onClick={() => handleSubmit(false)} disabled={saving} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px',
            background: '#E8832A', border: 'none', borderRadius: 99,
            color: '#0D0A07', fontWeight: 600, cursor: 'pointer', fontSize: 13,
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saving…' : <>{id ? 'Update' : 'Publish'} Recipe <ChevronRight size={15} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};