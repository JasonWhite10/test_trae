// pages/admin/dataAnalysis/dataAnalysis.js
Page({
  data: {
    loading: true,
    statistics: {
      totalUsers: 0,
      activeUsers: 0,
      avgVideoTime: 0,
      passRate: 0
    },
    chartData: {
      cityParticipation: [],  // 各市总参与人数
      cityIdentityDistribution: [],  // 各市身份类型分布
      cityExamCount: []  // 各市总考试次数
    },
    dateRange: 'week', // 'day', 'week', 'month', 'year',
    cities: ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市', '武汉市'],
    identityTypes: ['学生', '教师', '管理员', '其他']
  },

  // 切换日期范围
  onDateRangeChange(e) {
    const dateRange = e.detail.value;
    this.setData({
      dateRange,
      loading: true
    });
    this.loadData();
  },

  // 加载数据
  loadData() {
    // 这里应该是真实的API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      // 生成各市总参与人数数据
      const cityParticipation = this.data.cities.map(city => ({
        city,
        participants: Math.floor(Math.random() * 500 + 100)
      }));

      // 生成各市身份类型分布数据
      const cityIdentityDistribution = this.data.cities.map(city => {
        const distribution = this.data.identityTypes.reduce((acc, type) => {
          acc[type] = Math.floor(Math.random() * 100 + 10);
          return acc;
        }, {});
        return { city, distribution };
      });

      // 生成各市总考试次数数据
      const cityExamCount = this.data.cities.map(city => ({
        city,
        exams: Math.floor(Math.random() * 800 + 200)
      }));

      this.setData({
        statistics: {
          totalUsers: Math.floor(Math.random() * 1000 + 500),
          activeUsers: Math.floor(Math.random() * 300 + 100),
          avgVideoTime: Math.floor(Math.random() * 10 + 5),
          passRate: Math.floor(Math.random() * 30 + 70)
        },
        chartData: {
          cityParticipation,
          cityIdentityDistribution,
          cityExamCount
        },
        loading: false
      });

      // 这里应该初始化图表
      // 为了简化，我们省略了图表初始化代码
    }, 1000);
  },

  // 生命周期函数
  onLoad() {
    // 检查登录状态
    const adminToken = wx.getStorageSync('adminToken');
    if (!adminToken) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
      return;
    }

    this.loadData();
  },

  // 生命周期函数 - 监听页面显示
  onShow() {
    // 每次显示页面时检查登录状态
    const adminToken = wx.getStorageSync('adminToken');
    if (!adminToken) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
    }
  }
})