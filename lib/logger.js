'use strict';

var chalk = require('chalk');
var stringify = require('json-stable-stringify');

module.exports = function( what ) {
  if (typeof what === 'string' || !isNaN( what ) ) {
    console.log( chalk.blue( what ) );
  } else {
    console.log( chalk.blue(stringify(what, {space: 3})) );
  }
};
