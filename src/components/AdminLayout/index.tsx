import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={styles.pageWrapper}>
      <header className="fixed top-0 left-0 right-0 bg-bg-primary border-b border-border-primary h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-text-primary hidden sm:block">织知 - 管理员后台</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="https://s.coze.cn/image/3VpJhTJsCWE/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-text-primary hidden sm:block">{user?.name || '管理员'}</span>
              <i className="fas fa-chevron-down text-xs text-text-secondary hidden sm:block"></i>
            </div>
          </div>
        </div>
      </header>

      <aside className={`fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-primary transition-all duration-300 z-40 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin"
            className={`${styles.navItem} ${isActive('/admin') && !isActive('/admin/') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            {!isSidebarCollapsed && <span>仪表盘</span>}
          </Link>
          <Link 
            to="/admin/user-management"
            className={`${styles.navItem} ${isActive('/admin/user-management') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-users w-5"></i>
            {!isSidebarCollapsed && <span>用户管理</span>}
          </Link>
          <Link 
            to="/admin/article-management"
            className={`${styles.navItem} ${isActive('/admin/article-management') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-file-alt w-5"></i>
            {!isSidebarCollapsed && <span>文章管理</span>}
          </Link>
          <Link 
            to="/admin/comment-management"
            className={`${styles.navItem} ${isActive('/admin/comment-management') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-comments w-5"></i>
            {!isSidebarCollapsed && <span>评论管理</span>}
          </Link>
          <Link 
            to="/admin/image-management"
            className={`${styles.navItem} ${isActive('/admin/image-management') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-images w-5"></i>
            {!isSidebarCollapsed && <span>图片管理</span>}
          </Link>
          <Link 
            to="/admin/short-note-management"
            className={`${styles.navItem} ${isActive('/admin/short-note-management') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-sticky-note w-5"></i>
            {!isSidebarCollapsed && <span>短记管理</span>}
          </Link>
          <Link 
            to="/admin/short-video-management"
            className={`${styles.navItem} ${isActive('/admin/short-video-management') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-video w-5"></i>
            {!isSidebarCollapsed && <span>短视频管理</span>}
          </Link>
          <Link 
            to="/admin/system-settings"
            className={`${styles.navItem} ${isActive('/admin/system-settings') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-cog w-5"></i>
            {!isSidebarCollapsed && <span>系统设置</span>}
          </Link>
          <Link 
            to="/admin/user-settings"
            className={`${styles.navItem} ${isActive('/admin/user-settings') ? styles.navItemActive : ''} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-user-cog w-5"></i>
            {!isSidebarCollapsed && <span>用户设置</span>}
          </Link>
          {user?.role === 'superadmin' && (
            <Link to="/admin-login-config" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
              <i className="fas fa-sign-in-alt w-5"></i>
              {!isSidebarCollapsed && <span>登录接口配置</span>}
            </Link>
          )}
          <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-arrow-left w-5"></i>
            {!isSidebarCollapsed && <span>返回首页</span>}
          </Link>
        </nav>
      </aside>

      <main className={`pt-16 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;