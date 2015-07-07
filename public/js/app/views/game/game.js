define(function (require) {

    'use strict';

    var Player = require('app/views/game/player/player'),
        Countdown = require('app/views/game/countdown/countdown'),
        socketApi = require('app/services/socket-api'),
        SocketEvent = require('app/event/socket-event');

    return Backbone.View.extend({

        className: 'game',

        players: [],

        initialize: function () {
            this.createPlayers();

            socketApi.on(SocketEvent.START_GAME, this.startGame, this);
            socketApi.on(SocketEvent.END_GAME, this.endGame, this);
            socketApi.on(SocketEvent.END_GAME, this.setWinner, this);
            socketApi.on(SocketEvent.DISCONNECT, this.removePlayer, this);
            socketApi.on(SocketEvent.COUNTDOWN, this.countdown, this);
        },

        createPlayers: function () {
            socketApi.playerList().then(function (players) {
                console.log(players);
                if (players) {
                    players.forEach(function (player) {
                        this.createPlayer(player);
                    }.bind(this));
                }

                socketApi.on(SocketEvent.PLAYER_CONNECTED, this.createPlayer, this);
            }.bind(this));
        },

        createPlayer: function (options) {
            var player = new Player(options);
            this.$el.append(player.render().$el);

            this.players.push(player);

            this.positionPlayers();
        },

        removePlayer: function (data) {
            this.players.forEach(function (player, index) {
                if (data.id === player.id) {
                    player.remove();
                    this.players.splice(index, 1);
                }
            }.bind(this));

            this.positionPlayers();
        },

        positionPlayers: function () {
            var position,
                numPlayers = this.players.length,
                percPerPlayer = Math.min(90 / numPlayers, 20);

            this.players.forEach(function (player, index) {
                position = (100 - ((index + 1) * percPerPlayer)) - 10;
                player.$el.css({
                    top: position + '%',
                    zIndex: numPlayers - index
                });
            });
        },

        countdown: function (count) {
            var countdown = new Countdown(count);
            this.$el.append(countdown.render().$el);
        },

        startGame: function () {
            $(window).on('keyup', this.onKeyUp.bind(this));
        },

        endGame: function () {
            $(window).off('keyup', this.onKeyUp.bind(this));
        },

        setWinner: function (winner) {
            this.countdown(winner.name);
            this.players.forEach(function (player) {
                if (player.id === winner.id) {
                    player.setWinner();
                } else {
                    player.setLoser();
                }
            });
        },

        onKeyUp: function (event) {
            event.preventDefault();

            if (event.keyCode === 32 /*space*/) {
                socketApi.walk(1);
            }

        },

        remove: function () {
            Backbone.View.prototype.remove.apply(this, arguments);

            socketApi.off(SocketEvent.START_GAME, this.startGame, this);
            socketApi.off(SocketEvent.END_GAME, this.endGame, this);
            socketApi.off(SocketEvent.END_GAME, this.setWinner, this);

            _.invoke(this.players, 'remove');
        }

    });
});