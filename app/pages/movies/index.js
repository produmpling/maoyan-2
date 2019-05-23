var app = getApp();
var event = require('../../utils/event');
Page({
  data: {
    head: {
      currentCity: '',
      placestr: '找电影',
    },
    movies: [],
    banners: [],
    counts: 10,
    start: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function() {
    var that = this;
    event.on('ChangeCity', that, function(city) {
      that.setData({
        'head.currentCity': city,
      });
    });
    that.getMovies();
    wx.request({
      url: 'http://localhost:3008/banner/get',
      success: function(res) {
        that.setData({
          banners: res.data.data,
        });
      },
    });
    console.info('用户信息', app.globalData.userInfo);
    if (app.globalData.userInfo) {
      that.setData({
        hasUserInfo: true,
      });
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoCallback = res => {
        that.setData({
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          that.setData({
            hasUserInfo: true,
          });
        },
      });
    }
  },
  getMovies: function(name) {
    var that = this;
    wx.request({
      url: 'http://localhost:3008/movie/list',
      data: {
        name: name ? name : null
      },
      success: function(res) {
        that.setData({
          movies: res.data.data,
        });
      },
    });
  },
  searchinput: function(ev) {
    var that = this;
    setTimeout(function() {
      that.getMovies(ev.detail.value);
    }, 500);
  },
  onShow: function() {
    console.log('index-onShow');
    var that = this;
    app.getpol(function(currentCity) {
      that.setData({
        'head.currentCity': currentCity,
      });
    });
  },
  onReachBottom: function() {
    var that = this;
    wx.request({
      url:
        'http://localhost:3008/api/index?city=' +
        that.data.currentCity +
        '&counts=' +
        that.data.counts +
        '&start=' +
        that.data.start,
      success: function(res) {
        var moviesLi = that.data.indexData.moviesList;
        var nextLi = res.data.data.moviesList;
        var newLi = moviesLi.concat(nextLi);
        that.setData({
          'indexData.moviesList': newLi,
          start: that.data.start + that.data.counts,
        });
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
});
