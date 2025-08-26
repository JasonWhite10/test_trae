// pages/admin/videoManager/editVideo/editVideo.js
import videoStorage from '../../../../utils/videoStorage';

const app = getApp();

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
      },
      fail: (error) => {
        console.error('选择封面图片失败:', error);
        wx.showToast({
          title: '选择封面图片失败',
          icon: 'none',
          duration: 2000
        });
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
      },
      fail: (error) => {
        console.error('选择视频文件失败:', error);
        wx.showToast({
          title: '选择视频文件失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 保存视频信息
  saveVideo() {
    const { title, duration, coverUrl, videoUrl, isEditing, videoId } = this.data;

    // 简单验证
    if (!title.trim()) {
      wx.showToast({
        title: '请输入视频标题',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!duration) {
      wx.showToast({
        title: '请选择视频文件',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!coverUrl) {
      wx.showToast({
        title: '请选择封面图片',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!videoUrl) {
      wx.showToast({
        title: '请选择视频文件',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.setData({
      loading: true
    });

    try {
      if (isEditing) {
        // 编辑模式：更新现有视频
        const videoInfo = {
          id: videoId,
          title: title.trim(),
          duration: duration,
          cover: coverUrl,
          src: videoUrl
        };

        const success = videoStorage.updateVideo(videoInfo);
        
        if (success) {
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          throw new Error('更新视频失败');
        }
      } else {
        // 添加模式：创建新视频
        const videoInfo = {
          title: title.trim(),
          duration: duration,
          cover: coverUrl,
          src: videoUrl,
          viewCount: 0,
          createTime: Date.now()
        };

        const success = videoStorage.addVideo(videoInfo);
        
        if (success) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          throw new Error('添加视频失败');
        }
      }
    } catch (error) {
      console.error('保存视频信息失败:', error);
      wx.showToast({
        title: error.message || '保存失败',
        icon: 'none',
        duration: 2000
      });
    } finally {
      this.setData({
        loading: false
      });
    }
  },

  // 生命周期函数
  onLoad(options) {
    // 检查登录状态
    if (!app.checkLoginStatus()) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
      return;
    }

    // 检查是否是编辑模式
    if (options && options.id) {
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

    try {
      // 使用videoStorage获取视频详情
      const videoInfo = videoStorage.getVideoById(this.data.videoId);
      
      if (!videoInfo) {
        throw new Error('视频不存在');
      }
      
      this.setData({
        title: videoInfo.title || '',
        duration: videoInfo.duration || '',
        coverUrl: videoInfo.cover || '',
        videoUrl: videoInfo.src || '',
        loading: false
      });
    } catch (error) {
      console.error('加载视频详情失败:', error);
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none',
        duration: 2000
      });
      
      this.setData({
        loading: false
      });
      
      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  }
})