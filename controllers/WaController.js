const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { response } = require("express");
var db = require("./DbController");

let login = 0;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  login = 1;
});

if (client.info === undefined) {
  login = 0;
  console.log("the system is not ready yet");
} else {
  login = 1;
  console.log("Bypass");
}

client.on("message", (message) => {
  let full_massage = message;
  let [number, code] = message.id.remote.split("@");
  let chatid = message._data.id.id;
  let name = message._data.notifyName;
  let msg = message._data.body;
  // console.log(name);
  // console.log(msg);
  const sql = "INSERT INTO logs (text, time) VALUES (?, ?, NOW())";

  db.query(sql, [full_massage], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      // res.send('Terjadi kesalahan saat menyimpan chat.');
      return;
    }
    console.log(
      "Chat log saved:",
      results,
      "Chat log berhasil disimpan : ",
      name
    );
    // res.send('Chat log berhasil disimpan.');
  });

  if ((code = "c.us")) {
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
  } else if ((code = "g.us")) {
  }

  // if (message.body !== '') {
  //   message.reply('Ketik *#Daftar#Alamat*');
  // } else if (message.body === '#Daftar') {
  //     message.reply('pong');
  //   }
});

client.initialize();

const api = async (req, res) => {
  let No = req.query.No || req.body.No;
  const Msg = req.query.Msg || req.body.No;
  const Reply = req.query.reply || req.body.reply;
  if (login === 1) {
    if (No.startsWith("0")) {
      No = "62" + No.slice(1) + "@c.us";
    } else if (No.startsWith("62")) {
      No = No + "@c.us";
    } else {
      No = "62" + No + "@c.us";
    }

    try {
      const account = await client.isRegisteredUser(No);

      if (account) {
        let status = "";
        if (Reply !== "") {
          status = client.reply(Mgs, Reply);
        } else {
          status = client.sendMessage(No, Msg);
        }
        res.json({
          status: "Terkirim",
          No: No,
          Reply: Reply,
          Message: Msg,
          response: status,
        });
      } else {
        res.json({
          status: "Tidak terdaftar",
          No: No,
          Reply: Reply,
          Message: Msg,
        });
      }

      // res.status(200).json({ No, Msg });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "System Error !",
        No: No,
        Message: Msg,
        response: error,
      });
    }
  } else {
    res.status(500).json({
      status: "Whatsapp aren't Ready !",
      No: No,
      Message: Msg,
    });
  }
};

module.exports = api;
