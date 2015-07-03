define(function (require) {

    'use strict';

    var Track = require('app/views/game/player/components/track'),
        Horse = require('app/views/game/player/components/horse');

    return Backbone.View.extend({

        template: require('text!app/views/game/player/template/player.html'),

        className: 'player',

        initialize: function (options) {
            this.options = options;
        },

        render: function () {
            var html = _.template(this.template)(this.getTemplateData());
            this.$el.html($(html).html());

            this.createHorse();
            this.createTrack();

            this.horse.setIdle();

            return this;
        },

        getTemplateData: function () {
            return {
                name: this.options.name,
                status: 'Ready'
            }
        },

        createTrack: function () {
            this.track = new Track();
            this.$el.append(this.track.render().$el);
        },

        createHorse: function () {
            this.horse = new Horse();
            this.$('.horse-container').append(this.horse.render().$el);
        },

        remove: function () {
            Backbone.View.prototype.remove.apply(this, arguments);

            this.track.remove();
            this.horse.remove();
        }

    });
});