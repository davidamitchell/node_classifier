
var data = [
{input: {
  "ads": 3,
  "doctype": "other",
  // "domain": "allrecipes.com",
  "font family": "Verdana, Arial, sans-serif",
  "font size": 10.6666669845581,
  "images": 94,
  "off site links": 94
}, output: 'liked'},
{input: {
  "ads": 3,
  "doctype": "html5",
  // "domain": "chow.com",
  "font family": "proxima-nova, sans-serif",
  "font size": 15,
  "images": 2,
  "off site links": 4
}, output: 'disliked'},
{input: {
  "ads": 0,
  "doctype": "html5",
  // "domain": "annabel-langbein.com",
  "font family": "nimbus-sans, Arial, Helvetica, sans-serif",
  "font size": 15,
  "images": 5,
  "off site links": 10
}, output: 'disliked'},
{input: {
  "ads": 3,
  "doctype": "html5",
  // "domain": "chow.com",
  "font family": "proxima-nova, sans-serif",
  "font size": 20,
  "images": 27,
  "off site links": 44
}, output: 'liked'},
{input: {
  "ads": 3,
  "doctype": "html5",
  // "domain": "chow.com",
  "font family": "proxima-nova, sans-serif",
  "font size": 20,
  "images": 27,
  "off site links": 44
}, output: 'liked'}
];


var test = {
  "ads": 40,
  "doctype": "html5",
  "font family": "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  "font size": 20,
  "images": 8,
  "off site links": 8
}

test = {
  "ads": 3,
  "doctype": "html5",
  // "domain": "chow.com",
  "font family": "proxima-nova, sans-serif",
  "font size": 20,
  "images": 27,
  "off site links": 44
}

var Classifier = require('./lib/classifier');

var c = new Classifier();

c.train(data);
c.test(test);
