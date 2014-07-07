'use strict';

// live reloader
var livereload = require('express-livereload');

var hbs = require('express-hbs');

exports = module.exports = function(app, express) {
    // Handlebars template for rendering html
    app.engine('hbs', hbs.express3({
        extname: ".html",
        partialsDir: __dirname + '/src/partials/api'
    }));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/src/partials/api');

    // Set live reloading if we in DEV mode
    if (app.LIVE_RELOAD) {
    	console.log('LIVE RELOADER STARTED');
	    livereload(app, {
	    	watchDir: 'src',
	    	exts: ['html', 'hbs', 'js', 'css', 'less']
	    });
    }

    // Configuration for server
	app.configure(function() {
	    app.use(express.cookieParser());
	    app.use(express.bodyParser());
	    app.use(express.json());
	    app.use(express.urlencoded());
	    app.use(express.methodOverride());
	    app.use(express.favicon());
	    app.use(express.session({
	        secret: 'abc12345',
	        cookie: {
	            httpOnly: false
	        }
	    }));
	    app.use(app.router);
	    console.log('STATIC_DIR '+ __dirname + app.STATIC_DIR);
	    app.use("/", express.static(__dirname + app.STATIC_DIR));
	    app.use(express.errorHandler({
	        dumpExceptions: true,
	        showStack: true
	    }));
	});
};