'use strict';

var _ = require('lodash');
var assert = require('assert');

// vector - required
//        - a hash of named features and their values
//        - { 'green': false, 'size': 20 }
//
var FeatureVector = function ( vector ) {

  assert.equal( typeof( vector ), 'object',
      "argument 'vector' must be a object" );

  this.vector = vector;

  return this;
};

FeatureVector.prototype.log = function() {
};

module.exports = FeatureVector;
