var express = require('express');
const session = require('express-session');
var router = express.Router();
const client = require("../controllers/WaController");
const api = require("../controllers/ApiController");
const test = require("../controllers/TestController");
const { render } = require('jade');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/api", (req, res) => {
  res.json({ status: "ok" });
}); 

router.get("/WA", api); 
router.get("/test", test);
router.post("/WA", api);

module.exports = router;
