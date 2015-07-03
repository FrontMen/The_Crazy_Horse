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
            socketApi.on(SocketEvent.COUNTDOWN, this.countdown, this);
        },

        createPlayers: function () {
            socketApi.playerList().then(function (players) {
                if (players) {
                    players.forEach(function (player) {
                        this.createPlayer(player);
                    });
                }
            });

            socketApi.on(SocketEvent.PLAYER_CONNECTED, this.createPlayer, this);
        },

        createPlayer: function (options) {
            var player = new Player(options);
            this.$el.append(player.render().$el);

            this.players.push(player);

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
            var countdown = new Countdown(count)
            this.$el.append(countdown.render().$el);
        },

        startGame: function () {
            $(window).on('keyup', this.onKeyUp.bind(this));
        },

        endGame: function () {
            $(window).off('keyup', this.onKeyUp.bind(this));
        },

        onKeyUp: function (event) {
            event.preventDefault();

            if (event.keyCode === 32 /*space*/) {
                console.log('move!');
            }

        },

        remove: function () {
            Backbone.View.prototype.remove.apply(this, arguments);

            socketApi.off(SocketEvent.START_GAME, this.startGame, this);
            socketApi.off(SocketEvent.END_GAME, this.endGame, this);

            _.invoke(this.players, 'remove');
        }

    });
});