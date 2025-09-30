// -*- coding: utf-8 -*-
const axios = require("axios");

// -------------------
// Cấu hình Gemini API
// -------------------
const API_KEY = "AIzaSyAT1fccielQ6gIia_wRPLItGknrxSlq6X8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// -------------------
// Session chat
// -------------------
const chatSessions = {};

// -------------------
// Emoji bot thả ngẫu nhiên
// -------------------
const REACTIONS = ["👍", "❤️", "😂", "🔥", "👌", "🌹"];
const getRandomReaction = () => REACTIONS[Math.floor(Math.random() * REACTIONS.length)];

// -------------------
// Safe react helper
// -------------------
function safeReact(api, messageID, emoji) {
  try {
    if (!api || !messageID || !emoji) return;
    if (typeof api.setMessageReaction === "function") {
      api.setMessageReaction(emoji, messageID, () => {}, true);
    }
  } catch (e) {}
}

// -------------------
// Gọi Gemini API
// -------------------
async function getGeminiResponse(prompt, threadID) {
  const systemInstruction = `Nhiệm vụ của bạn là viết thơ, có gieo vần và nhịp rõ ràng, thơ phải hay. 
Hãy sáng tác theo yêu cầu người dùng. thơ phải có gieo vần , nhịp , ngắt ( thể thơ nào cũng được hoặc tùy theo yêu cầu )
Ví dụ về thơ :
Trai Hà Nội nghìn năm văn vở
Gặp được nàng anh thở ra thơ
Mắt em sáng như trăng trên phố
Nụ cười hồng làm ngỡ ngàng mơ  
Ví dụ 2
Trai Nghệ An như dãi nắng trên đồng  
Gặp em rồi anh thở nhẹ câu thơ  
Mắt em sáng như trăng soi dưới phố  
Nụ cười ấy làm hồn anh ngẩn ngơ
( bạn có thể tùy chọn viết , sao cũng được miễn là thơ hay , viết thơ không được ngập ngừng , phải là thơ thực sự , và bạn mỗi lần viết 1 bài thơ hoặc nhiều hơn nếu người dùng yêu cầu thêm về số lượng , nếu không yêu cầu số lượng , mặc định là 1 bài !!!)`;

  const session = chatSessions[threadID] || { history: [] };
  if (session.history.length >= 1000) session.history = [];

  // push system instruction khi mở session mới
  if (session.history.length === 0) {
    session.history.push({ role: "user", parts: [{ text: systemInstruction }] });
  }

  session.history.push({ role: "user", parts: [{ text: prompt }] });

  try {
    const response = await axios.post(API_URL, {
      contents: session.history,
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95 }
    });

    if (
      response.data?.candidates?.length > 0 &&
      response.data.candidates[0].content?.parts?.length > 0
    ) {
      const replyText = response.data.candidates[0].content.parts[0].text;
      session.history.push({ role: "model", parts: [{ text: replyText }] });
      chatSessions[threadID] = session;
      return replyText;
    }
    return "Gemini không phản hồi 😔";
  } catch (error) {
    console.error("❌ Lỗi gọi Gemini API:", error.response?.data || error.message);
    return "Có lỗi khi kết nối Gemini 😥";
  }
}

// -------------------
// Cấu hình lệnh
// -------------------
module.exports.config = {
  name: "viettho",
  version: "3.0.0",
  hasPermission: 0,
  credits: "Lộc khumbitcode",
  description: "Bot viết thơ bằng Gemini",
  commandCategory: "AI",
  usages: "viettho [nội dung]",
  cooldowns: 5
};

// -------------------
// Chỉ xử lý khi dùng lệnh viettho
// -------------------
module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  const prompt = args.join(" ");
  if (!prompt) {
    return api.sendMessage("⚠️ Bạn chưa nhập nội dung!", threadID, messageID);
  }

  try {
    const reply = await getGeminiResponse(prompt, threadID);
    api.sendMessage(reply, threadID, (err, info) => {
      if (err) return console.error(err);
      safeReact(api, info.messageID, getRandomReaction());
      chatSessions[threadID] = {
        lastMessageID: info.messageID,
        lastTimestamp: Date.now()
      };
    }, messageID);
  } catch (e) {
    console.error("❌ run error:", e);
    api.sendMessage("Có lỗi khi xử lý yêu cầu 😥", threadID, messageID);
  }
};

// -------------------
// Xóa session cũ sau 1h
// -------------------
setInterval(() => {
  const now = Date.now();
  for (const tid in chatSessions) {
    if (now - (chatSessions[tid]?.lastTimestamp || now) > 3600000) {
      delete chatSessions[tid];
      console.log(`🗑️ Xóa session cũ threadID: ${tid}`);
    }
  }
}, 600000);
