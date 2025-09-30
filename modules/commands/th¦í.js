const axios = require("axios");
const fs = require("fs");
const path = require("path");
const request = require("request");

module.exports.config = {
  name: "thơ",
  version: "1.0.6",
  hasPermssion: 0,
  credits: "ManhG ",
  description: "Gửi một bài thơ kèm ảnh",
  commandCategory: "game",
  usages: "thathinh",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  try {
    // Lấy dữ liệu ca dao
    const response = await axios.get("https://manhkhac.github.io/data/json/cadaovn.json");
    if (!response.data || !response.data.data) {
      return api.sendMessage("❌ Không lấy được dữ liệu ca dao!", event.threadID, event.messageID);
    }

    const dataCadao = response.data.data;
    const values = Object.values(dataCadao);
    const rdCadao = values[Math.floor(Math.random() * values.length)];

    // Lấy ảnh ngẫu nhiên
    const imgRes = await axios.get("https://api.vinhbeat.ga/gai.php");
    if (!imgRes.data || !imgRes.data.data) {
      return api.sendMessage("❌ Không lấy được ảnh!", event.threadID, event.messageID);
    }

    const imgUrl = imgRes.data.data;
    const ext = imgUrl.substring(imgUrl.lastIndexOf(".") + 1);
    const filePath = path.join(__dirname, `cache/anh_${Date.now()}.${ext}`);

    // Tải ảnh về cache
    request(imgUrl)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        api.sendMessage(
          {
            body: `『${rdCadao}』`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });
  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Đã xảy ra lỗi khi thực thi lệnh!", event.threadID, event.messageID);
  }
};
