var path = require('path');
var express = require('express');
var handlebars = require('handlebars');
var fs = require('fs');


var key = {'1': "My New Post", image1bin: "This is my first post!"};

var source = fs.readFileSync('index.html').toString();


var files = fs.readdirSync(__dirname + '/wavs')

var fileDates = [];
files.forEach(function(value){
  fileDates.push(new Date(value))
});

fileDates.sort()

console.log(fileDates)

var template = handlebars.compile(source);
var outputString = template(key);

var app = express();

app.get('/', function(req, res) {
  res.send(outputString);
});

app.post('/', function(req, res) {
  res.send("hello from post");
  console.log("hello from post")
});

var staticPath = path.resolve(__dirname);
app.use(express.static(staticPath));
console.log(staticPath);

app.listen(8080, function() {
  console.log('listening');
});
