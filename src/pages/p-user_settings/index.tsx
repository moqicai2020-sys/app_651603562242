

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

const UserSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentAvatar, setCurrentAvatar] = useState('https://s.coze.cn/image/ROx8ba83Irg/');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAutoSwitch, setIsAutoSwitch] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  // Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 用户设置';
    return () => { document.title = originalTitle; };
  }, []);

  // 加载用户设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const autoThemeSwitch = localStorage.getItem('autoThemeSwitch') === 'true';
    const highContrastSetting = localStorage.getItem('highContrast') === 'true';
    
    setIsDarkTheme(savedTheme === 'dark');
    setIsAutoSwitch(autoThemeSwitch);
    setIsHighContrast(highContrastSetting);
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      // 响应式逻辑如果需要可以在这里添加
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 显示成功消息
  const showSuccessMessageHandler = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 搜索功能
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = (e.target as HTMLInputElement).value.trim();
      if (keyword) {
        navigate(`/search-result?q=${encodeURIComponent(keyword)}`);
      }
    }
  };

  // 头像上传
  const handleAvatarClick = () => {
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCurrentAvatar(e.target.result as string);
          showSuccessMessageHandler();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 表单提交
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    
    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }
    
    if (!email.trim()) {
      alert('请输入邮箱地址');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('请输入有效的邮箱地址');
      return;
    }
    
    showSuccessMessageHandler();
    console.log('保存基本信息:', { username, email });
  };

  // 主题切换
  const handleThemeSwitch = (checked: boolean) => {
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    setIsDarkTheme(checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    showSuccessMessageHandler();
  };

  const handleAutoSwitch = (checked: boolean) => {
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    setIsAutoSwitch(checked);
    localStorage.setItem('autoThemeSwitch', checked.toString());
    showSuccessMessageHandler();
  };

  const handleHighContrast = (checked: boolean) => {
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    setIsHighContrast(checked);
    localStorage.setItem('highContrast', checked.toString());
    showSuccessMessageHandler();
  };

  // 密码修改和登录历史
  const handleChangePassword = () => {
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    alert('修改密码功能将在后续版本中提供');
  };

  const handleLoginHistory = () => {
    if (!user) {
      alert('请先登录后再操作');
      navigate('/login');
      return;
    }
    alert('登录历史功能将在后续版本中提供');
  };

  // 用户菜单处理函数
  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout(() => {
      navigate('/public-home');
    });
    setShowUserMenu(false);
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleNavigateToAdmin = () => {
    navigate('/admin');
    setShowUserMenu(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-bg-primary border-b border-border-primary h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
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
              <h1 className="text-xl font-bold text-text-primary hidden sm:block">织知</h1>
            </div>
          </div>
          
          {/* 中间：搜索框 */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索文章..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-secondary rounded-lg bg-white ${styles.searchFocus}`}
                onKeyPress={handleSearchKeyPress}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：通知和用户 */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            {user ? (
              <div className="relative">
                <button 
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                >
                  <img 
                    src="https://s.coze.cn/image/8GCGciJflo4/" 
                    alt="用户头像" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-text-primary hidden sm:block">{user.name}</span>
                  <i className="fas fa-chevron-down text-xs text-text-secondary hidden sm:block"></i>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-primary z-50">
                    <div className="py-2">
                      <button 
                        onClick={handleNavigateToProfile}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <i className="fas fa-user"></i>
                        <span>个人中心</span>
                      </button>
                      {(user.role === 'admin' || user.role === 'superadmin') && (
                        <button 
                          onClick={handleNavigateToAdmin}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <i className="fas fa-cog"></i>
                          <span>管理员后台</span>
                        </button>
                      )}
                      <hr className="my-2 border-border-primary" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50 flex items-center space-x-2"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-text-primary hover:text-primary">
                  登录
                </Link>
                <Link to="/register" className="text-sm font-medium text-text-primary hover:text-primary">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-primary transition-all duration-300 z-40 ${
        isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
      }`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/home" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-home w-5"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link 
            to="/article-list" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-file-alt w-5"></i>
            {!isSidebarCollapsed && <span>文章列表</span>}
          </Link>
          <Link 
            to="/knowledge-graph" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-project-diagram w-5"></i>
            {!isSidebarCollapsed && <span>知识图谱</span>}
          </Link>
          <Link 
            to="/tag-cloud" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-tags w-5"></i>
            {!isSidebarCollapsed && <span>标签云</span>}
          </Link>
          <Link 
            to="/user-settings" 
            className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-cog w-5"></i>
            {!isSidebarCollapsed && <span>用户设置</span>}
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        <div className="p-6">
          {/* 页面头部 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">用户设置</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>用户设置</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 成功提示消息 */}
          <div className={`${styles.successMessage} ${showSuccessMessage ? styles.show : ''}`}>
            <i className="fas fa-check-circle mr-2"></i>
            设置已保存成功！
          </div>

          {/* 设置内容区 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 基本信息设置 */}
            <div className="bg-bg-primary rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
                <i className="fas fa-user-circle text-primary mr-3"></i>
                基本信息
              </h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* 头像设置 */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text-primary">头像</label>
                  <div className="flex items-center space-x-4">
                    <div className={styles.avatarUpload} onClick={handleAvatarClick}>
                      <img 
                        src={currentAvatar}
                        alt="当前头像" 
                        className="w-20 h-20 rounded-full border-4 border-border-primary"
                      />
                      <div className={styles.avatarOverlay}>
                        <i className="fas fa-camera text-sm"></i>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">点击头像更换</p>
                      <p className="text-xs text-text-secondary mt-1">支持 JPG、PNG 格式，最大 2MB</p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={avatarInputRef}
                    accept="image/*" 
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {/* 用户名 */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-text-primary">用户名</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-secondary rounded-lg bg-white ${styles.formInputFocus}`}
                    placeholder="请输入用户名"
                  />
                </div>

                {/* 邮箱 */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary">邮箱</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-secondary rounded-lg bg-white ${styles.formInputFocus}`}
                    placeholder="请输入邮箱地址"
                  />
                </div>

                {/* 保存按钮 */}
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fas fa-save"></i>
                  <span>保存更改</span>
                </button>
              </form>
            </div>

            {/* 主题设置 */}
            <div className="bg-bg-primary rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
                <i className="fas fa-palette text-secondary mr-3"></i>
                主题设置
              </h3>
              
              <div className="space-y-6">
                {/* 主题模式切换 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">主题模式</h4>
                      <p className="text-xs text-text-secondary mt-1">选择适合您的界面主题</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={isDarkTheme}
                        onChange={(e) => handleThemeSwitch(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  
                  {/* 主题预览 */}
                  <div className="space-y-3">
                    {!isDarkTheme && (
                      <div className="p-4 border border-border-secondary rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">浅色主题</span>
                          <i className="fas fa-sun text-warning"></i>
                        </div>
                        <p className="text-xs text-text-secondary">明亮清晰，适合光线充足的环境</p>
                      </div>
                    )}
                    
                    {isDarkTheme && (
                      <div className="p-4 border border-border-secondary rounded-lg bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">深色主题</span>
                          <i className="fas fa-moon text-indigo-400"></i>
                        </div>
                        <p className="text-xs text-indigo-300">护眼舒适，适合弱光环境</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 其他主题相关设置 */}
                <div className="space-y-4 pt-4 border-t border-border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">自动切换</h4>
                      <p className="text-xs text-text-secondary mt-1">跟随系统时间自动切换主题</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={isAutoSwitch}
                        onChange={(e) => handleAutoSwitch(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">高对比度</h4>
                      <p className="text-xs text-text-secondary mt-1">提高文字和背景的对比度</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={isHighContrast}
                        onChange={(e) => handleHighContrast(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 账户安全设置 */}
          <div className="mt-8 bg-bg-primary rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
              <i className="fas fa-shield-alt text-tertiary mr-3"></i>
              账户安全
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-primary">密码修改</h4>
                <p className="text-xs text-text-secondary">为了您的账户安全，建议定期更换密码</p>
                <button 
                  onClick={handleChangePassword}
                  className="mt-2 px-4 py-2 border border-border-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  修改密码
                </button>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-primary">登录历史</h4>
                <p className="text-xs text-text-secondary">查看最近的登录记录</p>
                <button 
                  onClick={handleLoginHistory}
                  className="mt-2 px-4 py-2 border border-border-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  查看历史
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserSettingsPage;

