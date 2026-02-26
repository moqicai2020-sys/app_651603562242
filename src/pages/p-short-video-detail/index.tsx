import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import styles from './styles.module.css';

interface ShortVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  views: number;
  duration: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  originalArticleId: string;
}

const ShortVideoDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('id');
  const [video, setVideo] = useState<ShortVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addLike, removeLike, hasLiked, addComment, getItemStats } = useData();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 短视频详情';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    if (!videoId) {
      navigate('/short-videos');
      return;
    }

    setLoading(true);
    const mockVideos: ShortVideo[] = [
      {
        id: '1',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600',
        title: '科技前沿：AI技术革命',
        description: '人工智能技术正在改变我们的生活方式，从智能家居到自动驾驶，AI无处不在。',
        likes: 128,
        comments: 32,
        views: 1520,
        duration: '2:30',
        author: {
          name: '謩子',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        createdAt: '2小时前',
        originalArticleId: '1'
      },
      {
        id: '2',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
        title: '城市生活：绿色出行',
        description: '城市绿色出行计划实施半年，效果显著，市民满意度大幅提升。',
        likes: 256,
        comments: 48,
        views: 2340,
        duration: '3:15',
        author: {
          name: '李四',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        createdAt: '5小时前',
        originalArticleId: '2'
      },
      {
        id: '3',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
        title: '自然风光：美丽中国',
        description: '探索中国各地的自然风光，感受大自然的壮丽与美丽。',
        likes: 192,
        comments: 24,
        views: 1890,
        duration: '4:20',
        author: {
          name: '王五',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        createdAt: '1天前',
        originalArticleId: '3'
      },
      {
        id: '4',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
        title: '职场技能：高效工作',
        description: '分享职场高效工作技巧，提升工作效率，实现工作与生活的平衡。',
        likes: 320,
        comments: 64,
        views: 3210,
        duration: '5:45',
        author: {
          name: '赵六',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        createdAt: '2天前',
        originalArticleId: '4'
      },
      {
        id: '5',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600',
        title: '美食探店：特色小吃',
        description: '探访城市特色小吃，品味地道美食文化。',
        likes: 445,
        comments: 89,
        views: 4560,
        duration: '3:50',
        author: {
          name: '钱七',
          avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
        },
        createdAt: '3天前',
        originalArticleId: '5'
      }
    ];

    const foundVideo = mockVideos.find(v => v.id === videoId);
    if (foundVideo) {
      setVideo(foundVideo);
    } else {
      navigate('/short-videos');
    }
    setLoading(false);
  }, [videoId, navigate]);

  const handleShare = (platform: string) => {
    if (!video) return;
    
    const shareText = `${video.title}\n${video.description}\n\n来自织知短视频`;
    const shareUrl = window.location.origin + `/short-video-detail?id=${video.id}`;
    
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
    if (!video) return;

    if (hasLiked(video.id, user.id)) {
      removeLike(video.id, user.id);
    } else {
      addLike(video.id, user.id);
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
    if (!user || !video) return;
    
    if (!commentContent.trim()) {
      alert('请输入评论内容');
      return;
    }

    addComment(video.id, commentContent, user.id, user.name, user.avatar || 'https://s.coze.cn/image/3VpJhTJsCWE/');
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

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl text-danger mb-4"></i>
          <p className="text-text-secondary">视频不存在</p>
          <button 
            onClick={() => navigate('/short-videos')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回视频列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button 
          onClick={() => navigate('/short-videos')}
          className="mb-6 flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>返回视频列表</span>
        </button>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="relative">
            <video 
              src={video.url} 
              className="w-full"
              controls
              playsInline
              poster={video.thumbnail}
            />
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
              {video.duration}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">{video.title}</h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={video.author.avatar} 
                  alt={video.author.name} 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-text-primary">{video.author.name}</p>
                  <p className="text-sm text-text-secondary">{video.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-text-secondary">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-eye"></i>
                  <span>{getItemStats(video.id).views}</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 transition-colors ${user && hasLiked(video.id, user.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  <i className={`${user && hasLiked(video.id, user.id) ? 'fas' : 'far'} fa-heart`}></i>
                  <span>{getItemStats(video.id).likes}</span>
                </button>
                <button
                  onClick={handleComment}
                  className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                >
                  <i className="far fa-comment"></i>
                  <span>{getItemStats(video.id).comments}</span>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-3">视频简介</h2>
              <p className="text-text-secondary leading-relaxed">{video.description}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border-secondary">
              <button 
                onClick={() => navigate(`/article-detail?articleId=${video.originalArticleId}`)}
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

export default ShortVideoDetailPage;