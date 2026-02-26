import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 注册';
    return () => { document.title = originalTitle; };
  }, []);

  // 如果已经登录，重定向到主页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6个字符');
      return;
    }

    if (!termsAccepted) {
      setError('请阅读并同意服务条款和隐私政策');
      return;
    }

    try {
      setIsLoading(true);
      // 这里应该调用注册API
      // 模拟注册成功
      setTimeout(() => {
        setIsLoading(false);
        // 注册成功后跳转到登录页面
        navigate('/login', {
          state: {
            message: '注册成功，请登录您的账户'
          }
        });
      }, 1500);
    } catch (err) {
      setError('注册失败，请稍后重试');
      console.error('注册错误:', err);
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
            
            <h2 className="text-2xl font-bold text-white mb-4">欢迎加入织知</h2>
            <p className="text-white/80 mb-8">
              注册一个账户，开始您的知识分享之旅，与志同道合的人一起探索、学习和成长
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-pen-fancy text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">创作分享</h3>
                  <p className="text-white/80 text-sm">发布您的文章和见解</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-tags text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">标签管理</h3>
                  <p className="text-white/80 text-sm">使用标签组织您的内容</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-share-alt text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">社交互动</h3>
                  <p className="text-white/80 text-sm">与其他用户交流讨论</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：注册表单 */}
        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-plus text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">创建账户</h2>
              <p className="text-text-secondary">
                填写以下信息注册一个新账户
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
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入您的用户名..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  required
                />
              </div>
              
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
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入您的密码..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  required
                />
                <p className="text-xs text-text-secondary mt-1">
                  密码长度至少为6个字符
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入您的密码..."
                  className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                  required
                />
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-secondary rounded mt-1"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-text-primary">
                  我已阅读并同意
                  <Link to="/terms" className="text-primary hover:underline mx-1">服务条款</Link>
                  和
                  <Link to="/privacy" className="text-primary hover:underline mx-1">隐私政策</Link>
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
                    注册中...
                  </>
                ) : (
                  '注册'
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-text-secondary mb-4">
                已有账户？
                <Link 
                  to="/login" 
                  className="text-primary hover:underline ml-1"
                >
                  立即登录
                </Link>
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <button className={`w-12 h-12 border border-border-secondary rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors`}>
                  <i className="fab fa-weixin text-green-600 text-xl"></i>
                </button>
                <button className={`w-12 h-12 border border-border-secondary rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors`}>
                  <i className="fab fa-weibo text-red-600 text-xl"></i>
                </button>
                <button className={`w-12 h-12 border border-border-secondary rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors`}>
                  <i className="fab fa-qq text-blue-500 text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;