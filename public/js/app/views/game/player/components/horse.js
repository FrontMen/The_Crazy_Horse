define(function (require) {

    'use strict';

    var TweenMax = require('TweenMax'),
        TimelineMax = require('TimelineMax');


    return Backbone.View.extend({

        template: require('text!app/views/game/player/components/template/horse.html'),

        className: 'horse',

        states: {
            IDLE: 'idle',
            RUNNING: 'running'
        },

        timeline: null,

        speed: 20,

        render: function () {
            this.$el.html(_.template($(this.template).html()));

            return this;
        },

        setIdle: function () {
            this.state = this.states.IDLE;
            this.updateAnimation();
        },

        setRunning: function () {
            this.state = this.states.RUNNING;
            this.updateAnimation();
        },

        updateAnimation: function () {
            if (this.timeline) {
                this.timeline.stop();
            }

            switch (this.state) {
            case this.states.IDLE:
                this.createIdleTimeline();
                break;

            case this.states.RUNNING:
                this.createRunningTimeline();
                break;
            }
        },

        createIdleTimeline: function () {
            this.timeline = new TimelineMax({
                yoyo: true,
                repeat: -1,
                delay: Math.random()
            });

            this.timeline.append(TweenMax.to(this.el, 0.5, {
                y: 10,
                ease: Quad.easeInOut
            }));
        },

        createRunningTimeline: function () {
            this.timeline = new TimelineMax({
                repeat: -1
            });

            this.timeline.append(TweenMax.to(this.el, 0.15, {
                rotation: this.speed,
                ease: Quad.easeOut
            }));

            this.timeline.append(TweenMax.to(this.el, 0.15, {
                rotation: 0,
                ease: Quad.easeIn
            }));

            this.timeline.append(TweenMax.to(this.el, 0.15, {
                rotation: -(this.speed),
                ease: Quad.easeOut
            }));

            this.timeline.append(TweenMax.to(this.el, 0.15, {
                rotation: 0,
                ease: Quad.easeIn
            }));
        }

    });
});