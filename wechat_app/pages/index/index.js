//index.js
//获取应用实例
const app = getApp();

var beaconUUID = "01122334-4556-6778-899a-abbccddeeff0"; // "e2c56db5-dffb-48d2-b060-d0f5a71096e0";

var rooms = {
    1: '会议室',
    2: '大厅',
    3: '办公室一',
    4: '办公室二'
};

var dataArray = {
  1: [],
  2: [],
  3: [],
  4: []
};

var countArray = {
  1: 0,
  2: 0,
  3: 0,
  4: 0
};

Page({
  data: {
    nickname: '客人',
    beaconState: '未开始搜索',
    searchingState: '扫描中...',
    allBeacons:[]
  },

  onLoad: function () {
      this.scanBeacon();
      setInterval(this.displayReload, 2000);
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
                // let text = '未找到设备'
                that.loadingState()
                if (beacons.length > 0) {
                    // let nearest = 0
                    // let accur = 9999
                    // let room = '未知'
                    // that.setData({allBeacons: beacons})
                    beacons.forEach((b) => {
                        if (b.accuracy < 0) {
                          return;
                        }
                        that.pushData(b);
                        /*
                        if (b.accuracy < accur && rooms[b.minor] != undefined) {
                            nearest = b.minor
                            accur = b.accuracy
                            room = rooms[nearest]
                        }*/
                    })
                    // text = '当前位置：' + room
                }
                // console.log('beacon count=' + beacons.length, beacons)
                // that.setData({ beaconState: text })
              })
          }
      })
  },

  pushData(beacon) {
    var i = beacon.minor;
    if (rooms[i] != undefined) {
      countArray[i] = dataArray[i].push(beacon.accuracy);
    }
  },

  displayReload() {
    let text = '未找到设备';
    console.log('count:', countArray);
    let nearest = 0
    let accur = 9999
    let room = '未知'
    let beacons = [];
    for (var i=1; i<5; i++) {
      var d = dataArray[i];
      if (d.length > 0) {
        var sum = 0;
        d.forEach((v) => {
          sum += v;
        });
        sum /= d.length;
        console.log("" + i, " sum=" + sum);
        if (sum < accur) {
          accur = sum;
          nearest = i;
          room = rooms[nearest];
        }
        beacons.push({ minor: i, accuracy: sum});
      }
    }
    text = '当前位置：' + room;
    this.setData({ beaconState: text, allBeacons: beacons });
    dataArray[1].length = dataArray[2].length = dataArray[3].length = dataArray[4].length = 0;
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
