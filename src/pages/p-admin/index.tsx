import React, { useState } from 'react';

import AdminLayout from '../../components/AdminLayout';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'articles' | 'comments' | 'images' | 'shortNotes' | 'shortVideos'>('overview');

  const tabs = [
    { id: 'overview' as const, label: '系统概览', icon: 'fa-tachometer-alt' },
    { id: 'users' as const, label: '用户统计', icon: 'fa-users' },
    { id: 'articles' as const, label: '文章统计', icon: 'fa-file-alt' },
    { id: 'comments' as const, label: '评论统计', icon: 'fa-comments' },
    { id: 'images' as const, label: '图片统计', icon: 'fa-images' },
    { id: 'shortNotes' as const, label: '短记统计', icon: 'fa-sticky-note' },
    { id: 'shortVideos' as const, label: '短视频统计', icon: 'fa-video' }
  ];

  return (
    <AdminLayout title="管理员仪表盘" breadcrumb="仪表盘">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">管理员仪表盘</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>仪表盘</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="bg-bg-primary rounded-xl shadow-card mb-6">
        <div className="border-b border-border-primary">
          <nav className="flex space-x-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">总用户数</p>
                      <p className="text-3xl font-bold text-text-primary">128</p>
                      <p className="text-sm text-success mt-1">
                        <i className="fas fa-arrow-up"></i> +8 本月
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-users text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">总文章数</p>
                      <p className="text-3xl font-bold text-text-primary">256</p>
                      <p className="text-sm text-success mt-1">
                        <i className="fas fa-arrow-up"></i> +24 本月
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-file-alt text-secondary text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">总阅读量</p>
                      <p className="text-3xl font-bold text-text-primary">12,458</p>
                      <p className="text-sm text-success mt-1">
                        <i className="fas fa-arrow-up"></i> +1,234 本月
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-eye text-tertiary text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">附件下载量</p>
                      <p className="text-3xl font-bold text-text-primary">3,892</p>
                      <p className="text-sm text-success mt-1">
                        <i className="fas fa-arrow-up"></i> +456 本月
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-download text-success text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h4 className="text-base font-medium text-text-primary mb-4">用户增长趋势（近7天）</h4>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {[
                      { day: '周一', value: 5 },
                      { day: '周二', value: 8 },
                      { day: '周三', value: 12 },
                      { day: '周四', value: 7 },
                      { day: '周五', value: 15 },
                      { day: '周六', value: 20 },
                      { day: '周日', value: 18 }
                    ].map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${(item.value / 20) * 100}%` }}
                          title={`${item.value} 位新用户`}
                        ></div>
                        <span className="text-xs text-text-secondary mt-2">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-card">
                  <h4 className="text-base font-medium text-text-primary mb-4">阅读量趋势（近7天）</h4>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {[
                      { day: '周一', value: 120 },
                      { day: '周二', value: 156 },
                      { day: '周三', value: 189 },
                      { day: '周四', value: 145 },
                      { day: '周五', value: 234 },
                      { day: '周六', value: 287 },
                      { day: '周日', value: 312 }
                    ].map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-secondary rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                          style={{ height: `${(item.value / 312) * 100}%` }}
                          title={`${item.value} 次阅读`}
                        ></div>
                        <span className="text-xs text-text-secondary mt-2">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserStatistics />
          )}

          {activeTab === 'articles' && (
            <ArticleStatistics />
          )}

          {activeTab === 'comments' && (
            <CommentStatistics />
          )}

          {activeTab === 'images' && (
            <ImageStatistics />
          )}

          {activeTab === 'shortNotes' && (
            <ShortNoteStatistics />
          )}

          {activeTab === 'shortVideos' && (
            <ShortVideoStatistics />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const UserStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">用户地区分布</h4>
          <div className="space-y-3">
            {[
              { region: '北京', count: 45, percentage: 35 },
              { region: '上海', count: 32, percentage: 25 },
              { region: '广东', count: 26, percentage: 20 },
              { region: '浙江', count: 16, percentage: 12 },
              { region: '其他', count: 9, percentage: 8 }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="w-16 text-sm text-text-secondary">{item.region}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-primary h-4 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="w-20 text-sm font-medium text-text-primary text-right">{item.count}人 ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">用户人群画像</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-2">年龄分布</p>
              <div className="space-y-2">
                {[
                  { range: '18-24岁', percentage: 28 },
                  { range: '25-34岁', percentage: 35 },
                  { range: '35-44岁', percentage: 22 },
                  { range: '45岁以上', percentage: 15 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-20 text-xs text-text-secondary">{item.range}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-secondary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-xs font-medium text-text-primary text-right">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-2">职业分布</p>
              <div className="space-y-2">
                {[
                  { job: '开发者', percentage: 32 },
                  { job: '设计师', percentage: 24 },
                  { job: '产品经理', percentage: 18 },
                  { job: '学生', percentage: 15 },
                  { job: '其他', percentage: 11 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-16 text-xs text-text-secondary">{item.job}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-tertiary h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-xs font-medium text-text-primary text-right">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <h4 className="text-base font-medium text-text-primary mb-4">用户增长趋势（近7天）</h4>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[
            { day: '周一', value: 5 },
            { day: '周二', value: 8 },
            { day: '周三', value: 12 },
            { day: '周四', value: 7 },
            { day: '周五', value: 15 },
            { day: '周六', value: 20 },
            { day: '周日', value: 18 }
          ].map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(item.value / 20) * 100}%` }}
                title={`${item.value} 位新用户`}
              ></div>
              <span className="text-xs text-text-secondary mt-2">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <h4 className="text-base font-medium text-text-primary mb-4">活跃用户排行 TOP20</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border-primary">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">排名</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">用户</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">发布文章</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">发布短记</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">发布短视频</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">活跃度</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, i) => (
                <tr key={i} className="border-b border-border-primary hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < 3 ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <img src="https://s.coze.cn/image/3VpJhTJsCWE/" alt="用户头像" className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-text-primary">用户{i + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 50) + 10}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 100) + 20}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 30) + 5}</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ArticleStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总阅读量</p>
              <p className="text-3xl font-bold text-text-primary">45,678</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +12.5%
              </p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-eye text-primary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总转发量</p>
              <p className="text-3xl font-bold text-text-primary">3,456</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +8.3%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-share text-secondary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总下载量</p>
              <p className="text-3xl font-bold text-text-primary">1,234</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +15.2%
              </p>
            </div>
            <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-download text-tertiary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">认证文章</p>
              <p className="text-3xl font-bold text-text-primary">189</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +5.7%
              </p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-success text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">阅读量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 1200 },
              { day: '周二', value: 1560 },
              { day: '周三', value: 1890 },
              { day: '周四', value: 1450 },
              { day: '周五', value: 2340 },
              { day: '周六', value: 2870 },
              { day: '周日', value: 3120 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(item.value / 3120) * 100}%` }}
                  title={`${item.value} 次阅读`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">转发量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 120 },
              { day: '周二', value: 156 },
              { day: '周三', value: 189 },
              { day: '周四', value: 145 },
              { day: '周五', value: 234 },
              { day: '周六', value: 287 },
              { day: '周日', value: 312 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-secondary rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                  style={{ height: `${(item.value / 312) * 100}%` }}
                  title={`${item.value} 次转发`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <h4 className="text-base font-medium text-text-primary mb-4">热门文章排行 TOP20</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border-primary">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">排名</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">文章标题</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">作者</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">阅读量</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">转发量</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">下载量</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">认证状态</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, i) => (
                <tr key={i} className="border-b border-border-primary hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < 3 ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-primary truncate block max-w-xs">热门文章标题{i + 1}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <img src="https://s.coze.cn/image/3VpJhTJsCWE/" alt="作者头像" className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-text-primary">作者{i + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 5000) + 1000}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 500) + 100}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 200) + 50}</td>
                  <td className="py-3 px-4">
                    {Math.random() > 0.3 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success bg-opacity-10 text-success">
                        <i className="fas fa-check-circle mr-1"></i>已认证
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        未认证
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CommentStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总评论数</p>
              <p className="text-3xl font-bold text-text-primary">8,945</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +18.7%
              </p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-comments text-primary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">今日评论</p>
              <p className="text-3xl font-bold text-text-primary">234</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +12.3%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-calendar-day text-secondary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">平均评论/文章</p>
              <p className="text-3xl font-bold text-text-primary">34.9</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +5.2%
              </p>
            </div>
            <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-tertiary text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">评论量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 890 },
              { day: '周二', value: 1120 },
              { day: '周三', value: 1340 },
              { day: '周四', value: 980 },
              { day: '周五', value: 1560 },
              { day: '周六', value: 1890 },
              { day: '周日', value: 1165 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(item.value / 1890) * 100}%` }}
                  title={`${item.value} 条评论`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">评论量最高文章 TOP20</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border-primary rounded-lg hover:border-primary transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium truncate">热门文章标题{i + 1}</p>
                  <p className="text-xs text-text-secondary">作者{i + 1}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-primary">{Math.floor(Math.random() * 500) + 100}</p>
                  <p className="text-xs text-text-secondary">条评论</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总阅读量</p>
              <p className="text-3xl font-bold text-text-primary">23,456</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +15.8%
              </p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-eye text-primary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总转发量</p>
              <p className="text-3xl font-bold text-text-primary">2,345</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +10.2%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-share text-secondary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总下载量</p>
              <p className="text-3xl font-bold text-text-primary">1,567</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +8.9%
              </p>
            </div>
            <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-download text-tertiary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总评论数</p>
              <p className="text-3xl font-bold text-text-primary">4,567</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +12.4%
              </p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-comment text-success text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">阅读量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 2100 },
              { day: '周二', value: 2560 },
              { day: '周三', value: 2890 },
              { day: '周四', value: 2450 },
              { day: '周五', value: 3340 },
              { day: '周六', value: 3870 },
              { day: '周日', value: 3120 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(item.value / 3870) * 100}%` }}
                  title={`${item.value} 次阅读`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">转发量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 210 },
              { day: '周二', value: 256 },
              { day: '周三', value: 289 },
              { day: '周四', value: 245 },
              { day: '周五', value: 334 },
              { day: '周六', value: 387 },
              { day: '周日', value: 312 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-secondary rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                  style={{ height: `${(item.value / 387) * 100}%` }}
                  title={`${item.value} 次转发`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <h4 className="text-base font-medium text-text-primary mb-4">热门图片排行 TOP20</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="border border-border-primary rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={`https://images.unsplash.com/photo-${1500000000 + i}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`} alt={`热门图片${i + 1}`} className="w-full h-32 object-cover" />
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  #{i + 1}
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                  <span><i className="fas fa-eye mr-1"></i>{Math.floor(Math.random() * 5000) + 1000}</span>
                  <span><i className="fas fa-share mr-1"></i>{Math.floor(Math.random() * 500) + 100}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span><i className="fas fa-download mr-1"></i>{Math.floor(Math.random() * 200) + 50}</span>
                  <span><i className="fas fa-comment mr-1"></i>{Math.floor(Math.random() * 100) + 20}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ShortNoteStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总阅读量</p>
              <p className="text-3xl font-bold text-text-primary">15,678</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +22.5%
              </p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-eye text-primary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总转发量</p>
              <p className="text-3xl font-bold text-text-primary">1,890</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +18.3%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-share text-secondary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总下载量</p>
              <p className="text-3xl font-bold text-text-primary">890</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +14.7%
              </p>
            </div>
            <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-download text-tertiary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">认证短记</p>
              <p className="text-3xl font-bold text-text-primary">156</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +9.8%
              </p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-success text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">阅读量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 1200 },
              { day: '周二', value: 1560 },
              { day: '周三', value: 1890 },
              { day: '周四', value: 1450 },
              { day: '周五', value: 2340 },
              { day: '周六', value: 2870 },
              { day: '周日', value: 3120 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(item.value / 3120) * 100}%` }}
                  title={`${item.value} 次阅读`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">转发量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 120 },
              { day: '周二', value: 156 },
              { day: '周三', value: 189 },
              { day: '周四', value: 145 },
              { day: '周五', value: 234 },
              { day: '周六', value: 287 },
              { day: '周日', value: 312 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-secondary rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                  style={{ height: `${(item.value / 312) * 100}%` }}
                  title={`${item.value} 次转发`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <h4 className="text-base font-medium text-text-primary mb-4">热门短记排行 TOP20</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border-primary">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">排名</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">短记标题</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">作者</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">阅读量</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">转发量</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">下载量</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">认证状态</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, i) => (
                <tr key={i} className="border-b border-border-primary hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < 3 ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-primary truncate block max-w-xs">热门短记标题{i + 1}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <img src="https://s.coze.cn/image/3VpJhTJsCWE/" alt="作者头像" className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-text-primary">作者{i + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 5000) + 1000}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 500) + 100}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{Math.floor(Math.random() * 200) + 50}</td>
                  <td className="py-3 px-4">
                    {Math.random() > 0.3 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success bg-opacity-10 text-success">
                        <i className="fas fa-check-circle mr-1"></i>已认证
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        未认证
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ShortVideoStatistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总阅读量</p>
              <p className="text-3xl font-bold text-text-primary">28,456</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +25.8%
              </p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-eye text-primary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总转发量</p>
              <p className="text-3xl font-bold text-text-primary">2,890</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +20.3%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-share text-secondary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">总下载量</p>
              <p className="text-3xl font-bold text-text-primary">1,234</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +16.7%
              </p>
            </div>
            <div className="w-12 h-12 bg-tertiary bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-download text-tertiary text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">认证视频</p>
              <p className="text-3xl font-bold text-text-primary">134</p>
              <p className="text-sm text-success mt-1">
                <i className="fas fa-arrow-up"></i> +11.2%
              </p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-success text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">阅读量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 2100 },
              { day: '周二', value: 2560 },
              { day: '周三', value: 2890 },
              { day: '周四', value: 2450 },
              { day: '周五', value: 3340 },
              { day: '周六', value: 3870 },
              { day: '周日', value: 3120 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(item.value / 3870) * 100}%` }}
                  title={`${item.value} 次阅读`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h4 className="text-base font-medium text-text-primary mb-4">转发量趋势（近7天）</h4>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[
              { day: '周一', value: 210 },
              { day: '周二', value: 256 },
              { day: '周三', value: 289 },
              { day: '周四', value: 245 },
              { day: '周五', value: 334 },
              { day: '周六', value: 387 },
              { day: '周日', value: 312 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-secondary rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                  style={{ height: `${(item.value / 387) * 100}%` }}
                  title={`${item.value} 次转发`}
                ></div>
                <span className="text-xs text-text-secondary mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <h4 className="text-base font-medium text-text-primary mb-4">热门短视频排行 TOP20</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="border border-border-primary rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={`https://images.unsplash.com/photo-${1500000000 + i + 100}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`} alt={`热门短视频${i + 1}`} className="w-full h-32 object-cover" />
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  #{i + 1}
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(Math.random() * 20) + 5}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                  <span><i className="fas fa-eye mr-1"></i>{Math.floor(Math.random() * 5000) + 1000}</span>
                  <span><i className="fas fa-share mr-1"></i>{Math.floor(Math.random() * 500) + 100}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span><i className="fas fa-download mr-1"></i>{Math.floor(Math.random() * 200) + 50}</span>
                  <span><i className="fas fa-check-circle mr-1"></i>{Math.random() > 0.3 ? '已认证' : '未认证'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;