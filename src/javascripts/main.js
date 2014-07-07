require.config({
  //baseUrl: '.',
  waitSeconds: 0,
  // optimizer configuration
  optimize: 'uglify2',
  preserveLicenseComments: false,
  generateSourceMaps: true,

  uglify2: {
    output: {
      beautify: false
    },

    mangle: false
  },

  packages: [{
    name: 'basebackbone',
    location: '../javascripts/basebackbone'
  }],
  hbs: {
    templateExtension: 'hbs',
    // if disableI18n is `true` it won't load locales and the i18n helper
    // won't work as well.
    disableI18n: true
  },

  paths: {
    'backbone': '../bower_components/backbone-amd/backbone',
    'handlebars': '../bower_components/require-handlebars-plugin/Handlebars',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'i18nprecompile': '../bower_components/require-handlebars-plugin/hbs/i18nprecompile',
    'json2': '../bower_components/require-handlebars-plugin/hbs/json2',
    'json3': '../bower_components/json3/lib/json3',
    'underscore': '../bower_components/underscore/underscore',
    'jquery': '../bower_components/jquery/jquery',
    'text': '../bower_components/requirejs-text/text',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
    'typeahead': '../bower_components/typeahead.js/dist/typeahead.jquery',
    'bloodhound': '../bower_components/typeahead.js/dist/bloodhound',
    'edit-protected-input': './lib/edit-protected-input.plugin',
    'sinon': '../bower_components/sinonjs/sinon',
    // Dart Components and dependencies added here
    //'dart-platform': '../dart-require/platform.concat',
    //'dart-platform': '../modules/dart-login/build/web/packages/web_components/platform.concat',
    //'dart-support': '../dart-require/dart_support',
    //'dart-support': '../modules/dart-login/build/web/packages/web_components/dart_support',
    //'dart-polymer': '../modules/dart-login/build/web/packages/polymer/src/js/polymer/polymer.concat',
    //'dart': '../modules/dart-login/build/web/packages/browser/dart',

    //'dart-login-bootstrap': '../modules/dart-login/build/web/login.html_bootstrap.dart',

    //'dart-login-bootstrapjs': '../modules/dart-login/build/web/login.html_bootstrap.dart.precompiled',
    'dart': '../dart-require/dart'

  },
  urlArgs: "bust=" + (new Date()).getTime(),

  //skipModuleInsertion: false,
  wrap: true,
  shim: {
    'backbone': {
      deps: ['underscore']
    },
    'underscore': {
      exports: '_'
    },
    'sinon': {
      exports: 'sinon'
    },
    json3: {
      exports: 'JSON'
    },
    'bootstrap': {
      deps: ["jquery"],
      exports: 'jQuery'
    },
    'i18nprecompile': {
      deps: ['handlebars', 'underscore']
    },

    /*
    'dart-platform': {
      exports: 'window.Platform'
    },
    'dart-polymer': {
      exports: 'window.PolymerGestures'
    }
    'dart-polymer': {
      deps: ['dart-platform', 'dart-support'],
      exports: 'window.PolymerGestures'
    },
    'dart-support': {
      deps: ['dart-platform'],
      exports: 'window.ShadowDOMPolyfill'
    }*/
  },

  deps: [
    'handlebars',
    'hbs',
    'underscore',
    'jquery',
    'bootstrap'
  ],
  pragmasOnSave: {
    //removes Handlebars.Parser code (used to compile template strings) set
    //it to `false` if you need to parse template strings even after build
    excludeHbsParser: false,
    // kills the entire plugin set once it's built.
    excludeHbs: true,
    // removes i18n precompiler, handlebars and json2
    excludeAfterBuild: true
  },
  enforceDefine: true
});

var root = this;
var count = 0,
  updateModuleProgress = function(context, map, depMaps) {
    count += 1;
    var fetched = Object.keys(context.urlFetched).length,
      el = root.document.getElementById('requirejs-progress'),
      percentLoaded;

    if (el && fetched > 0) {
      percentLoaded = Math.min(100, (count / fetched) * 100);
      el.style.width = percentLoaded + '%';
    }
  };

require.onError = function(err, requireModules) {
  var progressEl = root.document.getElementById('requirejs-progress'),
    statusEl = root.document.getElementById('requirejs-status');

  if (progressEl) {
    progressEl.parentNode.className = progressEl.parentNode.className +
      ' progress-danger';
  }

  if (statusEl) {
    statusEl.innerHTML = 'Error loading application...';
  }
  console.error(err.message, err, requireModules);

  throw err; // helps debugging, shows file+line numbers that failed
};


require.onResourceLoad = function(context, map, depMaps) {
  if (map.parentMap) {
    updateModuleProgress(context, map, depMaps);
  }
};


// IE console issue when the developer tools are not opened.
//Ensures there will be no 'console is undefined' errors
if (!window.console) {
  window.console = window.console || (function() {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
    return c;
  })();
}

define([
  'jquery',
  'backbone',
  'basebackbone/app',
  'basebackbone/routes'
], function ($, backbone, app, routes) {
    'use strict';

  $.support.cors = true; // if we need cors support
  $.ajaxSetup({
    cache: false, // dont cache json requests
    /*crossDomain: true,
    xhrFields: {
        withCredentials: true
    },*/
    accept: "application/json"
  });
  var router = new routes();
  backbone.history.stop();
  Backbone.history.start({ /* pushState: true */ });

  return app;
});


