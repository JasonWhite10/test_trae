// pages/userInformation/userInformation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificates: [], // 初始化奖状数组
    examScores: []    // 初始化考试分数数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 检查登录状态
    if (!getApp().checkLoginStatus()) {
      return;
    }

    // 获取用户信息
    const userInfo = getApp().globalData.userInfo || {};
    this.setData({
      userInfo: userInfo
    });

    // 加载考试分数和证书信息
    this.loadExamScores();
    this.loadCertificates();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadExamScores();
    this.loadCertificates();
  },

  // 查看考试分数
  viewExamScores: function() {
    // 这里可以跳转到考试分数详情页
    wx.navigateTo({
      url: '/pages/examResult/examResult'
    });
  },

  // 查看个人奖状
  viewCertificates: function() {
    // 检查是否有满分奖状
    if (this.data.certificates.length === 0) {
      wx.showToast({
        title: '暂无满分奖状',
        icon: 'none'
      });
      return;
    }

    // 这里可以跳转到奖状详情页
    wx.navigateTo({
      url: '/pages/certificate/certificate'
    });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？退出后可以通过扫码重新登录。',
      success: function(res) {
        if (res.confirm) {
          getApp().logout();
        }
      }
    });
  },

  // 加载考试分数
  loadExamScores: function() {
    // 模拟从服务器加载数据
    // 实际应用中应该调用API获取数据
    const scores = [{
      id: 1,
      title: '安全知识考试',
      score: 95,
      date: '2023-05-15'
    }, {
      id: 2,
      title: '航海技能考试',
      score: 88,
      date: '2023-04-20'
    }];

    this.setData({
      examScores: scores
    });
  },

  // 加载奖状数据
  loadCertificates: function() {
    // 模拟从服务器加载数据
    // 实际应用中应该调用API获取数据
    // 只有满分的考试才会有奖状
    const certificates = [];

    // 检查是否有满分考试
    if (this.data.examScores && this.data.examScores.length > 0) {
      this.data.examScores.forEach(score => {
        if (score.score === 100) {
          certificates.push({
            id: score.id,
            examTitle: score.title,
            date: score.date,
            imageUrl: '/images/certificate_' + score.id + '.png'
          });
        }
      });
    }

    this.setData({
      certificates: certificates
    });
  }
})