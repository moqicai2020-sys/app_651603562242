import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

interface ShortNote {
  id: string;
  title: string;
  content: string;
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
  createdAt: string;
}

const ShortNoteManagement: React.FC = () => {
  const [shortNotes, setShortNotes] = useState<ShortNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingNote, setDeletingNote] = useState<ShortNote | null>(null);

  useEffect(() => {
    loadShortNotes();
  }, []);

  const loadShortNotes = () => {
    const mockShortNotes: ShortNote[] = [
      {
        id: 'note1',
        title: 'React Hooks 最佳实践',
        content: 'React Hooks 自推出以来，极大地改变了 React 组件的编写方式。本文将深入探讨 React Hooks 的工作原理...',
        author: '謩子',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '前端开发',
        status: 'published',
        views: 1234,
        shares: 56,
        downloads: 23,
        likes: 89,
        comments: 12,
        isVerified: true,
        createdAt: '2024-02-26'
      },
      {
        id: 'note2',
        title: '用户体验设计原则',
        content: '用户体验设计是产品成功的关键因素之一。本文将探讨如何在产品设计过程中融入用户体验思维...',
        author: '李四',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '产品设计',
        status: 'published',
        views: 987,
        shares: 34,
        downloads: 15,
        likes: 67,
        comments: 8,
        isVerified: true,
        createdAt: '2024-02-25'
      },
      {
        id: 'note3',
        title: '机器学习入门指南',
        content: '机器学习是人工智能的核心技术之一。本文将介绍机器学习的基本概念和常用算法...',
        author: '王五',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '人工智能',
        status: 'published',
        views: 2345,
        shares: 89,
        downloads: 45,
        likes: 156,
        comments: 23,
        isVerified: false,
        createdAt: '2024-02-24'
      },
      {
        id: 'note4',
        title: '云计算架构设计',
        content: '云计算架构设计需要考虑多个方面，包括可扩展性、可靠性、安全性等...',
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
        createdAt: '2024-02-23'
      },
      {
        id: 'note5',
        title: '区块链技术应用',
        content: '区块链技术在金融、供应链、医疗等领域都有广泛的应用前景...',
        author: '钱七',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        category: '区块链',
        status: 'published',
        views: 1567,
        shares: 67,
        downloads: 32,
        likes: 123,
        comments: 18,
        isVerified: true,
        createdAt: '2024-02-22'
      }
    ];
    setShortNotes(mockShortNotes);
  };

  const filteredNotes = shortNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || note.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(shortNotes.map(n => n.category)));

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

  const handleDelete = (note: ShortNote) => {
    setDeletingNote(note);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingNote) {
      setShortNotes(shortNotes.filter(n => n.id !== deletingNote.id));
      setShowDeleteModal(false);
      setDeletingNote(null);
    }
  };

  return (
    <AdminLayout title="短记管理" breadcrumb="短记管理">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">短记管理</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>短记管理</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/create-short-note"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>新建短记
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
                  placeholder="搜索短记标题、内容或作者..."
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
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">短记</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">作者</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">分类</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">状态</th>
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
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="border-b border-border-primary hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="max-w-xs">
                        <p className="text-text-primary font-medium truncate">{note.title}</p>
                        <p className="text-sm text-text-secondary truncate">{note.content}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <img src={note.authorAvatar} alt={note.author} className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-text-primary">{note.author}</span>
                        {note.isVerified && (
                          <i className="fas fa-check-circle text-primary text-xs"></i>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{note.category}</td>
                    <td className="py-3 px-4">{getStatusBadge(note.status)}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{note.views}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{note.shares}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{note.downloads}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{note.likes}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{note.comments}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{note.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/short-note-detail?id=${note.id}`}
                          className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                          title="查看"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(note)}
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
              {filteredNotes.map((note) => (
                <div key={note.id} className="border border-border-primary rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <img src={note.authorAvatar} alt={note.author} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{note.author}</p>
                        {note.isVerified && (
                          <i className="fas fa-check-circle text-primary text-xs"></i>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(note.status)}
                  </div>
                  <h4 className="text-base font-semibold text-text-primary mb-2 truncate">{note.title}</h4>
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">{note.content}</p>
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                    <span>{note.category}</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                    <div className="flex space-x-3">
                      <span><i className="fas fa-eye mr-1"></i>{note.views}</span>
                      <span><i className="fas fa-share mr-1"></i>{note.shares}</span>
                      <span><i className="fas fa-download mr-1"></i>{note.downloads}</span>
                      <span><i className="fas fa-heart mr-1"></i>{note.likes}</span>
                      <span><i className="fas fa-comment mr-1"></i>{note.comments}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/short-note-detail?id=${note.id}`}
                      className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-center text-sm hover:bg-blue-600 transition-colors"
                    >
                      查看
                    </Link>
                    <button
                      onClick={() => handleDelete(note)}
                      className="px-3 py-2 bg-danger text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border-primary flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            共 {filteredNotes.length} 条短记
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

      {showDeleteModal && deletingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-xl shadow-card max-w-md w-full mx-4">
            <div className="p-6 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">确认删除</h3>
            </div>
            <div className="p-6">
              <p className="text-text-secondary mb-4">
                确定要删除短记「{deletingNote.title}」吗？此操作不可撤销。
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingNote(null);
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

export default ShortNoteManagement;