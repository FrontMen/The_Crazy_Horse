define(function (require) {

    'use strict';

    var socketApi = require('app/services/socket-api'),
        SocketEvent = require('app/event/socket-event');

    return Backbone.View.extend({

        template: require('text!app/views/login/template/login.html'),

        className: 'login',

        events: {
            'submit form': 'connectToServer'
        },

        render: function () {
            this.$el.html(_.template($(this.template).html()));

            return this;
        },

        connectToServer: function (event) {
            event.preventDefault();

            var name = this.$('.username').val();
            socketApi.on(SocketEvent.PLAYER_CONNECTED, function () {
                Backbone.history.navigate('game', {
                    trigger: true
                });
            });
            socketApi.join(name);

            //Todo: TEMP!!
            Backbone.history.navigate('game', {
                trigger: true
            });
        }

    });
});
