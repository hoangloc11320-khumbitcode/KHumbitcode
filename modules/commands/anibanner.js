 const fs = require("fs");
 const canvas = require(`${__dirname}/../alice/wrapper/leiamnashE.js`).makeAnibanner;

function leiamnash(){
 return{
  "name": "anibanner",
  "author": "leiamnash",
  "version": "1.0.0",
  "commandMap": {
  "anibanner": {
    "func": "anibanner",
    "cooldown": 10
   }
  }
 }
}

async function anibanner(event, api, leiam, log) {
try{
const leiamFile = __dirname + "/cache/anibanner_" + event.senderID + ".png";
  const leiamnash = Object.keys(event.mentions);
const leiamChat = leiam.join(" ");
if(event.type == "message_reply") {
  const leiamName = (await api.getUserInfo(event.messageReply.senderID))[event.messageReply.senderID]
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  await canvas({
    fullName: leiamName.name,
    firstName: leiamName.firstName,
    facebook: event.messageReply.senderID,
    file: event.senderID
  });
  api.chat({body: `${leiamName.name}`, mentions: [{ tag: leiamName.name, id: event.messageReply.senderID }], attachment: fs.createReadStream(leiamFile)}, event.threadID, (err) => {
    fs.unlinkSync(leiamFile);
    if (err) return api.chat(`Error: {\nstatus: 3792\nsummary: {\n'leiamnash server is offline',\n'this is temporary issue please request again'\n'undefined leiamnash server'\n},\nalicezetion: this error happens if your account get muted by facebook\n}`, event.threadID, event.messageID);
   }, event.messageID);
} else if (!leiamChat) {
   const leiamName = (await api.getUserInfo(event.senderID))[event.senderID]
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  await canvas({
    fullName: leiamName.name,
    firstName: leiamName.firstName,
    facebook: event.senderID,
    file: event.senderID
  });
  api.chat({body: `${leiamName.name}`, mentions: [{ tag: leiamName.name, id: event.senderID }], attachment: fs.createReadStream(leiamFile)}, event.threadID, (err) => {
    fs.unlinkSync(leiamFile);
    if (err) return api.chat(`Error: {\nstatus: 3792\nsummary: {\n'leiamnash server is offline',\n'this is temporary issue please request again'\n'undefined leiamnash server'\n},\nalicezetion: this error happens if your account get muted by facebook\n}`, event.threadID, event.messageID);
   }, event.messageID);
} else if (leiamnash) {
   const leiamName = (await api.getUserInfo(leiamnash))[leiamnash]
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  await canvas({
    fullName: leiamName.name,
    firstName: leiamName.firstName,
    facebook: leiamnash,
    file: event.senderID
  });
  api.chat({body: `${leiamName.name}`, mentions: [{ tag: leiamName.name, id: leiamnash[0] }], attachment: fs.createReadStream(leiamFile)}, event.threadID, (err) => {
    fs.unlinkSync(leiamFile);
    if (err) return api.chat(`Error: {\nstatus: 3792\nsummary: {\n'leiamnash server is offline',\n'this is temporary issue please request again'\n'undefined leiamnash server'\n},\nalicezetion: this error happens if your account get muted by facebook\n}`, event.threadID, event.messageID);
   }, event.messageID);
  }
 } catch (err) { 
  log.err(err); 
  api.chat(`Error: {\nstatus: 9299\nsummary: {\n'leiamnash server is offline',\nconnection refuse to response,\n},\nhttp: cannot get data from leiamnash server\n}`, event.threadID, () => api.setMessageReaction("❎", event.messageID, (err) => {}, true), event.messageID);
 } 
}

module.exports = {
    anibanner,
    leiamnash
}