// pages/login/login.js
Page({
  data: {
    username: '',
    password: '',
    isAdminLogin: false,
    isDebug: false, // 调试模式标志
    isLoading: false, // 登录加载状态
    phoneNumber: '' // 手机号
  },

  // 关闭登录页面
  closeLogin: function() {
    wx.navigateBack({
      fail: function(err) {
        console.error('返回上一页失败:', err);
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  onLoad: function(options) {
    // 检查是否有token
    const token = wx.getStorageSync('token');
    if (token) {
      // 有token，直接检查是否为首次登录
      this.checkFirstLogin();
    }

    // 模拟获取手机号（实际应用中应通过微信API获取）
    // 这里使用固定格式的手机号作为示例
    this.setData({
      phoneNumber: '133****9953'
    });
  },

  /**
   * 检查是否为首次登录
   */
  checkFirstLogin: function() {
    try {
      // 这里应该调用后端API检查用户是否已完善信息
      // 为了模拟，我们假设新用户token中包含'new'
      const token = wx.getStorageSync('token');
      const isFirstLogin = token.includes('new');
      
      if (isFirstLogin) {
        // 首次登录，跳转到注册页面
        wx.navigateTo({
          url: '/pages/register/register',
          fail: function(err) {
            console.error('跳转到注册页失败:', err);
            wx.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            });
          }
        });
      } else {
        // 非首次登录，跳转到学习中心
        wx.redirectTo({
          url: '/pages/learning/learning',
          fail: function(err) {
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
  phoneLogin: async function() {
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
   * 切换调试模式
   * @description 仅用于开发环境，切换调试模式的显示状态
   */
  // toggleDebugMode: function() {
  //   try {
  //     this.setData({
  //       isDebug: !this.data.isDebug
  //     });
  //   } catch (e) {
  //     console.error('切换调试模式失败:', e);
  //   }
  // },

  /**
   * 调试登录
   * @description 仅用于开发环境，模拟用户登录流程
   */
  /*
  debugLogin: function() {
    try {
      wx.showLoading({ title: '调试登录中...' });
      setTimeout(() => {
        try {
          wx.hideLoading();
          // 随机决定是否为首次登录
          const isNewUser = Math.random() > 0.5;
          const token = 'debug_token_' + Date.now() + (isNewUser ? '_new' : '');
          wx.setStorageSync('token', token);
          wx.setStorageSync('userInfo', JSON.stringify({
            nickName: '调试用户',
            avatarUrl: '/images/default-avatar.png'
          }));
          // 检查是否为首次登录
          this.checkFirstLogin();
        } catch (e) {
          console.error('调试登录处理失败:', e);
          wx.showToast({
            title: '调试登录失败',
            icon: 'none'
          });
        }
      }, 500);
    } catch (e) {
      console.error('调试登录失败:', e);
      wx.hideLoading();
      wx.showToast({
        title: '调试登录失败',
        icon: 'none'
      });
    }
  },
  */

  /**
   * 切换管理员登录模式  暫時沒發現有調用
   */
  // switchToAdminLogin: function() {
  //   try {
  //     this.setData({
  //       isAdminLogin: !this.data.isAdminLogin
  //     });
  //   } catch (e) {
  //     console.error('切换管理员登录模式失败:', e);
  //     wx.showToast({
  //       title: '操作失败，请重试',
  //       icon: 'none'
  //     });
  //   }
  // },

  /**
   * 输入用户名
   * @param {Object} e - 事件对象
   */
  inputUsername: function(e) {
    this.setData({
      username: e.detail.value.trim()
    });
  },

  /**
   * 输入密码
   * @param {Object} e - 事件对象
   */
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value.trim()
    });
  },

  /**
   * 管理员登录
   */
  adminLogin: function() {

       // 跳转到结果页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/admin/login/login'
      });
    });
  }
    /*  
    try {
      const { username, password } = this.data;
      if (!username || !password) {
        wx.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        });
        return;
      }

      // 这里应该调用后端API进行管理员登录验证
      // 为了模拟，我们假设用户名和密码都是'admin'
      if (username === 'admin' && password === 'admin') {
        // 登录成功，存储token和用户信息
        wx.setStorageSync('adminToken', 'admin_token_' + Date.now());
        wx.setStorageSync('adminInfo', JSON.stringify({
          username: '管理员',
          role: 'admin'
        }));
        wx.redirectTo({
          url: '/pages/admin/dashboard/dashboard',
          success: function(res) {
            console.log('管理员登录跳转成功', res);
          },
          fail: function(err) {
            console.error('管理员登录跳转失败', err);
            wx.showToast({
              title: '跳转失败，请重试',
              icon: 'none'
            });
          }
        });
      } else {
        wx.showToast({
          title: '用户名或密码错误',
          icon: 'none'
        });
      }
    } catch (e) {
      console.error('管理员登录失败:', e);
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    }
  }
    */
})