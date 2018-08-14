// pages/todo/todo.js
const app = getApp()
var util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    input: '',
    todos: [],
    leftCount: 0,
    // allCompleted: false,
    logs: [],
    time:'',
    newLi: { id: '', content: '', begin: util.formatTime, needRemind: true, editing: false, done: false, date:'',time:'' }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.load()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value })
  },

  load: function () {
    var todos = wx.getStorageSync('todo_list')
    if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.completed
      }).length
      this.setData({ todos: todos, leftCount: leftCount })
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({ logs: logs })
    }
  },

  save: function () {
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
  },

  addTodoHandle: function (e) {
    if (!this.data.newLi || !this.data.newLi.trim()) return
    var todos = this.data.todos
    todos.push({ 
      name: this.data.newLi, 
      completed: false 
    })
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(), 
      action: 'Add', 
      name: this.data.newLi 
    })
    this.setData({
      input: '',
      todos: todos,
      leftCount: this.data.leftCount + 1,
      logs: logs
    })
    this.save()
  },

  toggleTodoHandle: function(e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? 'Finish' : 'Restart',
      name: this.data.newLi 
    })
    this.setData({
      todos:todos,
      leftCount: this.data.leftCount + (todos[index].completed?-1:1),
      logs:logs
    })
    this.save()
  },
  
  removeTodoHandle: function(e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    var remove = todos.splice(index,1)[0]
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'remove',
      name: remove.newLi
    })
    this.setData({
      todos:todos,
      leftCount:this.data.leftCount - (remove.completed?0:1),
      logs:logs
    })
    this.save()
  },

  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    this.setData({
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length,
      logs: logs
    })
    this.save()
  },
  
  clearCompletedHandle: function (e) {
    var todos = this.data.todos
    var remains = []
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i])
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    this.setData({ todos: remains, logs: logs })
    this.save()
  },

  bindTimeChange: function(e) {
    this.setData({
      'newLi.time': e.detail.value
    })
  },
  
  bindDateChange: function (e) {
    this.setData({
      'newLi.date': e.detail.value
    })
  },

  iptChange(e) {
    this.setData({
      'newLi.content': e.detail.value,
      'newLi.date': util.currentDate(),
      'newLi.time': util.currentTime()
    })
  },

  formReset() {
    this.setData({
      'newLi.content': ''
    })
  },

  //判断输入是否为空，如果不是数据提交
  formSubmit() {
    let todos = this.data.todos, i = 0, newTodo = this.data.newLi;
    if (todos.length > 0) {
      i = Number(util.sortBy(todos, 'id', true)[0].id) + 1;
    }
    newTodo.id = i;
    if (newTodo.content != '') {
      newTodo.begin = newTodo.date + ' ' + newTodo.time
      todos.push(newTodo);
      this.setData({
        leftCount: this.data.leftCount + 1,
        todos: todos,
        newLi: { id: '', content: '', needRemind: true, editing: false, done: false }
      })
    }
    // this.remind();
  },

  //提醒功能
  getRemindArr() {
    let thisLists = this.data.todos, closeT = 0, notDoneLists = [];
    let date = new Date(), now = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()]
    thisLists.map(function (l) {
      if (l.needRemind) {
        notDoneLists.push(l)
      }
    })
    if (notDoneLists.length > 0) {
      // let newLists = util.sortBy(notDoneLists, 'begin'), firstT = (newLists[0].begin).split(':'), id = newLists[0].id, cnt = newLists[0].content;
      var endTime = notDoneLists[0].begin.replace(/-/g, '/');
      var endTimestamp = new Date(endTime).getTime();
      var currentTimestamp = new Date().getTime();
      // closeT = ((firstT[0] - now[0]) * 60 + (firstT[1] - now[1]) - 1) * 60;
      closeT = endTimestamp - currentTimestamp >= 0 ? closeT : 0
      // closeT = closeT >= 0 ? closeT : 0;
      var id = notDoneLists[0].id
      var cnt = notDoneLists[0].content
      return { closeT, id , cnt };
    } else {
      return false;
    }
  },

  //提醒功能提示框，判断是否已完成
  remind() {
    let result = this.getRemindArr(), t = result.closeT, id = result.id, that = this, cnt = result.cnt;
    function alarm() {
      let newLists = that.data.todos;
      wx.showModal({
        title: '已经完成了吗？',
        content: cnt,
        cancelText: '否',
        confirmText: '是',
        success: function (res) {
          if (res.confirm) {
            newLists.map(function (l, index) {
              if (l.id == id) {
                newLists[index].done = true;
                newLists[index].needRemind = false;
              }
            })
            that.setData({
              todos: newLists
            })
          } else {
            newLists.map(function (l, index) {
              if (l.id == id) {
                newLists[index].needRemind = false;
              }
            })
            that.setData({
              todos: newLists
            })
          }
        }
      })

    }
    if (result) {
      setTimeout(alarm, Math.floor(t * 1000), function () {
        that.remind();
      })
    }
  }
})