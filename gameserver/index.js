var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var people = Dictionary();
var started, finished;
var throttleWalk;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  throttleWalk = _.throttle(throttleMe, 200);

  function throttleMe() {
    io.sockets.emit('player-update', getList());
  }

  socket.on("input", function (input) {
    switch (input) {
      case 'ready':
        ready();
        break;
      case 'list':
        playerList(socket);
        break;
      case 'c':
        connection(socket);
        break;
      case 'r':
        walk(socket);
        break;
    }
  });

  socket.on("join", function (data) {
    if(getList().length < 5) {
      join(socket, data);
    }
  });

  socket.on("ready", function () {
    ready(socket);
  });

  socket.on('end', function () {
    end(socket);
  });


  socket.on('walk', function () {
    walk(socket);
  });

  socket.on('player-list', function () {
    playerList(socket);
  });

  socket.on('disconnect', function () {
    disconnect(socket)
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});

/***********************/
/******* Methods *******/
/***********************/

function join(socket, data) {
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
    io.sockets.emit("player-connected", user);
  }
}

function playerList(socket) {
  socket.emit('player-listing', getList());
}

function connection(socket) {
  socket.emit('player-connection', people[socket.id]);
}

function ready(socket) {
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

function walk(socket) {
  if (!finished) {
    var user = people[socket.id];
    user.progression++;
    throttleWalk();
    if (user.progression === 100) {
      winner(user);
    }
  }
}

function winner(winner) {
  finished = true;
  io.sockets.emit('winner', winner);
}

function end(socket) {
  people = null;
  started = false;
  finished = false;
}

function disconnect(socket) {
  var user = people[socket.id];
  if (user) {
    io.sockets.emit('disconnected', user.name);
  }
  delete user;
}

/* helpers */

function getList() {
  var array = [];
  people.toArray.forEach(function(key) {
    array.push(people[key]);
  });
  return array;
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


