'use strict';

var path = require('path');

module.exports = function () {
  return {
    context: __dirname,
    entry: './entry.js',
    output: {
      path: path.join(__dirname, '..', '..', 'test_output', 'basic_bundle'),
      filename: 'output.js'
    }
  };
};
//# sourceMappingURL=webpack.config.js.map