//	Customization

var appPort = 16558;


var appPort = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// Librairies

var express = require('express'), app = express();
var http = require('http')
  , server = http.createServer(app, ip)
  , io = require('socket.io').listen(server);



// var io = require('socket.io').listen(app);
var pseudoArray = ['admin']; //block the admin username (you can disable it)

// Views Options

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.set("view options", { layout: false });

app.use(express.static(__dirname + '/public'));

// Render and send the main page

app.get('/', function(req, res){
  res.render('home.html');
});
server.listen(appPort,ip);
// app.listen(appPort);
console.log("Server listening on port " + appPort);

// Handle the socket.io connections

var users = 0; //count the users

io.sockets.on('connection', function (socket) { // First connection


	socket.on('joinRoom', function (data) { // Broadcast the message to all
		if (data === "rite") {
			socket.room= "meshup";
			socket.join("meshup");
			var transmit = {message : "sender has joined"};
			socket.broadcast.to(socket.room).emit('message', transmit);
		}
});

	socket.on('message', function (data) { // Broadcast the message to all
	     if(socket.room) {
			var transmit = {message : data};
			socket.broadcast.to(socket.room).emit('message', transmit);

		 }
	});

	socket.on('disconnect', function () { // Disconnection of the client
	});
});