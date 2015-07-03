define(function (require) {

    'use strict';

    var SocketEvent = require('app/event/socket-event'),
        ServerEvent = require('app/event/server-event');

    var socket = function () {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
            this.trigger(SocketEvent.CONNECTED);
        }.bind(this));

        this.socket.on('player-connected', function () {
            this.trigger(SocketEvent.PLAYER_CONNECTED);
        }.bind(this));

        this.socket.on('player-ready', function () {
            this.trigger(SocketEvent.PLAYER_READY);
        }.bind(this));

        this.socket.on('countdown', function (data) {
            if (data) {
                this.trigger(SocketEvent.START_GAME);
            } else {
                this.trigger(SocketEvent.COUNTDOWN, data);
            }
        }.bind(this))
    };

    _.extend(socket.prototype, {

        join: function (name) {
            this.socket.emit(SocketEvent.JOIN, {
                name: name
            });
            this.socket.on(ServerEvent.USER_JOINED, function (id) {
                this.userID = id
            }.bind(this));
        },

        getUserById: function (id) {

        },

        getOwnPlayer: function () {
            return this.userID;
        },

        ready: function () {
            this.socket.emit('ready');
        },

        playerList: function () {
            return new Promise(function (resolve) {
                this.socket.emit('getPlayerList');
                this.socket.on('playerList', function (list) {
                    resolve(list);
                });
            }.bind(this));
        },

        walk: function (speed) {
            this.socket.emit(SocketEvent.WALK, speed);
        },

        gameover: function () {
            this.socket.emit(SocketEvent.END_GAME);
        }

    }, Backbone.Events);

    return new socket();
});
