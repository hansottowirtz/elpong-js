var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cson = require('gulp-cson');
var coffeelint = require('gulp-coffeelint');
var size = require('gulp-size');
var umd = require('gulp-umd');
var sourcemaps = require('gulp-sourcemaps');

var reporter = require('coffeelint-stylish').reporter;
var karmaServer = require('karma').Server;

var files = ['./src/index.coffee', './src/scheme.coffee', './src/element.coffee', './src/collection.coffee', , './src/polyfills.coffee', './src/util.coffee', './src/*/*.coffee', './src/*/*/**/*.coffee']

gulp.task('default', ['test'])

gulp.task('build', ['lint'], function() {
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(concat('httpong.coffee'))
    .pipe(gulp.dest('./dist/'))
    .pipe(coffee({bare: true}))
    .pipe(umd({
      exports: function() {
        return 'HTTPong';
      },
      namespace: function() {
        return 'HTTPong';
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify({unsafe: true, global_defs: { DEBUG: false }}))
    .pipe(rename('httpong.min.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(size({showFiles: true}));
});

gulp.task('compile-schemes', function() {
  return gulp.src('./test/fixtures/*/scheme.cson')
    .pipe(cson())
    .pipe(gulp.dest('./test/fixtures'));
});

gulp.task('lint', function() {
  return gulp.src('./src/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter('coffeelint-stylish'));
});

gulp.task('test', ['karma-test']);

testWithFramework = function(framework, done) {
  process.env.FRAMEWORK = framework;
  console.log('Testing ' + framework);
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS']
  }, done).start();
}

gulp.task('karma-test', ['compile-schemes', 'build'], function(done) {
  return testWithFramework('angular', done);
});

gulp.task('saucelabs-test', function(done) {
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('travis-test', ['frameworks-test', 'saucelabs-test']);

gulp.task('frameworks-test', ['compile-schemes', 'build'], function(done){
  var frameworks = ['angular', 'jquery', 'fetch'];
  var i = 0;
  var partlyDone = function(exitcode){
    if(exitcode) {
      process.exit(exitcode);
    }
    if(++i === frameworks.length) {
      done();
      return;
    }
    testWithFramework(frameworks[i], partlyDone);
  };
  testWithFramework(frameworks[0], partlyDone);
})

gulp.task('debug-test', ['compile-schemes', 'build'], function(done) {
  gulp.watch('src/**/*.coffee', ['compile-schemes', 'build']);
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    autoWatch: true,
    browsers: ['Chrome']
  }, done).start();
});
