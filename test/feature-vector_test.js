'use strict';

var FeatureVector = require('../lib/feature-vector');
var assert = require('should');
var expect = require('chai').expect;

console.log(expect);

describe('FeatureVector', function () {

  describe('new', function() {

    context('with a valid argument', function(){
      var v = { 'green': false, 'size': 20 };
      it('does not error', function () {
        expect( function () { new FeatureVector( v ) } ).to.not.throw( );
      });
    });

    context('when no arguments are passed', function(){
      it('throws an error ', function () {
        expect( function () { new FeatureVector( ) } ).to.throw( );
      });
    });


  });
});
