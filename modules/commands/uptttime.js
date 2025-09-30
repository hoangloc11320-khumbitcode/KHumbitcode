module.exports.config = {
  name: "uptime",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sơnkb",
  description: "Xem thơi gian của BOT online",
  commandCategory: "Không cần dấu lệnh",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  const moment = require("moment-timezone");
  const time = process.uptime();
     var hours = Math.floor(time / (60 * 60));
    var minutes = Math.floor((time % (60 * 60)) / 60);
  var seconds = Math.floor(time % 60);
  var { threadID, messageID, body, senderID } = event;
  //if (senderID == global.data.botID) return;
  if ((this.config.credits) != "Sơnkb") { return api.sendMessage(`Sai credits!`, threadID, messageID)}
  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }
  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data; 
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};

  var arr = ["uptime","up time","thoigian"];
  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() | body === i | str === body) {
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
      if (data.PREFIX == null) {
        return out(` 𝐓𝐡𝐨̛̀𝐢 𝐆𝐢𝐚𝐧 𝐁𝐨𝐭 𝐃𝐚̃ 𝐎𝐧𝐥𝐢𝐧𝐞 \n================\n${hours} giờ  ${minutes} phút ${seconds} giây `)
      }
      else return out(` 𝐓𝐡𝐨̛̀𝐢 𝐆𝐢𝐚𝐧 𝐁𝐨𝐭 𝐃𝐚̃ 𝐎𝐧𝐥𝐢𝐧𝐞 \n================\n ${hours} giờ ${minutes} phút ${seconds} giây ` + data.PREFIX)
    }

  });
};

module.exports.run = async({ event, api }) => {
    return api.sendMessage({body:`Thời Gian Bot Đã Online\n================\n${hours} giờ ${minutes} phút ${seconds} giây`, attachment: (await global.nodemodule["axios"]({
url: (await global.nodemodule["axios"]('https://API-VD.miraiprofile2005.repl.co/images/videoanime')).data.data,
method: "GET",
responseType: "stream"
})).data                                      }, event.threadID)
}