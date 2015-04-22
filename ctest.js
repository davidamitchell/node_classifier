var classifier = require('classifier');
var bayes = new classifier.Bayesian();

bayes.train("cheap replica watches", 'spam');
bayes.train("cheap watches", 'spam');
bayes.train("replica watches", 'spam');
// bayes.train("I don't know if this works on windows", 'not');

var category = bayes.classify("free watches");   // "spam"
console.log(category)

console.log(bayes.getProbsSync("hi there"));
