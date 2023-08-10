function convertTimestampFormat(timestamp) {
    // 匹配原始格式的正则表达式
    let regex = /(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    
    // 使用正则表达式匹配并捕获组
    let match = timestamp.match(regex);
    
    if (match) {
      // 提取捕获的组
      let year = match[1];
      let month = match[2];
      let day = match[3];
      let hour = match[4];
      let minute = match[5];
      let second = match[6];
      
      // 构造新的时间戳格式
      let newTimestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      
      return newTimestamp;
    } else {
      return "Invalid timestamp format.";
    }
}
function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = function() {
            resolve(img);
        };
        img.onerror = function() {
            reject(new Error(`Failed to load image: ${img.src}`));
        };
    });
}
export default loadImage;