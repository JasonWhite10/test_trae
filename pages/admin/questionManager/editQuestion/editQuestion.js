// pages/admin/questionManager/editQuestion/editQuestion.js
Page({
  data: {
    questionId: '',
    title: '',
    type: 'single', // 'single' 或 'multiple'
    options: [{ id: 1, content: '', isCorrect: false }],
    explanation: '',
    isEditing: false,
    loading: false
  },

  // 输入框内容变化处理
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 选项内容变化处理
  onOptionChange(e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const options = [...this.data.options];
    options[index].content = value;
    this.setData({
      options
    });
  },

  // 切换选项正确性
  toggleOptionCorrect(e) {
    const { index } = e.currentTarget.dataset;
    const options = [...this.data.options];

    // 如果是单选题，只能有一个正确选项
    if (this.data.type === 'single') {
      options.forEach((option, i) => {
        option.isCorrect = i === index;
      });
    } else {
      options[index].isCorrect = !options[index].isCorrect;
    }

    this.setData({
      options
    });
  },

  // 添加选项
  addOption() {
    const options = [...this.data.options];
    const newId = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
    options.push({ id: newId, content: '', isCorrect: false });
    this.setData({
      options
    });
  },

  // 删除选项
  deleteOption(e) {
    const { index } = e.currentTarget.dataset;
    const options = [...this.data.options];

    // 至少保留一个选项
    if (options.length > 1) {
      options.splice(index, 1);
      this.setData({
        options
      });
    } else {
      wx.showToast({
        title: '至少保留一个选项',
        icon: 'none'
      });
    }
  },

  // 切换题目类型
  onTypeChange(e) {
    const type = e.detail.value;
    const options = [...this.data.options];

    // 如果切换为单选题，只保留第一个正确选项
    if (type === 'single') {
      const firstCorrectIndex = options.findIndex(o => o.isCorrect);
      options.forEach((option, i) => {
        option.isCorrect = i === firstCorrectIndex;
      });
    }

    this.setData({
      type,
      options
    });
  },

  // 保存题目信息
  saveQuestion() {
    const { title, type, options, explanation } = this.data;

    // 简单验证
    if (!title.trim()) {
      wx.showToast({
        title: '请输入题目内容',
        icon: 'none'
      });
      return;
    }

    if (options.length < 2) {
      wx.showToast({
        title: '至少添加两个选项',
        icon: 'none'
      });
      return;
    }

    const hasEmptyOption = options.some(option => !option.content.trim());
    if (hasEmptyOption) {
      wx.showToast({
        title: '选项内容不能为空',
        icon: 'none'
      });
      return;
    }

    const hasCorrectOption = options.some(option => option.isCorrect);
    if (!hasCorrectOption) {
      wx.showToast({
        title: '请设置正确选项',
        icon: 'none'
      });
      return;
    }

    this.setData({
      loading: true
    });

    // 这里应该是真实的保存API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      wx.showToast({
        title: this.data.isEditing ? '更新成功' : '添加成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  },

  // 生命周期函数
  onLoad(options) {
    // 检查登录状态
    const adminToken = wx.getStorageSync('adminToken');
    if (!adminToken) {
      wx.redirectTo({
        url: '/pages/admin/login/login'
      });
      return;
    }

    // 检查是否是编辑模式
    if (options.id) {
      this.setData({
        questionId: options.id,
        isEditing: true
      });

      // 加载题目详情
      this.loadQuestionDetails();
    }
  },

  // 加载题目详情
  loadQuestionDetails() {
    this.setData({
      loading: true
    });

    // 这里应该是真实的API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      this.setData({
        title: '下列哪种情况属于船舶重大事故？',
        type: 'single',
        options: [
          { id: 1, content: '船舶碰撞，造成轻微损伤', isCorrect: false },
          { id: 2, content: '船舶搁浅，造成重大结构损坏', isCorrect: true },
          { id: 3, content: '船舶失火，及时扑灭无损失', isCorrect: false },
          { id: 4, content: '船员轻微受伤', isCorrect: false }
        ],
        explanation: '根据国际海事组织定义，造成重大结构损坏或人员伤亡的事故属于重大事故。',
        loading: false
      });
    }, 800);
  }
})