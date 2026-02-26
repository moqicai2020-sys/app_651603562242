import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import styles from './styles.module.css';

interface Image {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  originalArticleId: string;
}

const ImageDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const imageId = searchParams.get('id');
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addLike, removeLike, hasLiked, addComment, getItemStats } = useData();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 图片详情';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    if (!imageId) {
      navigate('/photo-blog');
      return;
    }

    setLoading(true);
    const mockImages: Image[] = [
      {
        id: 'img1',
        title: '城市夜景',
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600',
        description: '繁华都市的夜晚，灯火辉煌，展现现代城市的魅力。',
        author: {
          name: '謩子',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        category: '城市风光',
        tags: ['城市', '夜景', '建筑'],
        likes: 256,
        comments: 32,
        views: 1520,
        createdAt: '2小时前',
        originalArticleId: '1'
      },
      {
        id: 'img2',
        title: '自然风光',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        description: '壮丽的自然风光，山川河流，展现大自然的鬼斧神工。',
        author: {
          name: '李四',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        category: '自然风光',
        tags: ['自然', '山川', '河流'],
        likes: 345,
        comments: 48,
        views: 2340,
        createdAt: '5小时前',
        originalArticleId: '2'
      },
      {
        id: 'img3',
        title: '人文纪实',
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
        description: '记录生活中的美好瞬间，展现人文关怀。',
        author: {
          name: '王五',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        category: '人文纪实',
        tags: ['人文', '纪实', '生活'],
        likes: 192,
        comments: 24,
        views: 1890,
        createdAt: '1天前',
        originalArticleId: '3'
      },
      {
        id: 'img4',
        title: '建筑艺术',
        url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
        description: '现代建筑的艺术之美，线条与光影的完美结合。',
        author: {
          name: '赵六',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        category: '建筑艺术',
        tags: ['建筑', '艺术', '设计'],
        likes: 445,
        comments: 67,
        views: 3210,
        createdAt: '2天前',
        originalArticleId: '4'
      },
      {
        id: 'img5',
        title: '美食摄影',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
        description: '精致美食的视觉盛宴，色香味俱全。',
        author: {
          name: '钱七',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        category: '美食摄影',
        tags: ['美食', '摄影', '生活'],
        likes: 567,
        comments: 89,
        views: 4560,
        createdAt: '3天前',
        originalArticleId: '5'
      }
    ];

    const foundImage = mockImages.find(img => img.id === imageId);
    if (foundImage) {
      setImage(foundImage);
    } else {
      navigate('/photo-blog');
    }
    setLoading(false);
  }, [imageId, navigate]);

  const handleShare = (platform: string) => {
    if (!image) return;
    
    const shareText = `${image.title}\n${image.description}\n\n来自织知图片博客`;
    const shareUrl = window.location.origin + `/image-detail?id=${image.id}`;
    
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
    if (!image) return;

    if (hasLiked(image.id, user.id)) {
      removeLike(image.id, user.id);
    } else {
      addLike(image.id, user.id);
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
    if (!user || !image) return;
    
    if (!commentContent.trim()) {
      alert('请输入评论内容');
      return;
    }

    addComment(image.id, commentContent, user.id, user.name, user.avatar || 'https://s.coze.cn/image/3VpJhTJsCWE/');
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

  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl text-danger mb-4"></i>
          <p className="text-text-secondary">图片不存在</p>
          <button 
            onClick={() => navigate('/photo-blog')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回图片列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button 
          onClick={() => navigate('/photo-blog')}
          className="mb-6 flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>返回图片列表</span>
        </button>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="relative">
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full"
            />
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">{image.title}</h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={image.author.avatar} 
                  alt={image.author.name} 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-text-primary">{image.author.name}</p>
                  <p className="text-sm text-text-secondary">{image.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-text-secondary">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>{getItemStats(image.id).views}</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 transition-colors ${user && hasLiked(image.id, user.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <i className={`${user && hasLiked(image.id, user.id) ? 'fas' : 'far'} fa-heart`}></i>
                  <span>{getItemStats(image.id).likes}</span>
                </button>
                <button
                  onClick={handleComment}
                  className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                >
                  <i className="far fa-comment"></i>
                  <span>{getItemStats(image.id).comments}</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary bg-opacity-10 text-primary mb-3">
                {image.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-3">图片描述</h2>
              <p className="text-text-secondary leading-relaxed">{image.description}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border-secondary">
              <button 
                onClick={() => navigate(`/article-detail?articleId=${image.originalArticleId}`)}
                className="flex items-center space-x-2 text-primary hover:text-blue-600 font-medium"
              >
                <i className="fas fa-arrow-right"></i>
                <span>阅读原文章</span>
              </button>

              <div className="flex items-center space-x-4">
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

export default ImageDetailPage;