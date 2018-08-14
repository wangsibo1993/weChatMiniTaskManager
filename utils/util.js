const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function currentDate() {
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  var day = date.getDate()
  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day;
}

function currentTime() {
  var date = new Date();
  var hour = date.getHours();
  if (hour < 10) {
    hour = '0'+hour
  }
  var minute = date.getMinutes();
  if (minute < 10) {
    minute = '0' + minute
  }
  return hour + ':' + minute;
}

var sortBy = function (arr, prop, desc) {
  var props = [],
    ret = [],
    i = 0,
    len = arr.length;
  if (typeof prop == 'string') {
    for (; i < len; i++) {
      var oI = arr[i];
      (props[i] = new String(oI && oI[prop] || ''))._obj = oI;
    }
  } else if (typeof prop == 'function') {
    for (; i < len; i++) {
      var oI = arr[i];
      (props[i] = new String(oI && prop(oI) || ''))._obj = oI;
    }
  } else {
    throw '参数类型错误';
  }
  props.sort();
  for (i = 0; i < len; i++) {
    ret[i] = props[i]._obj;
  }
  if (desc) ret.reverse();
  return ret;
};

module.exports = {
  sortBy: sortBy,
  formatTime: formatTime,
  currentDate: currentDate,
  currentTime: currentTime
}
