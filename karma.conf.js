module.exports = function(config) {
  var customLaunchers = {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '51'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '47'
    },
    'SL_Safari_8': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8'
    },
    'SL_Safari_9': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9'
    },
    'SL_IE_9': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    'SL_IE_10': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    'SL_iOS': {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '8.1'
    }
  }

  config.set({
    sauceLabs: {
      testName: 'HTTPong Karma Test',
      startConnect: false
    },
    customLaunchers: customLaunchers,
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'test/fixtures/**/*.json',
      'dist/httpong.js',
      'test/**/*_spec.coffee'
    ],
    exclude: [],
    preprocessors: {
      '**/*.json': ['json_fixtures'],
      '**/*.coffee': ['coffee']
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    plugins: [
      'karma-json-fixtures-preprocessor',
      'karma-jasmine',
      'karma-coffee-preprocessor',
      'karma-chrome-launcher',
      'karma-safari-launcher',
      'karma-phantomjs-launcher',
      'karma-sauce-launcher'
    ],
    reporters: ['progress', 'saucelabs'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: false,
    browsers: Object.keys(customLaunchers),
    singleRun: true,
    concurrency: Infinity
  })
  if (process.env.TRAVIS) {
    var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.build = buildLabel;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.sauceLabs.recordScreenshots = true;
  }
}
