
Page({
  data: {

  },
  onLoad: function (options) {
    var self = this;
    if (options.id) {
      wx.request({
        url: 'http://localhost:3008/order/detail',
        data: {
          id: options.id
        },
        success: function(res) {
          if (res.data.success) {
            self.setData({
              order_id: options.id,
              theater_name: res.data.data.theater_name,
              theater_id: res.data.data.theater_id,
              movie_id: res.data.data.movie_id,
              movie_name: res.data.data.movie_name,
              start_time: res.data.data.start_time,
              date: new Date(res.data.data.date).toLocaleDateString(),
              room: res.data.data.room,
              seats: res.data.data.seats,
              price: res.data.data.price,
              status: res.data.data.status
            });
          }
        },
      });
    } else {
      self.setData({
        order_id: options.order_id,
        theater_name: options.theater_name,
        theater_id: options.theater_id,
        movie_id: options.movie_id,
        movie_name: options.movie_name,
        start_time: options.start_time,
        date: options.date,
        room: options.room,
        seats: options.seats,
        price: options.price,
      });
    }
  },
  pay: function() {
    wx.showToast({
      title: '正在支付...',
      icon: 'loading'
    });
    var that = this;
    var params = {
      id: this.data.order_id
    };
    const skey = wx.getStorageSync('skey');
    let header = {
      'skey': skey,
    };
    wx.request({
      url: 'http://localhost:3008/order/update',
      data: params,
      header: header,
      method: 'POST',
      success: function(res) {
        setTimeout(function() {
          if (res.data.success) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000,
            });
            that.setData({
              status: 2
            });
          } else {
            wx.showToast({
              title: '支付失败',
              icon: 'error',
              duration: 2000,
            });
          }
        }, 1000);
      },
    });
  },
  getCode: function() {
    wx.navigateTo({
      url: `./code/code?order_id=${this.data.order_id}&date=${this.data.date}`,
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})