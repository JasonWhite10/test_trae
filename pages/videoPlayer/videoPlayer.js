// pages/videoPlayer/videoPlayer.js
import videoStorage from '../../utils/videoStorage';

const app = getApp();

Page({
  data: {
    videoId: '',
    videoInfo: null,
    currentTime: 0,
    duration: 0,
    progress: 0,
    isPlaying: false,
    videoError: false,
    errorMsg: '',
    isLoading: false, // 初始设为false，getVideoInfo开始时再设为true
    isFullScreen: false,
    isLandscape: false,
    showRetryOption: false,
    lastSaveTime: 0 // 记录上次保存进度的时间
  },

  onLoad: function(options) {
    // 检查登录状态
    if (!app.checkLoginStatus()) {
      return;
    }

    if (options && options.id) {
      this.setData({
        videoId: options.id,
        isLoading: true
      });
      this.getVideoInfo();
    } else {
      this.setData({
        videoError: true,
        errorMsg: '无效的视频ID',
        isLoading: false
      });
    }
  },

  getVideoInfo: function() {
    try {
      const videoId = this.data.videoId;
      
      if (!videoId) {
        this.setData({
          videoError: true,
          errorMsg: '无效的视频ID',
          isLoading: false
        });
        return;
      }
      
      // 从videoStorage获取真实视频信息
      const videoInfo = videoStorage.getVideoById(videoId);
      
      if (!videoInfo) {
        this.setData({
          videoError: true,
          errorMsg: '视频不存在',
          isLoading: false
        });
        return;
      }
      
      // 验证视频源地址
      if (!videoInfo.src) {
        this.setData({
          videoError: true,
          errorMsg: '视频源地址无效',
          isLoading: false
        });
        return;
      }

      // 检查本地存储的观看进度
      const progressKey = `video_progress_${videoId}`;
      const savedProgress = wx.getStorageSync(progressKey);
      if (typeof savedProgress === 'number' && savedProgress > 0) {
        this.setData({
          currentTime: savedProgress
        });
      }

      // 尝试预先验证视频源可用性
      this.verifyVideoSource(videoInfo.src).then(() => {
        this.setData({
          videoInfo: videoInfo,
          isLoading: false
        });
      }).catch(error => {
        console.warn('视频源预验证失败，但仍尝试加载:', error);
        this.setData({
          videoInfo: videoInfo,
          isLoading: false
          // 不立即设置为错误状态，让视频组件尝试加载
        });
      });
    } catch (error) {
      console.error('获取视频信息失败:', error);
      this.setData({
        videoError: true,
        errorMsg: `获取视频信息失败: ${error.message || '未知错误'}`,
        isLoading: false
      });
    }
  },

  // 验证视频源是否可用
  verifyVideoSource: function(src) {
    return new Promise((resolve) => {
      try {
        // 设置5秒超时
        const timeoutId = setTimeout(() => {
          console.warn('视频源验证超时，继续尝试加载');
          resolve(); // 超时情况下也继续尝试加载
        }, 5000);

        if (src.startsWith('/')) {
          // 本地视频路径检查
          try {
            const fileSystemManager = wx.getFileSystemManager();
            if (fileSystemManager) {
              fileSystemManager.getFileInfo({
                filePath: src,
                success: () => {
                  clearTimeout(timeoutId);
                  resolve();
                },
                fail: () => {
                  clearTimeout(timeoutId);
                  // 本地文件检查失败不立即拒绝，而是继续尝试加载
                  console.warn('本地视频文件检查失败，但仍尝试加载');
                  resolve();
                }
              });
            } else {
              clearTimeout(timeoutId);
              resolve();
            }
          } catch (e) {
            clearTimeout(timeoutId);
            // 文件系统API不可用或调用失败，继续尝试加载
            console.warn('文件系统API调用失败，但仍尝试加载');
            resolve();
          }
        } else if (src.startsWith('http')) {
          // 远程视频URL检查
          wx.request({
            url: src,
            method: 'HEAD',
            timeout: 5000, // 设置请求超时时间
            success: (res) => {
              clearTimeout(timeoutId);
              if (res.statusCode === 200) {
                resolve();
              } else {
                // 即使状态码不是200，也继续尝试加载，因为某些服务器配置可能有所不同
                console.warn(`视频URL状态码不为200(${res.statusCode})，但仍尝试加载`);
                resolve();
              }
            },
            fail: (error) => {
              clearTimeout(timeoutId);
              // 网络请求失败不立即拒绝，而是继续尝试加载
              console.warn('视频URL请求失败，但仍尝试加载:', error);
              resolve();
            }
          });
        } else {
          clearTimeout(timeoutId);
          resolve(); // 其他情况，继续尝试加载
        }
      } catch (e) {
        console.warn('视频源验证过程中出现异常，但仍尝试加载:', e);
        resolve(); // 出现异常也继续尝试加载
      }
    });
  },

  onReady: function() {
    // 创建视频上下文
    try {
      this.videoContext = wx.createVideoContext('myVideo');
      
      // 检查视频信息是否存在且src有效
      if (this.data.videoInfo && this.data.videoInfo.src) {
        // 如果有保存的进度，跳转到该位置
        if (this.data.currentTime > 0) {
          try {
            this.videoContext.seek(this.data.currentTime);
          } catch (e) {
            console.warn('尝试跳转到指定位置时出错:', e);
          }
        }
        
        // 延迟播放，确保页面完全加载
        setTimeout(() => {
          try {
            this.videoContext.play();
            this.setData({
              isPlaying: true
            });
          } catch (e) {
            console.error('尝试播放视频时出错:', e);
            // 不自动播放，让用户手动点击播放
            this.setData({
              isPlaying: false,
              videoError: false // 清除之前可能存在的错误状态
            });
          }
        }, 500);
      } else {
        console.warn('视频信息或视频源不存在');
        this.setData({
          isLoading: false
        });
      }
    } catch (e) {
      console.error('创建视频上下文失败:', e);
      this.setData({
        videoError: true,
        errorMsg: '初始化视频播放器失败',
        isLoading: false,
        showRetryOption: true
      });
    }
  },

  onTimeUpdate: function(e) {
    try {
      const currentTime = e.detail.currentTime;
      const duration = e.detail.duration;
      const progress = Math.floor((currentTime / duration) * 100);

      this.setData({
        currentTime: currentTime,
        duration: duration,
        progress: progress
      });

      // 每隔15秒保存一次进度，避免过于频繁的存储操作
      const now = Date.now();
      if (now - this.data.lastSaveTime > 15000 && currentTime > 0) {
        this.saveCurrentProgress();
        this.setData({
          lastSaveTime: now
        });
      }
    } catch (error) {
      console.error('更新视频播放进度时出错:', error);
    }
  },

  onEnded: function() {
    // 视频播放结束，保存进度为100%
    const progressKey = 'video_progress_' + this.data.videoId;
    wx.setStorageSync(progressKey, this.data.duration);

    this.setData({
      progress: 100,
      isPlaying: false
    });
  },

  onError: function(e) {
    console.error('视频播放错误:', e);
    
    // 根据错误类型提供更具体的错误信息
    let errorMessage = '视频播放失败，请稍后重试';
    let showRetryOption = true;
    
    if (e.detail && e.detail.errMsg) {
      // 特别处理MEDIA_ERR_SRC_NOT_SUPPORTED错误
      if (e.detail.errMsg.includes('MEDIA_ERR_SRC_NOT_SUPPORTED')) {
        errorMessage = '视频格式不支持，请尝试其他视频或检查网络连接';
        showRetryOption = true;
      } else if (e.detail.errMsg.includes('MEDIA_ERR_NETWORK')) {
        errorMessage = '网络连接异常，请检查您的网络设置';
        showRetryOption = true;
      } else {
        errorMessage = '播放错误: ' + e.detail.errMsg;
      }
    } else if (e.errMsg) {
      errorMessage = '播放错误: ' + e.errMsg;
    } else if (e.code) {
      errorMessage = '错误代码: ' + e.code + '，视频播放失败';
    }
    
    this.setData({
      videoError: true,
      errorMsg: errorMessage,
      showRetryOption: showRetryOption,
      isLoading: false,
      isPlaying: false
    });
  },

  onFullscreenChange: function(e) {
    const fullScreen = e.detail.fullScreen;
    this.setData({
      isFullScreen: fullScreen
    });
    
    // 设置横屏/竖屏状态
    this.setData({
      isLandscape: fullScreen
    });
    
    // 尝试切换屏幕方向（增强兼容性处理）
    try {
      // 双重保险：先检查wx对象是否存在，再检查setScreenOrientation方法是否存在
      if (wx && typeof wx.setScreenOrientation === 'function') {
        if (fullScreen) {
          // 如果进入全屏，尝试切换为横屏
          wx.setScreenOrientation({
            orientation: 'landscape'
          });
        } else {
          // 退出全屏，尝试恢复竖屏
          wx.setScreenOrientation({
            orientation: 'portrait'
          });
        }
      } else {
        console.log('当前环境不支持wx.setScreenOrientation方法');
      }
    } catch (error) {
      console.error('切换屏幕方向失败:', error);
      // 即使切换失败，也不影响应用继续运行
    }
  },

  // 处理视频播放事件
  onPlay: function() {
    this.setData({
      isPlaying: true
    });
  },

  // 处理视频暂停事件
  onPause: function() {
    this.setData({
      isPlaying: false
    });
  },

  // 处理视频等待事件
  onWaiting: function() {
    if (!this.data.videoError) {
      this.setData({
        isLoading: true
      });
    }
  },

  togglePlay: function() {
    if (this.data.isPlaying) {
      this.videoContext.pause();
    } else {
      this.videoContext.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    });
  },

  // 切换全屏/退出全屏
  toggleFullScreen: function() {
    if (this.data.isFullScreen) {
      this.videoContext.exitFullScreen();
    } else {
      this.videoContext.requestFullScreen({ direction: 0 });
    }
  },

  onUnload: function() {
    // 离开页面时保存进度
    const progressKey = 'video_progress_' + this.data.videoId;
    wx.setStorageSync(progressKey, this.data.currentTime);
    
    // 确保退出全屏和恢复竖屏
    if (this.data.isFullScreen) {
      this.videoContext.exitFullScreen();
    }
    
    if (this.data.isLandscape) {
      wx.setScreenOrientation({
        orientation: 'portrait'
      });
    }
  },

  // 重新加载视频
  retryPlay: function() {
    this.setData({
      videoError: false,
      isLoading: true
    });
    
    // 重新获取视频信息并重试
    this.getVideoInfo();
  },

  formatTime: function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return (minutes < 10 ? '0' + minutes : minutes) + ':' + (remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);
  }
})