
requirejs.config({

    baseUrl: 'js/',

    paths: {
        'backbone': 'bower_components/backbone/backbone-min',
        'underscore': 'bower_components/underscore/underscore-min',
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'text': 'bower_components/requirejs-text/text',
        'alertifyjs': 'bower_components/alertifyjs/dist/alertify',
        'TweenMax': 'bower_components/greensock/src/minified/TweenMax.min',
        'TweenLite': 'bower_components/greensock/src/minified/TweenLite.min',
        'TimelineMax': 'bower_components/greensock/src/minified/TimelineMax.min',
        'application': 'app/views/app',
        'router': 'app/router'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery']
        },

        'application': {
            deps: ['backbone']
        },

        'router': {
            deps: ['backbone']
        }
    }
});

require(['application', 'router'], function (Application, Router) {

    'use strict';

    new Application();
    new Router();

    return null;
});