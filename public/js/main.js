
requirejs.config({

    baseUrl: 'js/',

    paths: {
        'backbone': 'bower_components/backbone/backbone-min',
        'underscore': 'bower_components/underscore/underscore-min',
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'application': 'app/views/app'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery']
        },

        'application': {
            deps: ['backbone']
        }
    }
});

require(['application'], function (Application) {

    'use strict';

    new Application();

    return null;
});