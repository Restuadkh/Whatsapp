const { Client, LocalAuth, MessageAck } = require("whatsapp-web.js");
const qrcodet = require("qrcode-terminal");
const qrcode = require("qrcode");
const { response } = require("express");
var db = require("./DbController");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", async (qr) => {
  const fs = require("fs");

  console.log("Scan the QR code with your phone to authenticate:\n", qr);
  // qrcodet.generate(qr, { small: true });

  const qrImageBuffer = await qrcode.toBuffer(qr, { type: "image/jpeg" });
  const folderPath = "./public/qrcodes";
  const filePath = `${folderPath}/whatsapp-qrcode.jpg`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  fs.writeFileSync(filePath, qrImageBuffer);
  console.log(`QR Code image saved at: ${filePath}`);
});

client.on("ready", () => {
  console.log("Client is ready!");
  // console.log(client);
});

if (client.info === undefined) {
  console.log("the system is not ready yet");
  // console.log(client);
} else {
  console.log("Bypass");
}

client.on("message", async (message) => {
  const MessageData = {
    sender: message.from,
    text: message.body,
    timestamp: message.timestamp,
  };
  const chat = await message.getChat();
  const user = await message.id.user;
  let [number, code] = message.id.remote.split("@");
  let chatid = message._data.id.id;
  let name = message._data.notifyName;
  let msg = message._data.body;
  let id_wa = message.to;
  let time = message._data.t;
  console.log("Chat Respons", chat);
  console.log("Message Respons", message);

  if (message.hasMedia) {
    // Unduh media dan simpan ke dalam folder 'media'
    const mediaData = await message.downloadMedia();
    const filedirectory = `./public/media/${number}/`;
    if (!fs.existsSync(filedirectory)) {
      fs.mkdirSync(filedirectory);
    }
    const mediaFileName = `${filedirectory}/${time}.${
      mediaData.mimetype.split("/")[1]
    }`;

    // Tulis data media ke file
    fs.writeFileSync(mediaFileName, mediaData.data, "base64");

    console.log(`Media file saved at: ${mediaFileName}`);
  }

  if (message) {
    const sql = "INSERT INTO logs (id_wa, text, time) VALUES (?, ?, NOW())";

    db.query(sql, [id_wa, MessageData], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      console.log("Chat log saved:", results);
    });
  }

  if (!chat.isGroup) {
    if (number !== "status") {
      const sql =
        "INSERT INTO mgsin (number, name, chatid, type, massage, time) VALUES (?, ?, ?, ?, ?, NOW())";

      db.query(sql, [number, name, chatid, code, msg], (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          // res.send('Terjadi kesalahan saat menyimpan chat.');
          return;
        }

        console.log("Chat log saved:", results);
        // res.send('Chat log berhasil disimpan.');
      });
    } else {
      console.log("Status", name);
    }
  } else {
    console.log("Group", name);
  }

  // if (message.body !== '') {
  //   message.reply('Ketik *#Daftar#Alamat*');
  // } else if (message.body === '#Daftar') {
  //     message.reply('pong');
  //   }
});

client.initialize();

module.exports = client;
