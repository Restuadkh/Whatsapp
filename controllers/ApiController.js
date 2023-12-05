const { response } = require("express");
const bodyParser = require("body-parser");
var db = require("./DbController");
var client = require("./WaController");

const api = async (req, res) => {
  let No = req.query.No || req.body.No;
  let Group = req.query.Group || req.body.Group;
  let Msg = req.query.Msg || req.body.Msg;
  let info = client.info;
  let group = false;
  let status = "";
  let getResponse = "";

  let account = "";
  console.log(No);
  if (info) {
    if (No === undefined) {
      status = "Number kosong";
      rstatus = 404;
    } else {
      if (No.startsWith("G")) {
        group = true;
        No = No.slice(1) + "@g.us";
      } else if (No.startsWith("0")) {
        No = "62" + No.slice(1) + "@c.us";
      } else if (No.startsWith("62")) {
        No = No + "@c.us";
      } else {
        No = "62" + No + "@c.us";
      }
      try {
        /// Try Send Messange
        if (group == false) {
          /// Check is't Group
          account = await client.isRegisteredUser(No);
          // check number Is Active
          try {
            getResponse = await client.sendMessage(No, Msg);
            status = "Terkirim";
            rstatus = 200;
          } catch (error) {
            console.log("Tidak terdaftar", error);
            status = "Tidak terdaftar";
            rstatus = 404;
          }
        } else {
          /// Check Is Group
          const groupChat = await client.getChatById(No);
          // check group active
          try {
            getResponse = await groupChat.sendMessage(`${Msg}`);
            console.log("Response SendGroup :", getResponse);
            status = "Terkirim";
            rstatus = 200;
          } catch (error) {
            console.log("Response error SendGroup :", error);
            status = "Tidak terdaftar";
            rstatus = 404;
          }
        }
        try {
          const response = JSON.stringify(getResponse);

          const sql =
            "INSERT INTO logs_messages_out (response, created_at) VALUES (?, NOW())";

          db.query(sql, [response], (err, results) => {
            if (err) {
              console.error("Error executing query:", err);
              return;
            }
            console.log("Chat log saved:", results);
          });
        } catch (error) {
          console.log("Chat log error:", error);
        }
      } catch (error) {
        console.log(error);
        status = "System Error !";
        rstatus = 500;
      }
    }
    res.status(rstatus).json({
      status: status,
      No: No,
      Message: Msg,
      response: getResponse,
      info: info,
    });
  } else {
    res.status(500).json({
      status: "Whatsapp aren't Ready !",
      No: No,
      Message: Msg,
      info: info,
    });
  }
};

module.exports = api;
