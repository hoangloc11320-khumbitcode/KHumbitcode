module.exports.config = {
  name: "buon",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "ManhG",
  description: "Chat buồn sẽ có ramdom video buồn trên tiktok",
  commandCategory: "không cần dấu lệnh",
  usages: "Không cần dấu lệnh chỉ cần chat buồn,sad,... là ra",
  cooldowns: 0,
  denpendencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.handleEvent = async ({
  event,
  api,
  Users
}) => {
  const fs = global.nodemodule["fs-extra"];
  var {
    threadID,
    messageID,
    body,
    senderID
  } = event;
  const thread = global.data.threadData.get(threadID) || {};
  if (typeof thread["hi"] !== "undefined" && thread["hi"] == false) return;

  let name = await Users.getNameUser(event.senderID);
  if (senderID == api.getCurrentUserID()) return;

  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }
  //trả lời
  var msg = {
    body: `Bạn có tâm sự gì à🤔 ,Nếu có ib riêng admin nắng để được tư vấn nha💟 `,
    attachment: (await global.nodemodule["axios"]({
      url: (await global.nodemodule["axios"]('https://Buon.thanhha6.repl.co')).data.url,
      method: "GET",
      responseType: "stream"
    })).data
  }
  // Gọi bot
  var arr = ["buồn", "khóc", "sad", "sadgirl", "sadboy", "khóc", "mệt", "mệt mỏi quá", "haizz"];
  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() | body === i | str === body) return out(msg)
  });
};

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successText": "hi thành công",
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "hi success!",
  }
}
module.exports.config = {
  name: "buon",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "ManhG",
  description: "Chat buồn sẽ có ramdom video buồn trên tiktok",
  commandCategory: "không cần dấu lệnh",
  usages: "Không cần dấu lệnh chỉ cần chat buồn,sad,... là ra",
  cooldowns: 0,
  denpendencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.handleEvent = async ({
  event,
  api,
  Users
}) => {
  const fs = global.nodemodule["fs-extra"];
  var {
    threadID,
    messageID,
    body,
    senderID
  } = event;
  const thread = global.data.threadData.get(threadID) || {};
  if (typeof thread["hi"] !== "undefined" && thread["hi"] == false) return;

  let name = await Users.getNameUser(event.senderID);
  if (senderID == api.getCurrentUserID()) return;

  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }
  //trả lời
  var msg = {
    body: `Bạn có tâm sự gì à🤔 ,Nếu có ib riêng admin nắng để được tư vấn nha💟 `,
    attachment: (await global.nodemodule["axios"]({
      url: (await global.nodemodule["axios"]('https://Buon.thanhha6.repl.co')).data.url,
      method: "GET",
      responseType: "stream"
    })).data
  }
  // Gọi bot
  var arr = ["buồn", "khóc", "sad", "sadgirl", "sadboy", "khóc", "mệt", "mệt mỏi quá", "haizz"];
  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() | body === i | str === body) return out(msg)
  });
};

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successText": "hi thành công",
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "hi success!",
  }
}

module.exports.run = async function({
  api,
  event,
  Threads,
  getText
}) {
  const {
    threadID,
    messageID
  } = event;
  let data = (await Threads.getData(threadID)).data;

  if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
  else data["hi"] = true;

  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["hi"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}
module.exports.run = async function({
  api,
  event,
  Threads,
  getText
}) {
  const {
    threadID,
    messageID
  } = event;
  let data = (await Threads.getData(threadID)).data;

  if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
  else data["hi"] = true;

  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["hi"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}