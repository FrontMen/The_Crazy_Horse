var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = Dictionary();
var socket;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (_socket) {
  socket = _socket;

  socket.on("input", function (input) {
    switch (input) {
      case 'ready':
        ready('data');
        break;
    }
  });

  socket.on("join", function (data) {
    join(data);
  });

  socket.on("ready", function (data) {
    ready(data);
  });

  socket.on("ready", function (data) {
    ready(data);
  });

  socket.on('end', function (data) {
    end(data);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});


/***********************/
/******* Methods *******/
/***********************/

function join(data) {
  people[socket.id] = {
    name: data,
    ready: false
  };
  socket.emit("join", people[socket.id].name + " has connected to the server.");
}

function ready(data) {
  people[socket.id].ready = true;
  socket.emit("ready", people);
  if (checkAllReady(people)) {
    countdown();
  }
}

function countdown() {
  var iterations = 0, max = 3;
  var interval = setInterval(function () {
    iterations++;
    io.emit('countdown', (max - iterations));
    if (iterations === max) {
      clearInterval(interval);
    }
  }, 1000);
  io.emit('countdown', max);
}

function end(data) {

}

function checkAllReady(dict) {
  var key, user;
  for (var i = 0; i < dict.length; i++) {
    key = dict.toArray[i];
    user = dict[key];
    if (!user.ready) {
      return false;
    }
  }
  return true;
}

function Dictionary() {
  return Object.create({}, {
    length: {
      get: function () {
        return Object.keys(this).length;
      }
    },
    toArray: {
      get: function () {
        return Object.keys(this);
      }
    }
  });
}


