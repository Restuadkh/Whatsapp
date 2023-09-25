const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router(); 


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  let test = req.body.test;
  res.send(test);
});

module.exports = router;
