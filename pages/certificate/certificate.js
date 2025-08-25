// pages/certificate/certificate.js
Page({
  data: {
    certificate: null
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!getApp().checkLoginStatus()) {
      return;
    }

    // 从前一个页面获取证书信息
    // 实际应用中可能需要从服务器获取
    const certificateId = options.id || 1;
    this.loadCertificateData(certificateId);
  },

  // 加载证书数据
  loadCertificateData: function(id) {
    // 模拟从服务器加载数据
    const certificate = {
      id: id,
      examTitle: '安全知识考试',
      date: '2023-05-15',
      imageUrl: '/images/certificate_' + id + '.png',
      username: getApp().globalData.userInfo.name
    };

    this.setData({
      certificate: certificate
    });
  },

  // 保存证书到本地
  saveCertificate: function() {
    if (!this.data.certificate) return;

    wx.showLoading({
      title: '保存中...',
    });

    // 模拟保存图片到本地
    // 实际应用中应该使用wx.saveImageToPhotosAlbum API
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '证书已保存到相册',
        icon: 'success'
      });
    }, 1500);
  }
})