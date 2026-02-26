import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AdminLayout from '../../components/AdminLayout';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  targetType: 'article' | 'shortNote' | 'image';
  targetId: string;
  targetTitle: string;
  status: 'approved' | 'pending' | 'rejected' | 'spam';
  createdAt: string;
  likes: number;
  replies: number;
}

const CommentManagement: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = () => {
    const mockComments: Comment[] = [
      { id: '1', content: '这篇文章写得非常好，学到了很多！', author: '张三', authorId: '3', targetType: 'article', targetId: '1', targetTitle: '产品设计中的用户体验思考', status: 'approved', createdAt: '2024-02-26 10:30', likes: 12, replies: 2 },
      { id: '2', content: '请问有相关的代码示例吗？', author: '李四', authorId: '4', targetType: 'article', targetId: '2', targetTitle: '前端开发技术栈总结', status: 'pending', createdAt: '2024-02-26 09:45', likes: 3, replies: 0 },
      { id: '3', content: '这个观点很有启发，感谢分享！', author: '王五', authorId: '5', targetType: 'shortNote', targetId: 'note1', targetTitle: 'AI技术发展趋势', status: 'approved', createdAt: '2024-02-25 18:20', likes: 8, replies: 1 },
      { id: '4', content: '广告内容，已举报', author: '赵六', authorId: '6', targetType: 'article', targetId: '3', targetTitle: '人工智能在医疗领域的应用', status: 'spam', createdAt: '2024-02-25 14:15', likes: 0, replies: 0 },
      { id: '5', content: '图片拍得很美，构图很棒！', author: '钱七', authorId: '7', targetType: 'image', targetId: 'img1', targetTitle: '城市夜景', status: 'approved', createdAt: '2024-02-25 11:30', likes: 15, replies: 3 },
      { id: '6', content: '希望能看到更多这样的内容', author: '孙八', authorId: '8', targetType: 'article', targetId: '4', targetTitle: '云计算架构设计最佳实践', status: 'rejected', createdAt: '2024-02-24 16:45', likes: 2, replies: 0 },
      { id: '7', content: '这个短记很有意思，点赞！', author: '周九', authorId: '9', targetType: 'shortNote', targetId: 'note2', targetTitle: '生活感悟', status: 'approved', createdAt: '2024-02-24 14:20', likes: 20, replies: 5 },
      { id: '8', content: '请问这是什么地方？', author: '吴十', authorId: '10', targetType: 'image', targetId: 'img2', targetTitle: '自然风光', status: 'pending', createdAt: '2024-02-24 10:00', likes: 1, replies: 1 },
    ];
    setComments(mockComments);
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.targetTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || comment.status === selectedStatus;
    const matchesType = selectedType === 'all' || comment.targetType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = (commentId: string) => {
    if (window.confirm('确定要删除该评论吗？此操作不可恢复。')) {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  const handleBatchDelete = () => {
    if (selectedComments.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedComments.length} 条评论吗？此操作不可恢复。`)) {
      setComments(comments.filter(c => !selectedComments.includes(c.id)));
      setSelectedComments([]);
    }
  };

  const handleBatchApprove = () => {
    if (selectedComments.length === 0) return;
    setComments(comments.map(c => selectedComments.includes(c.id) ? { ...c, status: 'approved' as const } : c));
    setSelectedComments([]);
  };

  const handleBatchReject = () => {
    if (selectedComments.length === 0) return;
    setComments(comments.map(c => selectedComments.includes(c.id) ? { ...c, status: 'rejected' as const } : c));
    setSelectedComments([]);
  };

  const handleStatusChange = (commentId: string, newStatus: 'approved' | 'pending' | 'rejected' | 'spam') => {
    setComments(comments.map(c => c.id === commentId ? { ...c, status: newStatus } : c));
  };

  const handleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map(c => c.id));
    }
  };

  const handleSelectComment = (commentId: string) => {
    if (selectedComments.includes(commentId)) {
      setSelectedComments(selectedComments.filter(id => id !== commentId));
    } else {
      setSelectedComments([...selectedComments, commentId]);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setShowReplyModal(true);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyContent.trim()) return;
    
    const newReply: Comment = {
      id: Date.now().toString(),
      content: replyContent,
      author: '管理员',
      authorId: '1',
      targetType: replyingTo.targetType,
      targetId: replyingTo.targetId,
      targetTitle: replyingTo.targetTitle,
      status: 'approved',
      createdAt: new Date().toLocaleString('zh-CN'),
      likes: 0,
      replies: 0
    };
    
    setComments([newReply, ...comments]);
    setShowReplyModal(false);
    setReplyingTo(null);
    setReplyContent('');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
      spam: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      approved: '已通过',
      pending: '待审核',
      rejected: '已拒绝',
      spam: '垃圾评论'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      article: 'bg-blue-100 text-blue-700',
      shortNote: 'bg-purple-100 text-purple-700',
      image: 'bg-green-100 text-green-700'
    };
    const labels = {
      article: '文章',
      shortNote: '短记',
      image: '图片'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[type as keyof typeof badges]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getTargetLink = (comment: Comment) => {
    switch (comment.targetType) {
      case 'article':
        return `/article-detail?id=${comment.targetId}`;
      case 'shortNote':
        return `/short-note-detail?id=${comment.targetId}`;
      case 'image':
        return `/image-detail?id=${comment.targetId}`;
      default:
        return '#';
    }
  };

  return (
    <AdminLayout title="评论管理" breadcrumb="评论管理">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">评论管理</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>评论管理</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="bg-bg-primary rounded-xl shadow-card mb-6">
        <div className="p-4 border-b border-border-primary">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  <input
                    type="text"
                    placeholder="搜索评论内容、作者或目标..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有类型</option>
                <option value="article">文章</option>
                <option value="shortNote">短记</option>
                <option value="image">图片</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有状态</option>
                <option value="approved">已通过</option>
                <option value="pending">待审核</option>
                <option value="rejected">已拒绝</option>
                <option value="spam">垃圾评论</option>
              </select>
            </div>
          </div>
        </div>

        {selectedComments.length > 0 && (
          <div className="px-4 py-3 bg-blue-50 border-b border-border-primary flex items-center justify-between">
            <span className="text-sm text-primary">
              已选择 {selectedComments.length} 条评论
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBatchApprove}
                className="px-3 py-1 bg-success text-white rounded-lg text-sm hover:bg-green-600"
              >
                <i className="fas fa-check mr-1"></i>批量通过
              </button>
              <button
                onClick={handleBatchReject}
                className="px-3 py-1 bg-warning text-white rounded-lg text-sm hover:bg-yellow-600"
              >
                <i className="fas fa-times mr-1"></i>批量拒绝
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1 bg-danger text-white rounded-lg text-sm hover:bg-red-600"
              >
                <i className="fas fa-trash mr-1"></i>批量删除
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border-primary">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm w-10">
                  <input
                    type="checkbox"
                    checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">评论内容</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">作者</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">目标</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">类型</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">状态</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">点赞</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">回复</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">时间</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <tr key={comment.id} className="border-b border-border-primary hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => handleSelectComment(comment.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-md">
                      <p className="text-text-primary line-clamp-2">{comment.content}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-medium">{comment.author.charAt(0)}</span>
                      </div>
                      <span className="text-text-secondary">{comment.author}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={getTargetLink(comment)}
                      className="text-primary hover:underline max-w-xs block truncate"
                    >
                      {comment.targetTitle}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{getTypeBadge(comment.targetType)}</td>
                  <td className="py-3 px-4">{getStatusBadge(comment.status)}</td>
                  <td className="py-3 px-4 text-text-secondary">{comment.likes}</td>
                  <td className="py-3 px-4 text-text-secondary">{comment.replies}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{comment.createdAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(comment.id, 'approved')}
                            className="p-2 text-success hover:bg-green-50 rounded-lg transition-colors"
                            title="通过"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            onClick={() => handleStatusChange(comment.id, 'rejected')}
                            className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                            title="拒绝"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleReply(comment)}
                        className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                        title="回复"
                      >
                        <i className="fas fa-reply"></i>
                      </button>
                      <button
                        onClick={() => handleStatusChange(comment.id, comment.status === 'spam' ? 'pending' : 'spam')}
                        className={`p-2 ${comment.status === 'spam' ? 'text-warning' : 'text-gray-500'} hover:bg-gray-50 rounded-lg transition-colors`}
                        title={comment.status === 'spam' ? '取消垃圾标记' : '标记为垃圾'}
                      >
                        <i className="fas fa-exclamation-triangle"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
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

        <div className="p-4 border-t border-border-primary flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            共 {filteredComments.length} 条评论
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {showReplyModal && replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-xl shadow-card max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">回复评论</h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-xs font-medium">{replyingTo.author.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{replyingTo.author}</span>
                  <span className="text-xs text-text-secondary">{replyingTo.createdAt}</span>
                </div>
                <p className="text-text-secondary text-sm">{replyingTo.content}</p>
              </div>
              <form onSubmit={handleReplySubmit}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="输入回复内容..."
                  rows={4}
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>发送回复
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CommentManagement;