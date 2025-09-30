/**
 * @author MintDaL
 * @warn Do not edit code or edit credits
 */

const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "bot",
  version: "1.2.6",
  hasPermssion: 0,
  credits: "MintDaL",
  description: "Một số thông tin về bot",
  commandCategory: "Người dùng",
  hide: true,
  usages: "?",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
  const { threadID } = event;
  const { commands } = global.client;
  const PREFIX = global.config.PREFIX;
  const namebot = global.config.BOTNAME || "Bot";

  // Thời gian hoạt động bot
  const time = process.uptime(),
        hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor((time % (60 * 60)) / 60),
        seconds = Math.floor(time % 60);

  // Danh sách Admin
  const listAdmin = global.config.ADMINBOT || [];
  let msg = [];
  let i = 1;
  for (const idAdmin of listAdmin) {
    if (parseInt(idAdmin)) {
      const name = await Users.getNameUser(idAdmin);
      msg.push(`${i++}/ ${name} - ${idAdmin}`);
    }
  }

  // Nội dung tin nhắn
  const body = `====「 ${namebot} 」====\n» Prefix hệ thống: ${PREFIX}\n» Modules: ${commands.size}\n» Bot hoạt động: ${hours}h ${minutes}p ${seconds}s\n──────────────\n======「 ADMIN 」 ======\n${msg.join("\n")}`;

  // Random ảnh trong folder images/
  const folderPath = path.join(__dirname, "images");
  const files = fs.readdirSync(folderPath).filter(file => /\.(jpe?g|png|gif)$/i.test(file));
  if (!files.length) return api.sendMessage("Folder images trống!", threadID);

  const randomFile = files[Math.floor(Math.random() * files.length)];
  const attachmentPath = path.join(folderPath, randomFile);

  // Gửi tin nhắn + ảnh
  return api.sendMessage({
    body: body,
    attachment: fs.createReadStream(attachmentPath)
  }, threadID);
};
