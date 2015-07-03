define(function (require) {

    'use strict';

    var SocketEvent = require('app/event/socket-event'),
        ServerEvent = require('app/event/server-event');

    var socket = function () {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
            this.trigger(SocketEvent.CONNECTED);
        }.bind(this));

        this.socket.on('disconnect', function (data) {
            this.trigger(SocketEvent.DISCONNECT, data);
        }.bind(this));

        this.socket.on('player-connected', function (data) {
            this.trigger(SocketEvent.PLAYER_CONNECTED, data);
        }.bind(this));

        this.socket.on('player-ready', function (data) {
            this.trigger(SocketEvent.PLAYER_READY, data);
        }.bind(this));

        this.socket.on('player-update', function (data) {
            this.trigger(SocketEvent.PLAYER_UPDATE, data);
        }.bind(this));

        this.socket.on('winner', function (data) {
            this.trigger(SocketEvent.END_GAME, data);
        });

        this.socket.on('countdown', function (data) {
            if (data === 0) {
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

        getOwnPlayerId: function () {
            return this.userID;
        },

        playerList: function () {
            return new Promise(function (resolve) {
                this.socket.emit('player-list');
                this.socket.on('player-list', function (list) {
                    resolve(list);
                });
            }.bind(this));
        },

        ready: function () {
            this.socket.emit(SocketEvent.READY);
        },

        walk: function (speed) {
            this.socket.emit(SocketEvent.WALK, speed);
        }

    }, Backbone.Events);

    return new socket();
});
