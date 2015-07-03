define(function (require) {

    'use strict';

    var Game = require('app/views/game/game'),
        Login = require('app/views/login/login');

    return Backbone.Router.extend({

        routes: {
            '(/)': 'login',
            'game(/)': 'game'
        },

        initialize: function () {
            Backbone.history.start({
                pushState: true,
                root: '/'
            });
        },

        login: function () {
            this.showView(new Login());
        },

        game: function () {
            this.showView(new Game());
        },

        showView: function (view) {
            var container = $('main');

            if (this.view) {
                this.view.remove();
                delete this.view;
            }

            this.view = view;
            container.append(this.view.render().$el);

        }

    });
});