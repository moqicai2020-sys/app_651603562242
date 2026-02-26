import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '织知 - 找回密码';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('请填写邮箱地址');
      return;
    }

    try {
      setIsLoading(true);
      // 这里应该调用发送重置密码链接的API
      // 模拟发送成功
      setTimeout(() => {
        setSuccess('重置密码链接已发送到您的邮箱，请检查');
        setIsLoading(false);
        // 3秒后跳转到登录页面
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }, 1500);
    } catch (err) {
      setError('发送重置密码链接失败，请稍后重试');
      console.error('发送重置密码链接错误:', err);
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
            
            <h2 className="text-2xl font-bold text-white mb-4">找回密码</h2>
            <p className="text-white/80 mb-8">
              输入您的邮箱地址，我们将发送重置密码的链接到您的邮箱
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-envelope text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">安全验证</h3>
                  <p className="text-white/80 text-sm">通过邮箱验证您的身份</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-lock text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">重置密码</h3>
                  <p className="text-white/80 text-sm">设置新的安全密码</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-sign-in-alt text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">重新登录</h3>
                  <p className="text-white/80 text-sm">使用新密码登录账户</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：找回密码表单 */}
        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">找回密码</h2>
              <p className="text-text-secondary">
                输入您的邮箱地址，我们将发送重置密码的链接
              </p>
            </div>
            
            {error && (
              <div className={`${styles.errorMessage} mb-4 p-3 bg-red-50 text-red-600 rounded-lg`}>
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
            
            {success && (
              <div className={`${styles.successMessage} mb-4 p-3 bg-green-50 text-green-600 rounded-lg`}>
                <i className="fas fa-check-circle mr-2"></i>
                {success}
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
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors ${isLoading ? styles.buttonLoading : ''}`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    发送中...
                  </>
                ) : (
                  '发送重置链接'
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-text-secondary mb-4">
                记得密码了？
                <Link 
                  to="/login" 
                  className="text-primary hover:underline ml-1"
                >
                  立即登录
                </Link>
              </p>
              
              <p className="text-text-secondary">
                还没有账户？
                <Link 
                  to="/register" 
                  className="text-primary hover:underline ml-1"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;