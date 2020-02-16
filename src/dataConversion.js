function intToHex(int) {
  let hex = Number(int).toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
}

function fullRGBConvert(r, g, b) {
  let red = intToHex(r);
  let green = intToHex(g);
  let blue = intToHex(b);
  return red + green + blue;
}

function asciiToHex(str) {
  var arr = [];
  for (var n = 0, l = str.length; n < l; n ++) {
    // var hex = Number(str.charCodeAt(n)).toString(16);
    var hex = str.charCodeAt(n).toString(16);
    if (hex.length === 1) hex = '0'+hex;
    arr.push(hex);
  }
  return arr.join('');
};

function isHex(n) {
  var a = parseInt(n, 16);
  return (a.toString(16) === n.toLowerCase())
};

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

function intToBytes(int) {
  let arr = new ArrayBuffer(2); // an Int8 takes 2 bytes
  let view = new DataView(arr);
  view.setUint8(0, int, false); // byteOffset = 0; litteEndian = false
  return arr;
}

function intToChar(integer) {
  return String.fromCharCode(integer)
}

function stringToBytes(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    bytes.push(char >>> 8);
    bytes.push(char & 0xff);
  }
  return bytes;
}

function stringToHex (tmp) {
  var str = '',
      i = 0,
      tmp_len = tmp.length,
      c;

  for (; i < tmp_len; i += 1) {
      c = tmp.charCodeAt(i);
      str += d2h(c) + ' ';
  }
  return str;
};

function d2h(d) {
  return d.toString(16);
}
function h2d (h) {
  return parseInt(h, 16);
}

export {intToHex, fullRGBConvert, hexToBytes, stringToBytes, intToBytes, intToChar, asciiToHex, stringToHex, isHex};

