// pages/pomodoro/pomodoro.js
const defaultLogName = {
  work: '工作',
  rest: '休息'
}
const defaultTime = {
  defaultWorkTime: 25,
  defaultRestTime: 4
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRunning: false,
    leftDeg: 45,
    rightDeg: -45,
    completed: false,
    isRuning: false,
    showConfig:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let workTime = wx.getStorageSync('workTime')
    let restTime = wx.getStorageSync('restTime')
    if (!workTime) {
      wx.setStorage({
        key: 'workTime',
        data: defaultTime.defaultWorkTime
      })
    }
    if (!restTime) {
      wx.setStorage({
        key: 'restTime',
        data: defaultTime.defaultRestTime
      })
    }
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
    if (this.data.isRuning) return
    let workTime = wx.getStorageSync('workTime')
    let restTime = wx.getStorageSync('restTime')
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    })
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

  startTimer: function (e) {
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = e.target.dataset.type
    let showTime = this.data[timerType + 'Time']
    console.log(timerType)
    let keepTime = showTime * 60 * 1000
    let logName = this.logName || defaultLogName[timerType]

    if (!isRuning) {
      this.timer = setInterval((function () {
        this.updateTimer()
        // this.startNameAnimation()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }

    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00',
      taskName: logName
    })

    this.data.log = {
      name: logName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      // action: actionName[isRuning ? 'stop' : 'start'],
      type: timerType
    }

    this.saveLog(this.data.log)
  },

  updateTimer: function () {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = Math.floor(remainingTime / (60 * 60)) % 24
    if(H < 10) {
      H = '0'+H
    }
    let M = Math.floor(remainingTime / (60)) % 60
    if (M < 10) {
      M = '0' + M
    }
    let S = Math.floor(remainingTime) % 60
    if (S < 10) {
      S = '0' + S
    }
    let halfTime

    // update text
    if (remainingTime > 0) {
      let remainTimeText = (H == "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      this.stopTimer()
      return
    }

    // update circle progress
    // halfTime = log.keepTime / 2
    // if ((remainingTime * 1000) > halfTime) {
    //   this.setData({
    //     leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
    //   })
    // } else {
    //   this.setData({
    //     leftDeg: -135
    //   })
    //   this.setData({
    //     rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
    //   })
    // }
  },

  stopTimer: function () {
    // reset circle progress
    this.setData({

      // leftDeg: initDeg.left,
      // rightDeg: initDeg.right
    })

    // clear timer
    this.timer && clearInterval(this.timer)
  },

  saveLog: function (log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  },

  changeLogName: function (e) {
    this.logName = e.detail.value
  },

  changeTime: function (e) {
    let key = e.target.dataset.type + 'Time'
    let time = e.detail.value
    wx.setStorage({
      key: key,
      data: time
    })
    if (key == 'workTime') {
      this.setData({
        workTime: time,
        remainTimeText: time + ':00'
      })
    } else {
      this.setData({
        restTime: time,
      })
    }
  },

  showConfig: function() {
    console.log(this.data.showConfig)
    this.setData({
      showConfig: !this.data.showConfig,
    })
  }
})