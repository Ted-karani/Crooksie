import { supabase } from './supabase';

export const recipeService = {

  // ── Recipes ──────────────────────────────────────────
  getRecipes: async ({ category, sortBy } = {}) => {
    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_draft', false);

    if (category && category !== 'All') query = query.eq('category', category);

    if (sortBy === 'Most Liked') query = query.order('like_count', { ascending: false });
    else if (sortBy === 'Trending') query = query.order('view_count', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getRecipeById: async (id) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;

    // Increment view count
    await supabase.from('recipes').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);
    return data;
  },

  saveRecipe: async (recipe) => {
    if (recipe.id) {
      const { error } = await supabase.from('recipes').update(recipe).eq('id', recipe.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('recipes').insert(recipe);
      if (error) throw error;
    }
  },

  deleteRecipe: async (id) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) throw error;
  },

  getDrafts: async (userId) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_draft', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  searchRecipes: async ({ query, country, cost, category }) => {
    let q = supabase.from('recipes').select('*').eq('is_draft', false);

    if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    if (country && country !== 'All') q = q.eq('country', country);
    if (cost && cost !== 'All') q = q.eq('cost', cost);
    if (category && category !== 'All') q = q.eq('category', category);

    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  // ── Likes ─────────────────────────────────────────────
  isLiked: async (userId, recipeId) => {
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single();
    return !!data;
  },

  toggleLike: async (userId, recipeId, currentlyLiked) => {
    if (currentlyLiked) {
      await supabase.from('likes').delete().eq('user_id', userId).eq('recipe_id', recipeId);
      await supabase.from('recipes').update({ like_count: supabase.raw('like_count - 1') }).eq('id', recipeId);
    } else {
      await supabase.from('likes').insert({ user_id: userId, recipe_id: recipeId });
      await supabase.from('recipes').update({ like_count: supabase.raw('like_count + 1') }).eq('id', recipeId);
    }
  },

  // ── Bookmarks ─────────────────────────────────────────
  isBookmarked: async (userId, recipeId) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single();
    return !!data;
  },

  toggleBookmark: async (userId, recipeId, currentlyBookmarked) => {
    if (currentlyBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('recipe_id', recipeId);
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, recipe_id: recipeId });
    }
  },

  getSavedRecipes: async (userId) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('recipe_id, recipes(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map(b => b.recipes);
  },

  // ── Comments ──────────────────────────────────────────
  getComments: async (recipeId) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  addComment: async (comment) => {
    const { data, error } = await supabase.from('comments').insert(comment).select().single();
    if (error) throw error;
    return data;
  },

  deleteComment: async (id) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
  },

  // ── Reports ───────────────────────────────────────────
  addReport: async (report) => {
    const { error } = await supabase.from('reports').insert(report);
    if (error) throw error;
  },

  // ── Profile ───────────────────────────────────────────
  getProfile: async (username) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
    if (error) throw error;
    return data;
  },

  getUserRecipes: async (username) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('username', username)
      .eq('is_draft', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};