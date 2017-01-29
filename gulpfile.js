var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cson = require('gulp-cson');
var coffeelint = require('gulp-coffeelint');
var size = require('gulp-size');
var umd = require('gulp-umd');
var ts = require('gulp-typescript');
var webpack = require('webpack-stream');

var reporter = require('coffeelint-stylish').reporter;
var karmaServer = require('karma').Server;

// var files = ['./src/index.coffee', './src/scheme.coffee', './src/element.coffee', './src/collection.coffee', , './src/polyfills.coffee', './src/util.coffee', './src/*/*.coffee', './src/*/*/**/*.coffee']
// var files = ['./src/index.ts', './src/scheme.ts', './src/element.ts', './src/collection.ts', , './src/polyfills.ts', './src/util.ts', './src/*/*.ts', './src/*/*/**/*.ts']
var files = ['./src/index.js', './src/scheme.js', './src/element.js', './src/collection.js', , './src/polyfills.js', './src/util.js', './src/*/*.js', './src/*/*/**/*.js']

gulp.task('default', ['test']);

gulp.task('build', ['build:ts', 'build:concat', 'build:umd', 'build:uglify']);

gulp.task('build:ts', function() {
  return gulp.src('src/**/*.ts')
    .pipe(ts.createProject('tsconfig.json')()).js
    .pipe(gulp.dest('built/'));
});

// gulp.task('build:concat', function() {
//   return gulp.src('built/**/*.js')
//     .pipe(concat('elpong-x.js'))
//     // .pipe(rename())
//     .pipe(gulp.dest('dist/'));
// });
gulp.task('build:concat', function() {
  return gulp.src('src/**/*.ts')
    .pipe(concat('elpong-x.ts'))
    // .pipe(rename())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:umd', function() {
  return gulp.src('built/**/*.js')
    .pipe(umd({
      exports: function() {
        return 'Elpong';
      },
      namespace: function() {
        return 'Elpong';
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:uglify', function() {
  return gulp.src('dist/elpong.js')
    .pipe(uglify({
      compress: {
        global_defs: {
            DEBUG: false
        }
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('test:build:schemes', function() {
  return gulp.src('./test/fixtures/*/scheme.cson')
    .pipe(cson())
    .pipe(gulp.dest('./test/fixtures'));
});

gulp.task('lint', function() {
  return gulp.src('./src/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter('coffeelint-stylish'));
});

gulp.task('test', ['test:karma']);

gulp.task('test:build', ['test:build:schemes', 'build']);

testWithFramework = function(framework, done) {
  process.env.FRAMEWORK = framework;
  console.log('Testing ' + framework);
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS']
  }, done).start();
}

gulp.task('test:karma', ['test:build'], function(done) {
  return testWithFramework('angular', done);
});

gulp.task('test:saucelabs', ['test:build'], function(done) {
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('test:travis', ['test:frameworks', 'test:saucelabs']);

gulp.task('test:frameworks', ['test:build'], function(done){
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

gulp.task('debug-test', ['test:build'], function(done) {
  gulp.watch('src/**/*', ['test:build']);
  gulp.watch('test/**/*', ['test:build']);
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    autoWatch: true,
    browsers: ['Chrome']
  }, done).start();
});
