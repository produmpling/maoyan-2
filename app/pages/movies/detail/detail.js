var app = getApp();
Page({
  data: {
    detail: {},
    flexed: false,
    favoriteDetail: {},
    isLikedText: '想看'
  },
  onLoad: function(params) {
    var that = this;
    var id = params.id;
    wx.request({
      url: 'http://localhost:3008/movie/detail',
      data: {
        id: id
      },
      success: function(res) {
        console.info(res);
        that.setData({
          detail: res.data.data,
        });
        var params = {
          movie_id: res.data.data.movie.id,
          user_id: app.globalData.userInfo.id
        }
        const skey = wx.getStorageSync('skey');
        let header = {
          'skey': skey,
        };
        wx.request({
          url: 'http://localhost:3008/favorite/detail',
          data: params,
          header: header,
          success: function(result) {
            if (!!result.data.data) {
              that.setData({
                favoriteDetail: result.data.data,
                isLikedText: '已想看',
              });
            }
          },
        });
      },
    });
  },
  // 图片预览
  previewStill: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var images = [];
    src.forEach(function(item) {
      images.push(item.image);
    });
    wx.previewImage({
      current: images[0], // 当前显示图片的http链接
      urls: images, // 需要预览的图片http链接列表
    });
  },
  like: function() {
    var that = this;
    var params = {
      movie_id: that.data.detail.movie.id,
      user_id: app.globalData.userInfo.id,
      id: that.data.favoriteDetail.id
    }
    const skey = wx.getStorageSync('skey');
    let header = {
      'skey': skey,
    };
    wx.request({
      url: that.data.favoriteDetail.id ? 'http://localhost:3008/favorite/remove' : 'http://localhost:3008/favorite/add',
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
          if (that.data.favoriteDetail.id) {
            that.setData({
              favoriteDetail: {},
              isLikedText: '想看',
            });
          } else {
            that.setData({
              favoriteDetail: {
                id: res.data.data,
                movie_id: res.data.movie_id,
                user_id: res.data.user_id,
              },
              isLikedText: '已想看',
            });
            console.info(that.data.favoriteDetail);
          }
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
  flex: function() {
    var that = this;
    this.setData({
      flexed: !that.data.flexed,
    });
  },
});
