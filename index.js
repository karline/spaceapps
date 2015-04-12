var express = require('express');
var app = express();
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/jumbotron.css", express.static(__dirname + '/jumbotron.css'));
app.use("/custom.css", express.static(__dirname + '/custom.css'));

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname })
});

app.get('/about.html', function(req, res) {
  res.sendFile('about.html', {root: __dirname })
});

app.get('/nasa-front.html', function(req, res) {
  res.sendFile('nasa-front.html', {root: __dirname })
});

app.listen(8888);