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
        <div style={{ minHeight: '100vh', background: '#FFFBF7', color: '#1C0A00' }}>
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
                background: 'white',
                color: '#1C0A00',
                border: '1.5px solid #FED7AA',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 8px 32px rgba(249,115,22,0.15)',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;