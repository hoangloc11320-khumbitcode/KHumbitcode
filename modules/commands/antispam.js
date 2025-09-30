const fs = require("fs-extra");

module.exports.config = {
    name: "antispam",
    version: "1.3.1",
    hasPermssion: 1,
    credits: "HoangLoc Cute 🐰",
    description: "Chặn người dùng spam, cảnh báo bé dỗi 10 phút kèm ảnh gif",
    commandCategory: "Quản Lí Box",
    usages: "antispam",
    cooldowns: 0,
};

const path = "./modules/commands/data/antispam.json";
let antiSpamStatus = {};
let usersSpam = {};
let bannedUsers = {}; // danh sách bị bé dỗi

if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}, null, 4));
} else {
    antiSpamStatus = JSON.parse(fs.readFileSync(path));
}

// check sự kiện tin nhắn
module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, senderID, type } = event;

    // nếu bị dỗi mà nhắn lệnh → trả về câu "Đã hết dỗi đâu..."
    if (bannedUsers[senderID] && Date.now() < bannedUsers[senderID].expire) {
        if (event.body && event.body.startsWith(global.config.PREFIX || "")) {
            return api.sendMessage("❌ Đã hết dỗi đâu mà đòi nhắn 🐧", threadID, event.messageID);
        }
        return; // còn lại thì lơ
    } else if (bannedUsers[senderID] && Date.now() >= bannedUsers[senderID].expire) {
        delete bannedUsers[senderID]; // hết dỗi thì bỏ
    }

    if (!antiSpamStatus[threadID] || !antiSpamStatus[threadID].status) return;
    const settings = antiSpamStatus[threadID];

    if (type !== "message" && type !== "message_reply" && type !== "message_sticker") return;

    if (!usersSpam[senderID]) {
        usersSpam[senderID] = { count: 0, start: Date.now() };
    }

    const userSpamData = usersSpam[senderID];
    userSpamData.count++;

    if (Date.now() - userSpamData.start > settings.spamTime) {
        userSpamData.count = 1;
        userSpamData.start = Date.now();
    }

    if (userSpamData.count > settings.spamCount) {
        try {
            const userInfo = await api.getUserInfo(senderID);
            const userName = userInfo[senderID]?.name || "Bạn hông tên 🐣";

            const banTime = 10 * 60 * 1000; // 10 phút
            bannedUsers[senderID] = { expire: Date.now() + banTime };

            api.sendMessage(
                {
                    body: `😡 ${userName} đã bị bé dỗi 10 phút\n📌 Lý do: spam bé ${settings.spamCount} lần/${settings.spamTime / 1000} giây\n💌 Muốn gỡ thì hỏi bồ em\n⏳ Em sẽ hết dỗi sau 10 phút`,
                    mentions: [{ tag: userName, id: senderID }],
                    attachment: fs.createReadStream(__dirname + "/menhera-chan-chibi.gif")
                },
                threadID
            );
        } catch (error) {
            api.sendMessage("❌ Bé bị lỗi hông xử lý được 🥹", threadID);
        }

        delete usersSpam[senderID];
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID } = event;
    const infoThread = await api.getThreadInfo(threadID);
    const adminIDs = infoThread.adminIDs.map((e) => e.id);
    const idBot = api.getCurrentUserID();

    if (!adminIDs.includes(idBot)) {
        return api.sendMessage("🐰 Bé cần quyền Quản Trị Viên để hoạt động á~", threadID);
    }

    switch (args[0]) {
        case "set":
            const spamCount = parseInt(args[1]);
            const spamTimeInSeconds = parseInt(args[2]);

            if (!spamCount || !spamTimeInSeconds) {
                return api.sendMessage("❌ Nhập số tn + thời gian hợp lệ đi nè uwu~", threadID);
            }

            antiSpamStatus[threadID] = {
                spamCount,
                spamTime: spamTimeInSeconds * 1000,
                status: false,
            };

            fs.writeFileSync(path, JSON.stringify(antiSpamStatus, null, 4));
            api.sendMessage(
                `✅ Cài đặt chống spam rùi nè:\n- 📩 Số tn: ${spamCount}\n- ⏱ Trong: ${spamTimeInSeconds}s\n👉 Dùng 'antispam on' để bật bé dỗi mode nha~`,
                threadID
            );
            break;

        case "on":
            if (!antiSpamStatus[threadID]) {
                return api.sendMessage(
                    "❌ Chưa cài đặt gì hết trơn, xài 'antispam set [tin_nhắn] [giây]' đi pạn~",
                    threadID
                );
            }

            antiSpamStatus[threadID].status = true;
            fs.writeFileSync(path, JSON.stringify(antiSpamStatus, null, 4));
            api.sendMessage("🔒 Bé đã bật chế độ dỗi ai spam òi nha~ 😤", threadID);
            break;

        case "off":
            if (antiSpamStatus[threadID]) {
                antiSpamStatus[threadID].status = false;
                fs.writeFileSync(path, JSON.stringify(antiSpamStatus, null, 4));
                api.sendMessage("🔓 Bé hết dỗi, tắt chống spam òi đó 🐧", threadID);
            } else {
                api.sendMessage("❌ Chưa set gì hết mà đòi off, hông chịu đâu 🙄", threadID);
            }
            break;

        default:
            api.sendMessage(
                "📖 Hdsd nè:\n- Bật: antispam on 🐰\n- Tắt: antispam off 🐣\n- Set: antispam set [tin_nhắn] [giây]\n👉 Ví dụ: antispam set 5 10 (ai spam 5 tn/10s là bị bé dỗi 10p á 😡)",
                threadID
            );
    }
};
