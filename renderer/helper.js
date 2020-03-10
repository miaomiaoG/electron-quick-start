exports.$ = (id) => {
  return document.getElementById(id);
};

exports.convertDuration = (time) => {
  //  计算分钟 单位数返回"01"，多位数返回"010"
  const minutes = ('0' + Math.floor(time / 60));
  const seconds = ('0' + Math.floor(time % 60));
  return `${minutes.substr(-2)}:${seconds.substr(-2)}`;

};
