define(function (require) {

    'use strict';

    var TweenMax = require('TweenMax');

    return Backbone.View.extend({
        className: 'countdown',

        initialize: function (count) {
            this.count = count;
        },

        render: function () {
            var label = (this.count === 0) ? 'START' : this.count;
            this.$el.html(label);

            TweenMax.to(this.el, 1, {
                scale: 0.3,
                opacity: 0,
                ease: Quad.easeIn,
                onComplete: this.remove.bind(this)
            });

            return this;
        }
    });
});