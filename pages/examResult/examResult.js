// pages/examResult/examResult.js
Page({
  data: {
    score: 0,
    isPerfect: false,
    certificateUrl: ''
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!getApp().checkLoginStatus()) {
      return;
    }

    if (options.score) {
      const score = parseInt(options.score);
      const isPerfect = score === 100;

      this.setData({
        score: score,
        isPerfect: isPerfect
      });

      // 如果满分，生成奖状
      if (isPerfect) {
        this.generateCertificate();
      }
    }
  },

  generateCertificate: function() {
    // 这里应该调用后端API生成奖状图片
    // 为了模拟，我们使用一个静态图片URL
    setTimeout(() => {
      this.setData({
        certificateUrl: 'https://via.placeholder.com/600x800?text=Certificate+' + getApp().globalData.userInfo.name
      });
    }, 3000);
  },

  saveCertificate: function() {
    if (!this.data.certificateUrl) {
      wx.showToast({
        title: '奖状生成中，请稍候',
        icon: 'none'
      });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.certificateUrl,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('保存失败:', err);
        wx.showToast({
          title: '保存失败，请授权后重试',
          icon: 'none'
        });
      }
    });
  },

  goToLearning: function() {
    wx.switchTab({
      url: '/pages/learning/learning'
    });
  },

  retryExam: function() {
    wx.redirectTo({
      url: '/pages/exam/exam'
    });
  },

  // 设置导航栏返回按钮的行为
  // 拦截返回按钮事件
  onBackPress: function() {
    if (getApp().globalData.quizSubmitted) {
      // 如果已完成考试，跳转到学习中心
      wx.switchTab({
        url: '/pages/learning/learning'
      });
      return true; // 表示已处理返回事件
    }
    return false; // 表示未处理，使用默认返回行为
  }
})