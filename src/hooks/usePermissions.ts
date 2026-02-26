import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user, isAdmin, isSuperadmin } = useAuth();

  const canComment = () => {
    return !!user;
  };

  const canPublishArticle = () => {
    return isAdmin || isSuperadmin;
  };

  const canPublishShortNote = () => {
    return isAdmin || isSuperadmin;
  };

  const canPublishPhoto = () => {
    return isAdmin || isSuperadmin;
  };

  const canPublishVideo = () => {
    return isAdmin || isSuperadmin;
  };

  const canManageUsers = () => {
    return isSuperadmin;
  };

  const canManageContent = () => {
    return isAdmin || isSuperadmin;
  };

  const canEditArticle = (articleAuthorId: string) => {
    if (!user) return false;
    if (isSuperadmin) return true;
    if (isAdmin) return true;
    return user.id === articleAuthorId;
  };

  const canDeleteArticle = (articleAuthorId: string) => {
    if (!user) return false;
    if (isSuperadmin) return true;
    if (isAdmin) return true;
    return user.id === articleAuthorId;
  };

  const canAccessAdminPanel = () => {
    return isAdmin || isSuperadmin;
  };

  return {
    canComment,
    canPublishArticle,
    canPublishShortNote,
    canPublishPhoto,
    canPublishVideo,
    canManageUsers,
    canManageContent,
    canEditArticle,
    canDeleteArticle,
    canAccessAdminPanel,
  };
};