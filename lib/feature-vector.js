'use strict';

var _ = require('lodash');

// vector - required
//        - a hash of named features and their values
//        - { 'green': false, 'size': 20 }
//
var FeatureVector = function ( vector ) {

  if ( vector == undefined || _.isTypedArray( vector ) ) {
    throw new Error("vector must be a key value hash");
  } else {
    this.vector = vector
  }
  return this;
};

FeatureVector.prototype.log = function() {
};

module.exports = FeatureVector;
