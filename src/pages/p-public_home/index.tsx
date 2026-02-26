import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

const PublicHomePage: React.FC = () => {
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 博客';
    return () => { document.title = originalTitle; };
  }, []);

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = globalSearchValue.trim();
      if (keyword) {
        navigate(`/search-result?q=${encodeURIComponent(keyword)}`);
      }
    }
  };

  const handleTagClick = (tagName: string) => {
    navigate(`/article-list?tag=${encodeURIComponent(tagName)}`);
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/article-detail?id=${articleId}`);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
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
      <header className="bg-bg-primary border-b border-border-primary sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* 左侧：Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">织知</h1>
          </div>
          
          {/* 中间：搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                placeholder="搜索文章..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-secondary rounded-full bg-white ${styles.searchFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：导航链接 */}
          <nav className="flex items-center space-x-6">
            <Link to="/home" className={`${styles.navLink} text-text-primary hover:text-primary font-medium`}>
              首页
            </Link>
            <Link to="/article-list" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              文章
            </Link>
            <Link to="/photo-blog" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              图片
            </Link>
            <Link to="/short-notes" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              短记
            </Link>
            <Link to="/short-videos" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              短视频
            </Link>
            <Link to="/knowledge-graph" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              知识图谱
            </Link>
            {user ? (
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
                <Link to="/forgot-password" className="text-sm font-medium text-text-primary hover:text-primary">
                  找回密码
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              探索知识的无限可能
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              记录思考，分享见解，构建个人知识体系
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/article-list" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                <i className="fas fa-book"></i>
                <span>浏览文章</span>
              </Link>
              <Link to="/tag-cloud" className="bg-white text-primary border border-primary px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                <i className="fas fa-tags"></i>
                <span>探索标签</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 宣传卡片区域 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
              为什么选择织知
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 卡片 1：知识分享 */}
              <div className={`${styles.featureCard} bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-card hover:shadow-lg transition-shadow`}>
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-pen-fancy text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4 text-center">
                  知识分享
                </h3>
                <p className="text-text-secondary text-center">
                  记录思考过程，分享学习心得，与志同道合的人一起成长
                </p>
              </div>
              
              {/* 卡片 2：标签管理 */}
              <div className={`${styles.featureCard} bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-card hover:shadow-lg transition-shadow`}>
                <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-tags text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4 text-center">
                  标签管理
                </h3>
                <p className="text-text-secondary text-center">
                  智能标签系统，轻松组织内容，快速查找相关知识
                </p>
              </div>
              
              {/* 卡片 3：图片博客 */}
              <div className={`${styles.featureCard} bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl shadow-card hover:shadow-lg transition-shadow`}>
                <div className="w-16 h-16 bg-tertiary bg-opacity-10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-images text-tertiary text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4 text-center">
                  图片博客
                </h3>
                <p className="text-text-secondary text-center">
                  视觉化分享，用图片讲述故事，表达创意和灵感
                </p>
              </div>
              
              {/* 卡片 4：知识图谱 */}
              <div className={`${styles.featureCard} bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl shadow-card hover:shadow-lg transition-shadow`}>
                <div className="w-16 h-16 bg-warning bg-opacity-10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-project-diagram text-warning text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4 text-center">
                  知识图谱
                </h3>
                <p className="text-text-secondary text-center">
                  可视化知识关联，发现隐藏联系，构建完整知识体系
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧：文章列表 */}
          <div className="lg:flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-6">最新文章</h3>
            
            {/* 文章卡片 1 */}
            <div className={`${styles.articleCard} mb-8 bg-white rounded-xl shadow-card overflow-hidden`}>
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="产品设计中的用户体验思考" 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
                      产品设计
                    </span>
                    <span className="text-sm text-text-secondary">2小时前</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article1')}>
                    产品设计中的用户体验思考
                  </h4>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    用户体验设计是产品成功的关键因素之一。本文将探讨如何在产品设计过程中融入用户体验思维，从用户研究到原型设计，再到最终的用户测试，全方位提升产品的用户体验...
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
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-eye"></i>
                        <span>128</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-comment"></i>
                        <span>32</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-heart"></i>
                        <span>64</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 文章卡片 2 */}
            <div className={`${styles.articleCard} mb-8 bg-white rounded-xl shadow-card overflow-hidden`}>
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="前端开发技术栈总结" 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary bg-opacity-10 text-secondary">
                      前端开发
                    </span>
                    <span className="text-sm text-text-secondary">1天前</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article2')}>
                    前端开发技术栈总结
                  </h4>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    随着前端技术的快速发展，选择合适的技术栈变得越来越重要。本文将对当前主流的前端技术栈进行总结，包括框架、库、构建工具等，帮助开发者做出更明智的技术选择...
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
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-eye"></i>
                        <span>256</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-comment"></i>
                        <span>48</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-heart"></i>
                        <span>96</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 文章卡片 3 */}
            <div className={`${styles.articleCard} mb-8 bg-white rounded-xl shadow-card overflow-hidden`}>
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="学习笔记：React Hooks 深入理解" 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-tertiary bg-opacity-10 text-tertiary">
                      学习笔记
                    </span>
                    <span className="text-sm text-text-secondary">3天前</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article3')}>
                    学习笔记：React Hooks 深入理解
                  </h4>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    React Hooks 自推出以来，极大地改变了 React 组件的编写方式。本文将深入探讨 React Hooks 的工作原理，包括 useState、useEffect、useContext 等常用 Hook 的使用场景和最佳实践...
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
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-eye"></i>
                        <span>192</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-comment"></i>
                        <span>36</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-heart"></i>
                        <span>72</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 文章卡片 4 */}
            <div className={`${styles.articleCard} mb-8 bg-white rounded-xl shadow-card overflow-hidden`}>
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="项目管理心得分享" 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning bg-opacity-10 text-warning">
                      项目管理
                    </span>
                    <span className="text-sm text-text-secondary">1周前</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article4')}>
                    项目管理心得分享
                  </h4>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    项目管理是一项复杂的系统工程，需要协调人员、资源、时间等多个因素。本文将分享作者在实际项目中积累的管理经验，包括项目规划、团队协作、风险管理等方面的心得体会...
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
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-eye"></i>
                        <span>160</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-comment"></i>
                        <span>28</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-heart"></i>
                        <span>56</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 文章卡片 5 */}
            <div className={`${styles.articleCard} mb-8 bg-white rounded-xl shadow-card overflow-hidden`}>
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="代码重构的艺术" 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success bg-opacity-10 text-success">
                      编程技巧
                    </span>
                    <span className="text-sm text-text-secondary">3天前</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article5')}>
                    代码重构的艺术：从混乱到优雅
                  </h4>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    代码重构是提升代码质量和可维护性的重要手段。本文将深入探讨重构的原则、方法和最佳实践，帮助你将混乱的代码转化为优雅、高效的解决方案...
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
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-eye"></i>
                        <span>142</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-comment"></i>
                        <span>25</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-heart"></i>
                        <span>48</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 文章卡片 6 */}
            <div className={`${styles.articleCard} mb-8 bg-white rounded-xl shadow-card overflow-hidden`}>
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="技术团队管理" 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-info bg-opacity-10 text-info">
                      团队管理
                    </span>
                    <span className="text-sm text-text-secondary">5天前</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article6')}>
                    技术团队管理：打造高效协作的团队文化
                  </h4>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    技术团队的管理不仅仅是技术问题，更是人与人的协作问题。本文将分享如何建立高效的团队文化，提升团队凝聚力和执行力，打造一支优秀的技术团队...
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
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-eye"></i>
                        <span>128</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-comment"></i>
                        <span>22</span>
                      </span>
                      <span className="text-sm text-text-secondary flex items-center space-x-1">
                        <i className="far fa-heart"></i>
                        <span>42</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 分页 */}
            <div className="flex justify-center space-x-2">
              <button 
                onClick={() => setCurrentPage(1)}
                className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                1
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={`px-4 py-2 rounded-lg ${currentPage === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                2
              </button>
              <button 
                onClick={() => setCurrentPage(3)}
                className={`px-4 py-2 rounded-lg ${currentPage === 3 ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                3
              </button>
              <button 
                onClick={() => setCurrentPage(4)}
                className={`px-4 py-2 rounded-lg ${currentPage === 4 ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                ...
              </button>
              <button 
                onClick={() => setCurrentPage(10)}
                className={`px-4 py-2 rounded-lg ${currentPage === 10 ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
              >
                10
              </button>
            </div>
          </div>

          {/* 右侧：侧边栏 */}
          <div className="lg:w-80">
            {/* 搜索框 */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-8">
              <h4 className="text-lg font-semibold text-text-primary mb-4">搜索</h4>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索文章..." 
                  className={`w-full pl-10 pr-4 py-2 border border-border-secondary rounded-lg ${styles.searchFocus}`}
                  onKeyPress={handleGlobalSearchKeyPress}
                  onChange={(e) => setGlobalSearchValue(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>
            </div>

            {/* 作者信息 */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-8 text-center">
              <img 
                src="https://s.coze.cn/image/3VpJhTJsCWE/" 
                alt="作者头像" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary border-opacity-20"
              />
              <h4 className="text-xl font-bold text-text-primary mb-2">謩子</h4>
              <p className="text-text-secondary mb-4">产品设计师 & 前端开发者</p>
              <p className="text-sm text-text-secondary mb-6">
                专注于用户体验设计和前端开发，热爱分享技术心得和设计思考
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-medium text-xl"></i>
                </a>
              </div>
            </div>

            {/* 热门标签 */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-8">
              <h4 className="text-lg font-semibold text-text-primary mb-4">热门标签</h4>
              <div className="flex flex-wrap gap-2">
                <span 
                  onClick={() => handleTagClick('产品设计')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  产品设计
                </span>
                <span 
                  onClick={() => handleTagClick('前端开发')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  前端开发
                </span>
                <span 
                  onClick={() => handleTagClick('React')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  React
                </span>
                <span 
                  onClick={() => handleTagClick('用户体验')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  用户体验
                </span>
                <span 
                  onClick={() => handleTagClick('学习笔记')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  学习笔记
                </span>
                <span 
                  onClick={() => handleTagClick('项目管理')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  项目管理
                </span>
                <span 
                  onClick={() => handleTagClick('技术栈')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  技术栈
                </span>
                <span 
                  onClick={() => handleTagClick('心得')}
                  className={`${styles.tagItem} cursor-pointer`}
                >
                  心得
                </span>
              </div>
            </div>

            {/* 图片博客 */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-text-primary">图片博客</h4>
                <Link to="/photo-blog" className="text-sm text-primary hover:underline">查看更多</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" 
                  alt="图片博客" 
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/photo-blog')}
                />
                <img 
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400" 
                  alt="图片博客" 
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/photo-blog')}
                />
                <img 
                  src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400" 
                  alt="图片博客" 
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/photo-blog')}
                />
                <img 
                  src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400" 
                  alt="图片博客" 
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/photo-blog')}
                />
              </div>
            </div>

            {/* 知识图谱 */}
            <div className="bg-white rounded-xl shadow-card p-4 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-text-primary">知识图谱</h4>
                <Link to="/knowledge-graph" className="text-sm text-primary hover:underline">查看更多</Link>
              </div>
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <div className="w-48 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-project-diagram text-4xl text-primary"></i>
                  </div>
                  <div className="absolute -top-2 -left-2 w-3 h-3 bg-secondary rounded-full"></div>
                  <div className="absolute -top-4 -right-4 w-2 h-2 bg-tertiary rounded-full"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-warning rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-2 h-2 bg-danger rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-text-secondary text-center mb-4">
                可视化知识关联，发现隐藏联系
              </p>
              <button 
                onClick={() => navigate('/knowledge-graph')}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                探索知识图谱
              </button>
            </div>

            {/* 推荐文章 */}
            <div className="bg-white rounded-xl shadow-card p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-4">推荐文章</h4>
              <div className="space-y-4">
                <div className={`${styles.recommendedArticle} flex gap-3`}>
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80" 
                    alt="推荐文章" 
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-1 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article5')}>
                      如何构建高质量的前端代码库
                    </h5>
                    <p className="text-xs text-text-secondary">2周前</p>
                  </div>
                </div>
                <div className={`${styles.recommendedArticle} flex gap-3`}>
                  <img 
                    src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80" 
                    alt="推荐文章" 
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-1 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article6')}>
                      产品经理与设计师的协作之道
                    </h5>
                    <p className="text-xs text-text-secondary">3周前</p>
                  </div>
                </div>
                <div className={`${styles.recommendedArticle} flex gap-3`}>
                  <img 
                    src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80" 
                    alt="推荐文章" 
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-1 hover:text-primary cursor-pointer" onClick={() => handleArticleClick('article7')}>
                      前端性能优化实战指南
                    </h5>
                    <p className="text-xs text-text-secondary">1个月前</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-bg-primary border-t border-border-primary py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-sm"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary">织知</h3>
              </div>
              <p className="text-text-secondary mb-4">
                记录思考，分享见解，构建个人知识体系
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-text-secondary hover:text-primary">
                  <i className="fab fa-medium"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">导航</h4>
              <ul className="space-y-2">
                <li><Link to="/home" className="text-text-secondary hover:text-primary">首页</Link></li>
                <li><Link to="/article-list" className="text-text-secondary hover:text-primary">文章</Link></li>
                <li><Link to="/tag-cloud" className="text-text-secondary hover:text-primary">标签</Link></li>
                <li><Link to="/knowledge-graph" className="text-text-secondary hover:text-primary">知识图谱</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">联系我</h4>
              <ul className="space-y-2">
                <li className="text-text-secondary flex items-center space-x-2">
                  <i className="fas fa-envelope"></i>
                  <span>zhangsan@example.com</span>
                </li>
                <li className="text-text-secondary flex items-center space-x-2">
                  <i className="fas fa-phone"></i>
                  <span>+86 123 4567 8901</span>
                </li>
                <li className="text-text-secondary flex items-center space-x-2">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>北京市朝阳区</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border-primary mt-8 pt-8 text-center text-text-secondary text-sm">
            <p>© 2026 织知. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHomePage;