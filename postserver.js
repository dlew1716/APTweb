var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var handlebars = require('handlebars')
var fs = require('fs')
var PythonShell = require('python-shell');

var app = express();

var source = fs.readFileSync('index.html').toString();
var outputString = source;
var template = handlebars.compile(source);


app.use(express.static(__dirname+"/wavs"));

var sortByKey = function( key ){
  return function( a, b ){
    return a[ key ] - b[ key ];
  } 
}

var buildTemplate = function(key,templatekey){

  var i = 0;

  key.forEach(function(value){
    templatekey[ 'name'+i.toString() ] = value.time
    templatekey[ 'image'+i.toString() ] = "wavs/"+value.name+".jpeg"
    i = i+1;
  });

  return templatekey
}


var key = JSON.parse(fs.readFileSync('WavFiles.json'));

key = key.sort( sortByKey('time') );

templatekey = {};
templatekey = buildTemplate(key,templatekey); 
outputString = template(templatekey);


app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '100mb'
})); 


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {

	res.send(outputString);

});

app.post('/new', function (req, res) {

  res.send('POST request received');

  var options = {
    args: ['mono_best.wav', 'fake.png', 'value3']
  };

  PythonShell.run('MyDecoder.py',options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution 
    console.log('results: %j', results);
  });

console.log('yes this is dog')


});  

app.post('/', function (req, res) {


  res.send('POST request received');
  //console.log(req.connection.remoteAddress);



  var buf = new Buffer(req.body.wav, 'base64');
  var wstream = fs.createWriteStream(__dirname + "/wavs/" +req.body.filename.toString()+".jpeg");
  wstream.write(buf);
  wstream.end();

  key.push({name:req.body.filename,time:req.body.time})

  key = key.sort( sortByKey('time') );
  key.splice( 0, key.length - 6 );

  templatekey = {};
  templatekey = buildTemplate(key,templatekey); 
  outputString = template(templatekey);

  fs.writeFileSync('WavFiles.json', JSON.stringify(key));
 


});

var staticPath = path.resolve(__dirname);

app.use(express.static(staticPath));

app.listen(8080, function() {
  console.log('listening');
});

