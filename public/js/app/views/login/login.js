define(function (require) {

    'use strict';

    var socketApi = require('app/services/socket-api');

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
            socketApi.join(name);

            Backbone.history.navigate('game', {
                trigger: true
            });
        }

    });
});
