var event = require('../../utils/event');
var util = require('../../utils/util');
var threedays = util.getWeek(3);
Page({
  data: {
    activeindex: 0,
    activeDateIndex: 0,
    shop: {},
    imgUrl: '',
    activemovie: {},
    scrollMovies: [],
    threedays: threedays,
    theday: new Date().toISOString(),
    movies: [],
    active_movie_id: null,
    theater_id: null,
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      active_movie_id: options.movie_id,
      theater_id: options.theater_id
    });
    that.listByTheater(options.theater_id);
    wx.request({
      url: 'http://localhost:3008/theater/detail',
      data: {
        id: options.theater_id
      },
      success: function(res) {
        var shop = res.data.data;
        var imgUrl = shop.cover;
        that.setData({
          shop: shop
        });
      },
    });
    
  },
  listByTheater(id) {
    var that = this;
    wx.request({
      url: 'http://localhost:3008/timetable/listByTheater',
      data: {
        id: id
      },
      success: function(res) {
        var movies = res.data.data;
        var scrollMovies = [];
        let hash = {}; 
        scrollMovies = movies.reduce((preVal, curVal) => {
          hash[curVal.movie_id] ? '' : hash[curVal.movie_id] = true && preVal.push(curVal); 
          return preVal;
        }, []);
        that.setData({
          movies: movies,
          scrollMovies: scrollMovies
        });

        if (that.data.active_movie_id) {
          that.getMovieDetail(that.data.active_movie_id);
        } else {
          var detail = scrollMovies[0];
          detail.times = JSON.parse(detail.times);
          that.setData({
            activemovie: detail,
            imgUrl: detail.cover,
            active_movie_id: detail.movie_id
          });
        }
        // 默认选中今天
        that.selectDate({target: {
            dataset: {
              date: new Date().toISOString(),
            },
            id: 0,
          },
        });
      },
    });
  },
  getMovieDetail(id) {
    let detail = {};
    var index = 0;
    this.data.scrollMovies.forEach(function(item, i) {
      if (item.movie_id == id) {
        detail = item;
        if (typeof item.times == 'string') {
          detail.times = JSON.parse(item.times);
        }
        index = i;
      }
    });
    this.setData({
      activemovie: detail,
      imgUrl: detail.cover,
      activeindex: index
    });
    console.info('详情', this.data.activemovie);
  },
  openMap: function() {
    var that = this;
    wx.openLocation({
      latitude: 31, // 纬度，范围为-90~90，负数表示南纬
      longitude: 14, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
      // name: '我家', // 位置名
      // address: '洼的地方', // 地址的详细说明
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      },
    });
  },
  tapselect: function(e) {
    var detail = this.data.scrollMovies[e.currentTarget.id];
    if (typeof detail.times == 'string') {
      detail.times = JSON.parse(detail.times);
    }
    console.info('选择的电影详情', detail);
    this.setData({
      activemovie: detail,
      imgUrl: detail.cover,
      activeindex: e.currentTarget.id,
      active_movie_id: detail.movie_id
    });
  },
  selectDate: function(e) {
    var that = this;
    that.setData({
      theday: e.target.dataset.date,
      'activemovie.times': [],
      activeDateIndex: e.target.id
    });
    that.data.movies.forEach(function(item) {
      if (new Date(item.play_date).toLocaleDateString() == new Date(e.target.dataset.date).toLocaleDateString()) {
        var times = typeof item.times == 'string' ? JSON.parse(item.times) : item.times;
        that.setData({
          theday: e.target.dataset.date,
          'activemovie.times': times,
        });
      }
    });
  },
  
});
