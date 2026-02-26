import React, { useState, useEffect } from 'react';

import styles from './styles.module.css';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  views: number;
}

const SystemAnnouncements: React.FC = () => {

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: '系统升级通知',
        content: '为了提供更好的服务体验，我们将于2024年3月1日00:00-06:00进行系统升级维护，期间部分功能可能无法正常使用。请提前做好准备，给您带来的不便敬请谅解。',
        type: 'warning',
        priority: 'high',
        author: '系统管理员',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        createdAt: '2024-02-26 10:00',
        updatedAt: '2024-02-26 10:00',
        isPublished: true,
        views: 1234
      },
      {
        id: '2',
        title: '新功能上线：知识图谱',
        content: '我们很高兴地宣布，知识图谱功能正式上线！现在您可以更直观地查看文章之间的关联关系，发现更多相关内容。点击导航栏的"知识图谱"即可体验。',
        type: 'success',
        priority: 'medium',
        author: '产品团队',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        createdAt: '2024-02-25 14:30',
        updatedAt: '2024-02-25 14:30',
        isPublished: true,
        views: 856
      },
      {
        id: '3',
        title: '安全提醒：请勿泄露账户信息',
        content: '近期发现有不法分子冒充客服进行诈骗，请广大用户注意保护个人信息，不要向任何人透露账户密码、验证码等敏感信息。官方客服不会索要此类信息。',
        type: 'error',
        priority: 'high',
        author: '安全团队',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        createdAt: '2024-02-24 09:15',
        updatedAt: '2024-02-24 09:15',
        isPublished: true,
        views: 2341
      },
      {
        id: '4',
        title: '用户协议更新',
        content: '为了更好地保护用户权益，我们更新了用户协议和隐私政策。主要更新内容包括：数据收集说明、用户权利保护、争议解决机制等。请仔细阅读并确认。',
        type: 'info',
        priority: 'medium',
        author: '法务团队',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        createdAt: '2024-02-23 16:00',
        updatedAt: '2024-02-23 16:00',
        isPublished: true,
        views: 567
      },
      {
        id: '5',
        title: '征文活动：分享你的知识',
        content: '为了鼓励知识分享，我们即将举办征文活动。优秀文章将获得丰厚奖励和展示机会。活动详情请关注后续公告。',
        type: 'info',
        priority: 'low',
        author: '运营团队',
        authorAvatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
        createdAt: '2024-02-22 11:20',
        updatedAt: '2024-02-22 11:20',
        isPublished: true,
        views: 432
      }
    ];
    setAnnouncements(mockAnnouncements);
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch && announcement.isPublished;
  });

  const getTypeBadge = (type: string) => {
    const badges = {
      info: 'bg-blue-100 text-blue-700',
      warning: 'bg-yellow-100 text-yellow-700',
      success: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700'
    };
    const labels = {
      info: '信息',
      warning: '警告',
      success: '成功',
      error: '错误'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[type as keyof typeof badges]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-orange-100 text-orange-700',
      high: 'bg-red-100 text-red-700'
    };
    const labels = {
      low: '低',
      medium: '中',
      high: '高'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[priority as keyof typeof badges]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  const handleViewDetail = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
    
    const updatedAnnouncements = announcements.map(a =>
      a.id === announcement.id ? { ...a, views: a.views + 1 } : a
    );
    setAnnouncements(updatedAnnouncements);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">系统公告</h1>
          <p className="text-text-secondary">了解最新的系统动态和重要通知</p>
        </div>

        <div className="bg-white rounded-xl shadow-card mb-6">
          <div className="p-4 border-b border-border-primary">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  <input
                    type="text"
                    placeholder="搜索公告..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setSelectedType('info')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  信息
                </button>
                <button
                  onClick={() => setSelectedType('warning')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === 'warning' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  警告
                </button>
                <button
                  onClick={() => setSelectedType('success')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === 'success' ? 'bg-green-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  成功
                </button>
                <button
                  onClick={() => setSelectedType('error')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === 'error' ? 'bg-red-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  错误
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-card p-12 text-center">
              <i className="fas fa-inbox text-4xl text-text-secondary mb-4"></i>
              <p className="text-text-secondary">暂无公告</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewDetail(announcement)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeBadge(announcement.type)}
                      {getPriorityBadge(announcement.priority)}
                      {announcement.priority === 'high' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          重要
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">{announcement.title}</h3>
                    <p className="text-text-secondary line-clamp-2">{announcement.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary text-sm ml-4">
                    <i className="fas fa-eye"></i>
                    <span>{announcement.views}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border-secondary">
                  <div className="flex items-center space-x-3">
                    <img
                      src={announcement.authorAvatar}
                      alt={announcement.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{announcement.author}</p>
                      <p className="text-xs text-text-secondary">{announcement.createdAt}</p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-blue-600 text-sm font-medium">
                    查看详情 <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDetailModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeBadge(selectedAnnouncement.type)}
                  {getPriorityBadge(selectedAnnouncement.priority)}
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-text-secondary"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-4">{selectedAnnouncement.title}</h2>
              <div className="flex items-center space-x-4 mb-6 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <img
                    src={selectedAnnouncement.authorAvatar}
                    alt={selectedAnnouncement.author}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{selectedAnnouncement.author}</span>
                </div>
                <span>{selectedAnnouncement.createdAt}</span>
                <span>浏览 {selectedAnnouncement.views} 次</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-text-primary leading-relaxed whitespace-pre-wrap">{selectedAnnouncement.content}</p>
              </div>
            </div>
            <div className="p-6 border-t border-border-primary">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAnnouncements;