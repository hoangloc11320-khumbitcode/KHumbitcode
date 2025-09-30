module.exports.config = {
  name: "upttreo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "L.V. Bằng",
  description: "treo bot trên uptimerobot.com ngay tại messenger :>",
  commandCategory: "tiện ích",
  usages: "[text/reply]",
  cooldowns: 5
};
//////////////////////////////
//////// Khai báo ///////////
////////////////////////////
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const lvb = __dirname + `/cache/`;
    if (!fs.existsSync(lvb + "cache")) fs.mkdirSync(lvb, { recursive: true });
    if (!fs.existsSync(lvb + "upt.jpeg")) request("https://i.imgur.com/YUVQW61.jpeg").pipe(fs.createWriteStream(lvb + "upt.jpeg"));
      }
module.exports.run = async function({ api, event, args, client }) {
    const fs = require('fs-extra');
    var name = Date.now();
    var url = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
    var lvbang = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if(url.match(lvbang) == null) return api.sendMessage({body:`Vui lòng nhập/reply url cần treo trên Uptime Robot!`, attachment: fs.createReadStream(__dirname + `/cache/upt.jpeg`)}, event.threadID, event.messageID);
    var request = require("request");
    var options = { method: 'POST',
  url: 'https://api.uptimerobot.com/v2/newMonitor',
  headers:
   { 'content-type': 'application/x-www-form-urlencoded',
     'cache-control': 'no-cache' },
  form:
   { api_key: 'u1376899-824406bb41797129b9e16e23',
     format: 'json',
     type: '1',
     url: url,
     friendly_name: name } };
   /////////////////////////////////////////  //////Phần điều kiện và gửi tin nhắn//// ///////////////////////////////////////        
request(options, function (error, response, body) {
   if (error) return api.sendMessage(`Lỗi rồi huhu :((`, event.threadID, event.messageID );
   if(JSON.parse(body).stat == 'fail') return api.sendMessage({body:`[ ERROR ] - Đã tồn tại url '${url}' trên hệ thống UptimeRobot !!!`, attachment: fs.createReadStream(__dirname + `/cache/upt.jpeg`)}, event.threadID, event.messageID);
  if(JSON.parse(body).stat == 'success')
 return
api.sendMessage({body: `[ SUCCESS ] - Đã tạo sever UptimeRobot thành công !!!`, attachment: fs.createReadStream(__dirname + `/cache/upt.jpeg`)}, event.threadID, event.messageID );
});
                                    }