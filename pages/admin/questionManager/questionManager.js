// pages/admin/questionManager/questionManager.js
Page({
  data: {
    questionList: [],
    loading: true,
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    searchKeyword: '',
    questionType: 'all'
  },

  // 搜索输入框变化处理
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 切换题目类型
  onTypeChange(e) {
    this.setData({
      questionType: e.detail.value,
      currentPage: 1,
      questionList: []
    });
    this.loadQuestionList();
  },

  // 执行搜索
  onSearch() {
    this.setData({
      currentPage: 1,
      questionList: []
    });
    this.loadQuestionList();
  },

  // 加载题目列表
  loadQuestionList() {
    this.setData({
      loading: true
    });

    // 这里应该是真实的API调用
    // 为了演示，我们使用模拟数据
    setTimeout(() => {
      const mockQuestions = [];
      const startIndex = (this.data.currentPage - 1) * this.data.pageSize;

      // 模拟题目数据
      const allQuestions = [
        { id: 1, title: '下列哪种情况属于船舶重大事故？', type: 'single', answerCount: 128 },
        { id: 2, title: '船舶消防的基本原则是什么？', type: 'single', answerCount: 96 },
        { id: 3, title: '海上急救的基本步骤包括哪些？', type: 'multiple', answerCount: 156 },
        { id: 4, title: '船舶航行中遇到恶劣天气时应采取哪些措施？', type: 'multiple', answerCount: 87 },
        { id: 5, title: '船舶防污染的主要措施有哪些？', type: 'multiple', answerCount: 142 },
        { id: 6, title: '船员值班制度的基本要求是什么？', type: 'single', answerCount: 76 },
        { id: 7, title: '船舶应急计划应包括哪些内容？', type: 'multiple', answerCount: 112 },
        { id: 8, title: '下列哪种设备不属于船舶通信设备？', type: 'single', answerCount: 93 },
        { id: 9, title: '船舶安全检查的主要内容包括哪些？', type: 'multiple', answerCount: 85 },
        { id: 10, title: '国际海上避碰规则适用于哪些船舶？', type: 'single', answerCount: 108 },
        { id: 11, title: '船舶载重线的作用是什么？', type: 'single', answerCount: 67 },
        { id: 12, title: '海上救助的基本原则是什么？', type: 'multiple', answerCount: 79 },
      ];

      // 模拟筛选
      let filteredQuestions = allQuestions;
      if (this.data.questionType !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q.type === this.data.questionType);
      }

      const keyword = this.data.searchKeyword.toLowerCase();
      if (keyword) {
        filteredQuestions = filteredQuestions.filter(q => q.title.toLowerCase().includes(keyword));
      }

      // 模拟分页
      for (let i = startIndex; i < startIndex + this.data.pageSize && i < filteredQuestions.length; i++) {
        mockQuestions.push(filteredQuestions[i]);
      }

      this.setData({
        questionList: [...this.data.questionList, ...mockQuestions],
        totalCount: filteredQuestions.length,
        loading: false
      });
    }, 800);
  },

  // 上拉加载更多
  onReachBottom() {
    if (!this.data.loading && this.data.questionList.length < this.data.totalCount) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
      this.loadQuestionList();
    }
  },

  // 跳转到题目编辑页面
  toEditQuestion(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/questionManager/editQuestion?id=${id}`
    });
  },

  // 删除题目
  deleteQuestion(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除该题目吗？',
      success: (res) => {
        if (res.confirm) {
          // 这里应该是真实的删除API调用
          // 为了演示，我们直接从列表中移除
          const newQuestionList = this.data.questionList.filter(question => question.id !== id);
          this.setData({
            questionList: newQuestionList,
            totalCount: this.data.totalCount - 1
          });

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 添加新题目
  addNewQuestion() {
    wx.navigateTo({
      url: '/pages/admin/questionManager/editQuestion'
    });
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

    this.loadQuestionList();
  },

  // 生命周期函数 - 监听页面显示
  onShow() {
    // 如果从编辑页面返回，刷新列表
    if (this.data.questionList.length > 0) {
      this.setData({
        questionList: [],
        currentPage: 1
      });
      this.loadQuestionList();
    }
  }
})