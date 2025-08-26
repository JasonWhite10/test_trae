// pages/learning/learning.js
Page({
  data: {
    userInfo: getApp().globalData.userInfo,
    examScores: [], // 存储考试分数
    certificates: [] // 存储奖状信息
  },

  onLoad: function() {
    // 静默检查登录状态，避免循环跳转
    this.silentCheckLoginStatus();
  },

  onShow: function() {
    // 每次显示页面时更新用户信息和刷新数据
    this.updateUserInfoAndRefreshData();
  },

  /**
   * 静默检查登录状态，避免循环跳转
   */
  silentCheckLoginStatus: function() {
    const token = wx.getStorageSync('token');
    
    if (!token) {
      // 如果确实没有token，跳转到登录页面
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login'
        });
      }, 100);
    } else {
      // 有token，尝试加载用户信息和数据
      this.updateUserInfoAndRefreshData();
    }
  },

  /**
   * 更新用户信息并刷新数据
   */
  updateUserInfoAndRefreshData: function() {
    try {
      // 从本地存储获取用户信息并更新全局状态
      const userInfoStr = wx.getStorageSync('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        const app = getApp();
        app.globalData.userInfo = userInfo;
        
        this.setData({
          userInfo: userInfo
        });
      }
      
      // 加载考试分数和奖状数据
      this.loadExamScores();
      this.loadCertificates();
    } catch (e) {
      console.error('更新用户信息和数据失败:', e);
    }
  },

  goToVideoList: function() {
    wx.navigateTo({
      url: '/pages/videoList/videoList'
    });
  },

  goToExam: function() {
    // 检查是否已提交过测验
    if (getApp().globalData.quizSubmitted) {
      wx.showToast({
        title: '您已完成考试，无法再次挑战',
        icon: 'none'
      });
      return;
    }

    console.log('goToExam method called');
    wx.navigateTo({
      url: '/pages/exam/exam',
      success: function() {
        console.log('Navigation to exam page successful');
      },
      fail: function(error) {
        console.error('Navigation to exam page failed:', error);
      }
    });
  },

  // 加载考试分数数据
  loadExamScores: function() {
    // 模拟从服务器获取考试分数数据
    const scores = [
      { id: 1, examName: '基础知识考试', score: 95, date: '2023-10-15' },
      { id: 2, examName: '航海规则考试', score: 88, date: '2023-09-22' }
    ];
    this.setData({ examScores: scores });
  },

  // 加载奖状数据
  loadCertificates: function() {
    // 模拟从服务器获取奖状数据
    const certs = [
      { id: 1, examName: '基础知识考试', date: '2023-10-15', imageUrl: '/images/certificate1.png' },
      { id: 2, examName: '高级航海考试', date: '2023-08-10', imageUrl: '/images/certificate2.png' }
    ];
    this.setData({ certificates: certs });
  },

  // 查看考试分数
  viewExamScores: function() {
    wx.navigateTo({ url: '/pages/examResult/examResult' });
  },

  // 查看个人奖状
  viewCertificates: function() {
    wx.navigateTo({ url: '/pages/certificate/certificate' });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          getApp().logout();
        }
      }
    });
  }
})