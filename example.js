var yaml = require('./');
var Template = require('template');
var template = new Template();

/**
 * Register an engine
 */

template.engine('foo', require('engine-handlebars'));

/**
 * Register the helper
 */

template.asyncHelper('yaml', yaml);
template.helper('stringify', function (o) {
  return JSON.stringify(o);
});

/**
 * Add some templates
 */

// note that JSON.stringify and JSON.parse are only
// necessary here since I'm defining the YAML string inline.
// If it's passed as a variable JSON.parse/stringify aren't needed
template.page('abc.foo', '{{{stringify (yaml "first: Halle\nlast: Schlinkert\n")}}}');
template.page('xyz.foo', '{{{stringify (yaml "first: Brooke\nlast: Schlinkert\n")}}}');

/**
 * Render the templates
 */

template.render('abc.foo', function (err, res) {
  if (err) console.log(err);
  console.log(JSON.parse(res));
  //=> { first: 'Halle', last: 'Schlinkert' }
});

template.render('xyz.foo', function (err, res) {
  if (err) console.log(err);
  console.log(JSON.parse(res));
  //=> { first: 'Brooke', last: 'Schlinkert' }
});
