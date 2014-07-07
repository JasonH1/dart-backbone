/*global define, window*/
define(function (require) {
  'use strict';
  var Backbone = require('backbone'),
  	_ = require('underscore'),
    Handlebars = require('handlebars'),
  	View;

  View = Backbone.View.extend({
    context: function() {
        return {
            model: this.model,
            collection: this.collection
        };
    },
    render: function() {
        var template = typeof(this.template) === 'string' ?
                Handlebars.compile(this.template) : this.template,
            context = typeof(this.context) === 'function' ?
                this.context() : this.context;
        context.declaringView = this;
        _.defaults(context, this._context);
        if (template) {
            this.$el.html(template(context));
        }
        return this;
    },
  });

  // if wewant to extend views
  _.extend(View.prototype, {});

  return View;
});