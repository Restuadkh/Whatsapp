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
  let response = JSON.stringify(message);
  const chat = await message.getChat();

  let [number, code] = message.id.remote.split("@");
  let chatid = message._data.id.id;
  let name = message._data.notifyName;
  let msg = message._data.body;

  let time = message._data.t;

  console.log("Chat Respons", chat);
  console.log("Message Respons", message);

  try {
    const sql =
      "INSERT INTO logs_messages_in (response, created_at) VALUES (?, NOW())";

    db.query(sql, [response], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return;
      }
      console.log("Chat log saved:", results);
    });
  } catch (error) {
    console.error("Error executing message:", error);
  }

  if (message.hasMedia) {
    try {
      const mediaData = await message.downloadMedia();

      const filedirectory = `./public/media/${number}/`;

      if (!fs.existsSync(filedirectory)){
        fs.mkdirSync(filedirectory, { recursive: true });
        console.log('Directory created:', filedirectory);
    }
      const mediaFileName = `${filedirectory}/${name}_${time}.${
        mediaData.mimetype.split("/")[1]
      }`;

      // Tulis data media ke file
      fs.writeFileSync(mediaFileName, mediaData.data, "base64");

      console.log(`Media file saved at: ${mediaFileName}`);
    } catch (error) {
      console.log(`Media file Error : ${error}`);
    }
    // Unduh media dan simpan ke dalam folder 'media'
  } else if (!chat.isGroup) {
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
});

client.initialize();

module.exports = client;
