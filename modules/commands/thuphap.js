module.exports.config = {
  name: "thuphap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "D-jukie, DuyVuong, ChinhLe ",
  description: "Tạo một bức thư pháp kèm tên bạn",
  commandCategory: "Edit-IMG",
  usages: "[0 -> 3] | [ 1 -> 3 ] | [Text] | [Text 2]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args }) => {
  if (this.config.credits != 'D-jukie, DuyVuong, ChinhLe') return;

  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");
  const path = require("path");
  const Canvas = require("canvas");

  let pathImg = __dirname + `/cache/${senderID + 20}.png`;
  const fontPath = __dirname + `/cache/UTM ThuPhap Thien An.ttf`;

  if (!args[0])
    return api.sendMessage(
      'Sai cú pháp\n[0 -> 3] | [ 1 -> 3 ] | [Text] | [Text 2]',
      threadID,
      messageID
    );

  /*------------------------Background-----------------------*/
  var dsCover = [
    {
      tpCover:
        "https://lh3.googleusercontent.com/-nUwoTGWnfGA/YZjFyVXf7MI/AAAAAAAA1Ug/XX9QE_4WbFMQZaIJrpkDzvoUzg7JkYPbACNcBGAsYHQ/s0/thuphap1.jpg",
      tpColor: "#222222",
    },
    {
      tpCover:
        "https://lh3.googleusercontent.com/-2ZPI8b5CSv4/YZj-PpDjwKI/AAAAAAAA1U4/UIj7lGXgAAsTDuwQjpZu8WXyLxMUR-S7ACNcBGAsYHQ/s0/thuphap2.jpg",
      tpColor: "#48413a",
    },
    {
      tpCover:
        "https://lh3.googleusercontent.com/-mUDbRYZ8Cv8/YZkAOAkVIFI/AAAAAAAA1VA/9MtWRZzAqFc0D3I8iORn3bj0f2sRP6bHQCNcBGAsYHQ/s0/thuphap3.jpg",
      tpColor: "#c75a53",
    },
    {
      tpCover:
        "https://lh3.googleusercontent.com/-pZyh72jJKbo/YZkA0ss2V7I/AAAAAAAA1VI/juO1Wc2Ee24yKDlBDvhoMdMmivKlYeypgCNcBGAsYHQ/s0/thuphap4.jpg",
      tpColor: "#747757",
    },
  ];

  const content = args
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|");

  let background = (
    await axios.get(encodeURI(dsCover[content[0]].tpCover), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(background));

  // đảm bảo folder cache tồn tại
  if (!fs.existsSync(__dirname + "/cache")) fs.mkdirSync(__dirname + "/cache");

  // tải font nếu chưa có
  if (!fs.existsSync(fontPath)) {
    let getfont2 = (
      await axios.get(
        `https://drive.google.com/u/0/uc?id=1z_WTixiFx_LD99o2Vf9XSzaNyDxPaKcS&export=download`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(fontPath, Buffer.from(getfont2));
  }

  // đăng ký font
  Canvas.registerFont(fontPath, { family: "ThuPhapCustom" });

  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = dsCover[content[0]].tpColor;

  var q = content[2];
  var p = content[3];
  var n = content[4];

  if (content[1] == "1") {
    ctx.font = "100px ThuPhapCustom";
    var m = 150 - ctx.measureText(q || "").width;
    if (m < 30) m = 30;
    if (m > 90) m = 90;
    ctx.font = m + "px ThuPhapCustom";
    ctx.fillText(q, canvas.width / 2, canvas.height / 2 + 25);
  }

  if (content[1] == "2") {
    ctx.font = "100px ThuPhapCustom";
    var m = 140 - ctx.measureText(q || "").width;
    if (m < 30) m = 30;
    if (m > 90) m = 90;
    ctx.font = m + "px ThuPhapCustom";
    ctx.fillText(q, canvas.width / 2, canvas.height / 2 - 95);
    ctx.fillText(p, canvas.width / 2, canvas.height / 2 + 110);
  }

  if (content[1] == "3") {
    ctx.font = "100px ThuPhapCustom";
    var m = 130 - ctx.measureText(q || "").width;
    if (m < 30) m = 30;
    if (m > 90) m = 90;
    ctx.font = m + "px ThuPhapCustom";
    ctx.fillText(q, canvas.width / 2, canvas.height / 2 - 145);
    ctx.fillText(p, canvas.width / 2, canvas.height / 2);
    ctx.fillText(n, canvas.width / 2, canvas.height / 2 + 155);
  }

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);

  return api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    messageID
  );
};
