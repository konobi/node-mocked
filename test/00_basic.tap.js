
var tap = require('tap');

tap.test('Basic tests', function(t) {
  var mocked;
  t.doesNotThrow(() => {
    mocked = require('..')
  }, 'ensure mocked lib can load');

  var orig_require = (path) => {
    return process.env.NODE_PATH;
  };
  
  var fake = mocked.make_sneaky_require('test/lib', ['http', 'fs'], orig_require)
  var node_path = fake('http')

  t.equal(fake.mock_path, 'test/lib');
  t.equal(node_path, 'test/lib');
  t.same(fake.possible_modules, ['http', 'fs']);

  fake = mocked.make_sneaky_require('test/lib', ['http', 'fs'], orig_require)
  node_path = fake('repl')

  t.notEqual(node_path, 'test/lib');
  t.done();
});

tap.test('rainy day cases', function(t) {
  var mocked = require('..');

  t.throws(() => { mocked(2, []) }, 'Mock path must be a string');
  t.throws(() => { mocked('', []) }, 'Mock path must be a string');
  t.throws(() => { mocked('test', 'bob' ) }, 'Mocked libs must be an array');

  mocked('test/testlib/', ['bob']);
  var bob = require('bob');
  t.equal(bob, "ullo");

  t.done();
});
