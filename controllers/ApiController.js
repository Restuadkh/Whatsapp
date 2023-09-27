const { response } = require("express");
const bodyParser = require("body-parser");
var db = require("./DbController");
var client = require('./WaController');

const api = async (req, res) => {
    let No = req.query.No || req.body.No;
    let Group = req.query.Group || req.body.Group;
    const Msg = req.query.Msg || req.body.No;
    let info = client.info;
    let status = '';
    let response = '';
    console.log(No);
    if (info) {
        if ((No === undefined)) {
            status = "Number kosong";
            rstatus = 404;
        } else if ((Group === undefined)) {
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
                    response = await client.sendMessage(No, Msg);
                    status = "Terkirim";
                    rstatus = 200;
                } else {
                    status = "Tidak terdaftar";
                    rstatus = 404;
                }
            } catch (error) {
                console.log(error);
                status = "System Error !";
                rstatus = 500;
            }

        } else {
            if (Group.endsWith("@g.us")) {
                Group = Group;
            } else {
                Group = Group + "@g.us";
            }
            try {
                const account_ = await client.isRegisteredUser(Group);

                if (account_) {
                    response = await client.sendMessage(Group, Msg);
                    status = "Terkirim";
                    rstatus = 200;
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