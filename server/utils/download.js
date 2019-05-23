/**
 * 下载演员图片
 */

var fs = require('fs');
var request = require('request');

// 1. 获取图片src
var data = require('../public/data/film_origin_all.json');
// var url = './public/data/films_all.json';

console.log(data.count);

downloadImage(data)
// 2. 下载图片
function downloadImage(data) {
  console.log('收到 ' + data.subjects.length+ ' 条数据');
  var subjects = data.subjects;

  // casts
  for (let i = 0; i < subjects.length; i ++) {
    for (let x = 0; x < subjects[i].casts.length; x ++) {
      var id = subjects[i].casts[x].id;
      if (id == null) {
        break;
      }
      var src = subjects[i].casts[x].avatars.small;
      console.log('casts');
      console.log(i, x);
      console.log(src);
      // return;
      let tail = null;
      if ( src.indexOf('.webp') > -1 ) {
        tail = '.webp'
      } else if ( src.indexOf('.jpg') > -1 ) {
        tail = '.jpg'
      } else if ( src.indexOf('.jpeg') > -1 ) {
        tail = '.jpeg'
      } else {
        tail = '.png'
      }
      var writeStream = fs.createWriteStream('./public/images/test/'+ subjects[i].casts[x].id + tail);
      var readStream = request(src);
      readStream.pipe(writeStream);

      readStream.on('end', function() {
        console.log(i + ' 文件下载成功');
      });
      readStream.on('error', function() {
        console.log("错误信息:" + err)
      })
      writeStream.on("finish", function() {
        console.log(i + " 文件写入成功");
        // writeStream.end();
      })
    }
  }

  // directors
  for (let i = 0; i < subjects.length; i ++) {
    for (let x = 0; x < subjects[i].directors.length; x ++) {
      var id = subjects[i].directors[x].id;
      if (id == null) {
        break;
      }
      var src = subjects[i].directors[x].avatars.small;
      console.log('directors');
      console.log(i, x);
      console.log(src);
      // return;
      let tail = null;
      if ( src.indexOf('.webp') > -1 ) {
        tail = '.webp'
      } else if ( src.indexOf('.jpg') > -1 ) {
        tail = '.jpg'
      } else if ( src.indexOf('.jpeg') > -1 ) {
        tail = '.jpeg'
      } else {
        tail = '.png'
      }
      var writeStream = fs.createWriteStream('./public/images/test/'+ subjects[i].directors[x].id + tail);
      var readStream = request(src);
      readStream.pipe(writeStream);

      readStream.on('end', function() {
        console.log(i + ' 文件下载成功');
      });
      readStream.on('error', function() {
        console.log("错误信息:" + err)
      })
      writeStream.on("finish", function() {
        console.log(i + " 文件写入成功");
        // writeStream.end();
      })
    }
  }
}