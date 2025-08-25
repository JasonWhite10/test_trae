// pages/videoPlayer/videoPlayer.js
Page({
  data: {
    videoId: '',
    videoInfo: null,
    currentTime: 0,
    duration: 0,
    progress: 0,
    isPlaying: false,
    videoError: false,
    errorMsg: ''
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!getApp().globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }

    if (options.id) {
      this.setData({
        videoId: options.id
      });
      this.getVideoInfo();
    }
  },

  getVideoInfo: function() {
    // 这里应该调用后端API获取视频信息
    // 为了模拟，我们使用静态数据
    const videoId = this.data.videoId;
    const videoInfo = {
      id: videoId,
      title: '航海安全知识 ' + videoId,
      src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnail: 'https://via.placeholder.com/300x200?text=Video+' + videoId
    };

    // 检查本地存储的观看进度
    const progressKey = 'video_progress_' + videoId;
    const savedProgress = wx.getStorageSync(progressKey);
    if (savedProgress) {
      this.setData({
        currentTime: savedProgress
      });
    }

    this.setData({
      videoInfo: videoInfo
    });
  },

  onReady: function() {
    // 创建视频上下文
    this.videoContext = wx.createVideoContext('myVideo');

    // 如果有保存的进度，跳转到该位置
    if (this.data.currentTime > 0) {
      this.videoContext.seek(this.data.currentTime);
    }

    // 开始播放
    this.videoContext.play();
    this.setData({
      isPlaying: true
    });
  },

  onTimeUpdate: function(e) {
    const currentTime = e.detail.currentTime;
    const duration = e.detail.duration;
    const progress = Math.floor((currentTime / duration) * 100);

    this.setData({
      currentTime: currentTime,
      duration: duration,
      progress: progress
    });

    // 每隔30秒保存一次进度
    if (Math.floor(currentTime) % 30 === 0 && currentTime > 0) {
      const progressKey = 'video_progress_' + this.data.videoId;
      wx.setStorageSync(progressKey, currentTime);
    }
  },

  onEnded: function() {
    // 视频播放结束，保存进度为100%
    const progressKey = 'video_progress_' + this.data.videoId;
    wx.setStorageSync(progressKey, this.data.duration);

    this.setData({
      progress: 100,
      isPlaying: false
    });
  },

  onError: function(e) {
    console.error('视频播放错误:', e);
    this.setData({
      videoError: true,
      errorMsg: '视频播放失败，请稍后重试'
    });
  },

  togglePlay: function() {
    if (this.data.isPlaying) {
      this.videoContext.pause();
    } else {
      this.videoContext.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    });
  },

  onUnload: function() {
    // 离开页面时保存进度
    const progressKey = 'video_progress_' + this.data.videoId;
    wx.setStorageSync(progressKey, this.data.currentTime);
  },

  formatTime: function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return (minutes < 10 ? '0' + minutes : minutes) + ':' + (remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);
  }
})