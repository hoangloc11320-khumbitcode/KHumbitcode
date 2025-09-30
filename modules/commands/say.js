const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
	name: "say",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "Khum bietcode><",
	description: "Chuyển văn bản thành giọng nói (Viettel + Google TTS)",
	usePrefix: false,
	commandCategory: "Công cụ",
	usages: "say [nội dung]",
	cooldowns: 5
};

const TOKEN = "3d86869b2984d82f6bfe36f7fe99ba25"; // Token ViettelAI

module.exports.run = async function ({ api, event, args }) {
	try {
		if (!args[0]) return api.sendMessage("⚠️ Dùng: say + nội dung", event.threadID);

		const msg = args.join(" ");

		// menu giọng
		const menu = `
🎤 Chọn giọng đọc:

1. Quỳnh Anh (Nữ miền Bắc)
2. Diễm My (Nữ miền Nam)
3. Mai Ngọc (Nữ miền Trung)
4. Phương Trang (Nữ miền Bắc)
5. Thảo Chi (Nữ miền Bắc)
6. Thanh Hà (Nữ miền Bắc)
7. Phương Ly (Nữ miền Nam)
8. Thùy Dung (Nữ miền Nam)
9. Thanh Tùng (Nam miền Bắc)
10. Bảo Quốc (Nam miền Trung)
11. Minh Quân (Nam miền Nam)
12. Thanh Phương (Nữ miền Bắc)
13. Nam Khánh (Nam miền Bắc)
14. Lê Yến (Nữ miền Nam)
15. Tiến Quân (Nam miền Bắc)
16. Thùy Duyên (Nữ miền Nam)
17. Google TTS

👉 Reply số để chọn.`;

		api.sendMessage(menu, event.threadID, (err, info) => {
			global.client.handleReply.push({
				name: this.config.name,
				messageID: info.messageID,
				author: event.senderID,
				type: "chooseVoice",
				text: msg
			});
		});
	} catch (e) {
		console.log(e);
		return api.sendMessage("❌ Lỗi!", event.threadID);
	}
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
	if (handleReply.author != event.senderID) return;

	const { createReadStream, unlinkSync, writeFileSync } = fs;
	const { resolve } = path;

	// map số → mã giọng
	const voices = {
		1: "hn-quynhanh",
		2: "hcm-diemmy",
		3: "hue-maingoc",
		4: "hn-phuongtrang",
		5: "hn-thaochi",
		6: "hn-thanhha",
		7: "hcm-phuongly",
		8: "hcm-thuydung",
		9: "hn-thanhtung",
		10: "hue-baoquoc",
		11: "hcm-minhquan",
		12: "hn-thanhphuong",
		13: "hn-namkhanh",
		14: "hn-leyen",
		15: "hn-tienquan",
		16: "hcm-thuyduyen"
	};

	const choice = parseInt(event.body.trim());
	if (isNaN(choice) || choice < 1 || choice > 17)
		return api.sendMessage("❌ Lựa chọn không hợp lệ.", event.threadID);

	const msg = handleReply.text;

	try {
		if (choice === 17) {
			// GOOGLE TTS
			const languageToSay = "vi"; // mặc định
			const pathOut = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}_gg.mp3`);
			await global.utils.downloadFile(
				`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`,
				pathOut
			);
			return api.sendMessage(
				{ body: ".", attachment: createReadStream(pathOut) },
				event.threadID,
				() => unlinkSync(pathOut),
				event.messageID
			);
		} else {
			// VIETTEL TTS
			const voice = voices[choice];
			const res = await axios.post(
				"https://viettelai.vn/tts/speech_synthesis",
				{
					text: msg,
					voice: voice,
					speed: 1,
					tts_return_option: 3,
					token: TOKEN,
					without_filter: false
				},
				{ headers: { "Content-Type": "application/json", accept: "*/*" }, responseType: "arraybuffer" }
			);

			const pathOut = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}_vt.mp3`);
			writeFileSync(pathOut, Buffer.from(res.data, "binary"));

			return api.sendMessage(
				{ body: `(#${choice}):`, attachment: createReadStream(pathOut) },
				event.threadID,
				() => unlinkSync(pathOut),
				event.messageID
			);
		}
	} catch (e) {
		console.log(e);
		return api.sendMessage("⚠️ Có lỗi khi tạo giọng đọc.", event.threadID, event.messageID);
	}
};
