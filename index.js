/*
 * critical
 * http://github.com/addyosmani/critical
 *
 * Copyright (c) 2014 Google Inc.
 * Licensed under an Apache 2 license.
 */

'use strict';
var oust      = require('oust');
var penthouse = require('penthouse');
var fs        = require('fs');
var path      = require('path');
var inliner   = require('inline-styles');

/**
 * Critical path CSS generation
 * @param  {object} opts Options
 * @param  {function} cb Callback
 * @accepts src, base, width, height, dest
 */
exports.generate = function (opts, cb) {
    if (!opts.src && !opts.base) {
        throw new Error( 'A valid source and base path are required.' );
        process.exit(1);
    }
    opts = opts || {};
    cb = cb || function () {};    
    var url = opts.base + opts.src;
    // Oust extracts a list of your stylesheets
    oust({ src: url }, function (hrefs){
        // Penthouse then determines your critical
        // path CSS using these as input.
        penthouse({
            url : url,
            css : opts.base + hrefs[0],
            // What viewports do you care about?
            width : opts.width,   // viewport width
            height : opts.height   // viewport height
        }, function (err, criticalCSS) {
            // Write critical-path CSS
            if(opts.dest){
              fs.writeFile(opts.base + opts.dest, criticalCSS);
            }
            cb(criticalCSS);
        }); 
    });  
}

/**
 * Critical path CSS inlining
 * @param  {object} opts Options
 * @param  {function} cb Callback
 * @accepts src, base, dest
 */
exports.inline = function (opts, cb) {
  if (!opts.src && !opts.base) {
      throw new Error( 'A valid source and base path are required.' );
      process.exit(1);
  }
  opts = opts || {};
  cb = cb || function () {};
  var url = opts.base + opts.src;
  // Inline the critical path CSS
  var html = fs.readFile(url);
  var out = inliner(html, opts.base);
  if(opts.dest){
    // Write HTML with inlined CSS to dest
    fs.writeFile(opts.base + opts.dest, out);
  }
  cb(out);
}
