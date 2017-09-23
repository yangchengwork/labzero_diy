//index.js
//获取应用实例
const app = getApp();

var beaconUUID = "01122334-4556-6778-899a-abbccddeeff0"; // "e2c56db5-dffb-48d2-b060-d0f5a71096e0";

var rooms = {
    1: '会议室',
    2: '大厅',
    3: '办公室一',
    4: '办公室二'
}

Page({
  data: {
    nickname: '客人',
    beaconState: '未开始搜索',
    searchingState: '扫描中...',
    allBeacons:[]
  },
  onLoad: function () {
      this.scanBeacon()
  },

  scanBeacon() {
      this.setData({ beaconState: '开始搜索Beacon...' })
      let that = this
      wx.startBeaconDiscovery({
          uuids: [beaconUUID],
          success(res) {
              console.log('startBeaconDiscovery success')
              wx.onBeaconUpdate((res) => {
                  let beacons = res.beacons
                  let text = '未找到设备'
                  that.loadingState()
                  if (beacons.length > 0) {
                      let nearest = 0
                      let accur = 9999
                      let room = '未知'
                      that.setData({allBeacons: beacons})
                      beacons.forEach((b) => {
                          if (b.accuracy < 0) {
                            return;
                          }
                          if (b.accuracy < accur && rooms[b.minor] != undefined) {
                              nearest = b.minor
                              accur = b.accuracy
                              room = rooms[nearest]
                          }
                      })
                      text = '当前位置：' + room
                  }
                  console.log('beacon count=' + beacons.length, beacons)
                  that.setData({ beaconState: text })
              })
          }
      })
  },

  currentState: 1,
  loadingState() {
      let subfix = '.'.repeat(this.currentState)
      this.setData({ searchingState: '扫描中' + subfix })
      this.currentState++
      if (this.currentState > 5) {
          this.currentState = 1;
      }
  },
  onHide() {
      wx.stopBeaconDiscovery({
          uuids: [beaconUUID],
      })
  }
})
