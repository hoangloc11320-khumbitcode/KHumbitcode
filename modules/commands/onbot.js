const readline = require("readline");

module.exports.config = {
    name: "buffmxh",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "ChatGPT remix",
    description: "Buff MXH demo",
    commandCategory: "Tiện ích",
    usages: "buffmxh",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, senderID } = event;

    // B1: rep ngay
    api.sendMessage("⏳ Đang chờ ! Chờ tôi xíu 🌋📸👾", threadID);

    // B2: giả lập load
    setTimeout(() => {
        api.sendMessage("🔄 Loading dữ liệu bot... 🔄", threadID);
    }, 2000);

    // B3: trả lời sau vài giây
    setTimeout(() => {
        api.sendMessage({
            body: "Bot đã được mở ><",
            mentions: [{ tag: "Bạn", id: senderID }]
        }, threadID);
    }, 5000);

    // B4: Bật input terminal 1 lần thôi (tránh lặp lại nhiều lần khi có người gọi lệnh)
    if (!global.terminalInputStarted) {
        global.terminalInputStarted = true;

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log("💻 Nhập tin nhắn ở đây để gửi thẳng vào Messenger:");

        rl.on("line", (line) => {
            if (line.trim().length > 0) {
                api.sendMessage(line.trim(), threadID);
                console.log(`📩 Đã gửi: ${line}`);
            }
        });
    }
};
