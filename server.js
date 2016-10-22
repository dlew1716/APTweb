var path = require('path');
var express = require('express');
var handlebars = require('handlebars');
var fs = require('fs');
var PythonShell = require('python-shell');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;



var outputString

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var buildTemplate = function(){

    var source = fs.readFileSync('index.html').toString();

	var files = fs.readdirSync(__dirname + '/pngs')

	var fileDates = [];
	files.forEach(function(value){

	  if(value == ".DS_Store")
	  {

	  }
	  else
	  {

	  fileDates.push(new Date(value.replace("z", ':').replace("z", ':').slice(0,-4)))
	  console.log(value.replace("z", ':').replace("z", ':').slice(0,-4))
	   }

	});

	fileDates.sort(function(a, b){return b-a})
	console.log(fileDates)

	var key = {}

	if(fileDates.length < 7)
	{
		imagesHad = fileDates.length

	}
	else
	{
		imagesHad = 7
	}

	for(var i=0; i<imagesHad; i++){

		var temp = "pngs/"+fileDates[i].toISOString().replace(/\..+/, '').replace(":", 'z').replace(":", 'z')+".png"
		key["image"+i] = temp
		key["name"+i] = fileDates[i].toISOString().replace(/\..+/, '').replace("T"," ")
	}

	var template = handlebars.compile(source);
	var outputString = template(key);

	return outputString
    }

outputString = buildTemplate()

var app = express();

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '100mb'
})); 

app.get('/', function(req, res) {
  //console.log(req.connection.remoteAddress)
  outputString = buildTemplate()
  res.send(outputString);

});


app.post('/new', function(req, res) {

  var whosip = req.connection.remoteAddress.toString().split(":")[req.connection.remoteAddress.toString().split(":").length-1]
  console.log(whosip)

  if(whosip == 1){

	 console.log("Local Post Request Received")
	  var buf = new Buffer(req.body.wav, 'base64');
	  var wstream = fs.createWriteStream(__dirname + "/wavs/" +req.body.date.toString()+".wav");
	  wstream.write(buf);
	  wstream.end();

	  res.send(null);


	 exec('./Decoder' + ' wavs/'+req.body.date.toString()+".wav " + "pngs/" + req.body.date.toString()+".png", function(error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	        console.log('exec error: ' + error);
	    }
	});


  }


});

app.post('/', function(req, res) {

  	  var whosip = req.connection.remoteAddress.toString().split(":")[req.connection.remoteAddress.toString().split(":").length-1]
  	  console.log(whosip)
  	  var genName = makeid()

	  console.log("Remote Post Request Received")
	  var buf = new Buffer(req.body.wav, 'base64');
	  var wstream = fs.createWriteStream(__dirname + "/userwavs/" +genName+".wav");
	  wstream.write(buf);
	  wstream.end();

	  res.send("userpngs/"+genName+".png");
	  console.log('./Decoder '+__dirname + 'userwavs/'+genName+".wav " + __dirname+"userpngs/" +genName+".png")
	 exec('./Decoder '+__dirname + 'userwavs/'+genName+".wav " + __dirname+"userpngs/" +genName+".png", function(error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	        console.log('exec error: ' + error);
	    }
	});


});

var staticPath = path.resolve(__dirname);
app.use(express.static(staticPath));
console.log(staticPath);

app.listen(80, function() {
  console.log('listening');
});
