module.exports.config = {
  name: "vẽ",	
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "Dũngkon",
  description: "", 
  commandCategory: "Edit-img",
  usages: "reply",
  cooldowns: 5
};
module.exports.run = async function({ api, event, args }) {
const fs = global.nodemodule["fs-extra"];
const axios = require('axios');
  var linkUp = event.messageReply.attachments[0].url || args.join(" ");
  if(!linkUp) return api.sendMessage('Vui lòng reply hoặc nhập link 1 hình ảnh!!!', event.threadID, event.messageID)
  try {
    const res = await axios.get(`https://apidungkonuser.dungkonuwu.repl.co/imgur?link=${encodeURIComponent(linkUp)}`)
    const link = res.data.uploaded.image
    var img = (await axios.get(`https://thieutrungkien.dev/draw?url=${link}`, { responseType: "arraybuffer" })).data;
    api.sendMessage("Đang chịch chờ tí....!", event.threadID)
    fs.writeFileSync(__dirname + `/cache/veanime.png`, Buffer.from(img, "utf-8"));
    return api.sendMessage({ body: `Ảnh vẽ anime`, attachment: fs.createReadStream(__dirname + `/cache/veanime.png`)}, event.threadID, () => 
    fs.unlinkSync(__dirname + `/cache/veanime.png`), event.messageID)
  } catch(e) {
    return api.sendMessage(e, event.threadID, event.messageID);
  }
}