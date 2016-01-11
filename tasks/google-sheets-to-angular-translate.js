/*
 * grunt-google-sheets-to-ngTranslate
 * https://github.com/lipcsei/grunt-google-sheets-to-ngTranslate
 *
 * Copyright (c) 2014 Sandor Lipcsei
 * Licensed under the MIT license.
 */

'use strict';

var Spreadsheet = require('edit-google-spreadsheet');
var extend = require('util')._extend;



module.exports = function (grunt) {

    grunt.registerMultiTask('gss_to_json', 'Read Google Spreadsheet and save as JSON.', function () {
        var options = this.options({
            debug: false,
            prettify: false,
            includeInfo: false,
            headerIsFirstRow: true
        });

        var done = this.async();

        var filename = this.files.pop().dest;

        if (!options.worksheetName && !options.worksheetId) {
            grunt.log.warn("Worksheet name or id must be specified.");
        }

        if (!options.spreadsheetName && !options.spreadsheetId) {
            grunt.log.warn("Spreadsheet name or id must be specified.");
        }
            Spreadsheet.load(
                options,
                function sheetReady(err, spreadsheet) {
                    if (err) {
                        return done(new Error(err));
                    }

                    spreadsheet.receive(function (err, rows, info) {
                        if (err) {
                            return done(new Error(err));
                        }

                        if (!options.spreadsheetId) {
                            grunt.log.writeln('For better performance, set spreadsheetId "' + info.spreadsheetId + '".');
                        }

                        if (!options.worksheetId) {
                            grunt.log.writeln('For better performance, set worksheetId "' + info.worksheetId + '".');
                        }

                        var header = extend(rows["1"]);
                        if (header) {
                            delete header["1"];
                        }
                        var tmp = [];
                        Object.keys(header).map(function (key) {
                            tmp.push(header[key]);
                        });

                        if (options.headerIsFirstRow) {
                            delete rows["1"];
                        }

                        var data = [];
                        tmp.map(function (i) {
                            data[i] = {};
                            Object.keys(rows).map(function (row) {
                                    var token = rows[row]['1'].trim().toLowerCase().split(".").join("_").split("-").join("_");
                                    var translate = rows[row][tmp.indexOf(i) + 2];
                                    var obj = {};
                                    obj[token] = translate;
                                    data[i][token] = translate;
                                }
                            );
                        });


                        tmp.forEach(function (i) {
                            grunt.file.write(filename + "/" + i + ".json", JSON.stringify(data[i]));
                            grunt.log.writeln('Spreadsheet data written to "' + filename + '/' + i + '.json".');
                        });


                        done(data);
                    });
                });
        });
};
