// pages/examResult/examResult.js
Page({
  data: {
    score: 0,
    isPerfect: false,
    certificateUrl: '',
    hasTakenExam: false,
    userInfo: {},
    currentDate: ''
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!getApp().checkLoginStatus()) {
      return;
    }

    // 获取用户信息和应用实例
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo || {},
      currentDate: this.formatDate(new Date())
    });

    // 获取分数（优先从URL参数获取，其次从全局状态获取）
    let score = null;
    if (options.score !== undefined) {
      score = parseInt(options.score);
    } else if (app.globalData.examScore !== undefined) {
      score = app.globalData.examScore;
    }

    // 判断是否完成考试
    if (score !== null) {
      const isPerfect = score === 100;

      this.setData({
        score: score,
        isPerfect: isPerfect,
        hasTakenExam: true
      });

      // 如果满分，生成奖状
      if (isPerfect) {
        this.generateCertificate();
      }
    } else {
      // 未完成考试，检查全局状态
      if (app.globalData.quizSubmitted) {
        // 如果已经提交但没有分数，可能是评分中
        this.setData({
          hasTakenExam: true,
          isScoring: true
        });
        // 可以添加定时检查评分结果的逻辑
      }
    }
  },

  // 格式化日期
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  // 正确的处理导航栏返回按钮的方式
  // 重写默认的返回行为
  onBackPress: function() {
    // 不应该在这里直接跳转，这会干扰正常的导航流程
    // 保留原始的返回行为
    return false; // 表示未处理，使用默认返回行为
  }
})