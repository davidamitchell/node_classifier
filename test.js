var limdu = require('limdu');
var brain = require('brain');
var colorClassifier = new limdu.classifiers.NeuralNetwork();

colorClassifier.trainBatch(
  [
  {input: { r: 0.03, g: 0.7, b: 0.5 }, output: 0},  // black
  {input: { r: 0.16, g: 0.09, b: 0.2 }, output: 1}, // white
  {input: { r: 0.5, g: 0.5, b: 1.0 }, output: 1}   // white
  ]
);

console.log(colorClassifier.classify({ r: 1, g: 0.4, b: 0 }));  // 0.99 - almost white


var siteClassifier = new limdu.classifiers.NeuralNetwork();
var data = [
{input: {
  "ads": 3,
  // "doctype": "other",
  // "domain": "allrecipes.com",
  // "font family": "Verdana, Arial, sans-serif",
  "font size": 10.6666669845581,
  "images": 94,
  "off site links": 94
}, output: 0},  // black
{input: {
  "ads": 0,
  // "doctype": "html5",
  // "domain": "annabel-langbein.com",
  // "font family": "nimbus-sans, Arial, Helvetica, sans-serif",
  "font size": 15,
  "images": 5,
  "off site links": 10
}, output: 1}, // white
{input: {
  "ads": 3,
  // "doctype": "html5",
  // "domain": "chow.com",
  // "font family": "proxima-nova, sans-serif",
  "font size": 20,
  "images": 27,
  "off site links": 44
}, output: 1}   // white
];

siteClassifier.trainBatch(data,options);

console.log(siteClassifier.classify({
  "ads": 5,
  // "doctype": "html5",
  // "domain": "cookinglight.com",
  // "font family": "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  "font size": 12,
  "images": 41,
  "off site links": 58
}));  // 0.99 - almost white



var options = {
  errorThresh: 0.005,  // error threshold to reach
  iterations: 20000,   // maximum training iterations
  log: false,           // console.log() progress periodically
  logPeriod: 10,       // number of iterations between logging
  learningRate: 0.3    // learning rate
}
var net = new brain.NeuralNetwork();
net.train(data,options);

console.log(net.run({ r: 1, g: 0.4, b: 0 }));






var colorClassifier = new limdu.classifiers.Bayesian();

colorClassifier.trainBatch([
    {input: { r: 0.03, g: 0.7, b: 0.5, c: 'one'}, output: 'black'},
    {input: { r: 0.16, g: 0.09, b: 0.2, c: 'one' }, output: 'white'},
    {input: { r: 0.5, g: 0.5, b: 1.0, c: 'one' }, output: 'white'},
    ]);

console.log(colorClassifier.classify({ r: 1, g: 0.4, b: 0, c: 'one' },
        /* explanation level = */1));













var x = {
  "allrecipes.com": {
    "ads": 3,
    "doctype": "other",
    "domain": "allrecipes.com",
    "font family": "Verdana, Arial, sans-serif",
    "font size": 10.6666669845581,
    "images": 94,
    "liked": false,
    "off site links": 94
  },
  "annabel-langbein.com": {
    "ads": 0,
    "doctype": "html5",
    "domain": "annabel-langbein.com",
    "font family": "nimbus-sans, Arial, Helvetica, sans-serif",
    "font size": 15,
    "images": 5,
    "liked": false,
    "off site links": 10
  },
  "chow.com": {
    "ads": 3,
    "doctype": "html5",
    "domain": "chow.com",
    "font family": "proxima-nova, sans-serif",
    "font size": 20,
    "images": 27,
    "liked": false,
    "off site links": 44
  },
  "cookinglight.com": {
    "ads": 5,
    "doctype": "html5",
    "domain": "cookinglight.com",
    "font family": "Arial, 'Helvetica Neue', Helvetica, sans-serif",
    "font size": 12,
    "images": 41,
    "liked": false,
    "off site links": 58
  },
  "food.com": {
    "ads": 2,
    "doctype": "html5",
    "domain": "food.com",
    "font family": "TensoLight, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    "font size": 16,
    "images": 20,
    "liked": false,
    "off site links": 45
  },
  "foodnetwork.com": {
    "ads": 4,
    "doctype": "html5",
    "domain": "foodnetwork.com",
    "font family": "'Lucida Grande', Helvetica, Arial, sans-serif",
    "font size": 13,
    "images": 93,
    "liked": false,
    "off site links": 138
  },
  "jamieoliver.com": {
    "ads": 3,
    "doctype": "html5",
    "domain": "jamieoliver.com",
    "font family": "Courier, 'Courier New', monospace",
    "font size": 13,
    "images": 47,
    "liked": false,
    "off site links": 46
  },
  "kraftrecipes.com": {
    "ads": 11,
    "doctype": "other",
    "domain": "kraftrecipes.com",
    "font family": "'Trebuchet MS', Arial",
    "font size": 14,
    "images": 116,
    "liked": false,
    "off site links": 45
  },
  "marthastewart.com": {
    "ads": 2,
    "doctype": "html5",
    "domain": "marthastewart.com",
    "font family": "Georgia, serif",
    "font size": 14,
    "images": 88,
    "liked": false,
    "off site links": 47
  },
  "myrecipes.com": {
    "ads": 12,
    "doctype": "html5",
    "domain": "myrecipes.com",
    "font family": "'Helvetica Neue', Arial, Helvetica, Geneva, sans-serif",
    "font size": 13,
    "images": 67,
    "liked": false,
    "off site links": 267
  },
  "recipes.co.nz": {
    "ads": 0,
    "doctype": "html5",
    "domain": "recipes.co.nz",
    "font family": "Oxygen, Arial, 'Sans-serif regular'",
    "font size": 15,
    "images": 26,
    "liked": false,
    "off site links": 10
  },
  "seriouseats.com": {
    "ads": 4,
    "doctype": "html5",
    "domain": "seriouseats.com",
    "font family": "ff-tisa-web-pro, Georgia, Times, serif",
    "font size": 16,
    "images": 49,
    "liked": false,
    "off site links": 98
  },
  "simplyrecipes.com": {
    "ads": 4,
    "doctype": "html5",
    "domain": "simplyrecipes.com",
    "font family": "open-sans, Helvetica, Arial, sans-serif",
    "font size": 14,
    "images": 99,
    "liked": false,
    "off site links": 20
  },
  "taste.com.au": {
    "ads": 7,
    "doctype": "html5",
    "domain": "taste.com.au",
    "font family": "Museo-300, Arial, Helvetica, sans-serif",
    "font size": 14,
    "images": 81,
    "liked": false,
    "off site links": 73
  },
  "tasteofhome.com": {
    "ads": 2,
    "doctype": "html5",
    "domain": "tasteofhome.com",
    "font family": "Arial, 'Helvetica Neue', Helvetica, sans-serif",
    "font size": 14,
    "images": 49,
    "liked": false,
    "off site links": 98
  }
}
