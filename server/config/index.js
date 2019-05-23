const dev = require('./dev');
const prod = require('./prod');
module.exports = process.env.NODE_ENV === 'development' ? dev : prod;
