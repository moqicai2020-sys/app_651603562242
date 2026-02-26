import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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

const ShortNotesPage: React.FC = () => {
  const [notes, setNotes] = useState<ShortNote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitData, setSubmitData] = useState({
    title: '',
    content: '',
    category: 'tech' as 'tech' | 'society' | 'livelihood' | 'country',
    type: 'text' as 'image' | 'audio' | 'video' | 'text',
    imageUrl: '',
    audioUrl: '',
    videoUrl: '',
    fileUrl: '',
    linkUrl: ''
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 短记';
    return () => { document.title = originalTitle; };
  }, []);

  // AI自动更新功能 - 每天早上8点自动生成新短记
  useEffect(() => {
    const checkAndAutoUpdate = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // 检查是否是早上8点（8:00-8:05之间）
      if (hours === 8 && minutes < 5) {
        const lastUpdateKey = 'lastShortNoteUpdate';
        const lastUpdate = localStorage.getItem(lastUpdateKey);
        const today = now.toDateString();
        
        // 如果今天还没有更新过，则生成新的短记
        if (lastUpdate !== today) {
          generateAINote();
          localStorage.setItem(lastUpdateKey, today);
        }
      }
    };

    // 立即检查一次
    checkAndAutoUpdate();

    // 每分钟检查一次
    const interval = setInterval(checkAndAutoUpdate, 60000);

    return () => clearInterval(interval);
  }, []);

  // AI生成短记
  const generateAINote = () => {

    
    const aiNotes = [
      {
        title: 'AI驱动的智能交通系统上线',
        content: '基于人工智能技术的智能交通管理系统今日正式上线，预计将减少30%的交通拥堵时间。',
        category: 'tech' as const,
        type: 'image' as const,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600'
      },
      {
        title: '全国教育数字化平台启动',
        content: '教育部宣布全国教育数字化平台正式启动，将实现优质教育资源共享。',
        category: 'country' as const,
        type: 'video' as const,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        title: '新型环保材料研发成功',
        content: '科研团队成功研发出可完全降解的新型环保材料，将有效解决白色污染问题。',
        category: 'tech' as const,
        type: 'text' as const
      },
      {
        title: '社区养老服务升级',
        content: '为应对人口老龄化，各地社区养老服务全面升级，提供更加贴心的服务。',
        category: 'livelihood' as const,
        type: 'audio' as const,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      }
    ];

    const randomNote = aiNotes[Math.floor(Math.random() * aiNotes.length)];
    const newNote: ShortNote = {
      id: 'note' + Date.now(),
      title: randomNote.title,
      content: randomNote.content,
      category: randomNote.category,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: randomNote.type,
      imageUrl: randomNote.imageUrl,
      audioUrl: randomNote.audioUrl,
      videoUrl: randomNote.videoUrl,
      originalArticleId: 'article1'
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    console.log('AI自动生成短记:', newNote);
  };

  useEffect(() => {
    // 模拟短记数据
    const mockNotes: ShortNote[] = [
      {
        id: 'note1',
        title: '人工智能技术取得重大突破',
        content: '近日，国内科研团队在人工智能领域取得重大突破，开发出新一代大语言模型，性能超越国际同类产品。',
        category: 'tech',
        createdAt: '2026-02-25 08:00:00',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600',
        originalArticleId: 'article1'
      },
      {
        id: 'note2',
        title: '城市公共交通系统全面升级',
        content: '为提升市民出行体验，我市公共交通系统将全面升级，引入智能调度系统和无感支付技术。',
        category: 'society',
        createdAt: '2026-02-25 08:05:00',
        type: 'video',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        originalArticleId: 'article2'
      },
      {
        id: 'note3',
        title: '新一轮医疗保障政策出台',
        content: '国家医保局发布新政策，扩大医保覆盖范围，提高报销比例，减轻群众就医负担。',
        category: 'livelihood',
        createdAt: '2026-02-25 08:10:00',
        type: 'audio',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        originalArticleId: 'article3'
      },
      {
        id: 'note4',
        title: '国家科技创新基金启动',
        content: '为支持中小企业创新发展，国家设立百亿级科技创新基金，重点支持战略性新兴产业。',
        category: 'country',
        createdAt: '2026-02-25 08:15:00',
        type: 'text',
        originalArticleId: 'article4'
      },
      {
        id: 'note5',
        title: '5G技术在工业领域广泛应用',
        content: '5G技术已在全国多个工业园区实现全覆盖，为智能制造和工业互联网发展提供有力支撑。',
        category: 'tech',
        createdAt: '2026-02-24 08:00:00',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600',
        originalArticleId: 'article5'
      },
      {
        id: 'note6',
        title: '全国文化遗产保护工程启动',
        content: '为保护和传承中华优秀传统文化，国家启动大规模文化遗产保护工程，涉及全国2000多处文物古迹。',
        category: 'country',
        createdAt: '2026-02-24 08:05:00',
        type: 'video',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        originalArticleId: 'article6'
      }
    ];
    setNotes(mockNotes);
  }, []);

  const filteredNotes = selectedCategory === 'all' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOpenSubmitModal = () => {
    if (!user) {
      alert('请先登录后再提交短记');
      return;
    }
    setShowSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmitData({
      title: '',
      content: '',
      category: 'tech',
      type: 'text',
      imageUrl: '',
      audioUrl: '',
      videoUrl: '',
      fileUrl: '',
      linkUrl: ''
    });
  };

  const handleSubmitNote = () => {
    if (!submitData.title.trim()) {
      alert('请输入短记标题');
      return;
    }
    if (!submitData.content.trim()) {
      alert('请输入短记内容');
      return;
    }

    const newNote: ShortNote = {
      id: 'note' + Date.now(),
      title: submitData.title,
      content: submitData.content,
      category: submitData.category,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: submitData.type,
      imageUrl: submitData.imageUrl || undefined,
      audioUrl: submitData.audioUrl || undefined,
      videoUrl: submitData.videoUrl || undefined,
      originalArticleId: 'article1'
    };

    setNotes([newNote, ...notes]);
    handleCloseSubmitModal();
    alert('短记提交成功！');
  };

  const handleFileUpload = (type: 'image' | 'audio' | 'video' | 'file', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setSubmitData({
      ...submitData,
      [type === 'file' ? 'fileUrl' : `${type}Url`]: fileUrl
    });
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'tech': return '科技';
      case 'society': return '社会';
      case 'livelihood': return '民生';
      case 'country': return '国家';
      default: return '全部';
    }
  };

  // 分享功能
  const handleShare = (platform: string, note: ShortNote) => {
    const shareText = `${note.title}\n${note.content}\n\n来自织知每日短记`;
    const shareUrl = window.location.origin + `/short-note-detail?id=${note.id}`;
    
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
            <h1 className="text-2xl font-bold text-text-primary">织知</h1>
          </div>
          
          {/* 中间：导航链接 */}
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
            <Link to="/short-notes" className={`${styles.navLink} text-primary font-medium`}>
              短记
            </Link>
            <Link to="/short-videos" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              短视频
            </Link>
            <Link to="/knowledge-graph" className={`${styles.navLink} text-text-secondary hover:text-primary font-medium`}>
              知识图谱
            </Link>
          </nav>
          
          {/* 右侧：用户菜单 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <img 
                    src="https://s.coze.cn/image/3VpJhTJsCWE/" 
                    alt="用户头像" 
                    className="w-8 h-8 rounded-full border-2 border-primary"
                  />
                  <span className="text-sm font-medium text-text-primary hidden sm:block">{user.name}</span>
                  <i className="fas fa-chevron-down text-xs text-text-secondary hidden sm:block"></i>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-text-primary hover:text-primary font-medium">
                  登录
                </Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">每日短记</h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-6">
            每天早上8点更新，为您带来科技、社会、民生、国家相关的最新资讯
          </p>
          <button 
            onClick={handleOpenSubmitModal}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
          >
            <i className="fas fa-plus"></i>
            <span>手动提交短记</span>
          </button>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
          >
            全部
          </button>
          <button 
            onClick={() => handleCategoryChange('tech')}
            className={`px-4 py-2 rounded-full ${selectedCategory === 'tech' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
          >
            科技
          </button>
          <button 
            onClick={() => handleCategoryChange('society')}
            className={`px-4 py-2 rounded-full ${selectedCategory === 'society' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
          >
            社会
          </button>
          <button 
            onClick={() => handleCategoryChange('livelihood')}
            className={`px-4 py-2 rounded-full ${selectedCategory === 'livelihood' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
          >
            民生
          </button>
          <button 
            onClick={() => handleCategoryChange('country')}
            className={`px-4 py-2 rounded-full ${selectedCategory === 'country' ? 'bg-primary text-white' : 'bg-gray-100 text-text-primary hover:bg-gray-200'}`}
          >
            国家
          </button>
        </div>

        {/* 短记列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-shadow">
              {/* 短记媒体内容 */}
              <div className="h-48 overflow-hidden">
                {note.type === 'image' && note.imageUrl && (
                  <img 
                    src={note.imageUrl} 
                    alt={note.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                )}
                {note.type === 'video' && note.videoUrl && (
                  <video 
                    src={note.videoUrl} 
                    className="w-full h-full object-cover"
                    controls
                    muted
                    playsInline
                  />
                )}
                {note.type === 'audio' && note.audioUrl && (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <audio 
                      src={note.audioUrl} 
                      controls
                      className="w-full max-w-xs"
                    />
                  </div>
                )}
                {note.type === 'text' && (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                    <i className="fas fa-quote-right text-4xl opacity-50"></i>
                  </div>
                )}
              </div>
              
              {/* 短记内容 */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
                    {getCategoryName(note.category)}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {new Date(note.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">
                  {note.title}
                </h3>
                <p className="text-text-secondary mb-4">
                  {note.content}
                </p>
                
                {/* 阅读原文章链接 */}
                <div className="mb-4">
                  <Link 
                    to={`/article-detail?articleId=${note.originalArticleId}`}
                    className="text-primary hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                  >
                    <i className="fas fa-arrow-right"></i>
                    <span>请点击进去阅读原文章</span>
                  </Link>
                </div>
                
                {/* 分享按钮 */}
                <div className="flex items-center justify-end">
                  <button 
                    className="text-text-secondary hover:text-primary mr-4"
                    onClick={() => handleShare('wechat', note)}
                    title="微信分享"
                  >
                    <i className="fab fa-weixin text-xl"></i>
                  </button>
                  <button 
                    className="text-text-secondary hover:text-primary mr-4"
                    onClick={() => handleShare('weibo', note)}
                    title="微博分享"
                  >
                    <i className="fab fa-weibo text-xl"></i>
                  </button>
                  <button 
                    className="text-text-secondary hover:text-primary"
                    onClick={() => handleShare('copy', note)}
                    title="复制链接"
                  >
                    <i className="fas fa-share-alt text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-newspaper text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">暂无短记</h3>
            <p className="text-text-secondary mb-6">每天早上8点更新，敬请期待</p>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-bg-primary border-t border-border-primary py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary">
            © 2026 织知 - 每日短记 | 每天早上8点更新
          </p>
        </div>
      </footer>

      {/* 提交短记模态框 */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-secondary flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary">提交短记</h3>
              <button 
                onClick={handleCloseSubmitModal}
                className="text-text-secondary hover:text-text-primary"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  短记标题 *
                </label>
                <input 
                  type="text"
                  value={submitData.title}
                  onChange={(e) => setSubmitData({...submitData, title: e.target.value})}
                  placeholder="请输入短记标题"
                  className="w-full px-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  短记内容 *
                </label>
                <textarea 
                  value={submitData.content}
                  onChange={(e) => setSubmitData({...submitData, content: e.target.value})}
                  placeholder="请输入短记内容"
                  rows={4}
                  className="w-full px-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    分类
                  </label>
                  <select 
                    value={submitData.category}
                    onChange={(e) => setSubmitData({...submitData, category: e.target.value as any})}
                    className="w-full px-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="tech">科技</option>
                    <option value="society">社会</option>
                    <option value="livelihood">民生</option>
                    <option value="country">国家</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    类型
                  </label>
                  <select 
                    value={submitData.type}
                    onChange={(e) => setSubmitData({...submitData, type: e.target.value as any})}
                    className="w-full px-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="text">纯文本</option>
                    <option value="image">图片</option>
                    <option value="audio">音频</option>
                    <option value="video">视频</option>
                  </select>
                </div>
              </div>

              {submitData.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    上传图片
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('image', e)}
                    className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                  />
                  {submitData.imageUrl && (
                    <img 
                      src={submitData.imageUrl} 
                      alt="预览"
                      className="mt-2 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}

              {submitData.type === 'audio' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    上传音频
                  </label>
                  <input 
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload('audio', e)}
                    className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                  />
                  {submitData.audioUrl && (
                    <audio 
                      src={submitData.audioUrl} 
                      controls
                      className="mt-2 w-full"
                    />
                  )}
                </div>
              )}

              {submitData.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    上传视频
                  </label>
                  <input 
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload('video', e)}
                    className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                  />
                  {submitData.videoUrl && (
                    <video 
                      src={submitData.videoUrl} 
                      controls
                      className="mt-2 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  上传文档（ZIP、PDF等）
                </label>
                <input 
                  type="file"
                  accept=".zip,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('file', e)}
                  className="w-full px-4 py-2 border border-border-secondary rounded-lg"
                />
                {submitData.fileUrl && (
                  <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                    <i className="fas fa-file mr-2"></i>
                    文件已选择
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  添加网址链接
                </label>
                <input 
                  type="url"
                  value={submitData.linkUrl}
                  onChange={(e) => setSubmitData({...submitData, linkUrl: e.target.value})}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="p-6 border-t border-border-secondary flex justify-end space-x-3">
              <button 
                onClick={handleCloseSubmitModal}
                className="px-6 py-2 border border-border-secondary rounded-lg hover:bg-gray-100"
              >
                取消
              </button>
              <button 
                onClick={handleSubmitNote}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
              >
                提交短记
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortNotesPage;