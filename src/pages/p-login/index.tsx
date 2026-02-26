import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithThirdParty, isAuthenticated, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 从 location.state 中获取重定向路径
  const from = (location.state as any)?.from?.pathname || '/home';

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 登录';
    return () => { document.title = originalTitle; };
  }, []);

  // 如果已经登录，重定向到主页
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('请填写所有必填字段');
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('邮箱或密码错误');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
      console.error('登录错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.isFirstLogin) {
      navigate('/change-password', { state: { from: { pathname: from } } });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleThirdPartyLogin = async (platform: 'wechat' | 'weibo' | 'qq') => {
    try {
      setIsLoading(true);
      const success = await loginWithThirdParty(platform, (success) => {
        if (success) {
          navigate(from, { replace: true });
        } else {
          setError('第三方登录失败，请稍后重试');
          setIsLoading(false);
        }
      });
      if (!success) {
        setIsLoading(false);
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
      console.error('第三方登录错误:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* 左侧：Logo 和说明 */}
        <div className={`${styles.leftSection} hidden md:flex`}>
          <div className={styles.leftContent}>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-white">织知</h1>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">欢迎回来</h2>
            <p className="text-white/80 mb-8">
              登录您的账户，继续探索知识的海洋，分享您的想法和见解
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-lightbulb text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">分享知识</h3>
                  <p className="text-white/80 text-sm">记录和分享您的学习心得</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-network-wired text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">知识互联</h3>
                  <p className="text-white/80 text-sm">创建知识之间的连接</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">社区互动</h3>
                  <p className="text-white/80 text-sm">与其他学习者交流讨论</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：登录表单 */}
        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-sign-in-alt text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">登录账户</h2>
              <p className="text-text-secondary">
                请输入您的邮箱和密码登录
              </p>
            </div>
            
            {error && (
              <div className={`${styles.errorMessage} mb-4 p-3 bg-red-50 text-red-600 rounded-lg`}>
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入您的邮箱..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                    密码
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    忘记密码？
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入您的密码..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-secondary rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-text-primary">
                  记住我
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors ${isLoading ? styles.buttonLoading : ''}`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-text-secondary mb-4">
                还没有账户？
                <Link 
                  to="/register" 
                  className="text-primary hover:underline ml-1"
                >
                  立即注册
                </Link>
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <button 
                  className={`w-12 h-12 border border-border-secondary rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors ${isLoading ? styles.buttonLoading : ''}`}
                  onClick={() => handleThirdPartyLogin('wechat')}
                  disabled={isLoading}
                  title="微信登录"
                >
                  <i className="fab fa-weixin text-green-600 text-xl"></i>
                </button>
                <button 
                  className={`w-12 h-12 border border-border-secondary rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors ${isLoading ? styles.buttonLoading : ''}`}
                  onClick={() => handleThirdPartyLogin('weibo')}
                  disabled={isLoading}
                  title="微博登录"
                >
                  <i className="fab fa-weibo text-red-600 text-xl"></i>
                </button>
                <button 
                  className={`w-12 h-12 border border-border-secondary rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors ${isLoading ? styles.buttonLoading : ''}`}
                  onClick={() => handleThirdPartyLogin('qq')}
                  disabled={isLoading}
                  title="QQ登录"
                >
                  <i className="fab fa-qq text-blue-500 text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-text-secondary">
              <p>
                登录即表示您同意我们的
                <Link to="/terms" className="text-primary hover:underline mx-1">服务条款</Link>
                和
                <Link to="/privacy" className="text-primary hover:underline mx-1">隐私政策</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;