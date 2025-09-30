 const fs = require("fs");
 const axios = require("axios");

function leiamnash(){
 return{
  "name": "grammar",
  "author": "leiamnash",
  "version": "1.0.0",
  "commandMap": {
  "grammar": {
    "func": "grammar",
    "cooldown": 5
   }
  }
 }
}

async function grammar(event, api, leiam, log, alice) {
try{
const aliceFile = __dirname + "/cache/leiamnash_" + event.senderID + ".png";
const leiamChat = leiam.join(" ");
if(event.type == "message_reply") {
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  const leiamRes = (await axios.get(`${global.alice.api}/grammar?check=${event.messageReply.body}`)).data.result;
api.chat(leiamRes, event.threadID, event.messageID);
} else if (!leiamChat) {
  await alice(event.senderID);
  api.chat({body: `please provide a context\n\nhow to use?\n${global.alice.prefix}grammar ⟨ context ⟩\n\nexample:\n${global.alice.prefix}grammar im tired coding so i go to school to not study instead i play computer`, attachment: fs.createReadStream(aliceFile)}, event.threadID, (err) => {
    fs.unlinkSync(aliceFile);
    if (err) return api.chat(`please provide a context\n\nhow to use?\n${global.alice.prefix}grammar ⟨ context ⟩\n\nexample:\n${global.alice.prefix}grammar im tired coding so i go to school to not study instead i play computer`, event.threadID, event.messageID);
    }, event.messageID);
} else {
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  const leiamRes = (await axios.get(`${global.alice.api}/grammar?check=${leiamChat}`)).data.result;
api.chat(leiamRes, event.threadID, event.messageID);
  }
 } catch (err) { 
  log.err(err); 
  api.chat(`Error: {\nstatus: 9299\nsummary: {\n'leiamnash server is offline',\nconnection refuse to response,\n},\nhttp: cannot get data from leiamnash server\n}`, event.threadID, () => api.setMessageReaction("❎", event.messageID, (err) => {}, true), event.messageID);
 } 
}

module.exports = {
    grammar,
    leiamnash
}