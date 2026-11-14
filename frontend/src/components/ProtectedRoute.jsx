import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Customer route guard: preserve nested route content for signed-in users, otherwise redirect.
// පාරිභෝගික මාර්ග ආරක්ෂකය: පිවිසි අයට ඇතුළත් පිටුව පෙන්වා අනෙක් අය යළි යොමු කරයි.
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // AuthContext is the shared source of the current session / වත්මන් සැසියේ පොදු මූලාශ්‍රය AuthContext ය.
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
