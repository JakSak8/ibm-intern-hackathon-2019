var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

var HOST = '0.0.0.0';

// Setup static content folder
app.use(express.static("public"));

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(HTTP_PORT, HOST, () => {
    console.log("App is listening on port: " + HTTP_PORT);
});
