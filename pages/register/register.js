// pages/register/register.js
Page({
  data: {
    name: '',
    shipNumber: '',
    regionIndex: 0,
    identityIndex: 0,
    regionList: [],
    identityList: [],
    errorMessage: '',
    isLoading: false
  },

  /**
   * 页面加载时执行
   */
  onLoad: function() {
    try {
      // 获取全局数据
      const app = getApp();
      this.setData({
        regionList: app.globalData.regionList || [],
        identityList: app.globalData.identityOptions || []
      });
    } catch (e) {
      console.error('加载全局数据失败:', e);
      wx.showToast({
        title: '数据加载失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 输入姓名
   * @param {Object} e - 事件对象
   */
  inputName: function(e) {
    this.setData({
      name: e.detail.value.trim(),
      errorMessage: ''
    });
  },

  /**
   * 输入船号
   * @param {Object} e - 事件对象
   */
  inputShipNumber: function(e) {
    this.setData({
      shipNumber: e.detail.value.trim(),
      errorMessage: ''
    });
  },

  /**
   * 选择地区
   * @param {Object} e - 事件对象
   */
  bindRegionChange: function(e) {
    this.setData({
      regionIndex: e.detail.value,
      errorMessage: ''
    });
  },

  /**
   * 选择身份
   * @param {Object} e - 事件对象
   */
  bindIdentityChange: function(e) {
    this.setData({
      identityIndex: e.detail.value,
      errorMessage: ''
    });
  },

  /**
   * 验证表单数据
   * @returns {Object} - 包含valid和message的对象
   */
  validateForm: function() {
    const { name, shipNumber, regionList, regionIndex, identityList, identityIndex } = this.data;

    if (!name) {
      return { valid: false, message: '请输入姓名' };
    }

    if (!shipNumber) {
      return { valid: false, message: '请输入船号' };
    }

    if (!regionList || regionList.length === 0 || regionIndex === undefined) {
      return { valid: false, message: '请选择地区' };
    }

    if (!identityList || identityList.length === 0 || identityIndex === undefined) {
      return { valid: false, message: '请选择身份' };
    }

    return { valid: true };
  },

  /**
   * 提交注册信息
   */
  submitRegister: async function() {
    try {
      // 验证表单
      const validationResult = this.validateForm();
      if (!validationResult.valid) {
        this.setData({
          errorMessage: validationResult.message
        });
        return;
      }

      // 清除错误信息
      this.setData({
        errorMessage: '',
        isLoading: true
      });

      const { name, shipNumber, regionIndex, regionList, identityIndex, identityList } = this.data;

      // 准备提交的数据
      const userInfo = {
        name: name,
        shipNumber: shipNumber,
        region: regionList[regionIndex],
        identity: identityList[identityIndex]
      };

      // 调用微信登录接口获取code
      const app = getApp();
      const code = await app.wxLogin();

      // 这里应该调用后端API提交注册信息和code
      // 模拟后端请求
      setTimeout(() => {
        try {
          // 模拟注册成功
          // 更新用户信息
          const userInfoStr = wx.getStorageSync('userInfo');
          if (userInfoStr) {
            const userInfoObj = JSON.parse(userInfoStr);
            // 合并用户信息
            const updatedUserInfo = { ...userInfoObj, ...userInfo };
            wx.setStorageSync('userInfo', JSON.stringify(updatedUserInfo));

            // 更新全局状态
            app.globalData.userInfo = updatedUserInfo;
          }

          // 重新生成token（移除'new'标记）
          const oldToken = wx.getStorageSync('token');
          const newToken = oldToken.replace('_new', '');
          wx.setStorageSync('token', newToken);

          // 隐藏加载提示
          this.setData({
            isLoading: false
          });

          // 跳转到学习中心
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
        } catch (e) {
          console.error('注册后处理失败:', e);
          this.setData({
            isLoading: false
          });
          wx.showToast({
            title: '注册失败，请重试',
            icon: 'none'
          });
        }
      }, 1000);
    } catch (e) {
      console.error('提交注册失败:', e);
      this.setData({
        isLoading: false,
        errorMessage: e.message || '注册失败，请重试'
      });
      wx.showToast({
        title: e.message || '注册失败，请重试',
        icon: 'none'
      });
    }
  }
})