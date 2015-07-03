define(function (require) {

    'use strict';

    var Player = require('app/views/game/player/player')

    return Backbone.View.extend({

        className: 'game',

        players: [],

        initialize: function () {
            this.createPlayer({
                name: 'test'
            })
        },

        createPlayer: function (options) {
            var player = new Player(options);
            this.$el.append(player.render().$el);

            this.players.push(player);
        },

        remove: function () {
            Backbone.View.prototype.remove.apply(this, arguments);
            _.invoke(this.players, 'remove');
        }

    });
});