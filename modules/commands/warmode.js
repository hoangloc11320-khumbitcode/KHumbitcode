module.exports.config = {
  name: "warmode",
  version: "1.1.0",
  hasPermssion: 3,
  credits: "LTD",
  description: "Chỉ cho phép 1 số lệnh hoạt động",
  commandCategory: "system",
  cooldowns: 0
};

module.exports.run = async ({ event, api, args }) => {
  if (!global.warmode) global.warmode = false;

  const imageURL = "https://i.pinimg.com/564x/98/37/12/983712827beff24729da51c493cb2e76.jpg";

  if (args[0] === "on") {
    global.warmode = true;
    return api.sendMessage({
      body: "ON\n𝓦𝓐𝓡 💖✨",
      attachment: await global.downloadFile(imageURL)
    }, event.threadID);
  } 
  else if (args[0] === "off") {
    global.warmode = false;
    return api.sendMessage({
      body: "OFF\n𝓦𝓐𝓡 𝓔𝓝𝓓 ✨💖✨",
      attachment: await global.downloadFile(imageURL)
    }, event.threadID);
  } 
  else {
    return api.sendMessage({
      body: `WAR: ${global.warmode ? "BẬT" : "TẮT"}\nDùng: ${global.config.PREFIX}warmode on/off`,
      attachment: await global.downloadFile(imageURL)
    }, event.threadID);
  }
};
