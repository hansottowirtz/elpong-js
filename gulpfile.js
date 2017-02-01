const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const size = require('gulp-size');
const webpack = require('webpack-stream');
const karmaServer = require('karma').Server;

// var files = ['./src/index.coffee', './src/scheme.coffee', './src/element.coffee', './src/collection.coffee', , './src/polyfills.coffee', './src/util.coffee', './src/*/*.coffee', './src/*/*/**/*.coffee']
// var files = ['./src/index.ts', './src/scheme.ts', './src/element.ts', './src/collection.ts', , './src/polyfills.ts', './src/util.ts', './src/*/*.ts', './src/*/*/**/*.ts']
const files = ['./src/index.js', './src/scheme.js', './src/element.js', './src/collection.js', , './src/polyfills.js', './src/util.js', './src/*/*.js', './src/*/*/**/*.js']

gulp.task('default', ['test']);

gulp.task('build', ['build:webpack', 'build:uglify']);

gulp.task('build:webpack', () => {
  return gulp.src('src/main.ts')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:uglify', () => {
  return gulp.src('dist/elpong.js')
    .pipe(uglify({
      compress: {
        global_defs: {
            DEBUG: false
        }
      }
    }))
    .pipe(rename('elpong.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('lint', () => {
  return gulp.src('./src/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter('coffeelint-stylish'));
});

gulp.task('test', ['test:karma']);

gulp.task('test:build', ['build']);

testWithFramework = (framework, done) => {
  process.env.FRAMEWORK = framework;
  console.log('Testing ' + framework);
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS']
  }, done).start();
}

gulp.task('test:karma', ['test:build'], (done) => {
  return testWithFramework(process.env.FRAMEWORK || 'fetch', done);
});

gulp.task('test:saucelabs', ['test:build'], (done) => {
  process.env.FRAMEWORK = 'fetch'
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('test:travis', ['test:frameworks', 'test:saucelabs']);

gulp.task('test:frameworks', ['test:build'], (done) => {
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

gulp.task('test:karma:debug', ['test:build'], (done) => {
  gulp.watch('src/**/*', ['build']);
  gulp.watch('test/**/*', ['build']);
  return new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    autoWatch: true,
    browsers: ['Chrome']
  }, done).start();
});
