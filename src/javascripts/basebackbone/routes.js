define(function(require) {
  'use strict';
  var Backbone = require('backbone'),
    $ = require('jquery'),
    Controllers = require('./controllers'),
    Partials = require('../../partials/main'),
    Handlebars = require('handlebars'),
    Router,
    Dart = require('dart');

  Router = Backbone.Router.extend({
    routes: {
      // general
      '': 'invokeMainPageModule',
      '_=_': 'invokeMainPageModule',
      '#!watch': 'lessWatchRoute',
      'home': 'invokeMainPageModule',
      'api': 'invokeAPIModule',
      '*filter': 'notExistentRoute'
    },
    views: [],
    initialize: function(options) {
      options = options || {};
      Backbone.Router.prototype.initialize.call(this, options);
    },
    invokeMainPageModule: function() {
      this.navigatePage(new Controllers.Main({
        context: {
        }
      }));
    },
    invokeAPIModule: function() {
      this.navigatePage(new Controllers.Api({
        context: {
        }
      }));
    },
    notExistentRoute: function(route) {
      console.error('No route:', route);
    },
    // Appends a page and adds the view to be removed later
    appendPage: function(elname, view) {
      this.views.push(view);
      $(elname).append(view.render().el);
    },
    // Navigates to a page and adds the view to be removed later
    navigatePage: function(view, portfolio) {
      this.views.push(view);
      //$('#main-nav').html(Handlebars.compile(Partials.Nav));
      $("#main-view").html(view.render().el);
      //$('#main-footer').html(Handlebars.compile(Partials.Footer));

      // Compile any Dart Polymers
      Dart.compile();
    },
    closeViews: function() {
      // Call remove on the views currently loaded to clean up
      if (this.views.length > 0) {
        _(this.views).each(function(view) {
          view.remove();
        });
        this.views = [];
      }
    }
  });

  return Router;
});