define(function (require) {

    'use strict';

    var TweenMax = require('TweenMax'),
        TimelineMax = require('TimelineMax');


    return Backbone.View.extend({

        template: require('text!app/views/game/player/components/template/horse.html'),

        className: 'horse',

        states: {
            IDLE: 'idle',
            RUNNING: 'running',
            LOSER: 'loser',
            WINNER: 'winner'
        },

        timeline: null,
        previousProgression: 0,

        speed: 20,

        initialize: function () {
            this.throttledIdle = _.throttle(this.setIdle.bind(this), 1000);
        },


        render: function () {
            this.$el.html(_.template($(this.template).html()));
            this.setRandomColor();

            return this;
        },

        update: function (progression) {
            if (progression > this.previousProgression) {
                this.setRunning();
            } else {
                this.throttledIdle();
            }

            this.$el.css({
                left: progression + '%'
            });

            this.previousProgression = progression;
        },

        setIdle: function () {
            this.setState(this.states.IDLE);
        },

        setRunning: function () {
            this.setState(this.states.RUNNING);
        },

        setLoser: function () {
            this.setState(this.states.LOSER);
        },

        setWinner: function () {
            this.setState(this.states.WINNER);
        },

        setState: function (state) {
            if (this.state !== state) {
                this.state = state;
                this.updateAnimation();
            }
        },

        setRandomColor: function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }

            this.$('svg').css({
                'fill': color
            });
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

            case this.states.WINNER:
                this.createWinningTimeline();
                break;

            case this.states.LOSER:
                this.createLoserTimeline();
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
        },

        createWinningTimeline: function () {
            this.timeline = new TimelineMax({
                repeat: -1
            });

            this.$el.css({
                left: '50%'
            });

            TweenMax.set(this.el, {
                rotation: 0
            });

            this.timeline.append(TweenMax.to(this.el, 0.3, {
                y: 50,
                ease: Quint.easeOut,
                delay: 0.5
            }));

            this.timeline.append(TweenMax.to(this.el, 0.3, {
                y: 0,
                ease: Quint.easeIn
            }));
        },

        createLoserTimeline: function () {
            this.timeline = new TimelineMax();

            this.timeline.append(TweenMax.to(this.el, 0.3, {
                rotation: -180,
                ease: Quint.easeIn
            }));
        }

    });
});