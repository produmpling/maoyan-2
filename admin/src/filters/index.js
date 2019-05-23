export function filterBlank(val) {
  if (val === undefined || val === null || val === 'null' || val === '') {
    return '-';
  }
  return val;
}

export function fixNumber(val) {
  if (val === undefined || val === null || val === 'null' || val === '') {
    return 0;
  }
  return val;
}

export function transDate(val) {
  if (!val) {
    return '-';
  }
  const arr = val.split(' ');
  if (arr.length > 0) {
    return arr[0];
  }

  return '-';
}

export function millisecondToDate(val) {
  let time = parseFloat(val) / 1000;
  if (null != time && '' != time) {
    if (time > 60 && time < 60 * 60) {
      time =
        parseInt(time / 60.0) +
        '分钟' +
        parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) +
        '秒';
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time =
        parseInt(time / 3600.0) +
        '小时' +
        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
        '分钟' +
        parseInt(
          (parseFloat(
            (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60,
          ) -
            parseInt(
              (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60,
            )) *
            60,
        ) +
        '秒';
    } else {
      time = parseInt(time) + '秒';
    }
  }
  return time;
}

export function transLocalTime(val) {
  if (!val) {
    return '';
  }
  return new Date(+val).toLocaleString();
}

export function getQiniuFullUrl(val) {
  return window.API_CONFIG['qiniu_download'] + val;
}
