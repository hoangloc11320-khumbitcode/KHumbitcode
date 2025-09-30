const https = require('https');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "vdytb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "YourName",
  description: "Tìm kiếm và phát video YouTube",
  commandCategory: "Media",
  usages: "[từ khóa tìm kiếm]",
  cooldowns: 15
};

// Biến lưu trữ tạm
const searchCache = new Map();

module.exports.run = async function({ api, event, args, Users, Threads, Currencies, models }) {
  const { threadID, messageID, senderID } = event;
  const searchQuery = args.join(" ");

  if (!searchQuery) {
    return api.sendMessage("Vui lòng nhập từ khóa tìm kiếm!", threadID, messageID);
  }

  try {
    const API_KEY = "AIzaSyAvra5nLFPOzD7466zPocv0N1pS2iXKXZU";

    api.sendMessage(`🔍 Đang tìm kiếm video cho "${searchQuery}"...`, threadID, messageID);

    const searchResults = await searchYouTube(searchQuery, API_KEY);

    if (!searchResults || searchResults.length === 0) {
      return api.sendMessage("Không tìm thấy video nào phù hợp!", threadID, messageID);
    }

    // Lưu kết quả vào cache
    searchCache.set(senderID, {
      results: searchResults,
      timestamp: Date.now()
    });

    // Tải các thumbnail về máy
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const attachmentPromises = searchResults.map((item, index) => {
      const filePath = path.join(cacheDir, `thumb_${senderID}_${index}.jpg`);
      return downloadFile(item.thumbnail, filePath);
    });

    const attachments = await Promise.all(attachmentPromises);

    const message = {
      body: `🎬 Kết quả tìm kiếm cho "${searchQuery}":\n\n` +
            searchResults.map((item, index) => 
              `${index + 1}. ${item.title}\n⏱️ ${item.duration} | 📺 ${item.channel}`
            ).join('\n\n') +
            '\n\n💬 Reply tin nhắn này với số thứ tự (1-5) để xem video.',
      attachment: attachments
    };

    // Gửi message và đăng ký handle reply
    return api.sendMessage(message, threadID, (error, info) => {
      if (!error) {
        // ĐĂNG KÝ HANDLE REPLY VÀO global.client.handleReply
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          data: {
            results: searchResults,
            timestamp: Date.now()
          }
        });

        console.log(`Đã đăng ký handle reply cho messageID: ${info.messageID}`);

        // Giới hạn số lượng handle reply để tránh tràn bộ nhớ
        if (global.client.handleReply.length > 100) {
          global.client.handleReply.shift();
        }
      }
    });

  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    return api.sendMessage(`❌ Đã xảy ra lỗi khi tìm kiếm video!\n👉 Lỗi: ${error.message}`, threadID, messageID);
  }
};

// Hàm xử lý reply - THEO CƠ CHẾ CỦA BOT
module.exports.handleReply = async function({ api, event, handleReply, Users, Threads, Currencies, models }) {
  const { threadID, messageID, senderID, body } = event;

  // Kiểm tra quyền tác giả
  if (handleReply.author !== senderID) {
    return api.sendMessage("❌ Bạn không phải người thực hiện tìm kiếm này!", threadID, messageID);
  }

  // Kiểm tra thời gian (5 phút)
  if (Date.now() - handleReply.data.timestamp > 5 * 60 * 1000) {
    return api.sendMessage("⏰ Dữ liệu tìm kiếm đã hết hạn!", threadID, messageID);
  }

  const choice = parseInt(body.trim());
  if (isNaN(choice) || choice < 1 || choice > 5) {
    return api.sendMessage("❌ Vui lòng nhập số từ 1 đến 5!", threadID, messageID);
  }

  try {
    const selectedVideo = handleReply.data.results[choice - 1];

    if (!selectedVideo) {
      return api.sendMessage("❌ Lựa chọn không hợp lệ!", threadID, messageID);
    }

    // GỬI LINK VIDEO TRỰC TIẾP - KHÔNG TẢI XUỐNG
    api.sendMessage({
      body: `🎥 ${selectedVideo.title}\n⏱️ Thời lượng: ${selectedVideo.duration}\n📺 Kênh: ${selectedVideo.channel}\n\n🔗 Link video: ${selectedVideo.url}\n\n📋 Copy link và dán vào trình duyệt để xem!`,
      attachment: null // Không có file đính kèm
    }, threadID, messageID);

  } catch (error) {
    console.error("Lỗi xử lý reply:", error);
    return api.sendMessage("❌ Đã xảy ra lỗi khi xử lý yêu cầu!", threadID, messageID);
  }
};

// Hàm tải file từ URL (chỉ cho ảnh)
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      // Chỉ tải nếu là ảnh
      if (response.headers['content-type'] && response.headers['content-type'].startsWith('image/')) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(fs.createReadStream(filePath));
        });
      } else {
        reject(new Error('URL không phải là ảnh'));
      }
    }).on('error', reject);
  });
}

// Hàm tìm kiếm YouTube
async function searchYouTube(query, apiKey) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodedQuery}&key=${apiKey}`;

    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            console.error("Lỗi API YouTube:", result.error);
            reject(new Error(result.error.message || "Lỗi API YouTube"));
            return;
          }

          if (!result.items || result.items.length === 0) {
            resolve([]);
            return;
          }

          const videoIds = result.items.map(item => item.id.videoId).join(',');
          getVideoDetails(videoIds, apiKey)
            .then(details => {
              const videos = result.items.map((item, index) => ({
                title: item.snippet.title,
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                thumbnail: item.snippet.thumbnails.high.url,
                duration: details[index] ? formatDuration(details[index].contentDetails.duration) : "N/A",
                channel: item.snippet.channelTitle
              }));
              resolve(videos);
            })s
            .catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function getVideoDetails(videoIds, apiKey) {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`;
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data).items || []);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function formatDuration(duration) {
  if (!duration) return "N/A";
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "N/A";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  return hours > 0 
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes}:${seconds.toString().padStart(2, '0')}`;
}