// Karma configuration
// Generated on Fri Jun 24 2016 00:45:30 GMT+0200 (CEST)

module.exports = function(config) {
  var customLaunchers = {
    chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '51'
    }
  }
  // var customLaunchers = {
  //   sl_chrome: {
  //     base: 'SauceLabs',
  //     browserName: 'chrome',
  //     platform: 'Windows 7',
  //     version: '35'
  //   },
  //   sl_firefox: {
  //     base: 'SauceLabs',
  //     browserName: 'firefox',
  //     version: '30'
  //   },
  //   sl_ios_safari: {
  //     base: 'SauceLabs',
  //     browserName: 'iphone',
  //     platform: 'OS X 10.9',
  //     version: '7.1'
  //   },
  //   sl_ie_11: {
  //     base: 'SauceLabs',
  //     browserName: 'internet explorer',
  //     platform: 'Windows 8.1',
  //     version: '11'
  //   }
  // }
  console.log(process.env.SAUCE_USERNAME);
  config.set({
    sauceLabs: {testName: 'Karma'},
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
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: Object.keys(customLaunchers),
    singleRun: true,
    concurrency: Infinity
  })
}
