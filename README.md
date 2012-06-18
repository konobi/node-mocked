
Mocked is a small library that allows you to intercept calls to require() and
load the specified libaries from a directory of your choosing.

# Installation

    npm install mocked

# Usage

The usage is as so:

    var mocked = require('mocked');

    // Use the directory ./tests/mocks and list the libs to be mocked
    mocked('./tests/mocks', ['http', 'net', './some/dependency']);

    // this will be at ./tests/mocks/deps/logger.js
    var logger = require('./deps/logger');

# Github

For git repository and issues, please see [](http://github.com/konobi/node-mocked)

# License

MIT. (See LICENSE file)

# Author

Scott McWhirter - [Github profile](http://github.com/konobi)

