//index.js
//获取应用实例
const app = getApp();

var beaconUUID = "e2c56db5-dffb-48d2-b060-d0f5a71096e0";

Page({
  data: {
    motto: 'Hello World',
    ibeacon: 'gump',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
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
  },
  readBeaconData: function(beacons) {
    var num = beacons.length;
    var strNumber = "共找到:" + num.toString() + "个";
    this.setData({
      motto: "共找到:" + strNumber
    });
  },
  scanBeacon: function scanBeacon(e) {
    this.setData({
      motto: "开始扫描"
    });
    var that = this;
    wx.startBeaconDiscovery({
      uuids: [beaconUUID],
      success(res) {
        console.log("gump ibeacon", res);
        wx.getBeacons({
          success(res) {
            console.log('beacons:', JSON.stringify(res.beacons), res.beacons[0], res.errMsg);
          }
        });
        wx.onBeaconUpdate(function (res) {
          // console.log("update", res.beacons);
          that.readBeaconData(res.beacons);
        });
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
