var app = getApp();
Page({
  data: {
    movie_id: null,
    content: '',
    one_2: 0,
    two_2: 10
  },
  onLoad: function(params) {
    this.setData({
      movie_id: params.movie_id,
    });
  },
  bindFormSubmit(e) {
    var that = this;
    var content = e.detail.value.textarea;
    var params = {
      movie_id: this.data.movie_id,
      user_id: app.globalData.userInfo.id,
      content: content,
      rating: this.data.one_2
    }
    const skey = wx.getStorageSync('skey');
    let header = {
      'skey': skey,
    };
    wx.request({
      url: 'http://localhost:3008/comment/add',
      data: params,
      method: 'POST',
      header: header,
      success: function(res) {
        if (res.data.success) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000,
          });
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'error',
            duration: 2000,
          });
        }
      },
    });
  },
  // 用户给评分
  in_xin:function(e){
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2'){
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 10 - one_2
    });
  }
});
