// pages/login/login.js

Page({
  data: {
    phoneNumber: '133****9953', // 手机号（模拟数据）
    isLoading: false // 登录加载状态
  },

  // 关闭登录页面
  closeLogin: function () {
    wx.navigateBack({
      fail: function (err) {
        console.error('返回上一页失败:', err);
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  onLoad: function (options) {
    // 检查是否有token
    const token = wx.getStorageSync('token');
    if (token) {
      // 有token，直接检查是否为首次登录
      this.checkFirstLogin();
    }
  },

  /**
   * 检查是否为首次登录
   */
  checkFirstLogin: function () {
    try {
      // 这里应该调用后端API检查用户是否已完善信息
      // 为了模拟，我们假设新用户token中包含'new'
      const token = wx.getStorageSync('token');
      const isFirstLogin = token.includes('new');

      if (isFirstLogin) {
        // 首次登录，跳转到注册页面
        wx.navigateTo({
          url: '/pages/register/register',
          fail: function (err) {
            console.error('跳转到注册页失败:', err);
            wx.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            });
          }
        });
      } else {
        // 非首次登录，跳转到学习中心
        // 使用switchTab因为learning是tabBar页面
        wx.switchTab({
          url: '/pages/learning/learning',
          fail: function (err) {
            console.error('跳转到学习中心失败:', err);
            wx.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            });
          }
        });
      }
    } catch (e) {
      console.error('检查首次登录失败:', e);
      wx.showToast({
        title: '系统错误，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 本机号码一键登录
   */
  phoneLogin: async function () {
    try {
      // 设置登录中状态
      this.setData({
        isLoading: true
      });

      const app = getApp();

      // 1. 调用微信登录接口获取code
      const code = await app.wxLogin();

      // 2. 获取用户信息
      const userInfo = await app.getUserProfile();

      // 3. 调用后端API进行手机号登录
      // 模拟后端请求
      setTimeout(() => {
        try {
          // 模拟登录成功
          const isNewUser = Math.random() > 0.5;
          const token = 'mock_token_' + Date.now() + (isNewUser ? '_new' : '');
          wx.setStorageSync('token', token);
          wx.setStorageSync('userInfo', JSON.stringify(userInfo));

          // 更新全局状态
          app.globalData.isLogin = true;
          app.globalData.userInfo = userInfo;

          // 隐藏加载提示
          this.setData({
            isLoading: false
          });

          // 检查是否为首次登录
          this.checkFirstLogin();
        } catch (e) {
          console.error('登录后处理失败:', e);
          this.setData({
            isLoading: false
          });
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        }
      }, 1000);
    } catch (e) {
      console.error('登录失败:', e);
      this.setData({
        isLoading: false
      });
      wx.showToast({
        title: e.message || '登录失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 管理员登录
   */
  adminLogin: function () {
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/admin/login/login'
      });
    });
  },
  
  /**
   * 用户登录 - 临时测试按钮
   * 功能：点击后直接跳转到注册页面，用于测试注册和学习中心功能
   * 注意：测试完成后可以直接删除此方法
   */
  userLogin: function () {
    try {
      // 设置登录中状态
      this.setData({
        isLoading: true
      });

      // 模拟短时间延迟，模拟真实交互体验
      setTimeout(() => {
        // 直接跳转到注册页面，不执行真实登录逻辑
        wx.navigateTo({
          url: '/pages/register/register',
          success: () => {
            console.log('临时测试按钮：成功跳转到注册页面');
          },
          fail: function (err) {
            console.error('临时测试按钮：跳转到注册页失败:', err);
            wx.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            });
          },
          complete: () => {
            // 隐藏加载提示
            this.setData({
              isLoading: false
            });
          }
        });
      }, 300);
    } catch (e) {
      console.error('临时测试按钮异常:', e);
      this.setData({
        isLoading: false
      });
      wx.showToast({
        title: '操作异常，请重试',
        icon: 'none'
      });
    }
  }
})