module.exports.config = {
  name: "offbot",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "HTHB",
  description: "Tắt Bot.",
  commandCategory: "system",
  cooldowns: 0
        };
module.exports.run = ({event, api}) =>api.sendMessage("[⚜️] 𝒌𝒉𝒖𝒎𝒃𝒊𝒕𝒄𝒐𝒅𝒆 [⚜️]\n[🔰𝙊𝙁𝙁𝘽𝙊𝙏🔰] 𝑩𝒚𝒆 𝒄𝒂̣̂𝒖 𝒄𝒉𝒖̉ 𝒏𝒉𝒂 𝒆𝒎 𝒅𝒊 𝒏𝒈𝒖̉ 𝒅𝒂̂𝒚:𝟑𝟑",event.threadID, () =>process.exit(0))