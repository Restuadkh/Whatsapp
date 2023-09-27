
const { response } = require("express");
var db = require("./DbController");
var client = require('./WaController');

const test = async (req, res) => {

    res.status(200).json({
        status: 'ok',
    }
    )
};

module.exports = test;