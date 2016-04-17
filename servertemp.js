var datetime = new Date();
console.log(datetime.toString());

var net = require('net');
var fs = require('fs');
var crypto = require('crypto');

var server = net.createServer();  
server.on('connection', handleConnection);

server.listen(9999, function() {  
  console.log('server listening to %j', server.address());
});

function handleConnection(conn) {  
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  var filename = datetime
  console.log('new client connection from %s', remoteAddress);
  var wstream = fs.createWriteStream(__dirname + "/wavs/" + filename.toString());

  conn.on('data', onConnData);
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  function onConnData(d) {
    //console.log('connection data from %s: %j', remoteAddress, d);
    //conn.write(d);
    wstream.write(d);
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
    wstream.end();
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}


