// pages/admin/videoManager/editVideo/editVideo.js
Page({
  data: {
    videoId: '',
    title: '',
    duration: '',
    coverUrl: '',
    videoUrl: '',
    isEditing: false,
    loading: false
  },

  // 输入框内容变化处理
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 选择封面图片
  chooseCoverImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          coverUrl: tempFilePath
        });

        // 这里应该上传图片到服务器
        // 为了演示，我们直接使用临时文件路径
      }
    });
  },

  // 选择视频文件
  chooseVideoFile() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const duration = Math.floor(res.tempFiles[0].duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        this.setData({
          videoUrl: tempFilePath,
          duration: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        });

        // 这里应该上传视频到服务器
        // 为了演示，我们直接使用临时文件路径
      }
    });
  },

  // 保存视频信息
  saveVideo() {
    const { title, duration, coverUrl, videoUrl } = this.data;

    // 简单验证
    if (!title.trim()) {
      wx.showToast({
        title: '请输入视频标题',
        icon: 'none'
      });
      return;
    }

    if (!duration) {
      wx.showToast({
        title: '请选择视频文件',
        icon: 'none'
      });
      return;
    }

    if (!coverUrl) {
      wx.showToast({
        title: '请选择封面图片',
        icon: 'none'
      });
      return;
    }

    this.setData({
      loading: true
    });

    // 这里应该是真实的保存API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      wx.showToast({
        title: this.data.isEditing ? '更新成功' : '添加成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  },

  // 生命周期函数
  onLoad(options) {
    // 检查登录状态
    const adminToken = wx.getStorageSync('adminToken');
    if (!adminToken) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
      return;
    }

    // 检查是否是编辑模式
    if (options.id) {
      this.setData({
        videoId: options.id,
        isEditing: true
      });

      // 加载视频详情
      this.loadVideoDetails();
    }
  },

  // 加载视频详情
  loadVideoDetails() {
    this.setData({
      loading: true
    });

    // 这里应该是真实的API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      this.setData({
        title: '船舶安全知识培训',
        duration: '15:30',
        coverUrl: '/assets/images/video1.jpg',
        videoUrl: '',
        loading: false
      });
    }, 800);
  }
})