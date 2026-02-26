

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

interface GraphNode {
  id: string;
  title: string;
  preview: string;
  tags: string[];
  size: number;
  color: string;
  x: number;
  y: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface GraphState {
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

const KnowledgeGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [graphState, setGraphState] = useState<GraphState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startTransform, setStartTransform] = useState({ translateX: 0, translateY: 0 });

  // 模拟知识图谱数据
  const graphData: GraphData = {
    nodes: [
      {
        id: 'article1',
        title: '产品设计中的用户体验思考',
        preview: '在现代产品设计中，用户体验已经成为产品成功的关键因素...',
        tags: ['产品设计', '用户体验'],
        size: 25,
        color: '#2563eb',
        x: 200,
        y: 300
      },
      {
        id: 'article2',
        title: '前端开发技术栈总结',
        preview: '随着Web技术的快速发展，前端开发技术栈也在不断更新...',
        tags: ['前端开发', '技术栈'],
        size: 20,
        color: '#7c3aed',
        x: 400,
        y: 200
      },
      {
        id: 'article3',
        title: '学习笔记：React Hooks 深入理解',
        preview: 'React Hooks 是 React 16.8 引入的新特性，它允许我们在函数组件中使用状态和其他 React 特性...',
        tags: ['React', '学习笔记'],
        size: 18,
        color: '#059669',
        x: 600,
        y: 350
      },
      {
        id: 'article4',
        title: '项目管理心得分享',
        preview: '在多年的项目管理实践中，我总结了一些实用的经验和技巧...',
        tags: ['项目管理', '心得'],
        size: 16,
        color: '#f59e0b',
        x: 300,
        y: 450
      },
      {
        id: 'article5',
        title: '数据库设计最佳实践',
        preview: '良好的数据库设计是系统性能和可维护性的基础...',
        tags: ['数据库', '设计'],
        size: 14,
        color: '#dc2626',
        x: 500,
        y: 150
      },
      {
        id: 'article6',
        title: 'API接口设计规范',
        preview: 'RESTful API 设计规范是现代Web应用开发的重要标准...',
        tags: ['API', '规范'],
        size: 12,
        color: '#0891b2',
        x: 700,
        y: 250
      },
      {
        id: 'article7',
        title: '微服务架构学习笔记',
        preview: '微服务架构是一种将应用程序构建为一系列小型服务的架构风格...',
        tags: ['微服务', '架构'],
        size: 15,
        color: '#7c2d12',
        x: 450,
        y: 400
      },
      {
        id: 'article8',
        title: 'Docker容器化技术详解',
        preview: 'Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中...',
        tags: ['Docker', '容器化'],
        size: 13,
        color: '#a16207',
        x: 650,
        y: 450
      }
    ],
    links: [
      { source: 'article1', target: 'article2' },
      { source: 'article1', target: 'article4' },
      { source: 'article2', target: 'article3' },
      { source: 'article2', target: 'article6' },
      { source: 'article3', target: 'article6' },
      { source: 'article4', target: 'article7' },
      { source: 'article5', target: 'article6' },
      { source: 'article5', target: 'article7' },
      { source: 'article7', target: 'article8' },
      { source: 'article6', target: 'article8' }
    ]
  };

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 知识图谱';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化图谱
  useEffect(() => {
    renderGraph();
    setupEventListeners();
  }, [graphState]);

  // 渲染图谱
  const renderGraph = () => {
    const container = graphContainerRef.current;
    if (!container) return;

    // 清空现有内容
    container.innerHTML = '';

    // 渲染链接
    graphData.links.forEach(link => {
      const sourceNode = graphData.nodes.find(node => node.id === link.source);
      const targetNode = graphData.nodes.find(node => node.id === link.target);
      
      if (sourceNode && targetNode) {
        renderLink(sourceNode, targetNode, container);
      }
    });

    // 渲染节点
    graphData.nodes.forEach(node => {
      renderNode(node, container);
    });
  };

  // 渲染链接
  const renderLink = (source: GraphNode, target: GraphNode, container: HTMLDivElement) => {
    const link = document.createElement('div');
    link.className = styles.graphLink;
    
    const x1 = source.x * graphState.scale + graphState.translateX;
    const y1 = source.y * graphState.scale + graphState.translateY;
    const x2 = target.x * graphState.scale + graphState.translateX;
    const y2 = target.y * graphState.scale + graphState.translateY;
    
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    link.style.left = x1 + 'px';
    link.style.top = y1 + 'px';
    link.style.width = length + 'px';
    link.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(link);
  };

  // 渲染节点
  const renderNode = (node: GraphNode, container: HTMLDivElement) => {
    const nodeElement = document.createElement('div');
    nodeElement.className = styles.graphNode;
    nodeElement.id = `node-${node.id}`;
    nodeElement.style.width = node.size * graphState.scale + 'px';
    nodeElement.style.height = node.size * graphState.scale + 'px';
    nodeElement.style.left = (node.x - node.size / 2) * graphState.scale + graphState.translateX + 'px';
    nodeElement.style.top = (node.y - node.size / 2) * graphState.scale + graphState.translateY + 'px';
    nodeElement.style.backgroundColor = node.color;
    nodeElement.style.opacity = '0.8';
    
    // 添加节点标签
    const label = document.createElement('div');
    label.className = styles.nodeLabel;
    label.textContent = node.title;
    label.style.left = (node.size / 2 + 5) + 'px';
    label.style.top = (-15) + 'px';
    nodeElement.appendChild(label);
    
    // 添加节点数据
    nodeElement.dataset.nodeId = node.id;
    
    container.appendChild(nodeElement);
  };

  // 设置事件监听器
  const setupEventListeners = () => {
    const container = graphContainerRef.current;
    if (!container) return;

    // 节点点击事件
    const handleNodeClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // 检查是否点击了导航栏或其内部元素
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.contains(target)) {
        return; // 不处理导航栏的点击事件
      }
      
      let nodeElement: HTMLElement | null = null;
      
      if (target.classList.contains(styles.graphNode)) {
        nodeElement = target;
      } else {
        nodeElement = target.closest(`.${styles.graphNode}`);
      }
      
      if (nodeElement) {
        const nodeId = nodeElement.dataset.nodeId;
        const node = graphData.nodes.find(n => n.id === nodeId);
        
        if (node) {
          e.stopPropagation();
          e.preventDefault();
          navigate(`/article-detail?articleId=${nodeId}`);
        }
      }
    };

    // 节点悬停事件
    const handleNodeMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      let nodeElement: HTMLElement | null = null;
      
      if (target.classList.contains(styles.graphNode)) {
        nodeElement = target;
      } else {
        nodeElement = target.closest(`.${styles.graphNode}`);
      }
      
      if (nodeElement) {
        const nodeId = nodeElement.dataset.nodeId;
        const node = graphData.nodes.find(n => n.id === nodeId);
        
        if (node && e instanceof MouseEvent) {
          showNodeTooltip(node, e);
        }
      }
    };

    const handleNodeMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      let nodeElement: HTMLElement | null = null;
      
      if (target.classList.contains(styles.graphNode)) {
        nodeElement = target;
      } else {
        nodeElement = target.closest(`.${styles.graphNode}`);
      }
      
      if (nodeElement) {
        hideNodeTooltip();
      }
    };

    // 拖拽功能
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // 检查是否点击了导航栏或其内部元素
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.contains(target)) {
        return; // 不处理导航栏的鼠标按下事件
      }
      
      if (target === container || target.classList.contains(styles.graphLink) || target.classList.contains(styles.graphNode)) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setStartTransform({ translateX: graphState.translateX, translateY: graphState.translateY });
        container.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        setGraphState(prev => ({
          ...prev,
          translateX: startTransform.translateX + deltaX,
          translateY: startTransform.translateY + deltaY
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (container) {
        container.style.cursor = 'grab';
      }
    };

    // 滚轮缩放
    const handleWheel = (e: WheelEvent) => {
      // 检查是否在导航栏上滚动
      const sidebar = document.getElementById('sidebar');
      const target = e.target as HTMLElement;
      if (sidebar && sidebar.contains(target)) {
        return; // 不处理导航栏的滚轮事件
      }
      
      // 确保只在图谱容器上处理滚轮事件
      if (target === container || container.contains(target)) {
        e.preventDefault();
        
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const newScale = Math.max(0.5, Math.min(3, graphState.scale * zoomFactor));
        
        // 计算缩放中心
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 调整平移以保持缩放中心
        const scaleRatio = newScale / graphState.scale;
        setGraphState(prev => ({
          ...prev,
          translateX: mouseX - (mouseX - prev.translateX) * scaleRatio,
          translateY: mouseY - (mouseY - prev.translateY) * scaleRatio,
          scale: newScale
        }));
      }
    };

    // 添加事件监听器
    container.addEventListener('click', handleNodeClick);
    container.addEventListener('mouseenter', handleNodeMouseEnter);
    container.addEventListener('mouseleave', handleNodeMouseLeave);
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel);

    // 清理函数
    return () => {
      container.removeEventListener('click', handleNodeClick);
      container.removeEventListener('mouseenter', handleNodeMouseEnter);
      container.removeEventListener('mouseleave', handleNodeMouseLeave);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
    };
  };

  // 显示节点提示框
  const showNodeTooltip = (node: GraphNode, event: MouseEvent) => {
    const tooltip = tooltipRef.current;
    const container = graphContainerRef.current;
    
    if (!tooltip || !container) return;

    const titleElement = tooltip.querySelector('#tooltip-title');
    const previewElement = tooltip.querySelector('#tooltip-preview');
    const tagsContainer = tooltip.querySelector('#tooltip-tags');
    
    if (titleElement) titleElement.textContent = node.title;
    if (previewElement) previewElement.textContent = node.preview;
    
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      node.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = styles.tag;
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    }
    
    tooltip.style.display = 'block';
    
    // 计算提示框位置
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left + 10;
    const y = event.clientY - rect.top - 10;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    
    // 确保提示框不超出容器
    const tooltipRect = tooltip.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    if (tooltipRect.right > containerRect.right) {
      tooltip.style.left = (x - tooltipRect.width - 20) + 'px';
    }
    
    if (tooltipRect.bottom > containerRect.bottom) {
      tooltip.style.top = (y - tooltipRect.height - 20) + 'px';
    }
  };

  // 隐藏节点提示框
  const hideNodeTooltip = () => {
    const tooltip = tooltipRef.current;
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  };

  // 控制按钮事件
  const handleZoomIn = () => {
    setGraphState(prev => ({
      ...prev,
      scale: Math.min(3, prev.scale * 1.2)
    }));
  };

  const handleZoomOut = () => {
    setGraphState(prev => ({
      ...prev,
      scale: Math.max(0.5, prev.scale / 1.2)
    }));
  };

  const handleResetView = () => {
    setGraphState({
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      dragStart: { x: 0, y: 0 }
    });
  };

  const handleFullscreen = () => {
    const container = document.querySelector(`.${styles.graphContainer}`);
    if (container && 'requestFullscreen' in container) {
      container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    }
  };

  // 侧边栏折叠功能
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 搜索功能
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('#sidebar') as HTMLElement;
      if (sidebar && window.innerWidth < 1024) {
        sidebar.style.transform = sidebarCollapsed ? 'translateX(0)' : 'translateX(-100%)';
      } else if (sidebar) {
        sidebar.style.transform = 'translateX(0)';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarCollapsed]);

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
      <header id="top-navbar" className="fixed top-0 left-0 right-0 bg-bg-primary border-b border-border-primary h-16 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* 左侧：Logo和菜单切换 */}
          <div id="navbar-left" className="flex items-center space-x-4">
            <button 
              id="sidebar-toggle" 
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              onClick={handleSidebarToggle}
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div id="logo-section" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-text-primary hidden sm:block">织知</h1>
            </div>
          </div>
          
          {/* 中间：搜索框 */}
          <div id="navbar-center" className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input 
                type="text" 
                id="global-search" 
                placeholder="搜索文章..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-secondary rounded-lg bg-white ${styles.searchFocus}`}
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧：通知和用户 */}
          <div id="navbar-right" className="flex items-center space-x-3">
            <button 
              id="notification-btn"
              onClick={handleNotificationClick}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
              title="系统公告"
            >
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            {user ? (
              <div className="relative">
                <button 
                  onClick={handleUserMenuToggle}
                  id="user-menu" 
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                >
                  <img 
                    src="https://s.coze.cn/t/0hKLtWVX9Ys/" 
                    alt="用户头像" 
                    className="w-8 h-8 rounded-full"
                    data-category="人物"
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
      <aside 
        id="sidebar" 
        className={`fixed left-0 top-16 bottom-0 bg-bg-primary border-r border-border-primary transition-all duration-300 z-40 ${
          sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
        }`}
      >
        <nav id="sidebar-nav" className="p-4 space-y-2">
          <Link 
            to="/home" 
            id="nav-home" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-home w-5"></i>
            <span className="sidebar-text">首页</span>
          </Link>
          <Link 
            to="/article-list" 
            id="nav-articles" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-file-alt w-5"></i>
            <span className="sidebar-text">文章列表</span>
          </Link>
          <Link 
            to="/photo-blog" 
            id="nav-photos" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-image w-5"></i>
            <span className="sidebar-text">图片</span>
          </Link>
          <Link 
            to="/short-notes" 
            id="nav-notes" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-sticky-note w-5"></i>
            <span className="sidebar-text">短记</span>
          </Link>
          <Link 
            to="/short-videos" 
            id="nav-videos" 
            className={`${styles.navItem} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary`}
          >
            <i className="fas fa-video w-5"></i>
            <span className="sidebar-text">短视频</span>
          </Link>
          <Link 
            to="/knowledge-graph" 
            id="nav-graph" 
            className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-project-diagram w-5"></i>
            <span className="sidebar-text">知识图谱</span>
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main 
        id="main-content" 
        className={`pt-16 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
        }`}
      >
        <div className="p-6">
          {/* 页面头部 */}
          <div id="page-header" className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">知识图谱</h2>
                <nav id="breadcrumb" className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <span>知识图谱</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 图谱展示区 */}
          <section id="graph-section" className="mb-8">
            <div className={`${styles.graphContainer} h-[600px] relative`}>
              {/* 知识图谱节点和链接将通过JavaScript动态生成 */}
              <div 
                id="knowledge-graph" 
                className="w-full h-full relative"
                ref={graphContainerRef}
              >
                {/* 图谱背景装饰 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary rounded-full"></div>
                  <div className="absolute top-1/2 right-1/4 w-24 h-24 border border-secondary rounded-full"></div>
                  <div className="absolute bottom-1/4 left-1/2 w-28 h-28 border border-tertiary rounded-full"></div>
                </div>
              </div>
              
              {/* 图谱控制区 */}
              <div className={styles.graphControls}>
                <div className="flex flex-col space-y-2">
                  <button 
                    id="zoom-in-btn" 
                    className={styles.controlBtn} 
                    title="放大"
                    onClick={handleZoomIn}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button 
                    id="zoom-out-btn" 
                    className={styles.controlBtn} 
                    title="缩小"
                    onClick={handleZoomOut}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <button 
                    id="reset-view-btn" 
                    className={styles.controlBtn} 
                    title="重置视图"
                    onClick={handleResetView}
                  >
                    <i className="fas fa-home"></i>
                  </button>
                  <button 
                    id="fullscreen-btn" 
                    className={styles.controlBtn} 
                    title="全屏"
                    onClick={handleFullscreen}
                  >
                    <i className="fas fa-expand"></i>
                  </button>
                </div>
              </div>
              
              {/* 节点提示框 */}
              <div 
                id="node-tooltip" 
                className={styles.nodeTooltip}
                ref={tooltipRef}
              >
                <h4 id="tooltip-title"></h4>
                <p id="tooltip-preview"></p>
                <div id="tooltip-tags" className={styles.tags}></div>
              </div>
            </div>
          </section>

          {/* 图谱说明区 */}
          <section id="graph-info" className="mb-8">
            <div className="bg-bg-primary rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">图谱说明</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-circle text-primary text-xl"></i>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">节点</h4>
                  <p className="text-sm text-text-secondary">代表一篇文章，节点大小反映文章的重要性</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-link text-secondary text-xl"></i>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">连线</h4>
                  <p className="text-sm text-text-secondary">表示双向链接，连接相关的文章内容</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-mouse-pointer text-tertiary text-xl"></i>
                  </div>
                  <h4 className="font-medium text-text-primary mb-1">交互</h4>
                  <p className="text-sm text-text-secondary">点击节点跳转文章，拖拽移动，滚轮缩放</p>
                </div>
              </div>
            </div>
          </section>

          {/* 热点文章和标签云 */}
          <section id="hot-content" className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 热点文章列表 */}
              <div className="bg-bg-primary rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
                  <i className="fas fa-fire text-danger"></i>
                  <span>热点文章</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { id: 'article1', title: '产品设计中的用户体验思考', views: 156, author: '謩子' },
                    { id: 'article2', title: '前端开发技术栈总结', views: 234, author: '李四' },
                    { id: 'article3', title: '学习笔记：React Hooks 深入理解', views: 189, author: '王五' },
                    { id: 'article4', title: '项目管理心得分享', views: 145, author: '赵六' },
                    { id: 'article5', title: '数据库设计最佳实践', views: 128, author: '钱七' }
                  ].map((article, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border border-border-primary rounded-lg hover:border-primary hover:bg-gray-50 transition-all cursor-pointer"
                      onClick={() => navigate(`/article-detail?articleId=${article.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-danger text-white' :
                            index === 1 ? 'bg-warning text-white' :
                            index === 2 ? 'bg-success text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <p className="text-text-primary font-medium truncate">{article.title}</p>
                        </div>
                        <p className="text-sm text-text-secondary mt-1 ml-8">作者：{article.author}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-primary">{article.views}</p>
                        <p className="text-xs text-text-secondary">阅读量</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 标签云 */}
              <div className="bg-bg-primary rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
                  <i className="fas fa-cloud text-primary"></i>
                  <span>热门标签</span>
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { name: '产品设计', count: 45, size: 'text-2xl' },
                    { name: '用户体验', count: 38, size: 'text-xl' },
                    { name: '前端开发', count: 52, size: 'text-3xl' },
                    { name: 'React', count: 41, size: 'text-xl' },
                    { name: '技术栈', count: 35, size: 'text-lg' },
                    { name: '学习笔记', count: 28, size: 'text-base' },
                    { name: '项目管理', count: 32, size: 'text-lg' },
                    { name: '数据库', count: 25, size: 'text-base' },
                    { name: 'API', count: 22, size: 'text-sm' },
                    { name: '微服务', count: 18, size: 'text-sm' },
                    { name: 'Docker', count: 20, size: 'text-sm' },
                    { name: '架构', count: 30, size: 'text-lg' }
                  ].map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(`/article-list?tag=${encodeURIComponent(tag.name)}`)}
                      className={`${tag.size} font-medium text-primary hover:text-blue-600 hover:underline transition-colors`}
                      title={`${tag.count} 篇文章`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 热闹云词 */}
          <section id="active-tags" className="mb-8">
            <div className="bg-bg-primary rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <i className="fas fa-bolt text-warning"></i>
                <span>热闹云词</span>
                <span className="text-sm font-normal text-text-secondary ml-2">最近活跃的标签</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'AI', trend: 'up', change: '+15%', color: 'bg-green-100 text-green-700' },
                  { name: 'React', trend: 'up', change: '+12%', color: 'bg-blue-100 text-blue-700' },
                  { name: 'Vue', trend: 'up', change: '+10%', color: 'bg-purple-100 text-purple-700' },
                  { name: 'TypeScript', trend: 'up', change: '+8%', color: 'bg-indigo-100 text-indigo-700' },
                  { name: 'Node.js', trend: 'stable', change: '0%', color: 'bg-gray-100 text-gray-700' },
                  { name: 'Python', trend: 'up', change: '+5%', color: 'bg-yellow-100 text-yellow-700' },
                  { name: 'Docker', trend: 'down', change: '-3%', color: 'bg-red-100 text-red-700' },
                  { name: 'Kubernetes', trend: 'up', change: '+7%', color: 'bg-cyan-100 text-cyan-700' },
                  { name: 'GraphQL', trend: 'up', change: '+9%', color: 'bg-pink-100 text-pink-700' },
                  { name: 'Next.js', trend: 'up', change: '+11%', color: 'bg-orange-100 text-orange-700' },
                  { name: 'Tailwind', trend: 'up', change: '+13%', color: 'bg-teal-100 text-teal-700' },
                  { name: 'Rust', trend: 'up', change: '+6%', color: 'bg-amber-100 text-amber-700' }
                ].map((tag, index) => (
                  <div 
                    key={index}
                    className={`${tag.color} rounded-lg p-3 text-center hover:opacity-80 transition-opacity cursor-pointer`}
                    onClick={() => navigate(`/article-list?tag=${encodeURIComponent(tag.name)}`)}
                  >
                    <p className="font-medium mb-1">{tag.name}</p>
                    <div className="flex items-center justify-center space-x-1 text-xs">
                      {tag.trend === 'up' && <i className="fas fa-arrow-up"></i>}
                      {tag.trend === 'down' && <i className="fas fa-arrow-down"></i>}
                      {tag.trend === 'stable' && <i className="fas fa-minus"></i>}
                      <span>{tag.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 标签云 */}
          <section id="tag-cloud" className="mb-8">
            <div className="bg-bg-primary rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <i className="fas fa-tags text-secondary"></i>
                <span>标签云</span>
                <span className="text-sm font-normal text-text-secondary ml-2">所有标签的可视化展示</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'tag1', name: '产品设计', count: 28 },
                  { id: 'tag2', name: '前端开发', count: 22 },
                  { id: 'tag3', name: '用户体验', count: 18 },
                  { id: 'tag4', name: 'React', count: 15 },
                  { id: 'tag5', name: '学习笔记', count: 14 },
                  { id: 'tag6', name: '技术栈', count: 12 },
                  { id: 'tag7', name: '项目管理', count: 10 },
                  { id: 'tag8', name: '心得', count: 8 },
                  { id: 'tag9', name: 'JavaScript', count: 7 },
                  { id: 'tag10', name: 'Vue.js', count: 6 },
                  { id: 'tag11', name: 'Node.js', count: 5 },
                  { id: 'tag12', name: '数据库', count: 4 },
                  { id: 'tag13', name: 'API设计', count: 3 },
                  { id: 'tag14', name: '性能优化', count: 3 },
                  { id: 'tag15', name: '测试', count: 2 }
                ].map((tag, index) => {
                  const maxCount = 28;
                  const minCount = 2;
                  const sizeRatio = (tag.count - minCount) / (maxCount - minCount);
                  const fontSize = Math.floor(sizeRatio * 8) + 12;
                  const colors = ['text-blue-500', 'text-purple-500', 'text-green-500', 'text-yellow-500', 'text-red-500', 'text-indigo-500', 'text-pink-500', 'text-teal-500', 'text-orange-500', 'text-cyan-500'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <Link
                      key={tag.id}
                      to={`/article-list?tag=${encodeURIComponent(tag.name)}`}
                      className={`inline-block px-3 py-1 rounded-full hover:bg-gray-100 transition-colors ${colorClass}`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {tag.name} ({tag.count})
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeGraphPage;

