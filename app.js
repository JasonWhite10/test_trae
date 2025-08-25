// app.js
App({
  globalData: {
    userInfo: null,
    isLogin: false,
    regionList: [
      '沈阳市-和平区', '沈阳市-沈河区', '沈阳市-大东区', '沈阳市-皇姑区', '沈阳市-铁西区',
      '沈阳市-苏家屯区', '沈阳市-浑南区', '沈阳市-沈北新区', '沈阳市-于洪区', '沈阳市-辽中区',
      '沈阳市-康平县', '沈阳市-法库县', '沈阳市-新民市',
      '大连市-中山区', '大连市-西岗区', '大连市-沙河口区', '大连市-甘井子区', '大连市-旅顺口区',
      '大连市-金州区', '大连市-普兰店区', '大连市-长海县', '大连市-瓦房店市', '大连市-庄河市',
      '鞍山市-铁东区', '鞍山市-铁西区', '鞍山市-立山区', '鞍山市-千山区', '鞍山市-台安县',
      '鞍山市-岫岩满族自治县', '鞍山市-海城市',
      '抚顺市-新抚区', '抚顺市-东洲区', '抚顺市-望花区', '抚顺市-顺城区', '抚顺市-抚顺县',
      '抚顺市-新宾满族自治县', '抚顺市-清原满族自治县',
      '本溪市-平山区', '本溪市-溪湖区', '本溪市-明山区', '本溪市-南芬区', '本溪市-本溪满族自治县',
      '本溪市-桓仁满族自治县',
      '丹东市-元宝区', '丹东市-振兴区', '丹东市-振安区', '丹东市-宽甸满族自治县', '丹东市-东港市',
      '丹东市-凤城市',
      '锦州市-古塔区', '锦州市-凌河区', '锦州市-太和区', '锦州市-黑山县', '锦州市-义县',
      '锦州市-凌海市', '锦州市-北镇市',
      '营口市-站前区', '营口市-西市区', '营口市-鲅鱼圈区', '营口市-老边区', '营口市-盖州市',
      '营口市-大石桥市',
      '阜新市-海州区', '阜新市-新邱区', '阜新市-太平区', '阜新市-清河门区', '阜新市-细河区',
      '阜新市-阜新蒙古族自治县', '阜新市-彰武县',
      '辽阳市-白塔区', '辽阳市-文圣区', '辽阳市-宏伟区', '辽阳市-弓长岭区', '辽阳市-太子河区',
      '辽阳市-辽阳县', '辽阳市-灯塔市',
      '盘锦市-双台子区', '盘锦市-兴隆台区', '盘锦市-大洼区', '盘锦市-盘山县',
      '铁岭市-银州区', '铁岭市-清河区', '铁岭市-铁岭县', '铁岭市-西丰县', '铁岭市-昌图县',
      '铁岭市-调兵山市', '铁岭市-开原市',
      '朝阳市-双塔区', '朝阳市-龙城区', '朝阳市-朝阳县', '朝阳市-建平县', '朝阳市-喀喇沁左翼蒙古族自治县',
      '朝阳市-北票市', '朝阳市-凌源市',
      '葫芦岛市-连山区', '葫芦岛市-龙港区', '葫芦岛市-南票区', '葫芦岛市-绥中县', '葫芦岛市-建昌县',
      '葫芦岛市-兴城市'
    ],
    identityOptions: ['船长', '船东', '家属', '船员'],
    quizSubmitted: false,
    quizProgress: null
  },

  /**
   * 检查用户登录状态
   * @param {Boolean} needRedirect - 是否在未登录时跳转登录页
   * @returns {Boolean} - 是否已登录
   */
  checkLoginStatus: function(needRedirect = true) {
    const token = wx.getStorageSync('token');
    const isLogin = !!token;
    
    this.globalData.isLogin = isLogin;
    
    if (!isLogin && needRedirect) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
    
    return isLogin;
  },

  /**
   * 检查管理员登录状态
   * @param {Boolean} needRedirect - 是否在未登录时跳转登录页
   * @returns {Boolean} - 管理员是否已登录
   */
  checkAdminLoginStatus: function(needRedirect = true) {
    const adminToken = wx.getStorageSync('adminToken');
    const adminInfo = wx.getStorageSync('adminInfo');
    const isAdminLogin = !!adminToken && !!adminInfo;
    
    if (!isAdminLogin && needRedirect) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
    }
    
    return isAdminLogin;
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
      const isLogin = this.checkLoginStatus(false); // 检查登录状态但不跳转
      if (isLogin) {
        const userInfo = wx.getStorageSync('userInfo') || {};
        this.globalData.userInfo = userInfo;
      } else {
        this.globalData.userInfo = {};
      }
    } catch (e) {
      console.error('初始化登录状态失败:', e);
      this.globalData.isLogin = false;
      this.globalData.userInfo = {};
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
            reject(new Error('登录失败,无法获取code'));
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