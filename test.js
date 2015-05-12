/*!
 * helper-yaml <https://github.com/jonschlinkert/helper-yaml>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var should = require('should');
var Template = require('template');
var handlebars = require('handlebars');
var _ = require('lodash');
var read = require('helper-read');
var yaml = require('./');
var template;

describe('async', function () {
  it('should parse yaml from a string:', function (cb) {
    yaml('name: Jon\n', function (err, res) {
      if (err) return cb(err);
      res.should.eql({name: 'Jon'});
    });
    yaml('name: Brian\n', function (err, res) {
      if (err) return cb(err);
      res.should.eql({name: 'Brian'});
      cb();
    });
  });

  it('should work as an async helper:', function (cb) {
    template = new Template();
    template.engine('foo', require('engine-handlebars'));

    template.asyncHelper('yaml', yaml);
    template.helper('stringify', function (o) {
      return JSON.stringify(o);
    });

    template.page('abc.foo', '{{{stringify (yaml "first: Halle\nlast: Schlinkert\n")}}}');
    template.page('xyz.foo', '{{{stringify (yaml "first: Brooke\nlast: Schlinkert\n")}}}');

    template.render('abc.foo', function (err, res) {
      if (err) return cb(err);
      JSON.parse(res).should.eql({ first: 'Halle', last: 'Schlinkert' });
    });

    template.render('xyz.foo', function (err, res) {
      if (err) return cb(err);
      JSON.parse(res).should.eql({ first: 'Brooke', last: 'Schlinkert' });
    });
    cb();
  });

  it('should throw an error when the callback is missing:', function (cb) {
    (function () {
      yaml();
    }).should.throw('helper-yaml async expects a callback.');
    cb()
  });

  it('should throw an error when the string is missing:', function (cb) {
    yaml(null, function (err, res) {
      err.should.be.an.object;
      err.message.should.equal('helper-yaml async expects str to be a string.');
      cb();
    });
  });
});

describe('async', function () {
  function stringify(str) {
    return JSON.stringify(str);
  }
  it('should parse yaml from a string:', function () {
    yaml.sync('first: Halle\nlast: Schlinkert').should.eql({
      first: 'Halle',
      last: 'Schlinkert'
    });
    yaml.sync('first: Brooke\nlast: Schlinkert').should.eql({
      first: 'Brooke',
      last: 'Schlinkert'
    });
  });

  it('should work as a lodash helper:', function () {
    var actual = _.template('<%= stringify(yaml(read(".travis.yml"))) %>')({
      read: read.sync,
      yaml: yaml.sync,
      str: "first: Halle\nlast: Schlinkert\n",
      stringify: stringify
    });
    JSON.parse(actual).should.have.property('node_js');

    var actual = _.template('<%= stringify(yaml(str)) %>')({
      yaml: yaml.sync,
      str: "first: Halle\nlast: Schlinkert\n",
      stringify: stringify
    });
    JSON.parse(actual).should.eql({first: 'Halle', last: 'Schlinkert'});

    var actual = _.template('<%= stringify(yaml(str)) %>')({
      yaml: yaml.sync,
      str: "first: Brooke\nlast: Schlinkert\n",
      stringify: stringify
    });
    JSON.parse(actual).should.eql({first: 'Brooke', last: 'Schlinkert'});
  });

  it('should work as a handlebars helper:', function () {
    handlebars.registerHelper('yaml', yaml.sync);

    var a = handlebars.compile('{{{yaml "first: Halle\nlast: Schlinkert\n"}}}')();
    a.should.eql({first: 'Halle', last: 'Schlinkert'});

    var b = handlebars.compile('{{{yaml "first: Brooke\nlast: Schlinkert\n"}}}')();
    b.should.eql({first: 'Brooke', last: 'Schlinkert'});
  });

  it('should throw an error when the callback is missing:', function () {
    (function () {
      yaml.sync();
    }).should.throw('helper-yaml sync expects str to be a string.');
  });
});
