/**
 * 下载演员图片
 */

var fs = require('fs');
var request = require('request');

// 1. 获取图片src
var data = require('../public/data/200_films_top250.json');
var url = './public/data/200_films_top250.json';

console.log(data.count);

fs.readFile(url, 'utf-8', function (err, data) {
  if (err) {
    console.error(err);
  }

  data = JSON.parse(data);
  console.log(typeof data);

  for (let i = 0; i < data.subjects.length; i ++) {

    delete data.subjects[i].rating;
    delete data.subjects[i].genres;
    delete data.subjects[i].title;
    delete data.subjects[i].collect_count;
    delete data.subjects[i].original_title;
    delete data.subjects[i].subtype;
    delete data.subjects[i].year;
    delete data.subjects[i].id;
    delete data.subjects[i].cover;

    // casts
    for (let m = 0; m < data.subjects[i].casts.length; m ++) {
      let id = data.subjects[i].casts[m].id;

      if (id === null) {
        data.subjects[i].casts[m].id = '';
        data.subjects[i].casts[m].avatar = "";
      }
    }

    // directors
    for (let n = 0; n < data.subjects[i].directors.length; n ++) {
      let id = data.subjects[i].directors[n].id;

      if (id === null) {
        data.subjects[i].directors[n].id = '';
        data.subjects[i].directors[n].avatar = "";
      } else {
        let src = data.subjects[i].directors[n].small;

        if (src == null) {
          data.subjects[i].directors[n].avatar = ''
        } else {
          data.subjects[i].directors[n].avatar = src;
        }
      }
    }
  }

  // 2. 下载图片
  downloadImage(data);

  data = JSON.stringify(data);
  fs.writeFile('./public/data/avatar/200_249.json', data, 'utf-8', err => {
    if (err) {
      console.error(err);
    }

    console.log('write success');
  })
})

// 2. 下载图片
function downloadImage(data, start) {
  console.log('收到 ' + data.subjects.length+ ' 条数据');
  start = 1*start;
  var subjects = data.subjects;

  // casts
  for (let i = 0; i < subjects.length; i ++) {
    for (let x = 0; x < subjects[i].casts.length; x ++) {
      var src = subjects[i].casts[x].avatar;
      if (src == '') {
        break;
      }
      console.log(i, x);
      console.log(src);
      // return;
      var writeStream = fs.createWriteStream('./public/images/avatars/'+ subjects[i].casts[x].id + '.jpg');
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
      var src = subjects[i].directors[x].avatar;
      if (src == '') {
        break;
      }
      console.log(i, x);
      console.log(src);
      // return;
      var writeStream = fs.createWriteStream('./public/images/avatars/'+ subjects[i].directors[x].id + '.jpg');
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