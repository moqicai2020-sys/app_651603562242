import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  isFirstLogin?: boolean;
  avatar?: string;
}

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperadmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithThirdParty: (platform: 'wechat' | 'weibo' | 'qq', callback?: (success: boolean) => void) => Promise<boolean>;
  logout: (callback?: () => void) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === 'superadmin@example.com' && password === '123456') {
      const superadminUser: User = {
        id: '0',
        name: '超级管理员',
        email: 'superadmin@example.com',
        role: 'superadmin',
        isFirstLogin: true
      };
      setUser(superadminUser);
      localStorage.setItem('user', JSON.stringify(superadminUser));
      return true;
    } else if (email === 'admin@example.com' && password === '123456') {
      const adminUser: User = {
        id: '1',
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin',
        isFirstLogin: true
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    } else if (email === 'user@example.com' && password === '123456') {
      const regularUser: User = {
        id: '2',
        name: '普通用户',
        email: 'user@example.com',
        role: 'user',
        isFirstLogin: true
      };
      setUser(regularUser);
      localStorage.setItem('user', JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const logout = (callback?: () => void) => {
    setUser(null);
    localStorage.removeItem('user');
    if (callback) {
      callback();
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const getLoginConfig = (): LoginConfig => {
    try {
      const savedConfig = localStorage.getItem('loginConfig');
      if (savedConfig) {
        return JSON.parse(savedConfig);
      }
    } catch (error) {
      console.error('Failed to load login config:', error);
    }
    
    return {
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
    };
  };

  const loginWithThirdParty = async (platform: 'wechat' | 'weibo' | 'qq', callback?: (success: boolean) => void): Promise<boolean> => {
    const config = getLoginConfig();
    const platformConfig = config[platform];
    
    if (!platformConfig.enabled) {
      console.error(`${platform} login is not enabled`);
      if (callback) callback(false);
      return false;
    }
    
    if (!platformConfig.appId || !platformConfig.appSecret) {
      console.error(`${platform} login configuration is incomplete`);
      if (callback) callback(false);
      return false;
    }
    
    return new Promise((resolve) => {
      const sessionId = `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const qrData = JSON.stringify({
        platform: platform,
        sessionId: sessionId,
        timestamp: Date.now()
      });
      
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
      
      const authWindow = window.open('', '_blank', 'width=500,height=600');
      
      if (authWindow) {
        authWindow.document.write(`
          <html>
            <head>
              <title>第三方登录验证</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  padding: 20px;
                }
                .container {
                  background: white;
                  padding: 40px;
                  border-radius: 20px;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                  text-align: center;
                  max-width: 400px;
                  width: 100%;
                }
                .logo {
                  width: 80px;
                  height: 80px;
                  margin: 0 auto 20px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 32px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .wechat .logo {
                  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
                  color: white;
                }
                .weibo .logo {
                  background: linear-gradient(135deg, #e6162d 0%, #d41228 100%);
                  color: white;
                }
                .qq .logo {
                  background: linear-gradient(135deg, #12b7f5 0%, #0ea5e9 100%);
                  color: white;
                }
                h2 {
                  margin: 0 0 10px 0;
                  color: #333;
                  font-size: 24px;
                  font-weight: 600;
                }
                .subtitle {
                  color: #666;
                  margin: 0 0 30px 0;
                  font-size: 14px;
                  line-height: 1.5;
                }
                .qr-container {
                  position: relative;
                  display: inline-block;
                  margin-bottom: 20px;
                }
                .qr-code {
                  width: 200px;
                  height: 200px;
                  border: 2px solid #e0e0e0;
                  border-radius: 12px;
                  padding: 10px;
                  background: white;
                }
                .qr-overlay {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(255, 255, 255, 0.95);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  border-radius: 12px;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }
                .qr-overlay.show {
                  opacity: 1;
                }
                .qr-overlay i {
                  font-size: 48px;
                  margin-bottom: 10px;
                }
                .qr-overlay p {
                  color: #333;
                  font-size: 16px;
                  font-weight: 500;
                }
                .status {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 8px;
                  margin-bottom: 20px;
                  padding: 12px;
                  background: #f5f5f5;
                  border-radius: 8px;
                  font-size: 14px;
                  color: #666;
                }
                .status i {
                  color: #07c160;
                  animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
                .tips {
                  background: #f0f9ff;
                  border-left: 4px solid #0ea5e9;
                  padding: 12px;
                  margin-bottom: 20px;
                  text-align: left;
                  border-radius: 4px;
                }
                .tips h4 {
                  color: #0369a1;
                  margin: 0 0 8px 0;
                  font-size: 14px;
                  font-weight: 600;
                }
                .tips ul {
                  color: #555;
                  margin: 0;
                  padding-left: 20px;
                  font-size: 13px;
                  line-height: 1.6;
                }
                .tips li {
                  margin-bottom: 4px;
                }
                .button-group {
                  display: flex;
                  gap: 10px;
                  margin-top: 20px;
                }
                button {
                  flex: 1;
                  padding: 12px 20px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  border: none;
                  border-radius: 8px;
                  font-size: 14px;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  font-weight: 500;
                }
                button:hover {
                  opacity: 0.9;
                  transform: translateY(-1px);
                }
                button:active {
                  transform: translateY(0);
                }
                button.cancel {
                  background: #f5f5f5;
                  color: #333;
                }
                button.cancel:hover {
                  background: #e5e5e5;
                }
                button:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                  transform: none;
                }
              </style>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="${platform}">
              <div class="container">
                <div class="logo">
                  ${platform === 'wechat' ? '💬' : platform === 'weibo' ? '📱' : '🐧'}
                </div>
                <h2>${platform === 'wechat' ? '微信扫码登录' : platform === 'weibo' ? '微博扫码登录' : 'QQ扫码登录'}</h2>
                <p class="subtitle">
                  请使用${platform === 'wechat' ? '微信' : platform === 'weibo' ? '微博' : 'QQ'}扫描下方二维码完成登录
                </p>
                
                <div class="qr-container">
                  <img src="${qrApiUrl}" alt="扫码登录" class="qr-code" />
                  <div class="qr-overlay" id="qrOverlay">
                    <i class="fas fa-check-circle" style="color: #07c160;"></i>
                    <p>扫码成功</p>
                  </div>
                </div>
                
                <div class="status">
                  <i class="fas fa-circle-notch fa-spin"></i>
                  <span>等待扫码...</span>
                </div>
                
                <div class="tips">
                  <h4><i class="fas fa-lightbulb"></i> 扫码登录说明</h4>
                  <ul>
                    <li>打开${platform === 'wechat' ? '微信' : platform === 'weibo' ? '微博' : 'QQ'}App，使用"扫一扫"功能</li>
                    <li>扫描上方二维码，确认登录信息</li>
                    <li>在手机上确认授权后即可完成登录</li>
                    <li>二维码有效期为5分钟</li>
                  </ul>
                </div>
                
                <div class="button-group">
                  <button onclick="simulateScan()" id="scanButton">
                    <i class="fas fa-qrcode"></i> 模拟扫码
                  </button>
                  <button class="cancel" onclick="window.close()">
                    <i class="fas fa-times"></i> 取消
                  </button>
                </div>
              </div>
              
              <script>
                const sessionId = '${sessionId}';
                const platform = '${platform}';
                let isScanned = false;
                
                function simulateScan() {
                  if (isScanned) return;
                  
                  const overlay = document.getElementById('qrOverlay');
                  const status = document.querySelector('.status');
                  const button = document.getElementById('scanButton');
                  
                  overlay.classList.add('show');
                  status.innerHTML = '<i class="fas fa-check-circle"></i><span>扫码成功，请确认授权...</span>';
                  status.style.background = '#dcfce7';
                  status.style.color = '#166534';
                  button.disabled = true;
                  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
                  isScanned = true;
                  
                  setTimeout(() => {
                    status.innerHTML = '<i class="fas fa-check-circle"></i><span>授权成功！正在登录...</span>';
                    
                    setTimeout(() => {
                      window.opener.postMessage({ 
                        type: 'auth-success', 
                        platform: platform,
                        sessionId: sessionId 
                      }, '*');
                      window.close();
                    }, 1000);
                  }, 2000);
                }
                
                setTimeout(() => {
                  if (!window.closed && !isScanned) {
                    const status = document.querySelector('.status');
                    status.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>二维码已过期</span>';
                    status.style.background = '#fee2e2';
                    status.style.color = '#991b1b';
                    
                    const button = document.getElementById('scanButton');
                    button.innerHTML = '<i class="fas fa-redo"></i> 刷新二维码';
                    button.onclick = () => window.location.reload();
                  }
                }, 300000);
              </script>
            </body>
          </html>
        `);
      }
      
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === 'auth-success') {
          window.removeEventListener('message', messageHandler);
          
          let thirdPartyUser: User;
          switch (platform) {
            case 'wechat':
              thirdPartyUser = {
                id: '3',
                name: '微信用户',
                email: 'wechat@example.com',
                role: 'user',
                isFirstLogin: true
              };
              break;
            case 'weibo':
              thirdPartyUser = {
                id: '4',
                name: '微博用户',
                email: 'weibo@example.com',
                role: 'user',
                isFirstLogin: true
              };
              break;
            case 'qq':
              thirdPartyUser = {
                id: '5',
                name: 'QQ用户',
                email: 'qq@example.com',
                role: 'user',
                isFirstLogin: true
              };
              break;
            default:
              if (callback) callback(false);
              resolve(false);
              return;
          }
          
          setUser(thirdPartyUser);
          localStorage.setItem('user', JSON.stringify(thirdPartyUser));
          
          if (callback) callback(true);
          resolve(true);
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        if (callback) callback(false);
        resolve(false);
      }, 300000);
    });
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperadmin = user?.role === 'superadmin';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isSuperadmin, login, loginWithThirdParty, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};