/*global define, window*/
define(function (require) {
  'use strict';
  var Base = require('./base'),
  	Partials = require('../../../partials/main'),
  	_ = require('underscore'),
  	View;

  View = Base.extend({
    template: Partials.Main,
    events: {
      'click button.helloworld': 'clickHelloWorld',
    },
    clickHelloWorld: function() {
      window.alert('Hello World');
    }
  });

  return View;
});