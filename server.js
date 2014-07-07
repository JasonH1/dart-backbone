#!/bin/env node
/*
 *  Author: Jason Ho 2014
 *  NodeJS Proxy Handler
 *  Also handles clean urls
 */

var express = require('express'),
    fs = require('fs'),
    app = express(),
    PROXY_SERVER = 'http://localhost:9000',
    STATIC_DIR = '/src',
    LIVE_RELOAD = false,
    controllers = require('./app/controllers');

// print process.argv
process.argv.forEach(function(val, index, array) {
  if (val === 'prod') {
    // run against production
    PROXY_SERVER = 'http://api.example.com';
  }
  if (val === 'build') {
    // run against production
    STATIC_DIR= '/build';
  }
  if (val === 'dev') {
    LIVE_RELOAD = true;
  }
});

if (process.env.OPENSHIFT_APP_NAME) {
  // Proxy to Production on OPENSHIFT deploy
  console.log('STARTING PROXY POINTING TO PRODUCTION');
  PROXY_SERVER = 'http://api.example.com';
}

app.PROXY_SERVER = PROXY_SERVER;
app.STATIC_DIR = STATIC_DIR;
app.LIVE_RELOAD = LIVE_RELOAD;

//setup config
require('./config')(app, express);
//setup handlebars rendering.
//setup routes
require('./app/routes')(app, controllers);
//setup proxy
require('./app/proxy')(app, controllers);

require('./app/db')();
require('./app/processor')();


/*  ================================================================  */
/*  Helper functions.                                                 */
/*  ================================================================  */

/**
 *  Set up server IP address and port # using env variables/defaults.
 */
setupVariables = function() {
    //  Set the environment variables we need.
    app.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    app.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof app.ipaddress === "undefined") {
        //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
        //  allows us to run/test the app locally.
        console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
        app.ipaddress = "127.0.0.1";
    };
};
/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
terminator = function(sig) {
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...',
            Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
};


/**
 *  Setup termination handlers (for exit and a list of signals).
 */
setupTerminationHandlers = function() {
    //  Process on exit and signals.
    process.on('exit', function() {
        terminator();
    });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
        process.on(element, function() {
            terminator(element);
        });
    });
};


setupVariables();
setupTerminationHandlers();


//  Start the app on the specific interface (and port).
app.listen(app.port, app.ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), app.ipaddress, app.port);
});