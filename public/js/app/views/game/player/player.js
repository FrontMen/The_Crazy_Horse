define(function (require) {

    'use strict';

    var Track = require('app/views/game/player/components/track'),
        Horse = require('app/views/game/player/components/horse'),
        Info = require('app/views/game/player/components/info'),
        socketApi = require('app/services/socket-api'),
        SocketEvent = require('app/event/socket-event');

    return Backbone.View.extend({

        template: require('text!app/views/game/player/template/player.html'),

        className: 'player',

        initialize: function (options) {
            this.options = options;
            socketApi.on(SocketEvent.START_GAME, this.startListeningForUpdates, this);
            socketApi.on(SocketEvent.END_GAME, this.stopListeningForUpdates, this);
        },

        render: function () {
            var html = _.template(this.template)();
            this.$el.html($(html).html());

            this.createInfo();
            this.createHorse();
            this.createTrack();

            this.horse.setIdle();

            return this;
        },

        createTrack: function () {
            this.track = new Track(this.options);
            this.$el.append(this.track.render().$el);
        },

        createHorse: function () {
            this.horse = new Horse(this.options);
            this.$('.horse-container').append(this.horse.render().$el);
        },

        createInfo: function () {
            this.info = new Info(this.options);
            this.$el.prepend(this.info.render().$el);
        },

        startListeningForUpdates: function () {
            socketApi.on(SocketEvent.PLAYER_UPDATE, this.updatePlayer, this);
        },

        stopListeningForUpdates: function () {
            socketApi.off(SocketEvent.PLAYER_UPDATE, this.updatePlayer, this);
        },

        updatePlayer: function (players) {
            var ownId = this.options.id;
            if (players) {
                players.forEach(function (player) {
                    if (player.id === ownId) {
                        this.horse.update(player.progression);
                    }
                }.bind(this));
            }
        },

        remove: function () {
            Backbone.View.prototype.remove.apply(this, arguments);

            socketApi.off(SocketEvent.START_GAME, this.startListeningForUpdates, this);
            socketApi.off(SocketEvent.END_GAME, this.stopListeningForUpdates, this);

            this.track.remove();
            this.horse.remove();
        }

    });
});