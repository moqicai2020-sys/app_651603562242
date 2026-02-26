import React, { useState, useEffect } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';

interface LoginConfig {
  wechat: {
    appId: string;
    appSecret: string;
    enabled: boolean;
  };
  weibo: {
    appId: string;
    appSecret: string;
    enabled: boolean;
  };
  qq: {
    appId: string;
    appSecret: string;
    enabled: boolean;
  };
}

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  allowGuestComments: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
}

const SystemSettingsPage: React.FC = () => {
  useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'login' | 'security' | 'storage'>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: '织知',
    siteDescription: '一个知识分享与交流的平台',
    siteKeywords: '知识分享,技术交流,学习成长',
    allowRegistration: true,
    requireEmailVerification: true,
    allowGuestComments: false,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'zip'],
    maintenanceMode: false
  });

  const [loginConfig, setLoginConfig] = useState<LoginConfig>({
    wechat: {
      appId: '',
      appSecret: '',
      enabled: false
    },
    weibo: {
      appId: '',
      appSecret: '',
      enabled: false
    },
    qq: {
      appId: '',
      appSecret: '',
      enabled: false
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSystemSettings = localStorage.getItem('systemSettings');
      if (savedSystemSettings) {
        setSystemSettings(JSON.parse(savedSystemSettings));
      }

      const savedLoginConfig = localStorage.getItem('loginConfig');
      if (savedLoginConfig) {
        setLoginConfig(JSON.parse(savedLoginConfig));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSystemSettingsChange = (field: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginConfigChange = (platform: 'wechat' | 'weibo' | 'qq', field: 'appId' | 'appSecret' | 'enabled', value: string | boolean) => {
    setLoginConfig(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const handleTestConnection = async (platform: 'wechat' | 'weibo' | 'qq') => {
    const config = loginConfig[platform];
    if (!config.appId || !config.appSecret) {
      alert('请先填写完整的配置信息');
      return;
    }

    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    
    try {
      localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
      localStorage.setItem('loginConfig', JSON.stringify(loginConfig));
      
      setTimeout(() => {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const tabs = [
    { id: 'general' as const, label: '基本设置', icon: 'fa-cog' },
    { id: 'login' as const, label: '登录配置', icon: 'fa-sign-in-alt' },
    { id: 'security' as const, label: '安全设置', icon: 'fa-shield-alt' },
    { id: 'storage' as const, label: '存储设置', icon: 'fa-database' }
  ];

  return (
    <AdminLayout title="系统设置" breadcrumb="系统设置">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">系统设置</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>系统设置</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            {saveStatus === 'success' && (
              <span className="text-sm text-success flex items-center">
                <i className="fas fa-check-circle mr-2"></i>保存成功
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-danger flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>保存失败
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">站点信息</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      站点名称 *
                    </label>
                    <input
                      type="text"
                      value={systemSettings.siteName}
                      onChange={(e) => handleSystemSettingsChange('siteName', e.target.value)}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      站点描述
                    </label>
                    <textarea
                      value={systemSettings.siteDescription}
                      onChange={(e) => handleSystemSettingsChange('siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      站点关键词
                    </label>
                    <input
                      type="text"
                      value={systemSettings.siteKeywords}
                      onChange={(e) => handleSystemSettingsChange('siteKeywords', e.target.value)}
                      placeholder="用逗号分隔多个关键词"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">用户设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">允许用户注册</p>
                      <p className="text-sm text-text-secondary">关闭后新用户无法注册</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.allowRegistration}
                        onChange={(e) => handleSystemSettingsChange('allowRegistration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">需要邮箱验证</p>
                      <p className="text-sm text-text-secondary">注册时需要验证邮箱地址</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.requireEmailVerification}
                        onChange={(e) => handleSystemSettingsChange('requireEmailVerification', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">允许游客评论</p>
                      <p className="text-sm text-text-secondary">未登录用户可以发表评论</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.allowGuestComments}
                        onChange={(e) => handleSystemSettingsChange('allowGuestComments', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">维护模式</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-primary font-medium">启用维护模式</p>
                    <p className="text-sm text-text-secondary">启用后普通用户无法访问站点</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => handleSystemSettingsChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">微信登录配置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">启用微信登录</p>
                      <p className="text-sm text-text-secondary">允许用户使用微信账号登录</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loginConfig.wechat.enabled}
                        onChange={(e) => handleLoginConfigChange('wechat', 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      AppID *
                    </label>
                    <input
                      type="text"
                      value={loginConfig.wechat.appId}
                      onChange={(e) => handleLoginConfigChange('wechat', 'appId', e.target.value)}
                      placeholder="请输入微信开放平台 AppID"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      AppSecret *
                    </label>
                    <input
                      type="password"
                      value={loginConfig.wechat.appSecret}
                      onChange={(e) => handleLoginConfigChange('wechat', 'appSecret', e.target.value)}
                      placeholder="请输入微信开放平台 AppSecret"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={() => handleTestConnection('wechat')}
                    className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <i className="fas fa-plug mr-2"></i>测试连接
                  </button>
                </div>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">微博登录配置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">启用微博登录</p>
                      <p className="text-sm text-text-secondary">允许用户使用微博账号登录</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loginConfig.weibo.enabled}
                        onChange={(e) => handleLoginConfigChange('weibo', 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      App Key *
                    </label>
                    <input
                      type="text"
                      value={loginConfig.weibo.appId}
                      onChange={(e) => handleLoginConfigChange('weibo', 'appId', e.target.value)}
                      placeholder="请输入微博开放平台 App Key"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      App Secret *
                    </label>
                    <input
                      type="password"
                      value={loginConfig.weibo.appSecret}
                      onChange={(e) => handleLoginConfigChange('weibo', 'appSecret', e.target.value)}
                      placeholder="请输入微博开放平台 App Secret"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={() => handleTestConnection('weibo')}
                    className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <i className="fas fa-plug mr-2"></i>测试连接
                  </button>
                </div>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">QQ登录配置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">启用QQ登录</p>
                      <p className="text-sm text-text-secondary">允许用户使用QQ账号登录</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loginConfig.qq.enabled}
                        onChange={(e) => handleLoginConfigChange('qq', 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      App ID *
                    </label>
                    <input
                      type="text"
                      value={loginConfig.qq.appId}
                      onChange={(e) => handleLoginConfigChange('qq', 'appId', e.target.value)}
                      placeholder="请输入QQ互联 App ID"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      App Key *
                    </label>
                    <input
                      type="password"
                      value={loginConfig.qq.appSecret}
                      onChange={(e) => handleLoginConfigChange('qq', 'appSecret', e.target.value)}
                      placeholder="请输入QQ互联 App Key"
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={() => handleTestConnection('qq')}
                    className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <i className="fas fa-plug mr-2"></i>测试连接
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">密码策略</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      最小密码长度
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="20"
                      defaultValue={8}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">要求包含数字</p>
                      <p className="text-sm text-text-secondary">密码必须包含至少一个数字</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">要求包含特殊字符</p>
                      <p className="text-sm text-text-secondary">密码必须包含至少一个特殊字符</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">会话管理</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      会话超时时间（分钟）
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      defaultValue={30}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary font-medium">单设备登录</p>
                      <p className="text-sm text-text-secondary">同一账号只能在一个设备上登录</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">文件上传限制</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      最大文件大小（MB）
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => handleSystemSettingsChange('maxFileSize', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      允许的文件类型
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'].map(type => (
                        <label key={type} className="inline-flex items-center px-3 py-1 border border-border-primary rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={systemSettings.allowedFileTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSystemSettingsChange('allowedFileTypes', [...systemSettings.allowedFileTypes, type]);
                              } else {
                                handleSystemSettingsChange('allowedFileTypes', systemSettings.allowedFileTypes.filter(t => t !== type));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-text-secondary">{type.toUpperCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-primary pt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">存储配置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      存储方式
                    </label>
                    <select className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="local">本地存储</option>
                      <option value="oss">阿里云 OSS</option>
                      <option value="cos">腾讯云 COS</option>
                      <option value="s3">Amazon S3</option>
                    </select>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <i className="fas fa-info-circle mr-2"></i>
                      当前使用本地存储，文件保存在服务器上。建议在生产环境使用云存储服务以提高性能和可靠性。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettingsPage;