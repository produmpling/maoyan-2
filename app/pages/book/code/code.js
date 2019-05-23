var wxbarcode = require('../../../utils/index.js');

Page({
  data: {},
  onLoad: function(options) {
    this.setData({
      order_id: options.order_id,
      code: new Date(options.date).getTime() + '' + options.order_id
    });
    wxbarcode.barcode('barcode', this.data.code, 680, 200);
    wxbarcode.qrcode('qrcode', this.data.code, 420, 420);
  },
});
