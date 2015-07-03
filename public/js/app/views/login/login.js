define(function (require) {

    'use strict';



    return Backbone.View.extend({

        template: require('text!app/views/login/template/login.html'),

        className: 'login',

        render: function () {
            this.$el.html(_.template($(this.template).html()));

            return this;
        }

    });
});