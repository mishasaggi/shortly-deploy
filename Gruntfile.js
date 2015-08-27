module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      basic: {
        src: ['public/client/*.js'],
        dest: 'public/dist/concatApp.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec' //nyan, xunit, html-cov, dot, min, markdown
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/concatApp.min.js': ['public/dist/concatApp.js']
        }
      }
    },

    jshint: {

      beforeconcat: ['public/client/*.js'],
      afterconcat: ['public/dist/concatApp.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js'
          // 'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      add_banner: {
        options: {
          banner: '/* My minified css file */'
        },
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'jshint',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      },
      server: {
        files: ['app/**/*.js',
               'server.js',
               'server-config.js'
               ]
      }
    },

    shell: {
      prodServer: {
        command: ['git add --all', 'git commit -m "build to production server"', 'git push heroku master' ].join('&&')
        //can be used to auto-deploy to Heroku/Azure.
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'jshint',
    'uglify',
    'cssmin'
    ]);

  //can be used to auto-deploy.
  //auto deploy on changes - add to watch
  grunt.registerTask('upload', function(n) {
    //Grunt options are ways to customize tasks.  Research ways to use them.
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['deploy']);

    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', ['shell']);


};
