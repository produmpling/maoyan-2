var seatmap = require('../../../utils/seatmap');
var limt = 0;
const app = getApp();
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
Page({
  data: {
    shop: {},
    // 0代表空白位置，1代表可选的座位，3代表已被选的座位
    map: [
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    willChange: false,
    hasSelected: false,
    movie: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function(options) {
    var self = this;
    self.setData({
      shop: {
        name: options.theater_name,
        id: options.theater_id,
        time: options.start_time,
        date: options.date,
        effects: options.effects,
        room: options.room,
        price: options.price,
        center: 8,
      },
      movie: {
        id: options.movie_id,
        name: options.movie_name,
      },
    });
    wx.request({
      url: 'http://localhost:3008/order/all',
      success: function(res) {
        if (res.data.success) {
          res.data.data.forEach(function(item, index) {
            if (item.movie_id == self.data.movie.id &&
                item.theater_id == self.data.shop.id && 
                new Date(item.date).toLocaleDateString() == new Date(self.data.shop.date).toLocaleDateString() && 
                item.start_time == self.data.shop.time && 
                item.room == self.data.shop.room) {
                  var seats = item.seats.split(',');
                  var reg = /[0-9]+/g;
                  seats.forEach(function(seat, i) {
                    var xy = seat.match(reg);
                    console.info(xy);
                    self.setData({
                      ['map['+(xy[0]-1)+']['+(xy[1]-1)+']']: 3,
                    });
                  })
                }
          });
        }
      },
    });
    console.info('用户信息', app.globalData.userInfo);
    if (app.globalData.userInfo) {
      self.setData({
        hasUserInfo: true,
      });
    } else if (self.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoCallback = res => {
        self.setData({
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          self.setData({
            hasUserInfo: true,
          });
        },
      });
    }
  },
  onReady: function() {
    var columnArr = [];
    var map = this.data.map;
    for (var i = 1; i <= map.length; i++) {
      columnArr.push(i);
    }
    this.setData({
      columnArr: columnArr,
    });
  },
  onShow: function() {},
  // 下单
  confirm: function() {
    var that = this;
    const skey = wx.getStorageSync('skey');
    let header = {
      'skey': skey,
    };
    wx.request({
      url: 'http://localhost:3008/order/add',
      method: 'POST',
      header: header,
      data: {
        theater_name: that.data.shop.name,
        theater_id: that.data.shop.id,
        movie_id: that.data.movie.id,
        movie_name: that.data.movie.name,
        start_time: that.data.shop.time,
        date: that.data.shop.date,
        room: that.data.shop.room,
        price: that.data.seats.length * that.data.shop.price,
        user_id: app.globalData.userInfo.id,
        seats: that.data.seats.join(',')
      },
      success: function(res) {
        if (res.data.success) {
          wx.navigateTo({
            url: `../../book/book?order_id=${res.data.data}&theater_id=${that.data.shop.id}&theater_name=${that.data.shop.name}&movie_name=${that.data.movie.name}&movie_id=${that.data.movie.id}&effects=${that.data.shop.effects}&start_time=${that.data.shop.time}&date=${that.data.shop.date}&room=${that.data.shop.room}&price=${that.data.seats.length * that.data.shop.price}&seats=${that.data.seats.join(',')}`,
          });
        }
      },
    });
  },
  // 获取用户信息
  getUserInfo: function() {
    const self = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 未授权
          return;
        }
        const skey = wx.getStorageSync('skey');
        if (skey) {
          // 检查 session_key 是否过期
          wx.checkSession({
            // session_key 有效(未过期)
            success: function() {
              const skey = wx.getStorageSync('skey');
              let header = {
                'Content-Type': 'multipart/form-data',
                'accept': 'application/json',
                'skey': skey,
              };
              wx.request({
                url: 'http://localhost:3008/user/detail',
                header: header,
                success: function(res) {
                  if (res.data.success) {
                    self.setData({
                      hasUserInfo: true,
                    });
                    app.globalData.userInfo = res.data.data;
                  }
                },
              });
            },
            // session_key 过期
            fail: function() {
              // session_key过期，重新登录
              self.login();
            },
          });
        } else {
          self.login();
        }
      },
    });
  },
  // 登录
  login: function() {
    const self = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          wx.getUserInfo({
            success: user => {
              wx.request({
                url: 'http://localhost:3008/login/',
                data: {
                  code: code,
                  userInfo: user.userInfo,
                },
                success: function(res) {
                  if (res.data.success) {
                    wx.setStorageSync('skey', res.data.data.session);
                    // 重新获取用户信息
                    self.getUserInfo();
                  }
                },
              });
            },
          });
        } else {
          console.log('获取用户登录凭证失败：' + res.errMsg);
        }
      },
    });
  },
  scrollstart: function(ev) {
    this.sX = ev.changedTouches[0].clientX;
    this.sY = ev.changedTouches[0].clientY;
    this.setData({
      willChange: true,
    });
    console.log(ev);
  },
  scrollmove: function(ev) {
    var mX = ev.changedTouches[0].clientX;
    var mY = ev.changedTouches[0].clientY;
    var deltaX = (mX - this.sX) / 2;
    var deltaY = (mY - this.sY) / 2;
    this.setData({
      deltaX: deltaX,
      deltaY: deltaY,
    });
  },
  scrollend: function(ev) {
    var eX = ev.changedTouches[0].clientX;
    var eY = ev.changedTouches[0].clientY;
    console.log(ev);
    this.setData({
      willChange: false,
    });
  },
  selectSeat: function(ev) {
    var ver = ev.currentTarget.dataset.ver;
    var hor = ev.currentTarget.dataset.hor;
    var map = this.data.map;
    var seats = [];
    var cStr = '';
    limt++;
    if (limt <= 4) {
      map[ver][hor] = 2;
      for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
          if (map[i][j] === 2) {
            cStr = formatNumber(i + 1) + '排' + (j + 1) + '座';
            seats.push(cStr);
          }
        }
      }
      this.setData({
        map: map,
        seats: seats,
      });
    } else {
      wx.showToast({
        title: '最多选4个座位',
        icon: 'success',
        duration: 2000,
      });
    }
  },
  cancelSeat: function(ev) {
    var ver = ev.currentTarget.dataset.ver;
    var hor = ev.currentTarget.dataset.hor;
    var cStr = '';
    var seats = [];
    console.log(ev);
    var map = this.data.map;
    map[ver][hor] = 1;
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if (map[i][j] === 2) {
          cStr = formatNumber(i + 1) + '排' + (j + 1) + '座';
          seats.push(cStr);
        }
      }
    }
    this.setData({
      map: map,
      seats: seats,
    });
  },
});
