import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const AdminShortNoteEdit: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('id');
  const isEditMode = !!noteId;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('前端开发');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isEditMode && noteId) {
      const mockNotes: ShortNote[] = [
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
        }
      ];

      const note = mockNotes.find(n => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
        setStatus(note.status);
      }
    }
  }, [isEditMode, noteId]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSaveMessage('请填写标题和内容');
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
        navigate('/admin/short-note-management');
      }, 1500);
    }, 1000);
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm('确定要放弃编辑吗？未保存的内容将丢失。')) {
        navigate('/admin/short-note-management');
      }
    } else {
      navigate('/admin/short-note-management');
    }
  };

  return (
    <AdminLayout title={isEditMode ? '编辑短记' : '新建短记'} breadcrumb={isEditMode ? '短记管理 / 编辑' : '短记管理 / 新建'}>
      <div className="bg-white rounded-xl shadow-card p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            {isEditMode ? '编辑短记' : '新建短记'}
          </h2>
          <p className="text-text-secondary text-sm">
            {isEditMode ? '编辑短记内容' : '创建新的短记内容'}
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
              placeholder="请输入短记标题"
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
              内容 <span className="text-danger">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入短记内容"
              rows={10}
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

export default AdminShortNoteEdit;