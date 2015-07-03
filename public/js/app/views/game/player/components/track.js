define(function () {

    'use strict';

    return Backbone.View.extend({

        render: function () {
            this.$el.css({
                background: 'url("assets/img/track.png") repeat-x'
            });

            return this;
        }

    });
});