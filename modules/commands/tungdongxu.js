const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "tungdongxu",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Hoàng Lộc khumbitcode>< - Mod by GPT",
  description: "Tung đồng xu may rủi + emoji + ảnh (thắng/thua chỉ ăn hoặc mất 1/2 tiền cược)",
  commandCategory: "Trò Chơi",
  usages: "tungdongxu <ngửa/xấp> <số tiền>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, senderID, messageID } = event;
  let money = (await Currencies.getData(senderID)).money;

  if (!args[0] || !args[1]) {
    return api.sendMessage("⚠️ Cú pháp: tungdongxu <ngửa/xấp> <số tiền>", threadID, messageID);
  }

  let choice = args[0].toLowerCase();
  let bet = parseInt(args[1].replace(/[^0-9]/g, "")); // chỉ lấy số

  if (isNaN(bet) || bet < 10000) {
    return api.sendMessage("💸 Số tiền đặt cược phải là số và tối thiểu 10,000 RP!", threadID, messageID);
  }
  if (bet > money) {
    return api.sendMessage("❌ Số tiền của bạn không đủ!", threadID, messageID);
  }
  if (choice !== "ngửa" && choice !== "xấp") {
    return api.sendMessage("⚠️ Cược không hợp lệ! Chọn 'ngửa' hoặc 'xấp'", threadID, messageID);
  }

  // link ảnh kết quả
  const images = {
    ngửa: "https://i.postimg.cc/X7NdTHcf/552252503-1474775573773932-7177428520783273056-n.png",
    xấp: "https://i.postimg.cc/qRnxvNNT/553193516-1861535121385307-5200824650958779255-n.png"
  };

  // tung đồng xu (50/50)
  let result = Math.random() < 0.5 ? "ngửa" : "xấp";
  let win = (choice === result);
  let resultEmoji = win ? "🎉" : "😢";

  // số tiền thắng hoặc thua chỉ = 1/2 bet
  let delta = Math.floor(bet / 2);

  // bảng kết quả
  let messageBody =
`🎲 KẾT QUẢ TUNG ĐỒNG XU ${resultEmoji}
━━━━━━━━━━━━━━━━━━
👉 Kết quả: ${result.toUpperCase()}
👑 Người thắng: ${win ? "Bạn" : "Không"}
💀 Người thua: ${win ? "Không" : "Bạn"}
💰 Tiền ${win ? "thắng" : "thua"}: ${win ? "+"+delta+" RP" : "-"+delta+" RP"}
━━━━━━━━━━━━━━━━━━`;

  // tải ảnh về file tạm
  const imgPath = path.join(__dirname, "cache", `coin_${senderID}.png`);
  const response = await axios.get(images[result], { responseType: "arraybuffer" });
  fs.writeFileSync(imgPath, Buffer.from(response.data));

  // gửi kết quả + ảnh
  api.sendMessage({
    body: messageBody,
    attachment: fs.createReadStream(imgPath)
  }, threadID, async () => {
    // xóa file tạm sau khi gửi
    fs.unlinkSync(imgPath);

    // xử lý tiền
    if (win) {
      await Currencies.increaseMoney(senderID, delta);
    } else {
      await Currencies.decreaseMoney(senderID, delta);
    }
  }, messageID);
};
