

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  tags: string[];
  relevance: number;
}

type SortType = 'relevance' | 'created' | 'updated';

const SearchResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [currentResults, setCurrentResults] = useState<SearchResult[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [sortType, setSortType] = useState<SortType>('relevance');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 模拟搜索结果数据
  const mockSearchResults: SearchResult[] = [
    {
      id: 'article1',
      title: '产品设计中的用户体验思考',
      summary: '在现代产品开发中，<span class="highlight">产品设计</span>不仅仅是外观的美观，更重要的是用户体验的优化。本文探讨了如何在<span class="highlight">产品设计</span>过程中融入用户体验的核心要素...',
      createdAt: '2024-01-15 14:30',
      tags: ['产品设计', '用户体验'],
      relevance: 95
    },
    {
      id: 'article2',
      title: '前端开发中的产品设计思维',
      summary: '作为前端开发者，理解<span class="highlight">产品设计</span>思维对于构建更好的用户界面至关重要。本文分享了如何将<span class="highlight">产品设计</span>原则应用到前端开发中...',
      createdAt: '2024-01-14 09:15',
      tags: ['前端开发', '产品设计'],
      relevance: 88
    },
    {
      id: 'article3',
      title: '学习笔记：产品设计原则',
      summary: '通过系统学习<span class="highlight">产品设计</span>的基本原则，我总结了一套完整的设计方法论。包括用户研究、原型设计、可用性测试等关键环节...',
      createdAt: '2024-01-13 16:45',
      tags: ['学习笔记', '产品设计'],
      relevance: 82
    },
    {
      id: 'article4',
      title: '移动端产品设计实践',
      summary: '移动端<span class="highlight">产品设计</span>有其独特的挑战和机遇。本文结合实际项目经验，分享了移动端<span class="highlight">产品设计</span>的最佳实践和注意事项...',
      createdAt: '2024-01-12 11:20',
      tags: ['移动端', '产品设计'],
      relevance: 78
    },
    {
      id: 'article5',
      title: '产品设计团队协作模式',
      summary: '高效的<span class="highlight">产品设计</span>离不开团队的紧密协作。本文分析了不同规模团队的协作模式，以及如何优化<span class="highlight">产品设计</span>流程...',
      createdAt: '2024-01-11 13:50',
      tags: ['团队协作', '产品设计'],
      relevance: 75
    }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 搜索结果';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化搜索参数
  useEffect(() => {
    const keyword = searchParams.get('q') || '产品设计';
    setCurrentKeyword(keyword);
    setCurrentResults(mockSearchResults);
  }, [searchParams]);

  // 处理搜索
  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(`/search-result?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  // 处理搜索框回车
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e.currentTarget.value);
    }
  };

  // 处理筛选
  const handleFilterChange = () => {
    setCurrentPage(1);
    // 这里应该调用API重新获取筛选后的数据
    console.log('应用筛选:', { tagFilter, timeFilter });
  };

  // 处理排序
  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
    setCurrentPage(1);
    
    const sortedResults = [...currentResults];
    switch (newSortType) {
    case 'relevance':
      sortedResults.sort((a, b) => b.relevance - a.relevance);
      break;
    case 'created':
      sortedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'updated':
      sortedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    }
    setCurrentResults(sortedResults);
  };

  // 高亮文本
  const highlightText = (text: string, keyword: string): string => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    let date: Date;
    
    // 处理中文日期格式：2024年1月15日 14:30
    if (dateString.includes('年') && dateString.includes('月') && dateString.includes('日')) {
      const match = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{1,2})/);
      if (match) {
        const [, year, month, day, hour, minute] = match;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
      } else {
        date = new Date();
      }
    } else {
      date = new Date(dateString);
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}周前`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}个月前`;
    } else {
      return `${Math.floor(diffDays / 365)}年前`;
    }
  };

  // 处理分页
  const totalPages = Math.ceil(currentResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageResults = currentResults.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 处理文章操作
  const handleEditArticle = (articleId: string) => {
    navigate(`/article-edit?id=${articleId}`);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      console.log('删除文章:', articleId);
      alert('文章已删除');
    }
  };

  const handleViewArticle = (articleId: string) => {
    navigate(`/article-detail?id=${articleId}`);
  };

  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    navigate(`/article-list?tag=${encodeURIComponent(tagName)}`);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-bg-primary border-b border-border-primary h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyPress={handleSearchKeyPress}
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
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img 
                src="https://s.coze.cn/image/L6xw-5_xqIY/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-text-primary hidden sm:block">謩子</span>
              <i className="fas fa-chevron-down text-xs text-text-secondary hidden sm:block"></i>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-primary transition-all duration-300 z-40 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        <nav className="p-4 space-y-2">
          <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-home w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>首页</span>
          </Link>
          <Link to="/article-list" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium`}>
            <i className="fas fa-file-alt w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>文章列表</span>
          </Link>
          <Link to="/knowledge-graph" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-project-diagram w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>知识图谱</span>
          </Link>
          <Link to="/tag-cloud" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-tags w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>标签云</span>
          </Link>
          <Link to="/user-settings" className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}>
            <i className="fas fa-cog w-5"></i>
            <span className={isSidebarCollapsed ? 'hidden' : 'block'}>用户设置</span>
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
                <h2 className="text-2xl font-bold text-text-primary mb-1">搜索结果</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">{'>'}</span>
                  <span>搜索结果</span>
                </nav>
                <div className="mt-2">
                  <span className="text-sm text-text-secondary">搜索关键词：</span>
                  <span className="text-sm font-medium text-primary bg-primary bg-opacity-10 px-2 py-1 rounded">{currentKeyword}</span>
                  <span className="text-sm text-text-secondary ml-2">共找到 <span className="font-medium text-text-primary">{currentResults.length}</span> 条结果</span>
                </div>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <section className="mb-6">
            <div className="bg-bg-primary rounded-xl shadow-card p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* 筛选条件 */}
                <div className="flex flex-wrap items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-text-secondary">标签筛选：</label>
                    <select 
                      value={tagFilter}
                      onChange={(e) => {
                        setTagFilter(e.target.value);
                        handleFilterChange();
                      }}
                      className="border border-border-secondary rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">全部标签</option>
                      <option value="产品设计">产品设计</option>
                      <option value="用户体验">用户体验</option>
                      <option value="前端开发">前端开发</option>
                      <option value="学习笔记">学习笔记</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-text-secondary">时间范围：</label>
                    <select 
                      value={timeFilter}
                      onChange={(e) => {
                        setTimeFilter(e.target.value);
                        handleFilterChange();
                      }}
                      className="border border-border-secondary rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">全部时间</option>
                      <option value="today">今天</option>
                      <option value="week">本周</option>
                      <option value="month">本月</option>
                      <option value="quarter">本季度</option>
                    </select>
                  </div>
                </div>
                
                {/* 排序选项 */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-text-secondary">排序：</label>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleSortChange('relevance')}
                      className={`px-3 py-1 text-sm rounded-lg border border-border-secondary hover:bg-gray-50 ${sortType === 'relevance' ? styles.sortActive : ''}`}
                    >
                      相关度
                    </button>
                    <button 
                      onClick={() => handleSortChange('created')}
                      className={`px-3 py-1 text-sm rounded-lg border border-border-secondary hover:bg-gray-50 ${sortType === 'created' ? styles.sortActive : ''}`}
                    >
                      创建时间
                    </button>
                    <button 
                      onClick={() => handleSortChange('updated')}
                      className={`px-3 py-1 text-sm rounded-lg border border-border-secondary hover:bg-gray-50 ${sortType === 'updated' ? styles.sortActive : ''}`}
                    >
                      修改时间
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 搜索结果列表 */}
          <section className="mb-8">
            <div className="bg-bg-primary rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-border-primary">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">标题</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">摘要</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">创建时间</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">标签</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageResults.map(article => (
                      <tr key={article.id} className={`${styles.tableRow} border-b border-border-primary`}>
                        <td className="py-3 px-4">
                          <Link 
                            to={`/article-detail?id=${article.id}`} 
                            className="text-text-primary hover:text-primary font-medium"
                            dangerouslySetInnerHTML={{ __html: highlightText(article.title, currentKeyword) }}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-text-secondary line-clamp-2" dangerouslySetInnerHTML={{ __html: article.summary }}></div>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-secondary">
                          {formatDate(article.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map(tag => (
                              <span 
                                key={tag}
                                className={styles.tagItem}
                                onClick={() => handleTagClick(tag)}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEditArticle(article.id)}
                              className="text-text-secondary hover:text-primary text-sm" 
                              title="编辑"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-text-secondary hover:text-danger text-sm" 
                              title="删除"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <button 
                              onClick={() => handleViewArticle(article.id)}
                              className="text-text-secondary hover:text-primary text-sm" 
                              title="查看"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 分页区域 */}
          <section className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              显示第 <span>{currentResults.length > 0 ? startIndex + 1 : 0}</span> - <span>{Math.min(endIndex, currentResults.length)}</span> 条，共 <span>{currentResults.length}</span> 条结果
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-border-secondary rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left"></i> 上一页
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 text-sm rounded-lg border border-border-secondary ${
                      currentPage === index + 1 ? 'bg-primary text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-border-secondary rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页 <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SearchResultPage;

