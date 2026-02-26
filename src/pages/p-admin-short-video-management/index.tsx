import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

interface ShortVideo {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  authorAvatar: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  shares: number;
  downloads: number;
  likes: number;
  comments: number;
  isVerified: boolean;
  duration: string;
  createdAt: string;
}

const ShortVideoManagement: React.FC = () => {
  const [shortVideos, setShortVideos] = useState<ShortVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState<ShortVideo | null>(null);

  useEffect(() => {
    loadShortVideos();
  }, []);

  const loadShortVideos = () => {
    const mockShortVideos: ShortVideo[] = [
      {
        id: '1',
        title: '科技前沿：AI技术革命',
        thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600',
        author: '謩子',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '前端开发',
        status: 'published',
        views: 5678,
        shares: 234,
        downloads: 89,
        likes: 456,
        comments: 67,
        isVerified: true,
        duration: '2:30',
        createdAt: '2024-02-26'
      },
      {
        id: '2',
        title: '城市生活：绿色出行',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
        author: '李四',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '产品设计',
        status: 'published',
        views: 4321,
        shares: 189,
        downloads: 67,
        likes: 345,
        comments: 45,
        isVerified: true,
        duration: '3:15',
        createdAt: '2024-02-25'
      },
      {
        id: '3',
        title: '自然风光：美丽中国',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
        author: '王五',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '人工智能',
        status: 'published',
        views: 7890,
        shares: 345,
        downloads: 123,
        likes: 678,
        comments: 89,
        isVerified: false,
        duration: '4:20',
        createdAt: '2024-02-24'
      },
      {
        id: '4',
        title: '职场技能：高效工作',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
        author: '赵六',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '云计算',
        status: 'draft',
        views: 0,
        shares: 0,
        downloads: 0,
        likes: 0,
        comments: 0,
        isVerified: false,
        duration: '5:45',
        createdAt: '2024-02-23'
      },
      {
        id: '5',
        title: '美食探店：特色小吃',
        thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600',
        author: '钱七',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '区块链',
        status: 'published',
        views: 6543,
        shares: 267,
        downloads: 98,
        likes: 534,
        comments: 72,
        isVerified: true,
        duration: '3:50',
        createdAt: '2024-02-22'
      }
    ];
    setShortVideos(mockShortVideos);
  };

  const filteredVideos = shortVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || video.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(shortVideos.map(v => v.category)));

  const getStatusBadge = (status: string) => {
    const badges = {
      published: 'bg-success bg-opacity-10 text-success',
      draft: 'bg-warning bg-opacity-10 text-warning',
      archived: 'bg-gray-100 text-gray-600'
    };
    const labels = {
      published: '已发布',
      draft: '草稿',
      archived: '已归档'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleDelete = (video: ShortVideo) => {
    setDeletingVideo(video);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingVideo) {
      setShortVideos(shortVideos.filter(v => v.id !== deletingVideo.id));
      setShowDeleteModal(false);
      setDeletingVideo(null);
    }
  };

  return (
    <AdminLayout title="短视频管理" breadcrumb="短视频管理">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">短视频管理</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>短视频管理</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/create-short-video"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>新建短视频
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-bg-primary rounded-xl shadow-card mb-6">
        <div className="p-4 border-b border-border-primary">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <input
                  type="text"
                  placeholder="搜索短视频标题或作者..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="archived">已归档</option>
              </select>
              <div className="flex border border-border-primary rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-50'}`}
                >
                  <i className="fas fa-list"></i>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-50'}`}
                >
                  <i className="fas fa-th-large"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border-primary">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">短视频</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">作者</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">分类</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">状态</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">时长</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">阅读</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">转发</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">下载</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">点赞</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">评论</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">发布时间</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="border-b border-border-primary hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={video.thumbnail} alt={video.title} className="w-16 h-10 object-cover rounded" />
                        <div className="max-w-xs">
                          <p className="text-text-primary font-medium truncate">{video.title}</p>
                          <p className="text-xs text-text-secondary">{video.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <img src={video.authorAvatar} alt={video.author} className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-text-primary">{video.author}</span>
                        {video.isVerified && (
                          <i className="fas fa-check-circle text-primary text-xs"></i>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.category}</td>
                    <td className="py-3 px-4">{getStatusBadge(video.status)}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.duration}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.views}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.shares}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.downloads}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.likes}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.comments}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{video.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/short-video-detail?id=${video.id}`}
                          className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                          title="查看"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(video)}
                          className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => (
                <div key={video.id} className="border border-border-primary rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <img src={video.authorAvatar} alt={video.author} className="w-6 h-6 rounded-full" />
                        <div>
                          <p className="text-xs font-medium text-text-primary">{video.author}</p>
                          {video.isVerified && (
                            <i className="fas fa-check-circle text-primary text-xs"></i>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(video.status)}
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2 truncate">{video.title}</h4>
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                      <span>{video.category}</span>
                      <span>{video.createdAt}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                      <div className="flex space-x-3">
                        <span><i className="fas fa-eye mr-1"></i>{video.views}</span>
                        <span><i className="fas fa-share mr-1"></i>{video.shares}</span>
                        <span><i className="fas fa-download mr-1"></i>{video.downloads}</span>
                        <span><i className="fas fa-heart mr-1"></i>{video.likes}</span>
                        <span><i className="fas fa-comment mr-1"></i>{video.comments}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/short-video-detail?id=${video.id}`}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-center text-xs hover:bg-blue-600 transition-colors"
                      >
                        查看
                      </Link>
                      <button
                        onClick={() => handleDelete(video)}
                        className="px-3 py-2 bg-danger text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border-primary flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            共 {filteredVideos.length} 个短视频
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && deletingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-xl shadow-card max-w-md w-full mx-4">
            <div className="p-6 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">确认删除</h3>
            </div>
            <div className="p-6">
              <p className="text-text-secondary mb-4">
                确定要删除短视频「{deletingVideo.title}」吗？此操作不可撤销。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingVideo(null);
                  }}
                  className="px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ShortVideoManagement;