define(function (require) {

    'use strict';

    var Track = require('app/views/game/player/components/track'),
        Horse = require('app/views/game/player/components/horse');

    return Backbone.View.extend({

        className: 'player',

        initialize: function () {
            this.createTrack();
            this.createHorse();
        },

        createTrack: function () {
            this.track = new Track();
            this.$el.append(this.track.render().$el);
        },

        createHorse: function () {
            this.horse = new Horse();
            this.$el.append(this.horse.render().$el);
        },

        remove: function () {
            Backbone.View.prototype.remove.apply(this, arguments);

            this.track.remove();
            this.horse.remove();
        }

    });
});