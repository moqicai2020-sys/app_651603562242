import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AdminLayout from '../../components/AdminLayout';

interface Image {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  author: string;
  authorId: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  likes: number;
  comments: number;
  size: string;
  dimensions: string;
  createdAt: string;
  description?: string;
}

const ImageManagement: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    const mockImages: Image[] = [
      { id: 'img1', title: '城市夜景', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800', thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400', author: '謩子', authorId: '2', category: '风景', status: 'published', views: 256, likes: 45, comments: 12, size: '2.3 MB', dimensions: '1920x1080', createdAt: '2024-02-25', description: '美丽的城市夜景，拍摄于上海外滩' },
      { id: 'img2', title: '自然风光', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', author: '李四', authorId: '3', category: '风景', status: 'published', views: 189, likes: 32, comments: 8, size: '1.8 MB', dimensions: '1920x1080', createdAt: '2024-02-24', description: '清晨的自然风光，空气清新' },
      { id: 'img3', title: '人物肖像', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', author: '王五', authorId: '4', category: '人像', status: 'published', views: 145, likes: 28, comments: 5, size: '2.1 MB', dimensions: '1080x1920', createdAt: '2024-02-23' },
      { id: 'img4', title: '建筑摄影', url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800', thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400', author: '赵六', authorId: '5', category: '建筑', status: 'draft', views: 0, likes: 0, comments: 0, size: '3.2 MB', dimensions: '1920x1080', createdAt: '2024-02-22' },
      { id: 'img5', title: '美食摄影', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', author: '钱七', authorId: '6', category: '美食', status: 'published', views: 98, likes: 15, comments: 3, size: '1.5 MB', dimensions: '1080x1080', createdAt: '2024-02-21' },
      { id: 'img6', title: '动物摄影', url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800', thumbnail: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400', author: '謩子', authorId: '2', category: '动物', status: 'published', views: 234, likes: 56, comments: 18, size: '2.8 MB', dimensions: '1920x1080', createdAt: '2024-02-20' },
      { id: 'img7', title: '旅行摄影', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400', author: '李四', authorId: '3', category: '旅行', status: 'published', views: 167, likes: 38, comments: 10, size: '2.0 MB', dimensions: '1920x1080', createdAt: '2024-02-19' },
      { id: 'img8', title: '静物摄影', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800', thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', author: '王五', authorId: '4', category: '静物', status: 'archived', views: 76, likes: 12, comments: 2, size: '1.2 MB', dimensions: '1080x1080', createdAt: '2024-02-18' },
    ];
    setImages(mockImages);
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || image.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (imageId: string) => {
    if (window.confirm('确定要删除该图片吗？此操作不可恢复。')) {
      setImages(images.filter(i => i.id !== imageId));
    }
  };

  const handleBatchDelete = () => {
    if (selectedImages.length === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedImages.length} 张图片吗？此操作不可恢复。`)) {
      setImages(images.filter(i => !selectedImages.includes(i.id)));
      setSelectedImages([]);
    }
  };

  const handleStatusChange = (imageId: string, newStatus: 'published' | 'draft' | 'archived') => {
    setImages(images.map(i => i.id === imageId ? { ...i, status: newStatus } : i));
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(i => i.id));
    }
  };

  const handleSelectImage = (imageId: string) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter(id => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  const handleViewDetail = (image: Image) => {
    setSelectedImage(image);
    setShowDetailModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newImages: Image[] = uploadFiles.map((file, index) => ({
      id: Date.now().toString() + index,
      title: file.name.split('.')[0],
      url: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      author: '管理员',
      authorId: '1',
      category: '未分类',
      status: 'draft' as const,
      views: 0,
      likes: 0,
      comments: 0,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      dimensions: '未知',
      createdAt: new Date().toISOString().split('T')[0]
    }));
    setImages([...newImages, ...images]);
    setShowUploadModal(false);
    setUploadFiles([]);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      archived: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      published: '已发布',
      draft: '草稿',
      archived: '已归档'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const categories = Array.from(new Set(images.map(i => i.category)));

  return (
    <AdminLayout title="图片管理" breadcrumb="图片管理">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">图片管理</h2>
            <nav className="text-sm text-text-secondary">
              <span>管理员后台</span> / <span>图片管理</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i className="fas fa-upload mr-2"></i>上传图片
            </button>
          </div>
        </div>
      </div>

      <div className="bg-bg-primary rounded-xl shadow-card mb-6">
        <div className="p-4 border-b border-border-primary">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                  <input
                    type="text"
                    placeholder="搜索图片标题或作者..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">所有状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="archived">已归档</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        {selectedImages.length > 0 && (
          <div className="px-4 py-3 bg-blue-50 border-b border-border-primary flex items-center justify-between">
            <span className="text-sm text-primary">
              已选择 {selectedImages.length} 张图片
            </span>
            <button
              onClick={handleBatchDelete}
              className="px-3 py-1 bg-danger text-white rounded-lg text-sm hover:bg-red-600"
            >
              <i className="fas fa-trash mr-1"></i>批量删除
            </button>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="border border-border-primary rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-square">
                  <img src={image.thumbnail} alt={image.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleViewDetail(image)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors mr-2"
                    >
                      <i className="fas fa-eye text-gray-700"></i>
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => handleSelectImage(image.id)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(image.status)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-text-primary font-medium text-sm mb-1 truncate">{image.title}</h3>
                  <p className="text-xs text-text-secondary mb-2">{image.category}</p>
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span><i className="fas fa-user mr-1"></i>{image.author}</span>
                    <span><i className="fas fa-eye mr-1"></i>{image.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border-primary">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm w-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">图片</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">作者</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">分类</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">状态</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">尺寸</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">大小</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">浏览</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">点赞</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">评论</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">上传时间</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredImages.map((image) => (
                  <tr key={image.id} className="border-b border-border-primary hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => handleSelectImage(image.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={image.thumbnail} alt="" className="w-16 h-16 object-cover rounded" />
                        <div className="max-w-xs">
                          <p className="text-text-primary font-medium truncate">{image.title}</p>
                          <p className="text-xs text-text-secondary">ID: {image.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{image.author}</td>
                    <td className="py-3 px-4 text-text-secondary">{image.category}</td>
                    <td className="py-3 px-4">{getStatusBadge(image.status)}</td>
                    <td className="py-3 px-4 text-text-secondary">{image.dimensions}</td>
                    <td className="py-3 px-4 text-text-secondary">{image.size}</td>
                    <td className="py-3 px-4 text-text-secondary">{image.views}</td>
                    <td className="py-3 px-4 text-text-secondary">{image.likes}</td>
                    <td className="py-3 px-4 text-text-secondary">{image.comments}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{image.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewDetail(image)}
                          className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                          title="查看"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleStatusChange(image.id, image.status === 'published' ? 'draft' : 'published')}
                          className={`p-2 ${image.status === 'published' ? 'text-warning' : 'text-success'} hover:bg-gray-50 rounded-lg transition-colors`}
                          title={image.status === 'published' ? '下架' : '发布'}
                        >
                          <i className={`fas ${image.status === 'published' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border-primary flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            共 {filteredImages.length} 张图片
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-border-primary rounded-lg text-sm text-text-secondary hover:bg-gray-50">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-xl shadow-card max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">上传图片</h3>
            </div>
            <form onSubmit={handleUpload} className="p-6">
              <div className="border-2 border-dashed border-border-primary rounded-lg p-8 text-center mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                  <p className="text-text-primary font-medium mb-2">点击或拖拽上传图片</p>
                  <p className="text-sm text-text-secondary">支持 JPG、PNG、GIF 等格式</p>
                </label>
              </div>
              {uploadFiles.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-text-primary mb-2">已选择 {uploadFiles.length} 个文件：</p>
                  <div className="space-y-2">
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-text-secondary truncate">{file.name}</span>
                        <span className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles([]);
                  }}
                  className="px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={uploadFiles.length === 0}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-upload mr-2"></i>开始上传
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bg-primary rounded-xl shadow-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">图片详情</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedImage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <i className="fas fa-times text-text-secondary"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img src={selectedImage.url} alt={selectedImage.title} className="w-full rounded-lg" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-text-primary mb-4">{selectedImage.title}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">作者</span>
                      <span className="text-text-primary font-medium">{selectedImage.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">分类</span>
                      <span className="text-text-primary">{selectedImage.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">状态</span>
                      {getStatusBadge(selectedImage.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">尺寸</span>
                      <span className="text-text-primary">{selectedImage.dimensions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">大小</span>
                      <span className="text-text-primary">{selectedImage.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">浏览量</span>
                      <span className="text-text-primary">{selectedImage.views}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">点赞数</span>
                      <span className="text-text-primary">{selectedImage.likes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">评论数</span>
                      <span className="text-text-primary">{selectedImage.comments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">上传时间</span>
                      <span className="text-text-primary">{selectedImage.createdAt}</span>
                    </div>
                    {selectedImage.description && (
                      <div className="pt-3 border-t border-border-primary">
                        <span className="text-text-secondary block mb-2">描述</span>
                        <p className="text-text-primary">{selectedImage.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Link
                      to={`/image-detail?id=${selectedImage.id}`}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 text-center"
                    >
                      <i className="fas fa-external-link-alt mr-2"></i>查看详情页
                    </Link>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleDelete(selectedImage.id);
                      }}
                      className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600"
                    >
                      <i className="fas fa-trash mr-2"></i>删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ImageManagement;