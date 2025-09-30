const fs = require("fs");

module.exports.config = {
  name: "kinguc",                  // tên lệnh (dùng không có dấu cách, ví dụ !kinguc)
  version: "1.0.1",
  hasPermssion: 2,
  credits: "VanHung - Fixed by LTD",
  description: "Kí ngực fan",
  commandCategory: "Fun",
  usages: "kinguc",
  cooldowns: 5,
};

module.exports.run = function({ api, event }) {
  const { threadID, messageID } = event;

  const path = __dirname + "/noprefix/taokinguc.mp4";
  if (!fs.existsSync(path)) {
    return api.sendMessage("Không tìm thấy file video taokinguc.mp4!", threadID, messageID);
  }

  const msg = {
    body: "Yo !! Tao kí ngực fan !!",
    attachment: fs.createReadStream(path),
  };

  api.sendMessage(msg, threadID, messageID);
};
