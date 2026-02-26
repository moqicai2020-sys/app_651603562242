import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import styles from './styles.module.css';

interface ShortNote {
  id: string;
  title: string;
  content: string;
  category: 'tech' | 'society' | 'livelihood' | 'country';
  createdAt: string;
  type: 'image' | 'audio' | 'video' | 'text';
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  originalArticleId: string;
}

const ShortNoteDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('id');
  const [note, setNote] = useState<ShortNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addLike, removeLike, hasLiked, addComment, getItemStats } = useData();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 短记详情';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    if (!noteId) {
      navigate('/short-notes');
      return;
    }

    setLoading(true);
    const mockNotes: ShortNote[] = [
      {
        id: 'note1',
        title: 'React Hooks 最佳实践',
        content: 'React Hooks 自推出以来，极大地改变了 React 组件的编写方式。本文将深入探讨 React Hooks 的工作原理...',
        category: 'tech',
        createdAt: '2024-02-26 08:00:00',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600',
        originalArticleId: '1'
      },
      {
        id: 'note2',
        title: '用户体验设计原则',
        content: '用户体验设计是产品成功的关键因素之一。本文将探讨如何在产品设计过程中融入用户体验思维...',
        category: 'society',
        createdAt: '2024-02-25 08:05:00',
        type: 'video',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        originalArticleId: '2'
      },
      {
        id: 'note3',
        title: '机器学习入门指南',
        content: '机器学习是人工智能的核心技术之一。本文将介绍机器学习的基本概念和常用算法...',
        category: 'livelihood',
        createdAt: '2024-02-24 08:10:00',
        type: 'audio',
        audioUrl: 'https://www.w3schools.com/html/horse.mp3',
        originalArticleId: '3'
      },
      {
        id: 'note4',
        title: '云计算架构设计',
        content: '云计算架构设计需要考虑多个方面，包括可扩展性、可靠性、安全性等...',
        category: 'country',
        createdAt: '2024-02-23 08:15:00',
        type: 'text',
        originalArticleId: '4'
      },
      {
        id: 'note5',
        title: '区块链技术应用',
        content: '区块链技术在金融、供应链、医疗等领域都有广泛的应用前景...',
        category: 'tech',
        createdAt: '2024-02-22 08:00:00',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600',
        originalArticleId: '5'
      }
    ];

    const foundNote = mockNotes.find(n => n.id === noteId);
    if (foundNote) {
      setNote(foundNote);
    } else {
      navigate('/short-notes');
    }
    setLoading(false);
  }, [noteId, navigate]);

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'tech': return '科技';
      case 'society': return '社会';
      case 'livelihood': return '民生';
      case 'country': return '国家';
      default: return '全部';
    }
  };

  const handleShare = (platform: string) => {
    if (!note) return;
    
    const shareText = `${note.title}\n${note.content}\n\n来自织知每日短记`;
    const shareUrl = window.location.origin + `/short-note-detail?id=${note.id}`;
    
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

  const handleLike = () => {
    if (!user) {
      alert('请先登录后再进行操作');
      return;
    }
    if (!note) return;

    if (hasLiked(note.id, user.id)) {
      removeLike(note.id, user.id);
    } else {
      addLike(note.id, user.id);
    }
  };

  const handleComment = () => {
    if (!user) {
      alert('请先登录后再进行操作');
      return;
    }
    setShowCommentModal(true);
  };

  const handleSubmitComment = () => {
    if (!user || !note) return;
    
    if (!commentContent.trim()) {
      alert('请输入评论内容');
      return;
    }

    addComment(note.id, commentContent, user.id, user.name, user.avatar || 'https://s.coze.cn/image/3VpJhTJsCWE/');
    setCommentContent('');
    setShowCommentModal(false);
    alert('评论发表成功！');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl text-danger mb-4"></i>
          <p className="text-text-secondary">短记不存在</p>
          <button 
            onClick={() => navigate('/short-notes')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回短记列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => navigate('/short-notes')}
          className="mb-6 flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>返回短记列表</span>
        </button>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary">
                {getCategoryName(note.category)}
              </span>
              <span className="text-sm text-text-secondary">
                {new Date(note.createdAt).toLocaleString('zh-CN')}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-text-primary mb-6">{note.title}</h1>

            <div className="mb-8">
              <p className="text-lg text-text-secondary leading-relaxed">{note.content}</p>
            </div>

            <div className="mb-8">
              {note.type === 'image' && note.imageUrl && (
                <img 
                  src={note.imageUrl} 
                  alt={note.title} 
                  className="w-full rounded-lg"
                />
              )}
              {note.type === 'video' && note.videoUrl && (
                <video 
                  src={note.videoUrl} 
                  className="w-full rounded-lg"
                  controls
                  playsInline
                />
              )}
              {note.type === 'audio' && note.audioUrl && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <audio 
                    src={note.audioUrl} 
                    controls
                    className="w-full"
                  />
                </div>
              )}
              {note.type === 'text' && (
                <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-12 text-center text-white">
                  <i className="fas fa-quote-right text-4xl opacity-50 mb-4"></i>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border-secondary">
              <button 
                onClick={() => navigate(`/article-detail?articleId=${note.originalArticleId}`)}
                className="flex items-center space-x-2 text-primary hover:text-blue-600 font-medium"
              >
                <i className="fas fa-arrow-right"></i>
                <span>阅读原文章</span>
              </button>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-1 transition-colors ${user && hasLiked(note.id, user.id) ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
                  title={user && hasLiked(note.id, user.id) ? '取消喜欢' : '喜欢'}
                >
                  <i className={`${user && hasLiked(note.id, user.id) ? 'fas' : 'far'} fa-heart text-xl`}></i>
                  <span>{getItemStats(note.id).likes}</span>
                </button>
                <button 
                  onClick={handleComment}
                  className="flex items-center space-x-1 text-text-secondary hover:text-blue-500 transition-colors"
                  title="评论"
                >
                  <i className="far fa-comment text-xl"></i>
                  <span>{getItemStats(note.id).comments}</span>
                </button>
                <button 
                  className="text-text-secondary hover:text-green-500 transition-colors"
                  onClick={() => handleShare('wechat')}
                  title="微信分享"
                >
                  <i className="fab fa-weixin text-xl"></i>
                </button>
                <button 
                  className="text-text-secondary hover:text-red-500 transition-colors"
                  onClick={() => handleShare('weibo')}
                  title="微博分享"
                >
                  <i className="fab fa-weibo text-xl"></i>
                </button>
                <button 
                  className="text-text-secondary hover:text-blue-500 transition-colors"
                  onClick={() => handleShare('copy')}
                  title="复制链接"
                >
                  <i className="fas fa-share-alt text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-card max-w-md w-full mx-4">
            <div className="p-6 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">发表评论</h3>
            </div>
            <div className="p-6">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="请输入评论内容..."
                rows={4}
                className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="p-6 border-t border-border-primary flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setCommentContent('');
                }}
                className="px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmitComment}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
              >
                发表
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortNoteDetailPage;