// pages/admin/videoManager/videoManager.js
import videoStorage from '../../../utils/videoStorage';

const app = getApp();

Page({
  data: {
    videoList: [],
    loading: false, // 初始设为false，loadVideoList开始时再设为true
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

    try {
      // 获取所有视频数据
      let allVideos = videoStorage.getVideoList();
      
      // 根据关键词筛选视频
      const keyword = this.data.searchKeyword.trim();
      if (keyword) {
        allVideos = videoStorage.searchVideos(keyword);
      }

      // 执行分页处理
      const startIndex = (this.data.currentPage - 1) * this.data.pageSize;
      const endIndex = startIndex + this.data.pageSize;
      const paginatedVideos = allVideos.slice(startIndex, endIndex);

      this.setData({
        videoList: this.data.currentPage === 1 ? paginatedVideos : [...this.data.videoList, ...paginatedVideos],
        totalCount: allVideos.length,
        loading: false
      });
    } catch (error) {
      console.error('加载视频列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        loading: false
      });
    }
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

  // 删除视频
  deleteVideo(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除该视频吗？删除后无法恢复。',
      success: (res) => {
        if (res.confirm) {
          try {
            // 调用视频存储的删除方法
            const success = videoStorage.deleteVideo(id);
            
            if (success) {
              // 更新列表
              const newVideoList = this.data.videoList.filter(video => video.id !== id);
              this.setData({
                videoList: newVideoList,
                totalCount: this.data.totalCount - 1
              });

              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
            } else {
              throw new Error('删除操作未成功');
            }
          } catch (error) {
            console.error('删除视频失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  },

  // 添加新视频
  addNewVideo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        // 提取视频信息
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const duration = Math.floor(res.tempFiles[0].duration);
        
        // 显示输入标题的弹窗
        wx.showModal({
          title: '添加视频',
          editable: true,
          placeholderText: '请输入视频标题',
          success: (modalRes) => {
            if (modalRes.confirm && modalRes.content) {
              try {
                // 添加视频到存储
                videoStorage.addVideo({
                  title: modalRes.content.trim(),
                  duration: this.formatDuration(duration),
                  src: tempFilePath,
                  cover: 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(modalRes.content.trim())
                });
                
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                });
                
                // 重新加载视频列表
                this.setData({
                  currentPage: 1,
                  videoList: []
                });
                this.loadVideoList();
              } catch (error) {
                console.error('添加视频失败:', error);
                wx.showToast({
                  title: '添加失败: ' + (error.message || '未知错误'),
                  icon: 'none',
                  duration: 3000
                });
              }
            }
          }
        });
      },
      fail: (err) => {
        console.error('选择视频失败:', err);
        wx.showToast({
          title: '选择视频失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 格式化时长
  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // 生命周期函数
  onLoad() {
    // 使用app中的统一方法检查管理员登录状态
    if (!app.checkAdminLoginStatus()) {
      return;
    }

    this.loadVideoList();
  },

  // 生命周期函数 - 监听页面显示
  onShow() {
    // 每次页面显示时重新加载列表，确保数据是最新的
    // 这确保了管理员修改操作后用户能够动态获取最新视频数据
    if (this.data.videoList.length > 0) {
      this.setData({
        videoList: [],
        currentPage: 1
      });
      this.loadVideoList();
    }
  }
})