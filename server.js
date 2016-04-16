var path = require('path');
var express = require('express');
var handlebars = require('handlebars');
var fs = require('fs');

var key = {image1: "My New Post", image1bin: "This is my first post!"};

var source = fs.readFileSync('index.html').toString();

var template = handlebars.compile(source);
var outputString = template(key);

//var template = handlebars.compile(source);

//var outputString = template({title: "My New Post", body: "This is my first post!"});

var app = express();

app.get('/', function(req, res) {
  res.send(outputString);
});

var staticPath = path.resolve(__dirname);
app.use(express.static(staticPath));
console.log(staticPath);

app.listen(3000, function() {
  console.log('listening');
});