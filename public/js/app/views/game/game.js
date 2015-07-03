define(function (require) {

    'use strict';

    var Player = require('app/views/game/player/player')

    return Backbone.View.extend({

        className: 'game',

        players: [],

        initialize: function () {
            this.createPlayer({
                name: 'test'
            });

            this.createPlayer({
                name: 'test2'
            });

            this.createPlayer({
                name: 'test3'
            });

            this.startGame();
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

        startGame: function () {
            $(window).on('keyup', this.onKeyUp.bind(this));
        },

        stopGame: function () {
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
            _.invoke(this.players, 'remove');
        }

    });
});