var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var people = Dictionary();
var socket, started, finished;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (_socket) {
  socket = _socket;

  socket.on("input", function (input) {
    switch (input) {
      case 'ready':
        ready();
        break;
      case 'c':
        connection();
        break;
      case 'r':
        walk();
        break;
    }
  });

  socket.on("join", function (data) {
    join(data);
  });

  socket.on("ready", function (data) {
    ready(data);
  });

  socket.on('end', function (data) {
    end(data);
  });

  //socket.on('disconnect', function (data) {
  //  disconnect(data)
  //});
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});

/***********************/
/******* Methods *******/
/***********************/

function join(data) {
  var user;
  if (!started) {
    user = {
      name: data.name,
      id: socket.id,
      ready: false,
      progression: 0
    };
    people[socket.id] = user;
    socket.emit("user-joined", user);
    io.sockets.emit("player-connected", user.name);
  }
}

function connection() {
  socket.emit('player-connection', people[socket.id]);
}

function ready() {
  var user = people[socket.id];
  user.ready = true;
  io.sockets.emit("player-ready", user);
  if (checkAllReady(people)) {
    countdown();
  }
}

function countdown() {
  started = true;
  var iterations = 0, max = 3, interval = setInterval(function () {
    iterations++;
    io.sockets.emit('countdown', (max - iterations));
    if (iterations === max) {
      clearInterval(interval);
    }
  }, 1000);
  io.sockets.emit('countdown', max);
}

function walk() {
  if (!finished) {
    var user = people[socket.id];
    user.progression++;
    io.sockets.emit('player-update', people.toArray);
    if (user.progression === 3) {
      winner(user);
    }
  }
}

function winner(winner) {
  finished = true;
  io.sockets.emit('winner', winner);
}

function end() {
  people = null;
  started = false;
  finished = false;
}

//function disconnect() {
//  var user = people[socket.id];
//  if (user) {
//    io.sockets.emit('disconnect', user.name);
//  }
//  delete user;
//}

/* helpers */

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

/* dict */

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


