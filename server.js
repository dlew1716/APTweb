var path = require('path');
var express = require('express');
var handlebars = require('handlebars');
var fs = require('fs');
var PythonShell = require('python-shell');
var bodyParser = require('body-parser')



var outputString


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
  outputString = buildTemplate()
  res.send(outputString);

});

app.post('/', function(req, res) {
  
  var buf = new Buffer(req.body.wav, 'base64');
  var wstream = fs.createWriteStream(__dirname + "/wavs/" +req.body.date.toString()+".wav");
  wstream.write(buf);
  wstream.end();

  var options = {
  args: [req.body.date.toString()+".wav", req.body.date.toString()+".png"]
  };

  res.send(JSON.stringify({err: null}));
  PythonShell.run('MyDecoder.py',options, function (err, results) {
    if (err) return console.log(err);
    // results is an array consisting of messages collected during execution 
    console.log('results: %j', results);
    outputString = buildTemplate()
  });



});

var staticPath = path.resolve(__dirname);
app.use(express.static(staticPath));
console.log(staticPath);

app.listen(8080, function() {
  console.log('listening');
});
