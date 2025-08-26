// pages/videoList/videoList.js
import videoStorage from '../../utils/videoStorage';

const app = getApp();

Page({
  data: {
    videoList: [],
    loading: false, // 初始设为false，loadVideoList开始时再设为true
    hasMore: true,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0
  },

  // 加载视频列表
  loadVideoList() {
    this.setData({
      loading: true
    });

    try {
      // 获取所有视频数据
      const allVideos = videoStorage.getVideoList();
      
      // 执行分页处理
      const startIndex = (this.data.currentPage - 1) * this.data.pageSize;
      const endIndex = startIndex + this.data.pageSize;
      const paginatedVideos = allVideos.slice(startIndex, endIndex);

      // 为每个视频添加观看进度
      const videosWithProgress = paginatedVideos.map(video => {
        try {
          // 从本地存储获取观看进度
          const progressKey = `video_progress_${video.id}`;
          let savedProgress = wx.getStorageSync(progressKey);
          
          // 确保savedProgress是数字
          const numericProgress = typeof savedProgress === 'number' ? savedProgress : 0;
          
          // 计算进度百分比
          const durationSeconds = this.convertDurationToSeconds(video.duration);
          const progressValue = durationSeconds > 0 ? Math.floor((numericProgress / durationSeconds) * 100) : 0;
          
          // 确保进度值在有效范围内
          const progress = Math.max(0, Math.min(progressValue, 100));
          
          return {
            ...video,
            progress: progress, // 确保进度是有效的数字
            progressStyle: `width: ${progress}%` // 预格式化样式字符串
          };
        } catch (error) {
          console.warn('计算视频进度失败:', error);
          // 发生错误时默认进度为0
          return {
            ...video,
            progress: 0,
            progressStyle: 'width: 0%'
          };
        }
      });

      this.setData({
        videoList: this.data.currentPage === 1 ? videosWithProgress : [...this.data.videoList, ...videosWithProgress],
        totalCount: allVideos.length,
        loading: false,
        hasMore: paginatedVideos.length === this.data.pageSize && allVideos.length > endIndex
      });
    } catch (error) {
      console.error('加载视频列表失败:', error);
      wx.showToast({
        title: '视频列表加载失败',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        loading: false,
        hasMore: false
      });
    }
  },

  // 上拉加载更多
  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.loadVideoList();
    }
  },

  // 播放视频
  playVideo(e) {
    const { id } = e.currentTarget.dataset;
    
    try {
      // 先检查视频是否存在
      const video = videoStorage.getVideoById(id);
      if (!video) {
        throw new Error('视频不存在');
      }
      
      // 增加视频观看次数
      const incrementSuccess = videoStorage.incrementViewCount(id);
      if (!incrementSuccess) {
        console.warn('更新观看次数失败，但继续播放');
      }
      
      // 跳转到视频播放页面
      wx.navigateTo({
        url: `/pages/videoPlayer/videoPlayer?id=${id}`,
        fail: (err) => {
          console.error('跳转到视频播放页面失败:', err);
          wx.showToast({
            title: '播放失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    } catch (error) {
      console.error('播放视频失败:', error);
      wx.showToast({
        title: '播放失败: ' + (error.message || '未知错误'),
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 将时长字符串转换为秒数
  convertDurationToSeconds(duration) {
    try {
      const parts = duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0]);
        const seconds = parseInt(parts[1]);
        return minutes * 60 + seconds;
      }
    } catch (error) {
      console.warn('转换时长失败:', error);
    }
    return 0;
  },

  // 生命周期函数 - 监听页面加载
  onLoad() {
    this.loadVideoList();
  },

  // 生命周期函数 - 监听页面显示
  onShow() {
    // 每次页面显示时重新加载列表，确保数据是最新的
    // 这确保了管理员修改操作后用户能够动态获取最新视频数据
    if (this.data.videoList.length > 0) {
      // 重置页码，确保获取全部数据
      this.setData({
        currentPage: 1,
        hasMore: true
      });
      this.loadVideoList();
    } else {
      this.loadVideoList();
    }
  }
})