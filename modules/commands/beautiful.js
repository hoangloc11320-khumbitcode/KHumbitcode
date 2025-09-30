 const fs = require("fs");
 const canvas = require(`${__dirname}/../alice/wrapper/leiamnashB.js`).makeBeautiful;

function leiamnash(){
 return{
  "name": "beautiful",
  "author": "leiamnash",
  "version": "1.0.0",
  "commandMap": {
  "beautiful": {
    "func": "beautiful",
    "cooldown": 10
   }
  }
 }
}

async function beautiful(event, api, leiam, log) {
try{
 const alice = leiam.join(" ");
 const leiamnash = Object.keys(event.mentions);
 const file = __dirname + "/cache/beautiful_" + event.senderID + ".png";
  const leiamTxt = "you look as beautiful as ever";
if(event.type == "message_reply") {
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
   await canvas({
    user: `${global.alice.api}/alice/profile?user=${event.messageReply.senderID}`,
    file: event.senderID
  });
 const leiamGet = (await api.getUserInfo(event.messageReply.senderID))[event.messageReply.senderID].name;
    api.chat({body: `${leiamTxt} ${leiamGet}`, mentions: [{tag: leiamGet, id: event.messageReply.senderID}], attachment: fs.createReadStream(file)}, event.threadID, (err) => {
   fs.unlinkSync(file);
    if (err) return api.chat(`Error: {\nstatus: 3792\nsummary: {\n'leiamnash server is offline',\n'this is temporary issue please request again'\n'undefined leiamnash server'\n},\nalicezetion: this error happens if your account get muted by facebook\n}`, event.threadID, event.messageID);
    }, event.messageID);
 } else if (!alice[0]) {
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
   await canvas({
    user: `${global.alice.api}/alice/profile?user=${event.senderID}`,
    file: event.senderID
  });
  const leiamGet = (await api.getUserInfo(event.senderID))[event.senderID].name;
    api.chat({body: `${leiamTxt} ${leiamGet}`, mentions: [{tag: leiamGet, id: event.senderID}], attachment: fs.createReadStream(file)}, event.threadID, (err) => {
   fs.unlinkSync(file);
    if (err) return api.chat(`Error: {\nstatus: 3792\nsummary: {\n'leiamnash server is offline',\n'this is temporary issue please request again'\n'undefined leiamnash server'\n},\nalicezetion: this error happens if your account get muted by facebook\n}`, event.threadID, event.messageID);
    }, event.messageID);
 } else if (leiamnash) {
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
   await canvas({
    user: `${global.alice.api}/alice/profile?user=${leiamnash}`,
    file: event.senderID
  });
  const leiamGet = (await api.getUserInfo(leiamnash))[leiamnash].name;
    api.chat({body: `${leiamTxt} ${leiamGet}`, mentions: [{tag: leiamGet, id: leiamnash[0]}], attachment: fs.createReadStream(file)}, event.threadID, (err) => {
   fs.unlinkSync(file);
    if (err) return api.chat(`Error: {\nstatus: 3792\nsummary: {\n'leiamnash server is offline',\n'this is temporary issue please request again'\n'undefined leiamnash server'\n},\nalicezetion: this error happens if your account get muted by facebook\n}`, event.threadID, event.messageID);
    }, event.messageID);
  }
 } catch (err) { 
  log.err(err); 
  api.chat(`Error: {\nstatus: 9299\nsummary: {\n'leiamnash server is offline',\nconnection refuse to response,\n},\nhttp: cannot get data from leiamnash server\n}`, event.threadID, () => api.setMessageReaction("❎", event.messageID, (err) => {}, true), event.messageID);
 } 
}

module.exports = {
    beautiful,
    leiamnash
}