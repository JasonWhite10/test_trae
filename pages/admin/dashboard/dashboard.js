// pages/admin/dashboard/dashboard.js
Page({
  data: {
    adminInfo: {},
    statistics: {
      totalVideos: 0,
      totalQuestions: 0,
      totalUsers: 0,
      totalExams: 0
    }
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出管理员登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync('adminToken');
          wx.removeStorageSync('adminInfo');

          // 跳转到登录页
          wx.redirectTo({
            url: '/pages/admin/login/login'
          });
        }
      }
    });
  },

  // 跳转到视频管理
  toVideoManager() {
    wx.navigateTo({
      url: '/pages/admin/videoManager/videoManager'
    });
  },

  // 跳转到题库管理
  toQuestionManager() {
    wx.navigateTo({
      url: '/pages/admin/questionManager/questionManager'
    });
  },

  // 跳转到数据分析
  toDataAnalysis() {
    wx.navigateTo({
      url: '/pages/admin/dataAnalysis/dataAnalysis'
    });
  },

  // 生命周期函数
  onLoad() {
    console.log('dashboard页面加载中...');
    // 检查登录状态
    const adminInfo = wx.getStorageSync('adminInfo');
    const adminToken = wx.getStorageSync('adminToken');

    console.log('adminToken:', adminToken);
    console.log('adminInfo:', adminInfo);

    if (!adminToken || !adminInfo) {
      console.log('登录状态无效，跳转到登录页');
      wx.redirectTo({
        url: '/pages/admin/login/login',
        success: function(res) {
          console.log('跳转登录页成功', res);
        },
        fail: function(err) {
          console.log('跳转登录页失败', err);
        }
      });
      return;
    }

    this.setData({
      adminInfo
    });

    // 模拟加载统计数据
    this.loadStatistics();
  },

  // 加载统计数据
  loadStatistics() {
    // 这里应该是真实的API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      this.setData({
        statistics: {
          totalVideos: 24,
          totalQuestions: 150,
          totalUsers: 532,
          totalExams: 896
        }
      });
    }, 500);
  },

  // 生命周期函数 - 监听页面显示
  onShow() {
    // 每次显示页面时检查登录状态
    const adminToken = wx.getStorageSync('adminToken');
    if (!adminToken) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
    }
  }
})