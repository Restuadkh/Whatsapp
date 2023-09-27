const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { response } = require("express");
var db = require("./DbController"); 
 
const client = new Client({
  authStrategy: new LocalAuth(),
}); 

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
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
  const chat = await message.getChat(); 
  let [number, code] = message.id.remote.split("@");
  let chatid = message._data.id.id;
  let name = message._data.notifyName;
  let msg = message._data.body; 
  console.log(chat); 

  if ((!chat.isGroup)) {
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
  }

  // if (message.body !== '') {
  //   message.reply('Ketik *#Daftar#Alamat*');
  // } else if (message.body === '#Daftar') {
  //     message.reply('pong');
  //   }
});

client.initialize();

module.exports = client;
