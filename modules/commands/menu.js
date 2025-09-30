const fs = require("fs-extra");

module.exports.config = {
    name: 'menu',
    version: '1.4.4',
    hasPermssion: 0,
    credits: 'Hoàng Lộc',
    description: 'Xem danh sách nhóm lệnh, thông tin chi tiết lệnh',
    commandCategory: 'Danh sách lệnh',
    usages: '[...name commands|all|per <permission level>]',
    cooldowns: 5,
    envConfig: {
        autoUnsend: {
            status: true,
            timeOut: 500 // giây
        }
    }
};

const { autoUnsend } =
    (global.config && global.config.menu) || module.exports.config.envConfig;

module.exports.run = async function ({ api, event, args }) {
    const { sendMessage: send, unsendMessage: unsend } = api;
    const { threadID: tid, senderID: sid } = event;
    const isAdmin = global.config.ADMINBOT.includes(sid);

    // ===== menu all =====
    if (args[0] === "all") {
        const data = commandsGroup(isAdmin);
        let txt = `✨ 〚 DANH SÁCH TOÀN BỘ LỆNH 〛 ✨\n━━━━━━━━━━━━━━━\n`;
        let count = 0;

        for (const group of data) {
            txt += `🌺 ${group.commandCategory.toUpperCase()}:\n`;
            txt += group.commandsName
                .map(cmd => `   ${++count}. ${cmd.charAt(0).toUpperCase() + cmd.slice(1)} ✅`)
                .join("\n");
            txt += `\n━━━━━━━━━━━━━━━\n`;
        }

        txt += `🎀 Tổng cộng: ${count} lệnh`;

        return send(txt, tid);
    }

    // ===== menu chính =====
    if (args.length === 0) {
        const data = commandsGroup(isAdmin);
        const totalCmds = data.reduce((acc, cur) => acc + cur.commandsName.length, 0);
        let txt = `💖🌸 〚 MENU BOT 〛━━━━〚 𝓚𝓱𝓾𝓶𝓫𝓲𝓽𝓬𝓸𝓭𝓮 - 𝓗𝓛🌸〛🌸💖\n━━━━━━━━━━━━━━━\n\n`,
            count = 0;

        for (const { commandCategory, commandsName } of data) {
            txt += `🌸 ${++count}. ${commandCategory.charAt(0).toUpperCase() + commandCategory.slice(1)}  |  ✨ Có ${commandsName.length} lệnh 💖\n`;
        }

        txt += `\n━━━━━━━━━━━━━━━\n`;
        txt += `🎀 Tổng cộng: ${totalCmds} lệnh\n`;
        txt += `🌟 Reply số (1 → ${data.length}) để xem chi tiết nhóm\n`;
        txt += `⏳ Tự gỡ sau: ${autoUnsend.timeOut}s\n`;
        txt += `🙈 Một số lệnh 18+ đã bị khoá\n`;
        txt += `💌 FB ADMIN: https://facebook.com/???`;

        send({
            body: txt,
            attachment: fs.createReadStream(__dirname + "/anime.gif")
        }, tid, (err, info) => {
            if (autoUnsend.status)
                setTimeout(() => unsend(info.messageID), autoUnsend.timeOut * 1000);
            // push handleReply cấp 1
            global.client.handleReply.push({
                type: "menu",
                name: "menu",
                author: sid,
                messageID: info.messageID,
                data: data
            });
        });
    }
};

// ================== handle reply ===================
module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { threadID, senderID, body } = event;
    if (senderID !== handleReply.author) return;

    const num = parseInt(body);
    if (isNaN(num)) return api.sendMessage("❌ Vui lòng nhập số hợp lệ!", threadID);

    // menu chính: chọn nhóm
    if (handleReply.type === "menu") {
        if (num < 1 || num > handleReply.data.length)
            return api.sendMessage("❌ Số không hợp lệ!", threadID);

        const group = handleReply.data[num - 1];
        let txt = `🌸 〚 ${group.commandCategory.toUpperCase()} 〛 🌸\n━━━━━━━━━━━━━━━\n`;
        txt += group.commandsName
            .map((cmd, i) => `✨ ${i + 1}. ${cmd.charAt(0).toUpperCase() + cmd.slice(1)} 💖`)
            .join("\n");
        txt += `\n━━━━━━━━━━━━━━━\nTổng: ${group.commandsName.length} lệnh\n`;
        txt += `🌟 Reply số (1 → ${group.commandsName.length}) để xem chi tiết lệnh`;

        api.sendMessage(txt, threadID, (err, info) => {
            global.client.handleReply.push({
                type: "menu_detail",
                name: "menu",
                author: senderID,
                messageID: info.messageID,
                data: group.commandsName
            });
        });
    }
    // menu chi tiết: xem thông tin lệnh
    else if (handleReply.type === "menu_detail") {
        if (num < 1 || num > handleReply.data.length)
            return api.sendMessage("❌ Số không hợp lệ!", threadID);

        const cmdName = handleReply.data[num - 1];
        const cmd = global.client.commands.get(cmdName);
        if (!cmd) return api.sendMessage("❌ Không tìm thấy thông tin lệnh!", threadID);

        const { description, usages, cooldowns, hasPermssion } = cmd.config;
        let txt = `✨ 〚 THÔNG TIN LỆNH 〛 ✨\n━━━━━━━━━━━━━━━\n`;
        txt += `💖 Tên lệnh: ${cmdName.charAt(0).toUpperCase() + cmdName.slice(1)}\n`;
        txt += `📝 Mô tả: ${description || "Chưa có"}\n`;
        txt += `⚡ Cách dùng: ${usages || "Chưa có"}\n`;
        txt += `⏱ Thời gian cooldown: ${cooldowns || 0}s\n`;
        txt += `🔑 Quyền hạn: ${hasPermssion}\n`;
        txt += `━━━━━━━━━━━━━━━`;

        return api.sendMessage(txt, threadID);
    }
};

// ================== helper ===================
function filterCommands(commands, isAdmin) {
    return Array.from(commands).filter(cmd => {
        const { commandCategory, hasPermssion } = cmd.config;
        if (isAdmin) return true;
        return commandCategory !== 'Hệ Thống' && hasPermssion < 2;
    });
}

function commandsGroup(isAdmin) {
    const array = [],
        cmds = filterCommands(global.client.commands.values(), isAdmin);
    for (const cmd of cmds) {
        const { name, commandCategory } = cmd.config;
        const find = array.find(i => i.commandCategory == commandCategory);
        !find
            ? array.push({ commandCategory, commandsName: [name] })
            : find.commandsName.push(name);
    };
    array.sort(sortCompare('commandsName'));
    return array;
}

function sortCompare(k) {
    return function (a, b) {
        return (a[k].length > b[k].length ? 1 : a[k].length < b[k].length ? -1 : 0) * -1;
    };
}
