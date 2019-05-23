const app = getApp();
Page({
  data: {
    orders: [],
  },
  onLoad: function() {
    var that = this;
    wx.request({
      url: 'http://localhost:3008/order/list',
      data: {
        user_id: app.globalData.userInfo.id
      },
      success: function(res) {
        that.setData({
          orders: res.data.data,
        });
      },
    });
  },
});
