import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/home';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('请输入当前密码（初始密码为：123456）');
      return;
    }

    if (!newEmail) {
      setError('请输入新邮箱地址');
      return;
    }

    if (!newPassword) {
      setError('请输入新密码');
      return;
    }

    if (!confirmPassword) {
      setError('请确认新密码');
      return;
    }

    if (currentPassword !== '123456') {
      setError('当前密码错误，初始密码为：123456');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('新密码与确认密码不一致');
      return;
    }

    if (newPassword.length < 6) {
      setError('新密码长度至少为6位');
      return;
    }

    if (newEmail === user?.email && newPassword === '123456') {
      setError('请至少修改邮箱或密码');
      return;
    }

    try {
      setIsLoading(true);
      
      const updates: any = {
        isFirstLogin: false
      };

      if (newEmail !== user?.email) {
        updates.email = newEmail;
      }

      if (newPassword !== '123456') {
        updates.password = newPassword;
      }

      updateUser(updates);
      
      alert('密码修改成功！');
      navigate(from, { replace: true });
    } catch (err) {
      setError('修改失败，请稍后重试');
      console.error('修改密码错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-key text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">首次登录 - 修改密码</h2>
            <p className="text-text-secondary">
              为了账户安全，首次登录后请修改您的邮箱和密码
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
              <label htmlFor="currentPassword" className="block text-sm font-medium text-text-primary mb-2">
                当前密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="请输入当前密码（初始密码：123456）..."
                className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                required
              />
              <p className="text-xs text-text-secondary mt-1">
                初始密码为：123456
              </p>
            </div>

            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-text-primary mb-2">
                新邮箱地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="请输入新邮箱地址..."
                className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-text-primary mb-2">
                新密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码（至少6位）..."
                className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                确认新密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码..."
                className={`w-full px-4 py-3 border border-border-secondary rounded-lg ${styles.inputFocus}`}
                required
                minLength={6}
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
                  修改中...
                </>
              ) : (
                '确认修改'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            <p>
              修改密码后，请使用新邮箱和新密码登录系统
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;