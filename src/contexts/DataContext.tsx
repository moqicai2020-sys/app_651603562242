import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Comment {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

interface Like {
  id: string;
  itemId: string;
  userId: string;
  createdAt: string;
}

interface ItemStats {
  id: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
}

interface DataContextType {
  comments: Comment[];
  likes: Like[];
  itemStats: Record<string, ItemStats>;
  addComment: (itemId: string, content: string, userId: string, userName: string, userAvatar: string) => void;
  deleteComment: (commentId: string) => void;
  addLike: (itemId: string, userId: string) => void;
  removeLike: (itemId: string, userId: string) => void;
  hasLiked: (itemId: string, userId: string) => boolean;
  incrementView: (itemId: string) => void;
  getItemStats: (itemId: string) => ItemStats;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [itemStats, setItemStats] = useState<Record<string, ItemStats>>({});

  useEffect(() => {
    // 清除旧的文章相关数据
    localStorage.removeItem('comments');
    localStorage.removeItem('likes');
    localStorage.removeItem('articleStats');
    
    // 初始化空数据
    setComments([]);
    setLikes([]);
    setItemStats({});
  }, []);

  const addComment = (itemId: string, content: string, userId: string, userName: string, userAvatar: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      itemId,
      userId,
      userName,
      userAvatar,
      content,
      createdAt: new Date().toLocaleString('zh-CN'),
      likes: 0,
      replies: []
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    const updatedStats = {
      ...itemStats,
      [itemId]: {
        ...itemStats[itemId],
        comments: (itemStats[itemId]?.comments || 0) + 1
      }
    };
    setItemStats(updatedStats);
  };

  const deleteComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);

    const updatedStats = {
      ...itemStats,
      [comment.itemId]: {
        ...itemStats[comment.itemId],
        comments: Math.max(0, (itemStats[comment.itemId]?.comments || 0) - 1)
      }
    };
    setItemStats(updatedStats);
  };

  const addLike = (itemId: string, userId: string) => {
    const newLike: Like = {
      id: Date.now().toString(),
      itemId,
      userId,
      createdAt: new Date().toLocaleString('zh-CN')
    };
    const updatedLikes = [...likes, newLike];
    setLikes(updatedLikes);

    const updatedStats = {
      ...itemStats,
      [itemId]: {
        ...itemStats[itemId],
        likes: (itemStats[itemId]?.likes || 0) + 1
      }
    };
    setItemStats(updatedStats);
  };

  const removeLike = (itemId: string, userId: string) => {
    const updatedLikes = likes.filter(l => !(l.itemId === itemId && l.userId === userId));
    setLikes(updatedLikes);

    const updatedStats = {
      ...itemStats,
      [itemId]: {
        ...itemStats[itemId],
        likes: Math.max(0, (itemStats[itemId]?.likes || 0) - 1)
      }
    };
    setItemStats(updatedStats);
  };

  const hasLiked = (itemId: string, userId: string): boolean => {
    return likes.some(l => l.itemId === itemId && l.userId === userId);
  };

  const incrementView = (itemId: string) => {
    const updatedStats = {
      ...itemStats,
      [itemId]: {
        ...itemStats[itemId],
        views: (itemStats[itemId]?.views || 0) + 1
      }
    };
    setItemStats(updatedStats);
  };

  const getItemStats = (itemId: string): ItemStats => {
    return itemStats[itemId] || { id: itemId, likes: 0, comments: 0, views: 0, shares: 0 };
  };

  return (
    <DataContext.Provider
      value={{
        comments,
        likes,
        itemStats,
        addComment,
        deleteComment,
        addLike,
        removeLike,
        hasLiked,
        incrementView,
        getItemStats
      }}
    >
      {children}
    </DataContext.Provider>
  );
};