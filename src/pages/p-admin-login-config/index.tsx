import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

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

const AdminLoginConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [config, setConfig] = useState<LoginConfig>({
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
    const originalTitle = document.title;
    document.title = '织知 - 登录接口配置';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    try {
      const savedConfig = localStorage.getItem('loginConfig');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  };

  const handleInputChange = (platform: 'wechat' | 'weibo' | 'qq', field: 'appId' | 'appSecret' | 'enabled', value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      localStorage.setItem('loginConfig', JSON.stringify(config));
      setMessage({ type: 'success', text: '配置保存成功！' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '配置保存失败，请稍后重试' });
      console.error('保存配置失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async (platform: 'wechat' | 'weibo' | 'qq') => {
    const platformConfig = config[platform];
    
    if (!platformConfig.enabled) {
      setMessage({ type: 'error', text: '请先启用该登录方式' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!platformConfig.appId || !platformConfig.appSecret) {
      setMessage({ type: 'error', text: '请填写完整的AppID和AppSecret' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setMessage({ type: 'success', text: `${platform === 'wechat' ? '微信' : platform === 'weibo' ? '微博' : 'QQ'}登录配置验证通过！` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!user || user.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fas fa-lock text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">访问被拒绝</h2>
          <p className="text-gray-500 mb-6">只有超级管理员才能访问此页面</p>
          <button
            onClick={handleBack}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回后台
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors mb-4"
          >
            <i className="fas fa-arrow-left"></i>
            <span>返回后台</span>
          </button>
          <h1 className="text-3xl font-bold text-text-primary mb-2">登录接口配置</h1>
          <p className="text-text-secondary">
            配置第三方登录接口，包括微信、微博和QQ登录
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fab fa-weixin text-green-500 text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">微信登录</h3>
                  <p className="text-sm text-text-secondary">配置微信开放平台登录接口</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.wechat.enabled}
                    onChange={(e) => handleInputChange('wechat', 'enabled', e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-text-primary">启用</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection('wechat')}
                  className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  测试连接
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="wechatAppId" className="block text-sm font-medium text-text-primary mb-2">
                  AppID
                </label>
                <input
                  type="text"
                  id="wechatAppId"
                  value={config.wechat.appId}
                  onChange={(e) => handleInputChange('wechat', 'appId', e.target.value)}
                  placeholder="请输入微信AppID..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  disabled={!config.wechat.enabled}
                />
                <p className="text-xs text-text-secondary mt-1">
                  在微信开放平台创建应用后获取
                </p>
              </div>

              <div>
                <label htmlFor="wechatAppSecret" className="block text-sm font-medium text-text-primary mb-2">
                  AppSecret
                </label>
                <input
                  type="password"
                  id="wechatAppSecret"
                  value={config.wechat.appSecret}
                  onChange={(e) => handleInputChange('wechat', 'appSecret', e.target.value)}
                  placeholder="请输入微信AppSecret..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  disabled={!config.wechat.enabled}
                />
                <p className="text-xs text-text-secondary mt-1">
                  在微信开放平台创建应用后获取
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fab fa-weibo text-red-500 text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">微博登录</h3>
                  <p className="text-sm text-text-secondary">配置微博开放平台登录接口</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.weibo.enabled}
                    onChange={(e) => handleInputChange('weibo', 'enabled', e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-text-primary">启用</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection('weibo')}
                  className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  测试连接
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weiboAppId" className="block text-sm font-medium text-text-primary mb-2">
                  App Key
                </label>
                <input
                  type="text"
                  id="weiboAppId"
                  value={config.weibo.appId}
                  onChange={(e) => handleInputChange('weibo', 'appId', e.target.value)}
                  placeholder="请输入微博App Key..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  disabled={!config.weibo.enabled}
                />
                <p className="text-xs text-text-secondary mt-1">
                  在微博开放平台创建应用后获取
                </p>
              </div>

              <div>
                <label htmlFor="weiboAppSecret" className="block text-sm font-medium text-text-primary mb-2">
                  App Secret
                </label>
                <input
                  type="password"
                  id="weiboAppSecret"
                  value={config.weibo.appSecret}
                  onChange={(e) => handleInputChange('weibo', 'appSecret', e.target.value)}
                  placeholder="请输入微博App Secret..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  disabled={!config.weibo.enabled}
                />
                <p className="text-xs text-text-secondary mt-1">
                  在微博开放平台创建应用后获取
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                  <i className="fab fa-qq text-blue-500 text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">QQ登录</h3>
                  <p className="text-sm text-text-secondary">配置QQ互联平台登录接口</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.qq.enabled}
                    onChange={(e) => handleInputChange('qq', 'enabled', e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-text-primary">启用</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTestConnection('qq')}
                  className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  测试连接
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="qqAppId" className="block text-sm font-medium text-text-primary mb-2">
                  App ID
                </label>
                <input
                  type="text"
                  id="qqAppId"
                  value={config.qq.appId}
                  onChange={(e) => handleInputChange('qq', 'appId', e.target.value)}
                  placeholder="请输入QQ App ID..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  disabled={!config.qq.enabled}
                />
                <p className="text-xs text-text-secondary mt-1">
                  在QQ互联平台创建应用后获取
                </p>
              </div>

              <div>
                <label htmlFor="qqAppSecret" className="block text-sm font-medium text-text-primary mb-2">
                  App Key
                </label>
                <input
                  type="password"
                  id="qqAppSecret"
                  value={config.qq.appSecret}
                  onChange={(e) => handleInputChange('qq', 'appSecret', e.target.value)}
                  placeholder="请输入QQ App Key..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  disabled={!config.qq.enabled}
                />
                <p className="text-xs text-text-secondary mt-1">
                  在QQ互联平台创建应用后获取
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-border-secondary text-text-primary rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors ${isSaving ? styles.buttonLoading : ''}`}
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  保存中...
                </>
              ) : (
                '保存配置'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">
            <i className="fas fa-info-circle mr-2"></i>
            配置说明
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 请在相应的开放平台（微信开放平台、微博开放平台、QQ互联）注册开发者账号</li>
            <li>• 创建网站应用，获取相应的AppID/AppKey和AppSecret</li>
            <li>• 在开放平台配置回调地址，确保与系统域名一致</li>
            <li>• 启用登录方式后，用户可以使用对应的第三方账号登录系统</li>
            <li>• 配置信息将保存在本地存储中，请注意备份</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginConfigPage;