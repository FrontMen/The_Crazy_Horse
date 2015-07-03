var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on("join", function(name){
    people[socket.id] = name;
    socket.emit("join", name + " has connected to the server.");
  });

  socket.on("ready", function(){
    people[socket.id].ready = true;
    socket.emit("update", "You have connected to the server.");
  });

  socket.on('countdown', function(msg){
    io.emit('countdown', msg);
  });

  socket.on('end', function(msg){
    io.emit('countdown', msg);
  });

  socket.on("send", function(msg){
    //socket.sockets.emit("chat", people[client.id], msg);
  });

  socket.on("disconnect", function(){
    //socket.sockets.emit("update", people[socket.id] + " has left the server.");
    //delete people[socket.id];
    //socket.sockets.emit("update-people", people);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

