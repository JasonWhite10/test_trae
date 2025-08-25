// pages/exam/exam.js
Page({
  data: {
    questions: [],
    currentQuestionIndex: 0,
    selectedOptions: [],
    isFinished: false,
    score: 0,
    totalQuestions: 5
  },

  onLoad: function() {
    // 检查登录状态
    if (!getApp().globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }

    // 检查是否已提交过测验
    if (getApp().globalData.quizSubmitted) {
      wx.showToast({
        title: '您已提交过测验，无法再次尝试',
        icon: 'none'
      });
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/learning/learning'
        });
      }, 1000);
      return;
    }

    // 检查是否有保存的进度
    const savedProgress = getApp().globalData.quizProgress;
    if (savedProgress) {
      // 恢复保存的进度
      this.setData({
        questions: savedProgress.questions,
        currentQuestionIndex: savedProgress.currentQuestionIndex,
        selectedOptions: savedProgress.selectedOptions,
        totalQuestions: savedProgress.totalQuestions
      });
      wx.showToast({
        title: '已恢复上次测验进度',
        icon: 'success'
      });
    } else {
      // 生成新的模拟题目
      this.generateQuestions();

      // 初始化选中选项数组
      const selectedOptions = new Array(this.data.totalQuestions).fill(null);
      this.setData({
        selectedOptions: selectedOptions
      });
    }
  },

  generateQuestions: function() {
    // 模拟题库
    const questionTypes = ['single', 'judgment'];
    const questions = [];

    for (let i = 0; i < this.data.totalQuestions; i++) {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      let question = {
        id: i + 1,
        type: type,
        title: '问题 ' + (i + 1) + ': ' + this.generateQuestionTitle(type),
        hasImage: Math.random() > 0.7, // 30%的题目有图片
        image: 'https://via.placeholder.com/300x200?text=Question+' + (i + 1),
        options: [],
        correctAnswer: '',
        explanation: '这是问题 ' + (i + 1) + ' 的详细解析...'
      };

      if (type === 'single') {
        // 单选题
        const optionCount = 4;
        const options = ['A', 'B', 'C', 'D'];
        question.correctAnswer = options[Math.floor(Math.random() * optionCount)];

        for (let j = 0; j < optionCount; j++) {
          question.options.push({
            letter: options[j],
            text: '选项 ' + options[j] + ': ' + this.generateOptionText()
          });
        }
      } else if (type === 'judgment') {
        // 判断题
        question.options = [
          { letter: 'A', text: '正确' },
          { letter: 'B', text: '错误' }
        ];
        question.correctAnswer = Math.random() > 0.5 ? 'A' : 'B';
      }

      questions.push(question);
    }

    this.setData({
      questions: questions
    });
  },

  generateQuestionTitle: function(type) {
    const singleTitles = [
      '以下哪种情况需要立即停止航行？',
      '船舶在雾中航行时，应使用什么灯光信号？'
    ];

    const judgmentTitles = [
      '船舶在任何情况下都应给渔船让路。',
      '雾中航行时，听到他船雾号，应立即停车。'
    ];

    if (type === 'single') {
      return singleTitles[Math.floor(Math.random() * singleTitles.length)];
    } else {
      return judgmentTitles[Math.floor(Math.random() * judgmentTitles.length)];
    }
  },

  generateOptionText: function() {
    const optionTexts = [
      '能见度小于1海里时',
      '能见度小于2海里时',
      '能见度小于3海里时',
      '能见度小于4海里时',
      '开启雾灯和航行灯',
      '开启所有灯光',
      '仅开启航行灯',
      '关闭所有灯光'
    ];

    return optionTexts[Math.floor(Math.random() * optionTexts.length)];
  },

  selectOption: function(e) {
    const { index } = e.currentTarget.dataset;
    const { currentQuestionIndex } = this.data;
    const selectedOptions = [...this.data.selectedOptions];
    selectedOptions[currentQuestionIndex] = index;

    this.setData({
      selectedOptions: selectedOptions
    });
  },

  nextQuestion: function() {
    if (this.data.currentQuestionIndex < this.data.totalQuestions - 1) {
      this.setData({
        currentQuestionIndex: this.data.currentQuestionIndex + 1
      });
    }
  },

  prevQuestion: function() {
    if (this.data.currentQuestionIndex > 0) {
      this.setData({
        currentQuestionIndex: this.data.currentQuestionIndex - 1
      });
    }
  },

  submitExam: function() {
    // 检查是否所有题目都已回答
    if (this.data.selectedOptions.includes(null)) {
      wx.showModal({
        title: '提示',
        content: '还有题目未完成，确定要提交吗？',
        success: (res) => {
          if (res.confirm) {
            this.calculateScore();
          }
        }
      });
    } else {
      this.calculateScore();
    }
  },

  // 保存测验进度
  saveProgress: function() {
    if (!getApp().globalData.quizSubmitted) {
      const progress = {
        questions: this.data.questions,
        currentQuestionIndex: this.data.currentQuestionIndex,
        selectedOptions: this.data.selectedOptions,
        totalQuestions: this.data.totalQuestions
      };
      getApp().globalData.quizProgress = progress;
    }
  },

  // 当页面卸载时保存进度
  onUnload: function() {
    this.saveProgress();
  },

  calculateScore: function() {
    const { questions, selectedOptions } = this.data;
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const selectedIndex = selectedOptions[i];

      if (selectedIndex !== null) {
        const selectedOption = question.options[selectedIndex];
        if (selectedOption.letter === question.correctAnswer) {
          score += 2; // 每题2分，共100分
        }
      }
    }

    this.setData({
      score: score,
      isFinished: true
    });

    // 标记测验为已提交
    getApp().globalData.quizSubmitted = true;
    // 清除保存的进度
    getApp().globalData.quizProgress = null;

    // 跳转到结果页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/examResult/examResult?score=' + score
      });
    }, 1000);
  }
})