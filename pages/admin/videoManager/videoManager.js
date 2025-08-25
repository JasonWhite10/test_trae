// pages/admin/videoManager/videoManager.js
Page({
  data: {
    videoList: [],
    loading: true,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    searchKeyword: ''
  },

  // 搜索输入框变化处理
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 执行搜索
  onSearch() {
    this.setData({
      currentPage: 1,
      videoList: []
    });
    this.loadVideoList();
  },

  // 加载视频列表
  loadVideoList() {
    this.setData({
      loading: true
    });

    // 这里应该是真实的API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      const mockVideos = [];
      const startIndex = (this.data.currentPage - 1) * this.data.pageSize;

      // 模拟根据关键词筛选
      const keyword = this.data.searchKeyword.toLowerCase();
      const allVideos = [
        { id: 1, title: '船舶安全知识培训', duration: '15:30', cover: '/assets/images/video1.jpg', viewCount: 128 },
        { id: 2, title: '消防演练教程', duration: '20:15', cover: '/assets/images/video2.jpg', viewCount: 96 },
        { id: 3, title: '海上急救操作指南', duration: '25:40', cover: '/assets/images/video3.jpg', viewCount: 156 },
        { id: 4, title: '船舶设备维护保养', duration: '30:22', cover: '/assets/images/video4.jpg', viewCount: 87 },
        { id: 5, title: '航行规则与避碰', duration: '18:10', cover: '/assets/images/video5.jpg', viewCount: 142 },
        { id: 6, title: '气象与海洋知识', duration: '22:35', cover: '/assets/images/video6.jpg', viewCount: 76 },
        { id: 7, title: '船舶应急处理', duration: '28:15', cover: '/assets/images/video7.jpg', viewCount: 112 },
        { id: 8, title: '船员职责与管理', duration: '16:40', cover: '/assets/images/video8.jpg', viewCount: 93 },
        { id: 9, title: '航海仪器使用', duration: '24:18', cover: '/assets/images/video9.jpg', viewCount: 85 },
        { id: 10, title: '船舶防污染措施', duration: '20:55', cover: '/assets/images/video10.jpg', viewCount: 108 },
        { id: 11, title: '港口国检查指南', duration: '32:10', cover: '/assets/images/video11.jpg', viewCount: 67 },
        { id: 12, title: '船舶通信系统', duration: '19:30', cover: '/assets/images/video12.jpg', viewCount: 79 },
      ];

      // 模拟搜索筛选
      const filteredVideos = keyword
        ? allVideos.filter(video => video.title.toLowerCase().includes(keyword))
        : allVideos;

      // 模拟分页
      for (let i = startIndex; i < startIndex + this.data.pageSize && i < filteredVideos.length; i++) {
        mockVideos.push(filteredVideos[i]);
      }

      this.setData({
        videoList: [...this.data.videoList, ...mockVideos],
        totalCount: filteredVideos.length,
        loading: false
      });
    }, 800);
  },

  // 上拉加载更多
  onReachBottom() {
    if (!this.data.loading && this.data.videoList.length < this.data.totalCount) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.loadVideoList();
    }
  },

  // 跳转到视频编辑页面
  toEditVideo(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/videoManager/editVideo?id=${id}`
    });
  },

  // 删除视频
  deleteVideo(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除该视频吗？',
      success: (res) => {
        if (res.confirm) {
          // 这里应该是真实的删除API调用
          // 为了演示，我们直接从列表中移除
          const newVideoList = this.data.videoList.filter(video => video.id !== id);
          this.setData({
            videoList: newVideoList,
            totalCount: this.data.totalCount - 1
          });

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 添加新视频
  addNewVideo() {
    wx.navigateTo({
      url: '/pages/admin/videoManager/editVideo'
    });
  },

  // 生命周期函数
  onLoad() {
    // 检查登录状态
    const adminToken = wx.getStorageSync('adminToken');
    if (!adminToken) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
      return;
    }

    this.loadVideoList();
  },

  // 生命周期函数 - 监听页面显示
  onShow() {
    // 如果从编辑页面返回，刷新列表
    if (this.data.videoList.length > 0) {
      this.setData({
        videoList: [],
        currentPage: 1
      });
      this.loadVideoList();
    }
  }
})