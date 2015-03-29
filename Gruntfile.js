module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    jslint: {
      test: {
        src: 'spec/**/*.js',
        directives: {
          indent: 2,
          newcap: true,
          predef: [
            'describe',
            'it',
            'xit',
            'expect',
            'beforeEach',
            'jsConfig',
            'window',
            'require',
            'jsConfig'
          ]
        }
      },
      src: {
        src: 'src/**/*.js',
        directives: {
          indent: 2,
          predef: [
            'module'
          ]
        }
      },
      conf: {
        src: 'Gruntfile.js',
        directives: {
          indent: 2,
          node: true
        }
      }
    },
    watch: {
      files: ['spec/**/*.js', 'src/JsConfig.js'],
      tasks: ['test']
    },
    jasmine_nodejs: {
      options: {
        specNameSuffex: 'Spec.js'
      },
      all: {
        specs: 'spec/**'
      }
    },
    jasmine: {
      all: {
        src: 'src/JsConfig.js',
        options: {
          specs: 'spec/*Spec.js',
          keepRunner: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  grunt.registerTask('test', ['jasmine_nodejs', 'jslint', 'jasmine']);
  grunt.registerTask('default', ['test', 'watch']);

};
