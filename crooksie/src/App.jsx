import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { ForgotPasswordPage } from './pages/ForgotPassword';
import { RecipeDetailPage } from './pages/RecipeDetail';
import { PostRecipePage } from './pages/PostRecipe';
import { SearchPage } from './pages/Search';
import { ProfilePage } from './pages/Profile';
import { DraftsPage } from './pages/Drafts';
import { EditProfilePage } from './pages/EditProfile';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#0D0A07', color: '#F5EDD8' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/post" element={<PostRecipePage />} />
            <Route path="/post/:id" element={<PostRecipePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/drafts" element={<DraftsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#1C1612',
                color: '#F5EDD8',
                border: '1px solid rgba(232,131,42,0.2)',
                fontFamily: 'DM Sans, sans-serif',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;