
// module dependencies
var _ = require('lodash');
var dclassify = require('dclassify');

var log = require('./lib/logger');

// Utilities provided by dclassify
var Classifier = dclassify.Classifier;
var DataSet    = dclassify.DataSet;
var Document   = dclassify.Document;

var good = []
good.push( new Document('http://www.bite.co.nz/',                [ 'image:small',  'fs:x-large', 'ff:Oxygen' ]) );
good.push( new Document('http://www.recipes.co.nz/',             [ 'image:small',  'fs:large',   'ff:Oxygen' ]) );
good.push( new Document('http://www.foodlovers.co.nz/',          [ 'image:small',  'fs:large',   'ff:Oxygen' ]) );
good.push( new Document('http://www.nzwomansweekly.co.nz/food/', [ 'image:small',  'fs:large',   'ff:Oxygen' ]) );
good.push( new Document('http://www.food.com/topic/new-zealand', [ 'image:medium', 'fs:large',   'ff:Helvetica' ]) );


var bad = []
bad.push( new Document('http://cuisine.co.nz/',                 [ 'image:x-large', 'fs:x-small', 'ff:Differnt' ]) );
bad.push( new Document('http://www.taste.com.au/',              [ 'image:large',   'fs:small',   'ff:Helvetica' ]) )
bad.push( new Document('http://allrecipes.com/',                [ 'image:x-large', 'fs:small',   'ff:Helvetica' ]) )
bad.push( new Document('http://www.bettycrocker.com/',          [ 'image:x-large', 'fs:small',   'ff:Helvetica' ]) )
bad.push( new Document('http://www.cooks.com/',                 [ 'image:x-large', 'fs:small',   'ff:Helvetica' ]) )

// create a DataSet and add test items to appropriate categories
// this is 'curated' data for training
var data = new DataSet();
data.add('bad',  bad);
data.add('good', good);

// an optimisation for working with small vocabularies
var options = {
  applyInverse: true
};

// create a classifier
var classifier = new Classifier(options);

// train the classifier
classifier.train(data);
log('Classifier trained.');
log(classifier.probabilities);

// test the classifier on a new test item
var testDoc = new Document('testDoc', [ 'image:medium', 'fs:large', 'ff:Helvetica' ]);
log(testDoc)
var result1 = classifier.classify(testDoc);
log(result1);
