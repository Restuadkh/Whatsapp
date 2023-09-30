const { response } = require("express");
const bodyParser = require("body-parser");
var db = require("./DbController");
var client = require('./WaController');

const api = async (req, res) => {
    let No = req.query.No || req.body.No;
    let Group = req.query.Group || req.body.Group;
    const Msg = req.query.Msg || req.body.No; 
    let info = client.info;
    let group = false;
    let status = '';
    let response = '';
    let account = '';
    console.log(No);
    if (info) {
        if ((No === undefined)) {
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
                if(group==false){
                    account = await client.isRegisteredUser(No);
                }
                if (account) {
                    response = await client.sendMessage(No, Msg);
                    status = "Terkirim";
                    rstatus = 200;
                    if (response) {
                        const sql =
                          "INSERT INTO mgsout (id_wa, receive_to, text, response, time) VALUES (?, ?, ?, ?, NOW())";
                    
                        db.query(sql, [info.wid.user, No, Msg, response], (err, results) => {
                          if (err) {
                            console.error("Error executing query:", err);
                            return;
                          }
                          console.log("Chat log saved:", results);
                        });
                      }
                } else {
                    status = "Tidak terdaftar";
                    rstatus = 404;
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
            response: response,
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