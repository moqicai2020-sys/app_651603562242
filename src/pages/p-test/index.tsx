import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">测试页面</h1>
        <p className="text-gray-600 mb-6">这是一个简单的测试页面，用于验证 Vite 开发服务器是否正常工作。</p>
        <div className="flex space-x-4">
          <a href="/public-home" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            公共首页
          </a>
          <a href="/home" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            登录首页
          </a>
          <a href="/photo-blog" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            图片博客
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;