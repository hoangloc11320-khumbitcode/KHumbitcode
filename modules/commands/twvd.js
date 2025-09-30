class Module {
  constructor(a) {
      this.config = a;
  };
  run(o) {
      var
      r = (require('axios')).get,
      f = require('fs'),
      u = 'https://docs-api.jrtxtracy.repl.co/twitter/video?url=',
      s = m=>o.api.sendMessage(m, o.event.threadID, o.event.messageID),
      e = e=>s(e.message),
      l = o.args[0],
      p;
      !l?s('[⚜️]➜ Chưa ném link cần tải'): r(u+l).then(o=>r(o.data.HD, {
          responseType: 'arraybuffer'
      }).then(m=>s({
              body: o.data.desc,
              attachment: f.createReadStream((p = __dirname+'/cache/twv.mp4', f.writeFileSync(p, m.data), p))
          })).catch(e)).catch(e);
  };
};

module.exports = new Module({
  name: 'twvideo',
  version: '0',
  hasPermssion: 0,
  credits: 'Dương Công Nam',
  description: 'Lấy video twitter',
  commandCategory: 'Phương tiện',
  uages: 'twvideo []',
  cooldowns: 3
});
