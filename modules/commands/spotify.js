const axios = require("axios");
const moment = require('moment-timezone');

module.exports.config = {
  name: "spotify",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "DongDev",
  description: "Tìm kiếm nhạc trên Spotify",
  commandCategory: "Tìm kiếm",
  usages: "[]",
  images: [],
  cooldowns: 2,
};

function convertTime(a) {
  const giay = Math.floor((a / 1000) % 60);
  const phut = Math.floor((a / (1000 * 60)) % 60);
  const gio = Math.floor(a / (1000 * 60 * 60));
  return `${gio}:${String(phut).padStart(2, '0')}:${String(giay).padStart(2, '0')}`;
}

async function get_token(client_id, client_secret) {
  try {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };

    const response = await axios.post(authOptions.url, null, {
      headers: authOptions.headers,
      params: authOptions.form,
    });

    return response.data.access_token;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw new Error("Lỗi khi lấy token Spotify");
  }
}

async function search(keywords, limit = 6) {
  const data_audio = [];
  try {
    const client_id = 'b9d2557a2dd64105a37f413fa5ffcda4';
    const client_secret = '41bdf804974e4e70bfa0515bb3097fbb';

    const token = await get_token(client_id, client_secret);

    const res = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURI(keywords)}&type=track&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.tracks || !res.data.tracks.items.length) return [];

    for (const item of res.data.tracks.items) {
      const result = {
        id: item.id,
        title: item.name,
        author: item.album.artists[0].name,
        duration: item.duration_ms,
        thumb: item.album.images[0]?.url || null,
        link: item.external_urls.spotify,
        preview_url: item.preview_url,
      };
      data_audio.push(result);
    }
    return data_audio;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw new Error("Lỗi khi tìm kiếm trên Spotify");
  }
}

module.exports.run = async function ({ api, event, args }) {
  try {
    const keyword = args.join(" ").trim();

    if (!keyword) {
      api.sendMessage("⚠️ Vui lòng nhập từ khóa để tìm nhạc trên Spotify", event.threadID, event.messageID);
      return;
    }

    const dataSearch = await search(keyword);

    if (!dataSearch || dataSearch.length === 0) {
      api.sendMessage(`❎ Không tìm thấy kết quả nào cho từ khóa: ${keyword}`, event.threadID, event.messageID);
      return;
    }

    const img = dataSearch.map(t => t.thumb).filter(Boolean);

    const image = [];
    for (let a of img) {
      try {
        const stream = (await axios.get(a, { responseType: "stream" })).data;
        image.push(stream);
      } catch (e) { continue; }
    }

    const messages = dataSearch.map((item, index) => {
      const duration = convertTime(item.duration);
      return `\n${index + 1}. 👤 Tên: ${item.author}\n📜 Tiêu đề: ${item.title}\n⏳ Thời lượng: ${duration} giây`;
    });

    const listTrack = {
      body: `[ SPOTIFY - SEARCH TRACKS ]\n────────────────────\n📝 Danh sách tìm kiếm của từ khóa: ${keyword}\n${messages.join("\n")}\n\n📌 Reply theo số tương ứng để tải nhạc`,
      attachment: image
    };

    api.sendMessage(listTrack, event.threadID, (error, info) => {
      global.client.handleReply.push({
        type: "choose",
        name: module.exports.config.name,
        author: info.senderID,
        messageID: info.messageID,
        dataTrack: dataSearch,
      });
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("Lỗi: " + error.message, event.threadID);
  }
};

module.exports.handleReply = async function ({ event, api, handleReply, args }) {
  const { threadID: tid, messageID: mid, body } = event;

  if (handleReply.type !== "choose") return;

  const choose = parseInt(body);
  api.unsendMessage(handleReply.messageID);

  if (isNaN(choose)) {
    return api.sendMessage('⚠️ Vui lòng nhập 1 con số', tid, mid);
  }

  if (choose < 1 || choose > handleReply.dataTrack.length) {
    return api.sendMessage('❎ Lựa chọn không nằm trong danh sách', tid, mid);
  }

  const chosenItem = handleReply.dataTrack[choose - 1];
  const urlaudio = chosenItem.preview_url || chosenItem.link; // fallback nếu preview_url null
  const time = convertTime(chosenItem.duration);

  try {
    const resp = await axios.get(`https://for-devs.onrender.com/api/spotifydl?apikey=api1&url=${urlaudio}`);
    if (!resp.data || !resp.data.metadata || !resp.data.metadata.downloadUrl) {
      return api.sendMessage('❌ Không tải được file nhạc, thử track khác', tid, mid);
    }
    const results = resp.data.metadata;

    const streamURL = async (url, ext = 'mp3') => {
      try {
        const res = await axios.get(url, { responseType: 'stream' });
        res.data.path = `tmp.${ext}`;
        return res.data;
      } catch (e) { return null; }
    };

    const attachment = await streamURL(results.downloadUrl, 'mp3');
    if (!attachment) return api.sendMessage('❌ Không tải được file nhạc', tid, mid);

    api.sendMessage({
      body: `[ SPOTIFY - MUSIC ]\n────────────────────\n👤 → Tên: ${chosenItem.author}\n📝 → Tiêu đề: ${chosenItem.title}\n⏳ → Thời lượng: ${time} giây\n🗓️ → Tải lên: ${results.releaseDate}\n🔎 → ID: ${chosenItem.id}\n────────────────────\n⏰ → Time: ${moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss")}`,
      attachment
    }, tid);
  } catch (e) {
    console.error(e);
    api.sendMessage('❌ Lỗi khi tải file nhạc', tid, mid);
  }
};
