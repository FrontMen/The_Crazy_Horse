define(function (require) {

    'use strict';

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
            Backbone.history.navigate('game', {
                trigger: true
            });
        }

    });
});