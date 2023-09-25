const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { response } = require("express");

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
  console.log(message.body);
});

client.initialize();

const api = async (req, res) => {
  let No = req.query.No || req.body.No;
  const Msg = req.query.Msg || req.body.No;

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
        let status = client.sendMessage(No, Msg);
        res.json({
          status: "Terkirim",
          No: No,
          Message: Msg,
          response: status,
        });
      } else {
        res.json({
          status: "Tidak terdaftar",
          No: No,
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
