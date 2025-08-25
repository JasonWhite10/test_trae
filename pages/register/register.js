// pages/register/register.js
Page({
  data: {
    name: '',
    shipNumber: '',
    gender: -1, // -1:请选择, 0:男, 1:女
    genderIndex: 0, // 用于picker显示
    genderRange: ['请选择您的性别', '男', '女'], // picker的选项列表
    identityIndex: 0,
    identityList: ['请输入您的身份'], // 初始添加提示文本
    errorMessage: '',
    isLoading: false,
    // 地区选择相关数据
    cityList: [],
    cityIndex: 0,
    districtList: [],
    districtIndex: 0,
    selectedCity: '',
    selectedDistrict: '',
    cityDistrictMap: {} // 城市到区县的映射
  },

  /**
   * 选择性别
   * @param {Object} e - 事件对象
   */
  bindGenderChange: function(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      genderIndex: index,
      gender: index === 0 ? -1 : index - 1,
      errorMessage: ''
    });
  },

  /**
   * 页面加载时执行
   */
  onLoad: function() {
    try {
      // 获取全局数据
      const app = getApp();
      
      // 初始化身份列表，添加提示文本
      const identityOptions = app.globalData.identityOptions || [];
      // 确保第一个选项是"请输入您的身份"
      if (identityOptions.length > 0 && identityOptions[0] !== '请输入您的身份') {
        this.setData({
          identityList: ['请输入您的身份', ...identityOptions]
        });
      } else {
        this.setData({
          identityList: identityOptions
        });
      }
      
      // 处理地区数据，构建城市-区县映射
      const regionList = app.globalData.regionList || [];
      const cityDistrictMap = {};
      const cityList = [];
      
      regionList.forEach(region => {
        const [city, district] = region.split('-');
        if (city && district) {
          if (!cityDistrictMap[city]) {
            cityDistrictMap[city] = [];
            cityList.push(city);
          }
          cityDistrictMap[city].push(district);
        }
      });
      
      this.setData({
        cityList: cityList,
        cityDistrictMap: cityDistrictMap
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
   * 选择城市
   * @param {Object} e - 事件对象
   */
  bindCityChange: function(e) {
    const cityIndex = e.detail.value;
    const selectedCity = this.data.cityList[cityIndex];
    const districtList = this.data.cityDistrictMap[selectedCity] || [];
    
    this.setData({
      cityIndex: cityIndex,
      selectedCity: selectedCity,
      districtList: districtList,
      districtIndex: 0,
      selectedDistrict: '',
      errorMessage: ''
    });
  },
  
  /**
   * 选择区县
   * @param {Object} e - 事件对象
   */
  bindDistrictChange: function(e) {
    const districtIndex = e.detail.value;
    const selectedDistrict = this.data.districtList[districtIndex];
    
    this.setData({
      districtIndex: districtIndex,
      selectedDistrict: selectedDistrict,
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
    const { name, shipNumber, gender, selectedCity, selectedDistrict, identityList, identityIndex } = this.data;

    if (!name) {
      return { valid: false, message: '请输入姓名' };
    }

    if (gender === -1) {
      return { valid: false, message: '请选择性别' };
    }

    if (!shipNumber) {
      return { valid: false, message: '请输入船号' };
    }

    if (!selectedCity) {
      return { valid: false, message: '请选择市' };
    }

    if (!selectedDistrict) {
      return { valid: false, message: '请选择区县' };
    }

    // 确保用户选择了有效的身份选项，而不是默认提示文本
    if (!identityList || identityList.length <= 1 || identityIndex === undefined || identityIndex === 0) {
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

      const { name, shipNumber, gender, selectedCity, selectedDistrict, identityIndex, identityList } = this.data;
      
      // 准备提交的数据
      const userInfo = {
        name: name,
        gender: gender === 0 ? '男' : '女',
        shipNumber: shipNumber,
        region: `${selectedCity}${selectedDistrict}`,
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
        } else {
          // 首次注册，直接存储
          wx.setStorageSync('userInfo', JSON.stringify(userInfo));
          app.globalData.userInfo = userInfo;
        }

          // 重新生成token（移除'new'标记）
          const oldToken = wx.getStorageSync('token');
          const newToken = oldToken.replace('_new', '');
          wx.setStorageSync('token', newToken);
          
          // 更新全局登录状态
          app.globalData.isLogin = true;

          // 隐藏加载提示
          this.setData({
            isLoading: false
          });

          // 跳转到学习中心（使用switchTab因为learning是tabBar页面）
          wx.switchTab({
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