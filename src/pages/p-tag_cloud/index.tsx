

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

interface TagData {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

const TagCloudPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count'>('name');

  // 模拟标签数据
  const tagsData: TagData[] = [
    { id: 'tag1', name: '产品设计', count: 28, createdAt: '2024-01-15' },
    { id: 'tag2', name: '前端开发', count: 22, createdAt: '2024-01-10' },
    { id: 'tag3', name: '用户体验', count: 18, createdAt: '2024-01-08' },
    { id: 'tag4', name: 'React', count: 15, createdAt: '2024-01-05' },
    { id: 'tag5', name: '学习笔记', count: 14, createdAt: '2024-01-03' },
    { id: 'tag6', name: '技术栈', count: 12, createdAt: '2023-12-28' },
    { id: 'tag7', name: '项目管理', count: 10, createdAt: '2023-12-25' },
    { id: 'tag8', name: '心得', count: 8, createdAt: '2023-12-20' },
    { id: 'tag9', name: 'JavaScript', count: 7, createdAt: '2023-12-18' },
    { id: 'tag10', name: 'Vue.js', count: 6, createdAt: '2023-12-15' },
    { id: 'tag11', name: 'Node.js', count: 5, createdAt: '2023-12-12' },
    { id: 'tag12', name: '数据库', count: 4, createdAt: '2023-12-10' },
    { id: 'tag13', name: 'API设计', count: 3, createdAt: '2023-12-08' },
    { id: 'tag14', name: '性能优化', count: 3, createdAt: '2023-12-05' },
    { id: 'tag15', name: '测试', count: 2, createdAt: '2023-12-03' }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 标签云';
    return () => { document.title = originalTitle; };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      // 响应式逻辑如果需要可以在这里添加
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 处理搜索
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = searchKeyword.trim();
      if (keyword) {
        navigate(`/search-result?q=${encodeURIComponent(keyword)}`);
      }
    }
  };

  // 生成标签云
  const renderTagCloud = () => {
    const maxCount = Math.max(...tagsData.map(tag => tag.count));
    const minCount = Math.min(...tagsData.map(tag => tag.count));

    return tagsData.map((tag, index) => {
      const sizeRatio = (tag.count - minCount) / (maxCount - minCount);
      const sizeClass = `tagSize${Math.floor(sizeRatio * 9) + 1}`;
      const colorClass = `tagColor${(index % 10) + 1}`;

      return (
        <Link
          key={tag.id}
          to={`/article-list?tagId=${tag.id}`}
          className={`${styles.tagCloudItem} ${styles[sizeClass]} ${styles[colorClass]}`}
        >
          {tag.name} ({tag.count})
        </Link>
      );
    });
  };

  // 生成标签列表
  const renderTagList = () => {
    const sortedTags = [...tagsData];
    if (sortBy === 'count') {
      sortedTags.sort((a, b) => b.count - a.count);
    } else {
      sortedTags.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sortedTags.map(tag => (
      <tr key={tag.id} className={styles.tableRow}>
        <td className="py-3 px-4">
          <Link to={`/article-list?tagId=${tag.id}`} className={styles.tagItem}>
            {tag.name}
          </Link>
        </td>
        <td className="py-3 px-4 text-sm text-text-secondary">{tag.count}</td>
        <td className="py-3 px-4 text-sm text-text-secondary">{formatDate(tag.createdAt)}</td>
        <td className="py-3 px-4">
          <Link 
            to={`/article-list?tagId=${tag.id}`}
            className="text-primary hover:text-blue-600 text-sm font-medium"
          >
            查看文章
          </Link>
        </td>
      </tr>
    ));
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="搜索文章..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-secondary rounded-lg bg-white ${styles.searchFocus}`}
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
                    src="https://s.coze.cn/image/5-JtJG_1R_I/" 
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
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>首页</span>
          </Link>
          <Link 
            to="/article-list" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-file-alt w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>文章列表</span>
          </Link>
          <Link 
            to="/knowledge-graph" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-project-diagram w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>知识图谱</span>
          </Link>
          <Link 
            to="/tag-cloud" 
            className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-tags w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>标签云</span>
          </Link>
          <Link 
            to="/user-settings" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-cog w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>用户设置</span>
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
                <h2 className="text-2xl font-bold text-text-primary mb-1">标签云</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>标签云</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 标签云展示区 */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">标签云</h3>
            <div className="bg-bg-primary rounded-xl shadow-card p-6">
              <div className="text-center">
                {renderTagCloud()}
              </div>
            </div>
          </section>

          {/* 标签列表 */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">所有标签</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-secondary">排序：</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'count')}
                  className="border border-border-secondary rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="name">按名称</option>
                  <option value="count">按数量</option>
                </select>
              </div>
            </div>
            <div className="bg-bg-primary rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-border-primary">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">标签名称</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">关联文章数</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">创建时间</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTagList()}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TagCloudPage;

