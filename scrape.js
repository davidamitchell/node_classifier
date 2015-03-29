var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var http = require('http');
var imagesize = require('imagesize');
var log = require('./lib/logger');

var xray = require('x-ray');

var request = require('request');
var url = require("url");


var uris = [];
uris.push('http://cuisine.co.nz/cuisine.nsf/food/kumara-pork-pepper-curry');
uris.push('http://www.taste.com.au/recipes/37374/crispy+salmon+with+zucchini+salad?ref=collections,fish-recipes');


var average = function(w, h, c, u, cb){
  var avg = {};
  avg.count = c;
  avg.width = w / c;
  avg.height = h / c;
  avg.area = avg.width * avg.height;
  image_size_hash[u] = avg
  cb();
}

var print_results = function(){
  log(image_size_hash);
}



var image_size_hash = {}
var avg = {};


_.each(uris, function(uri){
  request(uri, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var count = 0;
      var total_width = 0;
      var total_height = 0;

      var requested = 0;
      var img_count = $('img').length;

      $('img').each(function(i, element){
        var http = require('http');
        var imagesize = require('imagesize');
        var image_url = element.attribs.src;
        if ((image_url.charAt(0) == "\/") && (image_url.charAt(1) != "\/")){
          image_url = 'http://' + url.parse(uri).host + '/' + image_url
        }
        var request = http.get(image_url, function (response) {
          imagesize(response, function (err, result) {
            if( err == null ){
              total_width += result.width;
              total_height += result.height;
              ++count;
            } else {
              // console.log( err );
            }
            // we don't need more data
            request.abort();
          });
          if (++requested == img_count) {
            average(total_width, total_height, count, uri, print_results);
          }

        }).on('error', function(e) {
          console.log("Got error: " + e.message, image_url);
          if (++requested == img_count) {
            average(total_width, total_height, count, uri, print_results);
          }
        });
      });
    }
  });

});





//
//
// var a = $(this).prev();
// var rank = a.parent().parent().text();
// var title = a.text();
// var uri = a.attr('href');
// var subtext = a.parent().parent().next().children('.subtext').children();
// var points = $(subtext).eq(0).text();
// var username = $(subtext).eq(1).text();
// var comments = $(subtext).eq(2).text();
// // Our parsed meta data object
// var metadata = {
//   rank: parseInt(rank),
//   title: title,
//   uri: uri,
//   points: parseInt(points),
//   username: username,
//   comments: parseInt(comments)
// };




//
// xray('http://www.bite.co.nz/recipe/10923/Chocolate-pear-cake-with-chocolate-sauce/')
// .select(['img[src]'])
// .run(function(err, array, x) {
//   log( array[0] );
//   log( x );
//   _.each(array, function( image_url ){
//
//     var http = require('http');
//     var imagesize = require('imagesize');
//
//     var request = http.get(image_url, function (response) {
//       imagesize(response, function (err, result) {
//
//         log( image_url );
//         log( result );
//
//         // we don't need more data
//         request.abort();
//       });
//     });
//   });
// });




//
// xray('http://www.bite.co.nz/recipe/10923/Chocolate-pear-cake-with-chocolate-sauce/')
// .select([{
//   $root: ".recipe-image",
//   name: 'img[alt]',
//   src: 'img[src]'
// }])
// .run(function(err, array) {
//   log(array);
//   image_url = array[0].src;
//
//   var http = require('http');
//   var imagesize = require('imagesize');
//
//   var request = http.get(image_url, function (response) {
//     imagesize(response, function (err, result) {
//       log( err );
//       log( result );
//
//       // we don't need more data
//       request.abort();
//     });
//   });
// });
//
// xray('http://www.recipes.co.nz/shop/EVERYDAY/Steaks+with+Romesco+Sauce.html')
// .select([{
//   $root: ".main_image",
//   name: 'img[alt]',
//   src: 'img[src]'
// }])
// .run(function(err, array) {
//   log(array);
//   image_url = array[0].src;
//
//   var http = require('http');
//   var imagesize = require('imagesize');
//
//   var request = http.get(image_url, function (response) {
//     imagesize(response, function (err, result) {
//       log( err );
//       log( result );
//
//       // we don't need more data
//       request.abort();
//     });
//   });
// });

// request.get('http://www.food.com/recipe/new-zealand-lolly-log-cake-10385', function (error, response, body) {
//   log(error);
//   log(response.statusCode)
//   log(body)
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Show the HTML for the Google homepage.
//   }
// })
// http.get( 'http://www.food.com/recipe/new-zealand-lolly-log-cake-10385', function(response) {
//   // Continuously update stream with data
//   var body = '';
//   response.on('data', function(d) {
//     body += d;
//   });
//   response.on('end', function() {
//     log(body)
//
//   });
// });
