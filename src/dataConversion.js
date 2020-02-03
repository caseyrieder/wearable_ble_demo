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

function stringToBytes(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    bytes.push(char >>> 8);
    bytes.push(char & 0xff);
  }
  return bytes;
}

export {intToHex, fullRGBConvert, hexToBytes, stringToBytes, intToBytes};

