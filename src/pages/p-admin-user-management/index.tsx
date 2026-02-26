import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin' | 'superadmin',
    status: 'active' as 'active' | 'inactive' | 'banned'
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const mockUsers: User[] = [
      { id: '0', name: '超级管理员', email: 'superadmin@example.com', role: 'superadmin', status: 'active', createdAt: '2024-01-01', lastLogin: '2024-02-26 10:30' },
      { id: '1', name: '管理员', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15', lastLogin: '2024-02-26 09:45' },
      { id: '2', name: '普通用户', email: 'user@example.com', role: 'user', status: 'active', createdAt: '2024-02-01', lastLogin: '2024-02-25 18:20' },
      { id: '3', name: '张三', email: 'zhangsan@example.com', role: 'user', status: 'active', createdAt: '2024-02-05', lastLogin: '2024-02-24 14:15' },
      { id: '4', name: '李四', email: 'lisi@example.com', role: 'user', status: 'inactive', createdAt: '2024-02-10', lastLogin: '2024-02-20 11:30' },
      { id: '5', name: '王五', email: 'wangwu@example.com', role: 'user', status: 'active', createdAt: '2024-02-15', lastLogin: '2024-02-26 08:00' },
      { id: '6', name: '赵六', email: 'zhaoliu@example.com', role: 'user', status: 'banned', createdAt: '2024-02-18', lastLogin: '2024-02-22 16:45' },
    ];
    setUsers(mockUsers);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('确定要删除该用户吗？')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'banned') => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user', status: 'active' });
  };

  const handlePasswordReset = (user: User) => {
    setResettingUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('密码长度至少为6位');
      return;
    }
    alert(`用户 ${resettingUser?.name} 的密码已重置成功`);
    setShowPasswordModal(false);
    setResettingUser(null);
    setPasswordData({ newPassword: '', confirmPassword: '' });
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      superadmin: 'bg-purple-100 text-purple-700',
      admin: 'bg-blue-100 text-blue-700',
      user: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      superadmin: '超级管理员',
      admin: '管理员',
      user: '普通用户'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[role as keyof typeof badges]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-yellow-100 text-yellow-700',
      banned: 'bg-red-100 text-red-700'
    };
    const labels = {
      active: '正常',
      inactive: '未激活',
      banned: '已封禁'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <AdminLayout title="用户管理" breadcrumb="用户管理">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">用户管理</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>用户管理</span>
            </nav>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: '', email: '', role: 'user', status: 'active' });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>添加用户
          </button>
        </div>
      </div>

      <div className="bg-bg-primary rounded-xl shadow-card mb-6">
        <div className="p-4 border-b border-border-primary">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                <input
                  type="text"
                  placeholder="搜索用户名或邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有角色</option>
                <option value="superadmin">超级管理员</option>
                <option value="admin">管理员</option>
                <option value="user">普通用户</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有状态</option>
                <option value="active">正常</option>
                <option value="inactive">未激活</option>
                <option value="banned">已封禁</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border-primary">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">用户</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">角色</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">状态</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">注册时间</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">最后登录</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border-primary hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{user.name}</p>
                        <p className="text-sm text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{user.createdAt}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {user.role !== 'superadmin' && (
                        <>
                          <button
                            onClick={() => handlePasswordReset(user)}
                            className="p-2 text-warning hover:bg-yellow-50 rounded-lg transition-colors"
                            title="重置密码"
                          >
                            <i className="fas fa-key"></i>
                          </button>
                          {user.status === 'active' && (
                            <button
                              onClick={() => handleStatusChange(user.id, 'inactive')}
                              className="p-2 text-warning hover:bg-yellow-50 rounded-lg transition-colors"
                              title="禁用"
                            >
                              <i className="fas fa-ban"></i>
                            </button>
                          )}
                          {user.status !== 'active' && (
                            <button
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="p-2 text-success hover:bg-green-50 rounded-lg transition-colors"
                              title="启用"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                            title="删除"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border-primary flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            共 {filteredUsers.length} 个用户
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-xl shadow-card max-w-md w-full mx-4">
            <div className="p-6 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingUser ? '编辑用户' : '添加用户'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  用户名 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  邮箱 *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  角色 *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                  {currentUser?.role === 'superadmin' && <option value="superadmin">超级管理员</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  状态 *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">正常</option>
                  <option value="inactive">未激活</option>
                  <option value="banned">已封禁</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                >
                  {editingUser ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-xl shadow-card max-w-md w-full mx-4">
            <div className="p-6 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">
                重置密码 - {resettingUser?.name}
              </h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  新密码 *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入新密码（至少6位）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  确认密码 *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请再次输入新密码"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                >
                  确认重置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;