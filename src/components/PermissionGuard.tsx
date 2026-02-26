import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  permission: () => boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const canAccess = permission();

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const CommentGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const { canComment } = usePermissions();
  return <PermissionGuard permission={canComment} fallback={fallback}>{children}</PermissionGuard>;
};

export const PublishArticleGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const { canPublishArticle } = usePermissions();
  return <PermissionGuard permission={canPublishArticle} fallback={fallback}>{children}</PermissionGuard>;
};

export const PublishShortNoteGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const { canPublishShortNote } = usePermissions();
  return <PermissionGuard permission={canPublishShortNote} fallback={fallback}>{children}</PermissionGuard>;
};

export const PublishPhotoGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const { canPublishPhoto } = usePermissions();
  return <PermissionGuard permission={canPublishPhoto} fallback={fallback}>{children}</PermissionGuard>;
};

export const PublishVideoGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const { canPublishVideo } = usePermissions();
  return <PermissionGuard permission={canPublishVideo} fallback={fallback}>{children}</PermissionGuard>;
};

export const AdminPanelGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const { canAccessAdminPanel } = usePermissions();
  return <PermissionGuard permission={canAccessAdminPanel} fallback={fallback}>{children}</PermissionGuard>;
};