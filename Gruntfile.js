/*
 * grunt-gss-to-json
 * https://github.com/stpe/grunt-gss-to-json
 *
 * Copyright (c) 2014 Stefan Pettersson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
      config: grunt.file.readJSON('config.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'src/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    gss_to_json: {
      dev: {
        options: {
            spreadsheetName: '<%= config.spreadsheetName %>',
            worksheetName: '<%= config.worksheetName %>',
            spreadsheetId: '<%= config.spreadsheetId %>',
            oauth : {
                email: '<%= config.oauth.email %>',
                keyFile: '<%= config.oauth.keyFile %>'
            }
        },
        dest: "tmp"
      }
    }

  });

  grunt.loadTasks('src');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'clean', 'gss_to_json']);

};
