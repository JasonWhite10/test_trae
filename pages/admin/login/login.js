// pages/admin/login/login.js
Page({
  data: {
    username: '',
    password: '',
    loading: false,
    errorMsg: ''
  },

  // 输入框内容变化处理
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 登录按钮点击事件
  onLogin() {
    const { username, password } = this.data;

    // 简单验证
    if (!username.trim() || !password.trim()) {
      this.setData({
        errorMsg: '用户名和密码不能为空'
      });
      return;
    }

    this.setData({
      loading: true,
      errorMsg: ''
    });

    // 模拟登录请求
    setTimeout(() => {
      // 这里应该是真实的登录API调用
      // 为了演示，我们使用固定的管理员账户
      if (username === '123' && password === '123') {
        // 登录成功，存储token
        wx.setStorageSync('adminToken', 'fake_admin_token');
        wx.setStorageSync('adminInfo', { username: '管理员' });

        // 添加调试信息
        console.log('登录成功，准备跳转');
        console.log('adminToken:', wx.getStorageSync('adminToken'));
        console.log('adminInfo:', wx.getStorageSync('adminInfo'));

        // 跳转到后台首页
        wx.reLaunch({
          url: '/pages/admin/dashboard/dashboard',
          success: function(res) {
            console.log('跳转成功', res);
          },
          fail: function(err) {
            console.log('跳转失败', err);
          }
        });
      } else {
        this.setData({
          errorMsg: '用户名或密码错误',
          loading: false
        });
      }
    }, 1000);
  },

  // 生命周期函数
  onLoad() {
    // 检查是否已登录
    const adminToken = wx.getStorageSync('adminToken');
    if (adminToken) {
      wx.redirectTo({
        url: '/pages/admin/dashboard/dashboard'
      });
    }
  }
})