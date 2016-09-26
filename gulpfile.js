var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cson = require('gulp-cson');
var coffeelint = require('gulp-coffeelint');
var size = require('gulp-size');
var reporter = require('coffeelint-stylish').reporter;
var karmaServer = require('karma').Server;

var files = ['./src/index.coffee', './src/scheme.coffee', './src/element.coffee', './src/collection.coffee', , './src/polyfills.coffee', './src/util.coffee', './src/helpers.coffee', './src/*/**/*.coffee']

gulp.task('default', ['test'])

gulp.task('build', ['lint'], function(done) {
  gulp.src(files)
    .pipe(concat('httpong.coffee'))
    .pipe(gulp.dest('./dist/'))
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify({unsafe: true, global_defs: { DEBUG: false }}))
    .pipe(rename('httpong.min.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(size({showFiles: true}));
  setTimeout(done, 500)
});

gulp.task('compile-schemes', function() {
  gulp.src('./test/fixtures/*/scheme.cson')
    .pipe(cson())
    .pipe(gulp.dest('./test/fixtures'))
});

gulp.task('lint', function (done) {
  gulp.src('./src/*.coffee')
      .pipe(coffeelint())
      .pipe(coffeelint.reporter('coffeelint-stylish'))
  setTimeout(done, 500)
});

gulp.task('test', ['compile-schemes', 'build'], function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS']
  }, done).start();
});

gulp.task('debug-test', ['compile-schemes', 'build'], function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    browsers: ['Chrome']
  }, done).start();
  gulp.watch('src/**/*.coffee', ['build']);
});
