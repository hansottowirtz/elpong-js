const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const tslint = require('gulp-tslint');
const webpack = require('webpack-stream');
const karma = require('karma').Server;
const fs = require('fs');
const ts = require('gulp-typescript');
const path = require('path');
const replace = require('replace-in-file');

gulp.task('build:webpack', () => {
  return gulp.src('src/main.ts')
    .pipe(webpack(require('./webpack.config.js'), require('webpack')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:uglify', () => {
  return gulp.src('dist/elpong.js')
    .pipe(uglify())
    .pipe(rename('elpong.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build:tsc', () => {
  const tsProject = ts.createProject('tsconfig.json');
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('built'));
});

gulp.task('build:dts', (done) => {
  require('dts-generator').default({
		name: 'elpong',
		project: '.',
		out: './dist/elpong.d.ts',
    eol: '\n'
  }).then(() => replace({
    files: ['./dist/elpong.d.ts'],
    from: "declare module 'elpong/main'",
    to: "declare module 'elpong'" 
  })).then(() => done());
});

gulp.task('build', gulp.series('build:webpack', 'build:uglify', 'build:tsc', 'build:dts'));
gulp.task('build:ts', gulp.series('build:tsc'));

gulp.task('lint', () => {
  return gulp.src('src/**/*.ts')
    .pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report());
});

testWithFramework = (framework, done) => {
  process.env.FRAMEWORK = framework;
  console.log('Testing ' + framework);
  new karma({
    configFile: path.join(__dirname, 'karma.conf.js'),
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
    configFile: path.join(__dirname, 'karma.conf.js')
  }, done).start();
});

gulp.task('test:frameworks', (done) => {
  let frameworks = ['angularjs', 'jquery', 'fetch'];
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
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: false,
    autoWatch: true,
    browsers: ['Chrome']
  }, done).start();
});

gulp.task('test:examples:node', (done) => {
  require('./examples/node-app');
  done();
});

gulp.task('test:examples', gulp.parallel('test:examples:node'));

gulp.task('test:travis', gulp.parallel('test:frameworks', 'test:saucelabs', 'test:examples'));

gulp.task('ensure-built', (done) => {
  let dir_files = (dir) => fs.readdirSync(dir).map((f) => path.join(dir, f));

  let dist_files = dir_files('./dist').filter(f => !f.endsWith('.d.ts'));
  let src_files = dir_files('./src');

  let mtimes = (f) => fs.statSync(f).mtime;

  let dist_mtime = Math.min.apply(null, dist_files.map(mtimes));
  let src_mtime = Math.max.apply(null, src_files.map(mtimes));

  console.log(dist_mtime, src_mtime);

  if (dist_mtime < src_mtime - 100) {
    throw new Error('Dist outdated, run `gulp build`');
  }
  done();
});
