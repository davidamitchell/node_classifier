'use strict';

var _ = require('lodash');
var log = require('./logger');


var Words = function () {
  var classifier = require('classifier');
  this.bayes = new classifier.Bayesian();

  this.liked_data = [];
  this.disliked_data = [];

  return this;
};

Words.prototype.train = function( liked_data, disliked_data ) {
  var b = this.bayes;

  this.liked_data = liked_data;
  this.disliked_data = disliked_data;

  _.each(liked_data, function(datum){
    b.train(datum, 'liked');
  });

  _.each(disliked_data, function(datum){
    b.train(datum, 'disliked');
  });

};

Words.prototype.probability = function( val ) {
  return this.bayes.getProbsSync( val );
};

module.exports = Words;
