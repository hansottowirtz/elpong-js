const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const size = require('gulp-size');
const webpack = require('webpack-stream');
const karma = require('karma').Server;

gulp.task('build:webpack', () => {
  return gulp.src('src/main.ts')
    .pipe(webpack(require('./webpack.config.js'), require('webpack')))
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

gulp.task('build', gulp.series('build:webpack', 'build:uglify'));

gulp.task('lint', () => {
  return gulp.src('./src/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter('coffeelint-stylish'));
});

testWithFramework = (framework, done) => {
  process.env.FRAMEWORK = framework;
  console.log('Testing ' + framework);
  new karma({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS']
  }, done).start();
}

gulp.task('test:karma', (done) => {
  return testWithFramework(process.env.FRAMEWORK || 'fetch', done);
});

gulp.task('test', gulp.series('test:karma'));

gulp.task('default', gulp.series('test'));

gulp.task('test:saucelabs', (done) => {
  process.env.FRAMEWORK = 'fetch'
  new karma({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('test:frameworks', (done) => {
  let frameworks = ['angular', 'jquery', 'fetch'];
  let i = 0;
  let partlyDone = function(exitcode){
    if (exitcode) {
      process.exit(exitcode);
    }
    if (++i === frameworks.length) {
      done();
      return;
    }
    testWithFramework(frameworks[i], partlyDone);
  };
  testWithFramework(frameworks[0], partlyDone);
});

gulp.task('test:karma:debug', (done) => {
  process.env.FRAMEWORK = process.env.FRAMEWORK || 'fetch'
  new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    autoWatch: true,
    browsers: ['Chrome']
  }, done).start();
});

gulp.task('test:travis', gulp.parallel('test:frameworks', 'test:saucelabs'));
