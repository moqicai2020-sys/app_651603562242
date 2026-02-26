import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  commentReplies: boolean;
  newFollowers: boolean;
  systemUpdates: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
}

const UserSettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    avatar: 'https://s.coze.cn/image/3VpJhTJsCWE/',
    bio: '',
    location: '',
    website: '',
    phone: '',
    dateOfBirth: '',
    gender: 'other'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    commentReplies: true,
    newFollowers: true,
    systemUpdates: false
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = () => {
    try {
      const savedProfile = localStorage.getItem(`userProfile_${user?.id}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedNotifications = localStorage.getItem(`notificationSettings_${user?.id}`);
      if (savedNotifications) {
        setNotificationSettings(JSON.parse(savedNotifications));
      }

      const savedPrivacy = localStorage.getItem(`privacySettings_${user?.id}`);
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    setPasswordError('');
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    
    try {
      localStorage.setItem(`userProfile_${user?.id}`, JSON.stringify(profile));
      updateUser({ name: profile.name, email: profile.email });
      
      setTimeout(() => {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleSaveNotifications = async () => {
    setSaveStatus('saving');
    
    try {
      localStorage.setItem(`notificationSettings_${user?.id}`, JSON.stringify(notificationSettings));
      
      setTimeout(() => {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleSavePrivacy = async () => {
    setSaveStatus('saving');
    
    try {
      localStorage.setItem(`privacySettings_${user?.id}`, JSON.stringify(privacySettings));
      
      setTimeout(() => {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('请输入当前密码');
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError('请输入新密码');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('新密码长度至少为6位');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }

    setSaveStatus('saving');
    
    setTimeout(() => {
      setSaveStatus('success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile' as const, label: '个人资料', icon: 'fa-user' },
    { id: 'security' as const, label: '安全设置', icon: 'fa-shield-alt' },
    { id: 'notifications' as const, label: '通知设置', icon: 'fa-bell' },
    { id: 'privacy' as const, label: '隐私设置', icon: 'fa-lock' }
  ];

  return (
    <AdminLayout title="用户设置" breadcrumb="用户设置">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">用户设置</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>用户设置</span>
            </nav>
          </div>
          {saveStatus === 'success' && (
            <span className="text-sm text-success flex items-center">
              <i className="fas fa-check-circle mr-2"></i>保存成功
            </span>
          )}
        </div>
      </div>

      <div className="bg-bg-primary rounded-xl shadow-card">
        <div className="border-b border-border-primary">
          <nav className="flex space-x-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={profile.avatar} 
                      alt="用户头像" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-border-primary"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors">
                      <i className="fas fa-camera"></i>
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      用户名 *
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full max-w-md px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      邮箱地址 *
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full max-w-md px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    性别
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => handleProfileChange('gender', e.target.value)}
                    className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="other">保密</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  个人简介
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={4}
                  placeholder="介绍一下你自己..."
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    所在地区
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    placeholder="城市、省份"
                    className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    个人网站
                  </label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => handleProfileChange('website', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  联系电话
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="请输入手机号码"
                  className="w-full max-w-md px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>保存中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>保存资料
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>密码安全提示
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 密码长度至少为6位</li>
                  <li>• 建议包含字母、数字和特殊字符</li>
                  <li>• 不要使用与其他网站相同的密码</li>
                  <li>• 定期更换密码以提高安全性</li>
                </ul>
              </div>

              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-text-primary mb-4">修改密码</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      {passwordError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      当前密码 *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="请输入当前密码"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      新密码 *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="请输入新密码（至少6位）"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      确认新密码 *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="请再次输入新密码"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saveStatus === 'saving'}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>修改中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-key mr-2"></i>修改密码
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">登录历史</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', ip: '192.168.1.1', time: '2024-02-26 10:30', current: true },
                    { device: 'Firefox on macOS', ip: '192.168.1.2', time: '2024-02-25 18:20', current: false },
                    { device: 'Safari on iPhone', ip: '192.168.1.3', time: '2024-02-24 14:15', current: false },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-desktop text-primary"></i>
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">{session.device}</p>
                          <p className="text-sm text-text-secondary">IP: {session.ip} · {session.time}</p>
                        </div>
                      </div>
                      {session.current && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          当前会话
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">通知方式</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">邮件通知</p>
                      <p className="text-sm text-text-secondary">接收重要通知的邮件提醒</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">推送通知</p>
                      <p className="text-sm text-text-secondary">在浏览器中接收实时通知</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">通知类型</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">评论回复</p>
                      <p className="text-sm text-text-secondary">当有人回复你的评论时通知你</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.commentReplies}
                        onChange={(e) => handleNotificationChange('commentReplies', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">新关注者</p>
                      <p className="text-sm text-text-secondary">当有人关注你时通知你</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.newFollowers}
                        onChange={(e) => handleNotificationChange('newFollowers', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">系统更新</p>
                      <p className="text-sm text-text-secondary">接收系统重要更新和公告</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.systemUpdates}
                        onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>保存中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>保存设置
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">资料可见性</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      个人资料可见性
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-full max-w-md px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="public">公开 - 所有人可见</option>
                      <option value="friends">仅好友可见</option>
                      <option value="private">私密 - 仅自己可见</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">联系方式</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">显示邮箱地址</p>
                      <p className="text-sm text-text-secondary">允许其他用户查看你的邮箱</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showEmail}
                        onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">显示电话号码</p>
                      <p className="text-sm text-text-secondary">允许其他用户查看你的电话</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showPhone}
                        onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">消息设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border-primary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">允许发送私信</p>
                      <p className="text-sm text-text-secondary">允许其他用户向你发送私信</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowMessages}
                        onChange={(e) => handlePrivacyChange('allowMessages', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSavePrivacy}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>保存中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>保存设置
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserSettingsPage;