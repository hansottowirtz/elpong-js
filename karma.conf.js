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
      testName: 'Elpong Karma Test',
      startConnect: false,
      recordScreenshots: true
    },
    customLaunchers: customLaunchers,
    basePath: '',
    frameworks: ['source-map-support', 'jasmine'],
    files: [
      'spec/fixtures/**/*.json',
      'src/**/*.ts',
      // 'spec/**/spec_helper.coffee',
      // 'spec/**/util_spec.coffee',
      'spec/**/util_spec.ts'
    ],
    exclude: [],
    preprocessors: {
      '**/*.json': ['json_fixtures'],
      '**/*.ts': ['webpack'],
      '**/*.coffee': ['webpack'],
      '**/*.js': ['env']
    },
    plugins: [
      'karma-env-preprocessor',
      'karma-json-fixtures-preprocessor',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-safari-launcher',
      'karma-phantomjs-launcher',
      'karma-sauce-launcher',
      'karma-source-map-support',
      'karma-webpack'
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
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },
    webpack: {
      resolve: {
        extensions: ['.ts', '.coffee', '.js']
      },
      module: {
        loaders: [
          { test: /\.coffee$/, loader: 'coffee-loader' },
          { test: /\.ts$/, loader: 'awesome-typescript-loader' }
        ]
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
