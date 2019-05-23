module.exports = {
  wechat: {
    appId: 'wx1614201b3d2eafad',
    appSecret: '6381a91c83d26ede326cd0616f983120',
  },
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'TAMMENY',
    database: 'movie_tickets',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '123456',
    prefix: 'movie:',
  },
  qiniu: {
    accessKey: 'DrHC33U5X02jO2-eGAEK3yVa5mZ-mNwji_i_siOi',
    secretKey: 'TZdM6rYyXp-NLtIUl2OcGAPIV6s7cGO2fmuQvkhX',
    bucket: 'taskparadise',
  },
};
