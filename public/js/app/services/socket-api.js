define(function () {

    'use strict';

    var socket = function () {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
            console.log('connected!!');
            this.trigger('connected');
        }.bind(this));

        this.socket.on('player-connected', function () {
            this.trigger('player-connected');
        }.bind(this));

        this.socket.on('countdown', function (data) {
            this.trigger('countdown', data);
        }.bind(this))
    };

    _.extend(socket.prototype, {

        join: function (name) {
            this.socket.emit('join', {
                id: Math.floor(Math.random() * 9000) + 1000,
                name: name
            });
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
            this.socket.emit('walk', speed);
        }

    }, Backbone.Events);

    return new socket();
});
