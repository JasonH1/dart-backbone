module.exports = function (grunt) {
// Load grunt tasks automatically
require('load-grunt-tasks')(grunt);

// Define the configuration for all the tasks
grunt.initConfig({
    // Project settings
    config: {
        // Configurable paths
        app: 'src',
        build: 'build'
    },
    // Watches files for changes and runs tasks based on the changed files
    // Watches files for changes and runs tasks based on the changed files
    watch: {
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            files: [
                '<%= config.app %>/*.html',
                '{.tmp,<%= config.app %>}/javascript/**/*.*',
                '{.tmp,<%= config.app %>}/partials/**/*.*',
                '{.tmp,<%= config.app %>}/stylesheets/**/*.less', // Add less files to dynamically reload
                '<%= config.app %>/less/**/*.*',
                '<%= config.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                '<%= config.app %>/{,*/}*.html',
                '.tmp/styles/{,*/}*.css',
                '<%= config.app %>/images/{,*/}*'
            ]
        }
    },
    // The actual grunt server settings
    connect: {
        options: {
            port: 8080,
            livereload: 35729,
            hostname: 'localhost',
            middleware: function (connect, options) {
              if (!Array.isArray(options.base)) {
                  options.base = [options.base];
              }

              // Setup the proxy
              var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

              // Serve static files.
              options.base.forEach(function(base) {
                  middlewares.push(connect.static(base));
              });

              // Make directory browse-able.
              var directory = options.directory || options.base[options.base.length - 1];
              middlewares.push(connect.directory(directory));

              return middlewares;
            }
        },
        proxies: [
                {
                    context: '/resources',
                    host: 'localhost',
                    port: 9000,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                },
                {
                    context: '/authenticate',
                    host: 'localhost',
                    port: 9000,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                }
            ],
        livereload: {
            options: {
            protocol: 'http',
            open: 'http://localhost:8080/',
            base: [
              '.tmp',
              '<%= config.app %>'
            ]
          }
        },
        build: {
          options: {
            protocol: 'http',
            open: 'http://localhost:8080/',
            base: '<%= config.build %>'
          }
        }
    },
    less: {
      compile: {
        files: [{
          src: 'src/stylesheets/app.less',
          dest: 'src/css/app.css'
        }],
        yuicompress: true
      }
    },
    requirejs: {
      build: {
        // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {
          out: './build/javascripts/main.js',
          name: 'main',
          mainConfigFile: './src/javascripts/main.js',
          baseUrl: '<%= config.app %>/javascripts',
          //optimize: 'uglify2',
          //preserveLicenseComments: false,
          useStrict: true,
          wrap: true
          //uglify2: {} // https://github.com/mishoo/UglifyJS2
        }
      }
    },
    copy: {
      less: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.tmp/css',
          dest: '<%= config.build %>/css',
          src: [
            'main.css'
          ]
        }]
      },
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.build %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/**/*.*',
            'css/**/*.*',
            'fonts/**/*.*',
            'data/**/*.*',
            'partials/**/*.*',
            'index.html',
            'bower_components/requirejs/require.js'
          ]
        }]
      }
    }
});


grunt.registerTask('server', function (target) {
    if (target === 'build') {
      return grunt.task.run(['build', 'configureProxies','connect:build:keepalive']);
    }

    grunt.task.run([
      'configureProxies',
      'less',
      'connect:livereload',
      'watch'
    ]);

  });

  grunt.registerTask('runNode', function () {
    grunt.util.spawn({
      cmd: 'node',
      args: ['./node_modules/nodemon/nodemon.js', '--debug', 'server.js', 'dev'],
      opts: {
        stdio: 'inherit'
      }
    }, function () {
      grunt.fail.fatal(new Error("nodemon quit"));
    });
  });

  grunt.registerTask('build', [
    'less',
    'requirejs',
    'copy:build'
  ]);

  grunt.registerTask('default', [

  ]);

  grunt.registerTask('devserver', [
    'less',
    'server'
  ]);

  grunt.registerTask('buildserver', [
    'server:build'
  ]);
};


