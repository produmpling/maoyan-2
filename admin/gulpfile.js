const gulp = require('gulp');
const path = require('path');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const server = path.resolve(__dirname, 'src/mock');

/** mock */
// browser-sync 配置，配置里启动 nodemon 任务
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000", // 这里的端口和 webpack 的端口一致
    port: 8090
  });
});

// browser-sync 监听文件
gulp.task('mock', ['browser-sync'], function() {
  gulp.watch(['src/mock/db.js', 'src/mock/**'], ['bs-delay']);
});

// 延时刷新
gulp.task('bs-delay', function() {
  setTimeout(function() {
    browserSync.reload();
  }, 1000);
});

// 服务器重启
gulp.task('nodemon', function(cb) {
  // 设个变量来防止重复重启
  var started = false;
  var stream = nodemon({
    script: 'src/mock/server.js',
    // 监听文件的后缀
    ext: "js",
    env: {
      'NODE_ENV': 'development'
    },
    // 监听的路径
    watch: [
      server
    ]
  });
  stream.on('start', function() {
    if (!started) {
      cb();
      started = true;
    }
  }).on('crash', function() {
    console.error('application has crashed!\n')
    stream.emit('restart', 10)
  })
});
