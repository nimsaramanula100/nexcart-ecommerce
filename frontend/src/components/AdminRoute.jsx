import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin-only route guard; AuthContext supplies identity/role and unauthorized users go to login.
// පරිපාලක මාර්ග ආරක්ෂකය: AuthContext අනන්‍යතාව/භූමිකාව සපයන අතර අවසර නොලත් අය පිවිසුමට යොමු කරයි.
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();

  // Render the nested page only for an authenticated admin / පිවිසි පරිපාලකයෙකුට පමණක් ඇතුළත් පිටුව පෙන්වයි.
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
