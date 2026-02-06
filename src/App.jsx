import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; // Import Home

import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Attack from './pages/Attack';
import Help from './pages/Help';
import FactionSelect from './pages/FactionSelect';
import Shop from './pages/Shop';
import HowToPlay from './pages/HowToPlay';

const ProtectedRoute = ({ children }) => {
  const { currentUser, mongoUser, loading } = useAuth();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-borderland-dark text-borderland-red font-mono tracking-[0.5em] animate-pulse uppercase">
      <div className="w-12 h-[2px] bg-borderland-red mb-4"></div>
      Loading_Realm...
    </div>
  );

  // We require both Firebase Auth AND Backend Auth (which proves verification)
  if (!currentUser || !mongoUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

// NEW: Redirect logged-in users to /game
const PublicRoute = ({ children }) => {
  const { currentUser, mongoUser, loading } = useAuth();

  if (loading) {
    return null; // Or a simple spinner, but null is fine for smooth redirect
  }

  // If fully authenticated, redirect to game
  if (currentUser && mongoUser) {
    return <Navigate to="/game" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <Layout>
            <Routes>
              {/* Public Routes with Check */}
              <Route path="/" element={<Home />} />

              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />

              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/game" element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              } />

              <Route path="/select-faction" element={
                <ProtectedRoute>
                  <FactionSelect />
                </ProtectedRoute>
              } />

              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />

              <Route path="/attack" element={
                <ProtectedRoute>
                  <Attack />
                </ProtectedRoute>
              } />

              <Route path="/help" element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              } />

              <Route path="/shop" element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              } />

              <Route path="/rules" element={
                <ProtectedRoute>
                  <HowToPlay />
                </ProtectedRoute>
              } />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
