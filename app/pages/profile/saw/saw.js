const app = getApp();
Page({
  data: {
    favorites: [],
  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: 'http://localhost:3008/favorite/list',
      data: {
        user_id: app.globalData.userInfo.id
      },
      success: function(res) {
        that.setData({
          favorites: res.data.data,
        });
      },
    });
  },
});
