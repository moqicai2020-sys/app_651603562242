import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const AdminShortVideoEdit: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('id');
  const isEditMode = !!videoId;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('前端开发');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('draft');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('0:00');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isEditMode && videoId) {
      const mockVideos: ShortVideo[] = [
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
        }
      ];

      const video = mockVideos.find(v => v.id === videoId);
      if (video) {
        setTitle(video.title);
        setCategory(video.category);
        setStatus(video.status);
        setThumbnail(video.thumbnail);
        setDuration(video.duration);
      }
    }
  }, [isEditMode, videoId]);

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveMessage('请填写标题');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage('保存中...');

    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('保存成功！');
      setTimeout(() => {
        setSaveMessage('');
        navigate('/admin/short-video-management');
      }, 1500);
    }, 1000);
  };

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      if (window.confirm('确定要放弃编辑吗？未保存的内容将丢失。')) {
        navigate('/admin/short-video-management');
      }
    } else {
      navigate('/admin/short-video-management');
    }
  };

  return (
    <AdminLayout title={isEditMode ? '编辑短视频' : '新建短视频'} breadcrumb={isEditMode ? '短视频管理 / 编辑' : '短视频管理 / 新建'}>
      <div className="bg-white rounded-xl shadow-card p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            {isEditMode ? '编辑短视频' : '新建短视频'}
          </h2>
          <p className="text-text-secondary text-sm">
            {isEditMode ? '编辑短视频内容' : '创建新的短视频内容'}
          </p>
        </div>

        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${saveMessage === '保存成功！' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
            {saveMessage}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              标题 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入视频标题"
              className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              分类 <span className="text-danger">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="前端开发">前端开发</option>
              <option value="产品设计">产品设计</option>
              <option value="人工智能">人工智能</option>
              <option value="云计算">云计算</option>
              <option value="区块链">区块链</option>
              <option value="后端开发">后端开发</option>
              <option value="移动开发">移动开发</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              视频时长
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="例如：2:30"
              className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              封面图片
            </label>
            <div className="border-2 border-dashed border-border-primary rounded-lg p-8 text-center">
              {thumbnail ? (
                <div className="relative">
                  <img src={thumbnail} alt="封面" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    onClick={() => setThumbnail('')}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              ) : (
                <div>
                  <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                  <p className="text-text-secondary mb-2">点击或拖拽上传封面图片</p>
                  <p className="text-xs text-text-secondary">支持 JPG、PNG 格式，建议尺寸 16:9</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              视频文件
            </label>
            <div className="border-2 border-dashed border-border-primary rounded-lg p-8 text-center">
              {videoUrl ? (
                <div className="relative">
                  <video src={videoUrl} className="w-full h-48 object-cover rounded-lg" controls />
                  <button
                    onClick={() => setVideoUrl('')}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              ) : (
                <div>
                  <i className="fas fa-video text-4xl text-text-secondary mb-4"></i>
                  <p className="text-text-secondary mb-2">点击或拖拽上传视频文件</p>
                  <p className="text-xs text-text-secondary">支持 MP4、WebM 格式，最大 500MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              视频描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入视频描述"
              rows={4}
              className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              状态
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="published"
                  checked={status === 'published'}
                  onChange={(e) => setStatus(e.target.value as 'published')}
                  className="w-4 h-4 text-primary"
                />
                <span>已发布</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={(e) => setStatus(e.target.value as 'draft')}
                  className="w-4 h-4 text-primary"
                />
                <span>草稿</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="archived"
                  checked={status === 'archived'}
                  onChange={(e) => setStatus(e.target.value as 'archived')}
                  className="w-4 h-4 text-primary"
                />
                <span>已归档</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-secondary">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-border-primary rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminShortVideoEdit;