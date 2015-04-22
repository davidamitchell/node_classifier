'use strict';

var _ = require('lodash');
var log = require('./logger');

var numeric = require('./numeric');
var words = require('./words');

var stringify = require('json-stable-stringify');
var chalk = require('chalk');

var Classifier = function () {
  return this;
};

var str = function(what) {
  return chalk.blue(stringify(what, {space: 3}));
};


Classifier.prototype.train = function( data ) {
  this.data = data;

  var l = _.map(this.data, function(datum){
    if (datum.output === 'liked') {
      return datum.input;
    }
  });
  this.liked = _.compact(l);

  var d = _.map(this.data, function(datum){
    if (datum.output  === 'disliked') {
      return datum.input;
    }
  });
  this.disliked = _.compact(d);

  this.words = new words();


  var liked_ff = _.pluck(this.liked, 'font family');
  var disliked_ff = _.pluck(this.disliked, 'font family');
  this.words.train(liked_ff, disliked_ff);


}

Classifier.prototype.test = function( test ) {
  var n = new numeric();
  var d = this.data;
  var liked = this.liked;
  var disliked = this.disliked;

  // log(d);
  console.log('liked: ', str(liked));
  console.log('disliked:  ', str(disliked));

  var key_data, lp, dp;
  var likedProbs = 1;
  var dislikedProbs = 1;
  _.each(['ads', 'font size', 'images', 'off site links'],function(x){

    //liked
    key_data = _.pluck(liked, x);
    lp = n.probability(test[x], key_data);
    likedProbs *= lp;
    print_probs(x, test[x], key_data, lp, 'liked');

    //disliked
    key_data = _.pluck(disliked, x);
    dp = n.probability(test[x], key_data);
    dislikedProbs *= dp;
    print_probs(x, test[x], key_data, dp, 'disliked');

    console.log(chalk.red(lp == 0, lp));
    console.log(chalk.red(dp == 0, dp));
  });

  var font_fam_prob = this.words.probability(test['font family']);

  likedProbs *= font_fam_prob.liked;
  dislikedProbs *= font_fam_prob.disliked;

  print_probs('font family', test['font family'], this.words.liked_data, font_fam_prob.liked, 'liked');
  print_probs('font family', test['font family'], this.words.disliked_data, font_fam_prob.disliked, 'disliked');

  console.log(likedProbs)
  console.log('liked: ', likedProbs, '   disliked: ', dislikedProbs);
  if (likedProbs > dislikedProbs){
    log("========  LIKED ")
  } else {
    log("========  DISLIKED ")
  }


  font_fam_prob = this.words.probability(test['font family']);

  console.log("\n");

};

var n_prob = function(test, data, key){
  var n = new numeric();
  var a = _.pluck(data, key);
  var p = n.probability(test, a);

  return p;
};

var print_probs = function(key, test, data, prob, label){
  log("\n====================================");
  console.log(chalk.blue(label, ' -- ', key, ':  '));
  log("====================================");
  console.log('test: ', test, '  in data: : ', data);
  console.log( 'probablity: ', prob );
};


module.exports = Classifier;
