'use strict';

var _ = require('lodash');
var log = require('./logger');
var stats = require("stats-lite")
var gaussian = require('gaussian');

var Numeric = function () {
  return this;
};

Numeric.prototype.probability = function( val, data ) {


  var mean = stats.mean(data);
  var variance = stats.variance(data);
  if (variance === 0) {
    variance = 1;
  }

  // log('data --------------');
  // log(data);
  // log(mean);
  // log(variance);
  // log('data --------------');

  var g = gaussian(mean, variance);

  return g.pdf(val);
};

module.exports = Numeric;
