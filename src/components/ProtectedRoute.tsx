import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'user' | 'admin' | 'superadmin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 如果未登录，重定向到登录页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // 检查权限：超级管理员可以访问所有页面，管理员可以访问非超级管理员页面，普通用户只能访问普通用户页面
    const hasPermission = 
      user?.role === 'superadmin' || 
      (user?.role === 'admin' && requiredRole !== 'superadmin') || 
      (user?.role === 'user' && requiredRole === 'user');
    
    if (!hasPermission) {
      // 如果没有足够的权限，重定向到首页
      return <Navigate to="/home" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
};
