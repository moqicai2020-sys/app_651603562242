import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PublishVideoGuard } from '../../components/PermissionGuard';
import styles from './styles.module.css';

interface Video {
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
}

const ShortVideosPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 短视频';
    return () => { document.title = originalTitle; };
  }, []);

  const mockVideos: Video[] = [
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
      createdAt: '2小时前'
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
      createdAt: '5小时前'
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
      createdAt: '1天前'
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
      createdAt: '2天前'
    },
    {
      id: '5',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
      title: '团队协作：成功秘诀',
      description: '团队协作的重要性，如何建立高效的团队合作关系。',
      likes: 168,
      comments: 28,
      views: 1450,
      duration: '3:50',
      author: {
        name: '张三',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '3天前'
    },
    {
      id: '6',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
      title: '健康生活：运动健身',
      description: '分享健康生活方式，运动健身的重要性，保持身心健康。',
      likes: 288,
      comments: 56,
      views: 2670,
      duration: '4:10',
      author: {
        name: '李四',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '4天前'
    }
  ];

  useEffect(() => {
    setVideos(mockVideos);
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleLike = (videoId: string) => {
    setVideos(videos.map(video => 
      video.id === videoId 
        ? { ...video, likes: video.likes + 1 }
        : video
    ));
  };

  const handleUploadClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowUploadModal(true);
  };

  const handleShare = (video: Video, platform: string) => {
    const shareText = `${video.title}\n${video.description}\n\n来自织知短视频`;
    const shareUrl = window.location.origin + `/short-videos`;
    
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

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => {
        if (selectedCategory === 'popular') return video.likes > 200;
        if (selectedCategory === 'recent') return true;
        return true;
      });

  return (
    <div className={styles.pageWrapper}>
      <header className="bg-bg-primary border-b border-border-primary sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">织知</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
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
            <Link to="/short-videos" className={`${styles.navLink} text-primary font-medium`}>
              短视频
            </Link>
            <Link to="/knowledge-graph" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              知识图谱
            </Link>
          </nav>
          
          <PublishVideoGuard fallback={null}>
            <button 
              onClick={handleUploadClick}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <i className="fas fa-upload"></i>
              <span>上传视频</span>
            </button>
          </PublishVideoGuard>
        </div>
      </header>

      <div className="bg-bg-primary border-b border-border-primary">
        <div className="container mx-auto px-4 py-3">
          <div className="flex space-x-4">
            <button 
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
            >
              全部
            </button>
            <button 
              onClick={() => handleCategoryChange('popular')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'popular' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
            >
              热门
            </button>
            <button 
              onClick={() => handleCategoryChange('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'recent' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
            >
              最新
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div 
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className={`${styles.videoCard} bg-white rounded-xl shadow-card overflow-hidden cursor-pointer`}
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className={`${styles.videoOverlay} absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center`}>
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <i className="fas fa-play text-primary text-2xl ml-1"></i>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={video.author.avatar} 
                      alt={video.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-text-primary">{video.author.name}</span>
                  </div>
                  <span className="text-xs text-text-secondary">{video.createdAt}</span>
                </div>
                
                <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(video.id);
                      }}
                      className="flex items-center space-x-1 text-text-secondary hover:text-danger transition-colors"
                    >
                      <i className="fas fa-heart"></i>
                      <span className="text-sm">{video.likes}</span>
                    </button>
                    <span className="flex items-center space-x-1 text-text-secondary">
                      <i className="fas fa-eye"></i>
                      <span className="text-sm">{video.views}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-text-secondary">
                      <i className="fas fa-comment"></i>
                      <span className="text-sm">{video.comments}</span>
                    </span>
                  </div>
                  <div className="relative group">
                    <button 
                      className="text-text-secondary hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <i className="fas fa-share-alt"></i>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-card border border-border-secondary py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="px-3 py-1 cursor-pointer hover:bg-gray-50 flex items-center space-x-2" onClick={(e) => { e.stopPropagation(); handleShare(video, 'wechat'); }}>
                        <i className="fab fa-weixin text-green-500"></i>
                        <span className="text-sm">微信分享</span>
                      </div>
                      <div className="px-3 py-1 cursor-pointer hover:bg-gray-50 flex items-center space-x-2" onClick={(e) => { e.stopPropagation(); handleShare(video, 'weibo'); }}>
                        <i className="fab fa-weibo text-red-500"></i>
                        <span className="text-sm">微博分享</span>
                      </div>
                      <div className="px-3 py-1 cursor-pointer hover:bg-gray-50 flex items-center space-x-2" onClick={(e) => { e.stopPropagation(); handleShare(video, 'copy'); }}>
                        <i className="fas fa-link text-blue-500"></i>
                        <span className="text-sm">复制链接</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-elevated w-full max-w-4xl max-h-screen overflow-hidden">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/3 bg-black flex items-center justify-center">
                  <video 
                    src={selectedVideo.url} 
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh]"
                  />
                </div>
                
                <div className="md:w-1/3 p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">{selectedVideo.title}</h2>
                    <button 
                      onClick={() => setSelectedVideo(null)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      <i className="fas fa-times text-2xl"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={selectedVideo.author.avatar} 
                      alt={selectedVideo.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{selectedVideo.author.name}</div>
                      <div className="text-sm text-text-secondary">{selectedVideo.createdAt}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">描述</h3>
                    <p className="text-text-secondary">{selectedVideo.description}</p>
                  </div>
                  
                  <div className="flex space-x-3 mb-6">
                    <button 
                      onClick={() => handleLike(selectedVideo.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <i className="fas fa-heart"></i>
                      <span>喜欢</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-secondary text-white rounded-lg hover:bg-purple-600 transition-colors">
                      <i className="fas fa-comment"></i>
                      <span>评论</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">{selectedVideo.likes}</div>
                      <div className="text-sm text-text-secondary">喜欢</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-secondary mb-1">{selectedVideo.views}</div>
                      <div className="text-sm text-text-secondary">观看</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-tertiary mb-1">{selectedVideo.comments}</div>
                      <div className="text-sm text-text-secondary">评论</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-elevated w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">上传视频</h3>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border-secondary rounded-lg p-8 text-center">
                    <input 
                      type="file" 
                      accept="video/*"
                      className="hidden"
                      id="video-upload-input"
                    />
                    <label 
                      htmlFor="video-upload-input"
                      className="cursor-pointer"
                    >
                      <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                      <p className="text-sm text-text-secondary">
                        点击或拖拽视频到此处上传
                      </p>
                      <p className="text-xs text-text-secondary mt-2">
                        支持 MP4、WebM 格式，最大 500MB
                      </p>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="video-title" className="block text-sm font-medium text-text-primary mb-2">
                      视频标题
                    </label>
                    <input 
                      type="text" 
                      id="video-title"
                      placeholder="请输入视频标题..."
                      className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="video-description" className="block text-sm font-medium text-text-primary mb-2">
                      视频描述
                    </label>
                    <textarea 
                      id="video-description"
                      placeholder="请输入视频描述..."
                      rows={3}
                      className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      alert('视频上传功能演示');
                      setShowUploadModal(false);
                    }}
                    className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    上传视频
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortVideosPage;