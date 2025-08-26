// 模拟视频数据存储管理

// 存储键名常量
export const STORAGE_KEY = 'videoData';

// 初始化视频存储（创建空数组而非模拟数据）
export const initVideoStorage = () => {
  try {
    const storedVideos = wx.getStorageSync(STORAGE_KEY);
    if (!storedVideos) {
      // 初始化空的视频数据数组，不包含任何模拟数据
      wx.setStorageSync(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return typeof storedVideos === 'object' ? storedVideos : JSON.parse(storedVideos);
  } catch (error) {
    console.error('初始化视频存储失败:', error);
    return [];
  }
};

// 获取视频列表
export const getVideoList = () => {
  try {
    const videos = wx.getStorageSync(STORAGE_KEY);
    if (!videos) {
      return initVideoStorage();
    }
    // 检查数据类型，如果是对象则直接返回，如果是字符串则解析
    if (typeof videos === 'object') {
      return videos;
    }
    return JSON.parse(videos);
  } catch (error) {
    console.error('获取视频列表失败:', error);
    return [];
  }
};

// 保存视频列表到本地存储
export const saveVideoList = (videos) => {
  try {
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(videos));
    return true;
  } catch (error) {
    console.error('保存视频列表失败:', error);
    return false;
  }
};

// 根据ID获取视频
export const getVideoById = (id) => {
  try {
    const videos = getVideoList();
    return videos.find(video => video.id === id) || null;
  } catch (error) {
    console.error(`根据ID获取视频失败(ID: ${id}):`, error);
    return null;
  }
};

// 添加视频
export const addVideo = (videoInfo) => {
  try {
    const videos = getVideoList();
    const newVideo = {
      id: Date.now().toString(), // 使用时间戳作为唯一ID
      ...videoInfo,
      viewCount: 0,
      uploadTime: new Date().toISOString()
    };
    
    // 验证视频信息
    if (!newVideo.title || !newVideo.src) {
      throw new Error('视频标题和视频源是必需的');
    }
    
    videos.push(newVideo);
    saveVideoList(videos);
    return newVideo;
  } catch (error) {
    console.error('添加视频失败:', error);
    throw error;
  }
};

// 更新视频
export const updateVideo = (id, videoInfo) => {
  try {
    const videos = getVideoList();
    const index = videos.findIndex(video => video.id === id);
    if (index !== -1) {
      videos[index] = { ...videos[index], ...videoInfo };
      saveVideoList(videos);
      return videos[index];
    }
    return null;
  } catch (error) {
    console.error(`更新视频失败(ID: ${id}):`, error);
    return null;
  }
};

// 删除视频
export const deleteVideo = (id) => {
  try {
    const videos = getVideoList();
    const filteredVideos = videos.filter(video => video.id !== id);
    return saveVideoList(filteredVideos);
  } catch (error) {
    console.error(`删除视频失败(ID: ${id}):`, error);
    return false;
  }
};

// 增加视频观看次数
export const incrementViewCount = (id) => {
  try {
    const videos = getVideoList();
    const index = videos.findIndex(video => video.id === id);
    if (index !== -1) {
      videos[index].viewCount = (videos[index].viewCount || 0) + 1;
      saveVideoList(videos);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`增加视频观看次数失败(ID: ${id}):`, error);
    return false;
  }
};

// 搜索视频
export const searchVideos = (keyword) => {
  try {
    const videos = getVideoList();
    if (!keyword || keyword.trim() === '') {
      return videos;
    }
    const lowerKeyword = keyword.toLowerCase().trim();
    return videos.filter(video => 
      video.title.toLowerCase().includes(lowerKeyword)
    );
  } catch (error) {
    console.error('搜索视频失败:', error);
    return [];
  }
};

// 导出默认模块
export default {
  getVideoList,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
  incrementViewCount,
  searchVideos,
  saveVideoList,
  initVideoStorage,
  STORAGE_KEY
};