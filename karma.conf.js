module.exports = function(config) {
  var customLaunchers = {
    'SL_Chrome_26': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '26'
    },
    'SL_Chrome_dev': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'dev'
    },
    'SL_Firefox_10': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '10'
    },
    'SL_Firefox_dev': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'dev'
    },
    'SL_Safari_6': {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '6'
    },
    'SL_Safari_10': {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '10'
    },
    'SL_IE_9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 10',
      version: '11'
    }
  }

  config.set({
    sauceLabs: {
      testName: 'HTTPong Karma Test',
      startConnect: false,
      recordScreenshots: true
    },
    customLaunchers: customLaunchers,
    basePath: '',
    frameworks: ['source-map-support', 'jasmine'],
    files: [
      'test/fixtures/**/*.json',
      'dist/httpong.js',
      'test/spec_helper.coffee',
      'test/**/*_spec.coffee'
    ],
    exclude: [],
    preprocessors: {
      '**/*.json': ['json_fixtures'],
      '**/*.coffee': ['coffee'],
      '**/*.js': ['env']
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    plugins: [
      'karma-env-preprocessor',
      'karma-json-fixtures-preprocessor',
      'karma-jasmine',
      'karma-coffee-preprocessor',
      'karma-chrome-launcher',
      'karma-safari-launcher',
      'karma-phantomjs-launcher',
      'karma-sauce-launcher',
      'karma-source-map-support'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: Object.keys(customLaunchers), // overridden by certain gulp tasks
    singleRun: true,
    concurrency: Infinity,
    envPreprocessor: [
     'FRAMEWORK'
   ],
    coffeePreprocessor: {
      options: {
        sourceMap: true
      }
    }
  })
  switch (process.env.FRAMEWORK) {
    case 'jquery':
      config.files.unshift('node_modules/jquery/dist/jquery.js', 'node_modules/jquery-mockjax/dist/jquery.mockjax.js');
      break;
    case 'fetch':
      config.files.unshift('node_modules/promise-polyfill/promise.js', 'node_modules/whatwg-fetch/fetch.js', 'node_modules/fetch-mock/es5/client-browserified.js');
      break;
    default:
      config.files.unshift('node_modules/angular/angular.js', 'node_modules/angular-mocks/angular-mocks.js');
  }
  if (process.env.TRAVIS) {
    config.reporters.push('saucelabs')
    config.sauceLabs.build = 'Travis #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
  }
}
