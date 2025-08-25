// app.js
App({
  globalData: {
    userInfo: null,
    isLogin: false,
    regionList: [
      '沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市',
      '丹东市', '锦州市', '营口市', '阜新市', '辽阳市',
      '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'
    ],
    identityOptions: ['船长', '船东', '家属', '船员'],
    quizSubmitted: false,
    quizProgress: null
  },

  onLaunch: function() {
    // 初始化登录状态
    this.initLoginStatus();
  },

  /**
   * 初始化登录状态
   */
  initLoginStatus: function() {
    try {
      const token = wx.getStorageSync('token');
      if (token) {
        this.checkToken(token);
      }
    } catch (e) {
      console.error('初始化登录状态失败:', e);
    }
  },

  /**
   * 验证token有效性
   * @param {string} token - 用户token
   */
  checkToken: function(token) {
    // 实际应用中应调用后端API验证token
    // 这里为模拟实现
    try {
      this.globalData.isLogin = true;
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = JSON.parse(userInfo);
      }
    } catch (e) {
      console.error('验证token失败:', e);
      this.logout();
    }
  },

  /**
   * 用户登出
   */
  logout: function() {
    try {
      wx.removeStorageSync('token');
      wx.removeStorageSync('userInfo');
      this.globalData.isLogin = false;
      this.globalData.userInfo = null;
      wx.redirectTo({
        url: '/pages/login/login',
        fail: function(err) {
          console.error('登出跳转失败:', err);
          wx.showToast({
            title: '登出失败，请重试',
            icon: 'none'
          });
        }
      });
    } catch (e) {
      console.error('登出失败:', e);
      wx.showToast({
        title: '登出失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 封装微信登录API
   * @returns {Promise} - 返回包含code的Promise
   */
  wxLogin: function() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code);
          } else {
            reject(new Error('登录失败，无法获取code'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 封装获取用户信息API
   * @returns {Promise} - 返回用户信息的Promise
   */
  getUserProfile: function() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          resolve(res.userInfo);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
})