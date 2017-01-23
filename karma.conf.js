'use strict';

module.exports = function(config) {
  config.set({
    frameworks: [ 'mocha', 'sinon-chai' ],

    'plugins': [
        'karma-coverage',
        'karma-mocha',
        'karma-sinon-chai',
        'karma-phantomjs-launcher'
    ],

    files: [
      'dist/lib-*.js',
      'dist/swagger-ui-*.js',
      'test/unit/mock.js',
      'test/unit/**/*.js'
    ],

    //singleRun: true,

    browsers: [ 'PhantomJS'/*,  'Chrome' */],

    // https://github.com/kt3k/codecov-karma-example
    preprocessor: {
      'src/**/*.js': [ 'coverage' ]
    },
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
      reporters: [{type: 'lcov'}]
    }
  });
};
