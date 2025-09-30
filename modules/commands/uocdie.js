
// -*- coding: utf-8 -*-
module.exports.config = {
  name: "uocdie",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Minh Dương (mod by Lộc)",
  description: "Lệnh uocdie (prefix only)",
  commandCategory: "Prefix",
  usages: "{prefix}uocdie",
  cooldowns: 10,
  dependencies: {
    "fs": "",
    "request": ""
  }
};

module.exports.onLoad = () => {
  const fs = require("fs");
  const request = require("request");
  const dirMaterial = __dirname + `/prefix/`;
  if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
  if (!fs.existsSync(dirMaterial + "uocdie.mp4")) {
    request("https://i.imgur.com/ztKjoAl.mp4")
      .pipe(fs.createWriteStream(dirMaterial + "uocdie.mp4"));
  }
};

module.exports.run = async ({ api, event, args }) => {
  const fs = require("fs");
  const dirMaterial = __dirname + `/prefix/`;

  const msg = {
    body: `🌸𝙐̛𝙤̛́𝙘 𝘿𝙞𝙚 𝘾𝙖́𝙞 𝙇𝙤̂̀𝙣 𝙈𝙚̣ 𝙈𝙖̀𝙮 !🌸`,
    attachment: fs.createReadStream(dirMaterial + "uocdie.mp4")
  };

  // nối args thành chuỗi để check
  let text = (args.join(" ") || "").toLowerCase();

  // danh sách args hợp lệ (khi muốn truyền thêm từ/biến thể sau lệnh)
  // bạn có thể thêm/bớt các biến thể ở đây
  const validArgs = [
    "",
    "ước die",
    "bố m ước đc die",
    "ước đc die",
    "dame t đi",
    "bố m ước die"
  ];

  if (validArgs.includes(text)) {
    return api.sendMessage(msg, event.threadID, event.messageID);
  } else {
    const prefix = (global && global.config && global.config.PREFIX) ? global.config.PREFIX : "";
    return api.sendMessage(
      `Sai cú pháp rồi 😛\nDùng đúng: ${prefix}uocdie`,
      event.threadID,
      event.messageID
    );
  }
};