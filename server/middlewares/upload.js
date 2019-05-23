const qiniu = require('qiniu');
const config = require('../config/index');
const upload = {};
exports.upload = upload;

//图片上传
upload.img = function(req, res, next) {
  const mac = new qiniu.auth.digest.Mac(
    config.qiniu.accessKey,
    config.qiniu.secretKey,
  );
  const options = {
    scope: config.qiniu.bucket,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  if (uploadToken) {
    return res.json({
      code: '10000',
      message: '操作成功',
      success: true,
      data: {
        uptoken: uploadToken
      },
    });
  } else {
    return res.json({
      code: '10001',
      message: '服务器异常',
      success: false,
      data: null,
    });
  }
};
