// pages/lock/lock.js

var qcloud = require('../../vendor/wafer2-client-sdk/index');
// 引入配置
var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      doorKey: 'Loading',
      user: {}
  },

  copyID: function (e) {
      wx.setClipboardData({
          data: e.currentTarget.dataset.openid,
          success: function() {
              wx.showToast({
                  title: '复制成功',
              });
          }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      // 登录
      qcloud.login({
          success(result) {
              qcloud.request({
                  method: 'GET',
                  login: true,
                  json: true,
                  url: config.service.lockUrl,
                  success: (r) => {
                      console.log(r)
                      if (r.data.code == 0) {
                          that.setData({
                              doorKey: r.data.data.doorKey,
                              user: r.data.data.user
                          })
                      } else {
                          that.setData({
                              doorKey: r.data.data.error,
                              user: r.data.data.user
                          })
                      }
                  }, fail: (err) => {
                      console.log(err)
                  }
              })
          }
      })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //   wx.login({
    //       success: function(res) {
    //           if (res.code) {
    //               console.log('Login success')
    //           }
    //       }
    //   })
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
  
  }
})