define(function (require) {

    'use strict';

    var socketApi = require('app/services/socket-api'),
        SocketEvent = require('app/event/socket-event');

    return Backbone.View.extend({

        template: require('text!app/views/game/player/components/template/info.html'),

        events: {
            'click button': 'setReady'
        },

        initialize: function (options) {
            this.options = options;

            if (!this.options.ready) {
                socketApi.on(SocketEvent.PLAYER_READY, this.onPlayerReady, this);
            }
        },

        render: function () {
            var html = _.template(this.template)(this.getTemplateData());
            this.$el.html($(html).html());

            return this;
        },

        getTemplateData: function () {
            return {
                name: this.options.name,
                ready: this.options.ready,
                own: (this.options.id === socketApi.getOwnPlayerId())
            }
        },

        onPlayerReady: function (player) {
            if (this.options.id === player.id) {
                socketApi.off(SocketEvent.PLAYER_READY, this.onPlayerReady, this);
                this.options = player;
                this.render();
            }
        },

        setReady: function () {
            socketApi.ready();
        }
    });
});