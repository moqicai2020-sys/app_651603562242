import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

const HomePage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 首页';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = globalSearchValue.trim();
      if (keyword) {
        navigate(`/search-result?q=${encodeURIComponent(keyword)}`);
      }
    }
  };

  const handleNotificationClick = () => {
    navigate('/system-announcements');
  };

  const handleQuickKnowledgeGraphClick = () => {
    navigate('/knowledge-graph');
  };

  const handleQuickTagsClick = () => {
    navigate('/tag-cloud');
  };

  const handleShare = (platform: string, noteId: string, title: string, content: string) => {
    const shareText = `${title}\n${content}\n\n来自织知每日短记`;
    const shareUrl = window.location.origin + `/short-note-detail?id=${noteId}`;
    
    switch (platform) {
      case 'wechat':
        alert('请在微信中打开此页面进行分享');
        break;
      case 'weibo':
        const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        window.open(weiboUrl, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('链接已复制到剪贴板');
        });
        break;
      default:
        break;
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUserMenuClose = () => {
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/user-settings');
    handleUserMenuClose();
  };

  const handleAdminClick = () => {
    navigate('/admin');
    handleUserMenuClose();
  };

  const handleLogoutClick = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
      handleUserMenuClose();
      navigate('/public-home');
    }
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
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                placeholder="搜索..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-secondary rounded-lg bg-white ${styles.searchFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：通知和用户 */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button 
                  onClick={handleNotificationClick}
                  className="p-2 rounded-lg hover:bg-gray-100 relative"
                  title="系统公告"
                >
                  <i className="fas fa-bell text-gray-600"></i>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
                </button>
                <div className="relative">
                  <button 
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                  >
                    <img 
                      src="https://s.coze.cn/image/3VpJhTJsCWE/" 
                      alt="用户头像" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-text-primary hidden sm:block">{user.name}</span>
                    <i className={`fas fa-chevron-down text-xs text-text-secondary hidden sm:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-primary z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-text-secondary border-b border-border-primary">
                          <div className="font-medium text-text-primary">{user.name}</div>
                          <div className="text-xs text-text-secondary">{user.role === 'admin' ? '管理员' : '普通用户'}</div>
                        </div>
                        <button 
                          onClick={handleSettingsClick}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <i className="fas fa-cog w-4"></i>
                          <span>设置</span>
                        </button>
                        {user.role === 'admin' && (
                          <button 
                            onClick={handleAdminClick}
                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <i className="fas fa-user-shield w-4"></i>
                            <span>管理员后台</span>
                          </button>
                        )}
                        <div className="border-t border-border-primary">
                          <button 
                            onClick={handleLogoutClick}
                            className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <i className="fas fa-sign-out-alt w-4"></i>
                            <span>退出</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-text-primary hover:text-primary">
                  登录
                </Link>
                <Link to="/register" className="text-sm font-medium text-text-primary hover:text-primary">
                  注册
                </Link>
                <Link to="/forgot-password" className="text-sm font-medium text-text-primary hover:text-primary">
                  找回密码
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-primary transition-all duration-300 z-40 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        <nav className="p-4 space-y-2">
          <Link to="/home" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium`}>
            <i className="fas fa-home w-5"></i>
            {!isSidebarCollapsed && <span>首页</span>}
          </Link>
          <Link to="/photo-blog" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-image w-5"></i>
            {!isSidebarCollapsed && <span>图片</span>}
          </Link>
          <Link to="/short-notes" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-sticky-note w-5"></i>
            {!isSidebarCollapsed && <span>短记</span>}
          </Link>
          <Link to="/short-videos" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-video w-5"></i>
            {!isSidebarCollapsed && <span>短视频</span>}
          </Link>
          <Link to="/knowledge-graph" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-project-diagram w-5"></i>
            {!isSidebarCollapsed && <span>知识图谱</span>}
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        <div className="p-6">
          {/* 页面头部 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
              {user && (
                <>
                  <h2 className="text-2xl font-bold text-text-primary mb-1">欢迎回来，{user.name}</h2>
                  <nav className="text-sm text-text-secondary">
                    <span>首页</span>
                  </nav>
                </>
              )}
            </div>
            </div>
          </div>

          {/* 快速入口区 */}
          {user && (
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">快速入口</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={handleQuickKnowledgeGraphClick}
                  className={`bg-bg-primary rounded-xl p-6 cursor-pointer ${styles.cardHover}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-project-diagram text-tertiary text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">知识图谱</h4>
                      <p className="text-sm text-text-secondary">查看知识关联</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  onClick={handleQuickTagsClick}
                  className={`bg-bg-primary rounded-xl p-6 cursor-pointer ${styles.cardHover}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-tags text-warning text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">热门标签</h4>
                      <p className="text-sm text-text-secondary">浏览标签分类</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 统计概览区 */}
          {user && (
            <section className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">知识统计</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-bg-primary rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">双向链接</p>
                    <p className="text-3xl font-bold text-text-primary">256</p>
                    <p className="text-sm text-success mt-1">
                      <i className="fas fa-arrow-up"></i> +23 本月
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-link text-secondary text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-bg-primary rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">标签总数</p>
                    <p className="text-3xl font-bold text-text-primary">43</p>
                    <p className="text-sm text-success mt-1">
                      <i className="fas fa-arrow-up"></i> +5 本月
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-tags text-tertiary text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-bg-primary rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">连续使用</p>
                    <p className="text-3xl font-bold text-text-primary">15</p>
                    <p className="text-sm text-text-secondary mt-1">天</p>
                  </div>
                  <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-fire text-warning text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
          )}

          {/* 短记文章 */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">短记文章</h3>
              <Link to="/short-notes" className="text-primary hover:text-blue-600 text-sm font-medium">
                查看全部 <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
            <div className="space-y-4">
              {/* 短记文章 1 */}
              <div className="bg-bg-primary rounded-xl p-6 shadow-card">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-newspaper text-primary text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
                        科技资讯
                      </span>
                      <span className="text-sm text-text-secondary">2小时前</span>
                    </div>
                    <Link to="/short-note-detail?id=1" className="text-lg font-semibold text-text-primary mb-2 hover:text-primary inline-block">人工智能技术在医疗领域的应用取得重大突破</Link>
                    <p className="text-text-secondary mb-4">
                      最新研究表明，人工智能技术在医疗诊断方面的准确率已经超过了人类医生，特别是在影像诊断和疾病预测方面表现突出。
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="https://s.coze.cn/image/3VpJhTJsCWE/" 
                          alt="作者头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-text-primary">謩子</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* 分享按钮 */}
                        <button 
                          className="text-text-secondary hover:text-primary text-sm"
                          onClick={() => handleShare('wechat', '1', '人工智能技术在医疗领域的应用取得重大突破', '最新研究表明，人工智能技术在医疗诊断方面的准确率已经超过了人类医生，特别是在影像诊断和疾病预测方面表现突出。')}
                          title="微信分享"
                        >
                          <i className="fab fa-weixin"></i>
                        </button>
                        <button 
                          className="text-text-secondary hover:text-primary text-sm"
                          onClick={() => handleShare('weibo', '1', '人工智能技术在医疗领域的应用取得重大突破', '最新研究表明，人工智能技术在医疗诊断方面的准确率已经超过了人类医生，特别是在影像诊断和疾病预测方面表现突出。')}
                          title="微博分享"
                        >
                          <i className="fab fa-weibo"></i>
                        </button>
                        <button 
                          className="text-text-secondary hover:text-primary text-sm"
                          onClick={() => handleShare('copy', '1', '人工智能技术在医疗领域的应用取得重大突破', '最新研究表明，人工智能技术在医疗诊断方面的准确率已经超过了人类医生，特别是在影像诊断和疾病预测方面表现突出。')}
                          title="复制链接"
                        >
                          <i className="fas fa-share-alt"></i>
                        </button>
                        {(user && (user.role === 'admin' || user.role === 'superadmin')) && (
                          <>
                            <button 
                              className="text-text-secondary hover:text-primary text-sm"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="text-text-secondary hover:text-danger text-sm"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 短记文章 2 */}
              <div className="bg-bg-primary rounded-xl p-6 shadow-card">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-city text-secondary text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary bg-opacity-10 text-secondary">
                        社会新闻
                      </span>
                      <span className="text-sm text-text-secondary">4小时前</span>
                    </div>
                    <Link to="/short-note-detail?id=2" className="text-lg font-semibold text-text-primary mb-2 hover:text-primary inline-block">城市绿色出行计划成效显著，空气质量明显改善</Link>
                    <p className="text-text-secondary mb-4">
                      某城市实施绿色出行计划半年来，公共交通使用率提升30%，私家车出行减少25%，空气质量指数显著下降，市民满意度大幅提高。
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="https://s.coze.cn/image/3VpJhTJsCWE/" 
                          alt="作者头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-text-primary">謩子</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* 分享按钮 */}
                        <button 
                          className="text-text-secondary hover:text-primary text-sm"
                          onClick={() => handleShare('wechat', '2', '城市绿色出行计划成效显著，空气质量明显改善', '某城市实施绿色出行计划半年来，公共交通使用率提升30%，私家车出行减少25%，空气质量指数显著下降，市民满意度大幅提高。')}
                          title="微信分享"
                        >
                          <i className="fab fa-weixin"></i>
                        </button>
                        <button 
                          className="text-text-secondary hover:text-primary text-sm"
                          onClick={() => handleShare('weibo', '2', '城市绿色出行计划成效显著，空气质量明显改善', '某城市实施绿色出行计划半年来，公共交通使用率提升30%，私家车出行减少25%，空气质量指数显著下降，市民满意度大幅提高。')}
                          title="微博分享"
                        >
                          <i className="fab fa-weibo"></i>
                        </button>
                        <button 
                          className="text-text-secondary hover:text-primary text-sm"
                          onClick={() => handleShare('copy', '2', '城市绿色出行计划成效显著，空气质量明显改善', '某城市实施绿色出行计划半年来，公共交通使用率提升30%，私家车出行减少25%，空气质量指数显著下降，市民满意度大幅提高。')}
                          title="复制链接"
                        >
                          <i className="fas fa-share-alt"></i>
                        </button>
                        {(user && (user.role === 'admin' || user.role === 'superadmin')) && (
                          <>
                            <button 
                              className="text-text-secondary hover:text-primary text-sm"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="text-text-secondary hover:text-danger text-sm"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 短记文章 3 */}
              <div className="bg-bg-primary rounded-xl p-6 shadow-card">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-utensils text-tertiary text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-tertiary bg-opacity-10 text-tertiary">
                        民生资讯
                      </span>
                      <span className="text-sm text-text-secondary">6小时前</span>
                    </div>
                    <Link to="/short-note-detail?id=3" className="text-lg font-semibold text-text-primary mb-2 hover:text-primary inline-block">全国多地推出食品安全追溯系统，保障舌尖上的安全</Link>
                    <p className="text-text-secondary mb-4">
                      为了保障食品安全，全国多地开始推行食品溯源系统，消费者可以通过扫描二维码了解食品的生产、加工、运输全过程信息。
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="https://s.coze.cn/image/3VpJhTJsCWE/" 
                          alt="作者头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-text-primary">謩子</span>
                      </div>
                      {(user && (user.role === 'admin' || user.role === 'superadmin')) && (
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-text-secondary hover:text-primary text-sm"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-text-secondary hover:text-danger text-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 未登录状态下的欢迎页面 */}
          {!user && (
            <div className="container mx-auto px-4 py-12">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 左侧：欢迎信息 */}
                <div className="lg:flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-6">欢迎使用织知</h3>
                  <p className="text-text-secondary mb-8">
                    织知是一个综合性知识管理平台，您可以在这里记录短记、分享图片、观看短视频、探索知识图谱。
                    登录后即可开始使用全部功能。
                  </p>
                  <div className="flex space-x-4">
                    <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                      登录
                    </Link>
                    <Link to="/register" className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors">
                      注册
                    </Link>
                  </div>
                </div>

                {/* 右侧：侧边栏 */}
                <div className="lg:w-80">
                  {/* 最新图片 */}
                  <div className="bg-white rounded-xl shadow-card p-4 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-text-primary">最新图片</h4>
                      <Link to="/photo-blog" className="text-sm text-primary hover:underline">查看更多</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" 
                        alt="最新图片" 
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img 
                        src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400" 
                        alt="最新图片" 
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img 
                        src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400" 
                        alt="最新图片" 
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <img 
                        src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400" 
                        alt="最新图片" 
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;