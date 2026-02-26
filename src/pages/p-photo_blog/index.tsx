import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PublishPhotoGuard } from '../../components/PermissionGuard';
import styles from './styles.module.css';

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
}

const PhotoBlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 图片博客';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟图片数据
  const mockPhotos: Photo[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '美丽的风景',
      description: '这是一张美丽的风景照片，拍摄于清晨的湖边。',
      likes: 128,
      comments: 32,
      author: {
        name: '謩子',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '2小时前'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '城市夜景',
      description: '繁华都市的夜景，灯火辉煌。',
      likes: 256,
      comments: 48,
      author: {
        name: '李四',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '5小时前'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '自然风光',
      description: '大自然的壮丽景色，让人心旷神怡。',
      likes: 192,
      comments: 24,
      author: {
        name: '王五',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '1天前'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1447752875215-b2761b3dbdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '山川河流',
      description: '山川河流的美景，如诗如画。',
      likes: 320,
      comments: 64,
      author: {
        name: '赵六',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '2天前'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1501854140801-50d0a989e36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '森林秘境',
      description: '深林中的秘境，充满神秘感。',
      likes: 168,
      comments: 28,
      author: {
        name: '张三',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '3天前'
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1472214103451-9374d892778?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '海滨日落',
      description: '美丽的海滨日落景色。',
      likes: 288,
      comments: 56,
      author: {
        name: '李四',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '4天前'
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '雪山风光',
      description: '壮丽的雪山风光，令人震撼。',
      likes: 144,
      comments: 20,
      author: {
        name: '王五',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '5天前'
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      title: '田园风光',
      description: '宁静的田园风光，让人放松心情。',
      likes: 216,
      comments: 40,
      author: {
        name: '赵六',
        avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/'
      },
      createdAt: '1周前'
    }
  ];

  useEffect(() => {
    setPhotos(mockPhotos);
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleLike = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
  };

  // 分享功能
  const handleShare = (photo: Photo, platform: string) => {
    const shareText = `${photo.title}\n${photo.description}\n\n来自织知图片博客`;
    const shareUrl = window.location.origin + `/photo-blog`;
    
    switch (platform) {
      case 'wechat':
        // 微信分享需要特殊处理，这里模拟分享功能
        alert('请在微信中打开此页面进行分享');
        break;
      case 'weibo':
        // 微博分享
        const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        window.open(weiboUrl, '_blank');
        break;
      case 'copy':
        // 复制链接
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('链接已复制到剪贴板');
        });
        break;
      default:
        break;
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowUploadModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setIsUploading(false);
          setUploadStatus('success');
          
          setTimeout(() => {
            setUploadStatus('idle');
            setUploadProgress(0);
            setShowUploadModal(false);
          }, 2000);
        }
        setUploadProgress(progress);
      }, 200);
    };

    simulateUpload();
  };

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => {
        if (selectedCategory === 'popular') return photo.likes > 200;
        if (selectedCategory === 'recent') return true;
        return true;
      });

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="bg-bg-primary border-b border-border-primary sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* 左侧：Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">图片博客</h1>
          </div>
          
          {/* 右侧：上传按钮 */}
          <PublishPhotoGuard fallback={null}>
            <button 
              onClick={handleUploadClick}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <i className="fas fa-upload"></i>
              <span>上传图片</span>
            </button>
          </PublishPhotoGuard>
        </div>
      </header>

      {/* 分类标签 */}
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

      {/* 主内容区 */}
      <div className="flex min-h-screen">
        {/* 左侧菜单 */}
        <aside className="hidden lg:block w-64 bg-bg-primary border-r border-border-primary flex-shrink-0">
          <nav className="p-4 space-y-2">
            <Link to="/home" className={`${styles.navLink} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100`}>
              <i className="fas fa-home w-5"></i>
              <span>首页</span>
            </Link>
            <Link to="/article-list" className={`${styles.navLink} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100`}>
              <i className="fas fa-file-alt w-5"></i>
              <span>文章</span>
            </Link>
            <Link to="/photo-blog" className={`${styles.navLink} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white`}>
              <i className="fas fa-image w-5"></i>
              <span>图片</span>
            </Link>
            <Link to="/short-notes" className={`${styles.navLink} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100`}>
              <i className="fas fa-sticky-note w-5"></i>
              <span>短记</span>
            </Link>
            <Link to="/short-videos" className={`${styles.navLink} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100`}>
              <i className="fas fa-video w-5"></i>
              <span>短视频</span>
            </Link>
            <Link to="/knowledge-graph" className={`${styles.navLink} flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100`}>
              <i className="fas fa-project-diagram w-5"></i>
              <span>知识图谱</span>
            </Link>
          </nav>
        </aside>

        {/* 右侧内容 */}
        <div className="flex-1">
          {/* 图片瀑布流 */}
          <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              onClick={() => handlePhotoClick(photo)}
              className={`${styles.photoCard} bg-white rounded-xl shadow-card overflow-hidden cursor-pointer`}
            >
              <div className="relative">
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  className="w-full h-64 object-cover"
                />
                <div className={`${styles.photoOverlay} absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-end p-4`}>
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-2">{photo.title}</h3>
                    <p className="text-sm opacity-90">{photo.description}</p>
                  </div>
                </div>
              </div>
              
              {/* 图片信息 */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={photo.author.avatar} 
                      alt={photo.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-text-primary">{photo.author.name}</span>
                  </div>
                  <span className="text-xs text-text-secondary">{photo.createdAt}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className="flex items-center space-x-1 text-text-secondary hover:text-danger transition-colors"
                  >
                    <i className="fas fa-heart"></i>
                    <span className="text-sm">{photo.likes}</span>
                  </button>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1 text-text-secondary">
                      <i className="fas fa-comment"></i>
                      <span className="text-sm">{photo.comments}</span>
                    </span>
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
                        <div className="px-3 py-1 cursor-pointer hover:bg-gray-50 flex items-center space-x-2" onClick={(e) => { e.stopPropagation(); handleShare(photo, 'wechat'); }}>
                          <i className="fab fa-weixin text-green-500"></i>
                          <span className="text-sm">微信分享</span>
                        </div>
                        <div className="px-3 py-1 cursor-pointer hover:bg-gray-50 flex items-center space-x-2" onClick={(e) => { e.stopPropagation(); handleShare(photo, 'weibo'); }}>
                          <i className="fab fa-weibo text-red-500"></i>
                          <span className="text-sm">微博分享</span>
                        </div>
                        <div className="px-3 py-1 cursor-pointer hover:bg-gray-50 flex items-center space-x-2" onClick={(e) => { e.stopPropagation(); handleShare(photo, 'copy'); }}>
                          <i className="fas fa-link text-blue-500"></i>
                          <span className="text-sm">复制链接</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>
      </div>

      {/* 图片详情弹窗 */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-elevated w-full max-w-4xl max-h-screen overflow-hidden">
              <div className="flex flex-col md:flex-row h-full">
                {/* 左侧：图片 */}
                <div className="md:w-2/3 bg-black flex items-center justify-center">
                  <img 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.title}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </div>
                
                {/* 右侧：信息 */}
                <div className="md:w-1/3 p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">{selectedPhoto.title}</h2>
                    <button 
                      onClick={() => setSelectedPhoto(null)}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      <i className="fas fa-times text-2xl"></i>
                    </button>
                  </div>
                  
                  {/* 作者信息 */}
                  <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={selectedPhoto.author.avatar} 
                      alt={selectedPhoto.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{selectedPhoto.author.name}</div>
                      <div className="text-sm text-text-secondary">{selectedPhoto.createdAt}</div>
                    </div>
                  </div>
                  
                  {/* 描述 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">描述</h3>
                    <p className="text-text-secondary">{selectedPhoto.description}</p>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex space-x-3 mb-6">
                    <button 
                      onClick={() => handleLike(selectedPhoto.id)}
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
                  
                  {/* 统计信息 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-1">{selectedPhoto.likes}</div>
                      <div className="text-sm text-text-secondary">喜欢</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-secondary mb-1">{selectedPhoto.comments}</div>
                      <div className="text-sm text-text-secondary">评论</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 上传图片弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-elevated w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">上传图片</h3>
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
                      accept="image/*"
                      className="hidden"
                      id="photo-upload-input"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor="photo-upload-input"
                      className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadStatus === 'idle' && (
                        <>
                          <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                          <p className="text-sm text-text-secondary">
                            点击或拖拽图片到此处上传
                          </p>
                          <p className="text-xs text-text-secondary mt-2">
                            支持 JPG、PNG、GIF 格式，最大 10MB
                          </p>
                        </>
                      )}
                      {uploadStatus === 'uploading' && (
                        <>
                          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                          <p className="text-sm text-text-primary font-medium">
                            正在上传...
                          </p>
                        </>
                      )}
                      {uploadStatus === 'success' && (
                        <>
                          <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                          <p className="text-sm text-green-600 font-medium">
                            上传成功！
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {uploadStatus === 'uploading' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">上传进度</span>
                        <span className="text-primary font-medium">{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {uploadStatus === 'idle' && (
                    <>
                      <div>
                        <label htmlFor="photo-title" className="block text-sm font-medium text-text-primary mb-2">
                          图片标题
                        </label>
                        <input 
                          type="text" 
                          id="photo-title"
                          placeholder="请输入图片标题..."
                          className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                        />
                      </div>
                      <div>
                        <label htmlFor="photo-description" className="block text-sm font-medium text-text-primary mb-2">
                          图片描述
                        </label>
                        <textarea 
                          id="photo-description"
                          placeholder="请输入图片描述..."
                          rows={3}
                          className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          document.getElementById('photo-upload-input')?.click();
                        }}
                        className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <i className="fas fa-upload mr-2"></i>
                        上传图片
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoBlogPage;