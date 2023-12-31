var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var db = require("./controllers/DbController");
var client = require("./controllers/WaController");
var app = express();

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/qr", (req, res) => {
  res.send("<img src='/qrcodes/whatsapp-qrcode.jpg' alt='QR Code'>");
});

app.get("/login", (req, res) => {
  if (req.session.authenticated) {
    res.redirect("/dashboard");
  } else {
    // res.render('login');
    res.sendFile(__dirname + "/views/login.html");
  }
});
app.get("/logout", (req, res) => {
  req.session.authenticated = false;
  res.redirect("/login");
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  // Anda dapat menambahkan logika autentikasi sederhana di sini
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.send("Terjadi kesalahan saat login.");
      return;
    }
    if (results.length === 1) {
      req.session.authenticated = true;
      res.status(200).json({
        status: "User Ditemukan",
        username: username,
        password: password,
      });
    } else {
      res.status(404).json({
        status: "User Tidak Ditemukan",
        username: username,
        password: password,
      });
    }
  });
});
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
