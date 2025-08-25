// pages/videoList/videoList.js
Page({
  data: {
    videoList: [],
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!getApp().checkLoginStatus()) {
      return;
    }

    // 模拟视频数据
    this.generateVideoList();
  },

  generateVideoList: function() {
    // 模拟5个视频
    let videos = [];
    for (let i = 1; i <= 5; i++) {
      // 模拟随机观看进度
      const progress = Math.floor(Math.random() * 100);
      videos.push({
        id: i,
        title: '航海安全知识 ' + i,
        thumbnail: 'https://via.placeholder.com/300x200?text=Video+' + i,
        duration: '0' + Math.floor(Math.random() * 5) + ':' + (Math.floor(Math.random() * 50) + 10),
        progress: progress
      });
    }

    const totalPages = Math.ceil(videos.length / this.data.pageSize);

    this.setData({
      videoList: videos,
      totalPages: totalPages
    });

    // 加载当前页数据
    this.loadCurrentPageData();
  },

  loadCurrentPageData: function() {
    const { videoList, currentPage, pageSize } = this.data;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, videoList.length);
    const currentPageData = videoList.slice(startIndex, endIndex);

    this.setData({
      currentPageData: currentPageData
    });
  },

  goToNextPage: function() {
    if (this.data.currentPage < this.data.totalPages) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.loadCurrentPageData();
    }
  },

  goToPrevPage: function() {
    if (this.data.currentPage > 1) {
      this.setData({
        currentPage: this.data.currentPage - 1
      });
      this.loadCurrentPageData();
    }
  },

  playVideo: function(e) {
    const videoId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/videoPlayer/videoPlayer?id=' + videoId
    });
  }
})