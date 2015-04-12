var express = require('express');
var fetch = require('node-fetch');
var app = express();
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/jumbotron.css", express.static(__dirname + '/jumbotron.css'));
app.use("/custom.css", express.static(__dirname + '/custom.css'));

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname })
});

app.post('/submit-candidate', function(req, res) {
  var remoteUrl = 'http://107.170.101.126:8080';
  fetch(remoteUrl, {method: post})
    .then(function(resp) {
      console.log('resp!');
      console.log(resp);
      return resp.json();
    }).then(function(json) {
      console.log('json!');
      console.log(json);
    });
});

app.get('/about.html', function(req, res) {
  res.sendFile('about.html', {root: __dirname })
});

app.get('/nasa-front.html', function(req, res) {
  res.sendFile('nasa-front.html', {root: __dirname })
});

app.get('/nasa-testcandidate.html', function(req, res) {
  res.sendFile('nasa-testcandidate.html', {root: __dirname })
});

app.listen(8888);