module.exports.config = {
  name: "trick",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Minh Dương (mod by Lộc)",
  description: "Thông tin adm",
  commandCategory: "Prefix",
  usages: "trick | trick lỏ | tricker lỏ | lỏ",
  cooldowns: 10,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.onLoad = () => {
  const fs = require("fs-extra");
  const request = require("request");
  const dirMaterial = __dirname + `/prefix/`;
  if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
  if (!fs.existsSync(dirMaterial + "trick.mp4")) {
    request("https://i.imgur.com/jlXQQhi.mp4")
      .pipe(fs.createWriteStream(dirMaterial + "trick.mp4"));
  }
};

module.exports.run = async ({ api, event, args }) => {
  const fs = require("fs");
  const dirMaterial = __dirname + `/prefix/`;

  const msg = {
    body: `🌸Trick Lỏ🌸`,
    attachment: fs.createReadStream(dirMaterial + "trick.mp4")
  };

  // nối args thành chuỗi để check
  let text = (args.join(" ") || "").toLowerCase();

  // danh sách args hợp lệ
  const validArgs = ["", "lỏ", "trick lỏ", "tricker lỏ"];

  if (validArgs.includes(text)) {
    return api.sendMessage(msg, event.threadID, event.messageID);
  } else {
    const prefix = global.config.PREFIX; // lấy prefix hệ thống
    return api.sendMessage(
      `Sai cú pháp rồi lêu lêu 😛\nDùng đúng: ${prefix}trick | ${prefix}trick lỏ | ${prefix}tricker lỏ | ${prefix}lỏ`,
      event.threadID,
      event.messageID
    );
  }
};
