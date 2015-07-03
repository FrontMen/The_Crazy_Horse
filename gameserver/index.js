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
      case 'r':
        increment();
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
  if(!started) {
    people[socket.id] = {
      name: data.name,
      id: data.id,
      ready: false,
      progression: 0
    };
    socket.emit("join", people[socket.id].name + " has connected to the server.");
  }
}

function ready() {
  var user = people[socket.id];
  user.ready = true;
  socket.emit("ready", user.name);
  if (checkAllReady(people)) {
    countdown();
  }
}

function countdown() {
  started = true;
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

function increment() {
  if(!finished) {
    var user = people[socket.id];
    user.progression++;
    io.emit('increment', people);
    if (user.progression === 3) {
      winner(user);
    }
  }
}

function winner(winner) {
  finished = true;
  io.emit('winner', winner.name);
}

function end(data) {

}

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


