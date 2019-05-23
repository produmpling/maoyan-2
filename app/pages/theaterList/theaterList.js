var util = require('../../utils/util.js');
var weekday = util.getWeek(12);
Page({
  data: {
    movie_id: null,
    weekday: weekday,
    currentCity: '',
    list: {},
    activeDateIndex: 0,
  },
  onLoad: function (options) {
    var date = new Date().toISOString();
    this.setData({
      movie_id: options.id,
      'list.selectedDate': date,
    });
    var title = options.title;
    wx.setNavigationBarTitle({
      title: title
    })
    if (options.id) {
      this.getTimetable(date);
    } else {
      this.getTheaters();
    }
  },
  getTheaters() {
    var that = this;
    wx.request({
      url: 'http://localhost:3008/theater/list',
      data: {
        city: that.data.currentCity,
      },
      success: function (res) {
        res.data.data.forEach(function(item) {
          item.labels = item.labels.split(',');
        });
        that.setData({
          'list.theaters': res.data.data,
          'list.movie_id': that.data.movie_id
        });
      }
    });
  },
  getTimetable(date) {
    var that = this;
    wx.request({
      url: 'http://localhost:3008/timetable/list',
      data: {
        city: that.data.currentCity,
        movie_id: that.data.movie_id,
        play_date: date,
      },
      success: function (res) {
        res.data.data.forEach(function(item) {
          item.labels = item.labels.split(',');
          item.times = JSON.parse(item.times);
        });
        console.info(res.data.data);
        that.setData({
          'list.theaters': res.data.data,
          'list.movie_id': that.data.movie_id
        })
      }
    })
  },
  handleDateSelected: function(e) {
    console.info(e);
    this.setData({
      'list.selectedDate': e.target.dataset.date,
      activeDateIndex: e.target.id
    });
    this.getTimetable(e.target.dataset.date);
  },
})