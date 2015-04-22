var _ = require('lodash');
var test_sites = ['food.com','annabel-langbein.com','jamieoliver.com','recipes.co.nz']
var inspected_raw = require('./lib/inspected');

var data = [];
var input, output, c_obj;
//
// {
//     "ads": 3,
//     "below fold": true,
//     "domain": "allrecipes.com",
//     "font family": "Verdana, Arial, sans-serif",
//     "font size": 10.6666669845581,
//     "html5": false,
//     "images": 94,
//     "liked": false,
//     "main image": 69696,
//     "off site links": 94
// },


_.each(inspected_raw, function(datum){
  if (!_.contains(test_sites, datum.domain)) {

    liked = datum.liked;
    output = liked ? 'liked' : 'disliked';
    input = datum;

    c_obj = {
      input: input,
      output: output
    }
    data.push(c_obj);
  }
});

console.log(data);


var test_data = [];

_.each(inspected_raw, function(datum){
  if (_.contains(test_sites, datum.domain)) {
    test_data.push(datum);
  }
});

console.log(test_data);

var Classifier = require('./lib/classifier');

var c = new Classifier(false);

c.train(data);

_.each(test_data, function(test){
  c.test(test);
  console.log('tested ', test.domain, 'liked?: ', test.liked)
});
