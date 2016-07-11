import gulp from 'gulp';
import webpack from 'webpack';
import path from 'path';
import pug from 'gulp-pug';
import stylus from 'gulp-stylus';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import {Server} from 'karma';

gulp.task('copy', ['copy-and-minimise-css'], () => {    
  gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min*', './node_modules/toastr/build/toastr.min.css*'])  
  .pipe(gulp.dest('./Build/Common/css'));
  gulp.src(['Content/favicon.ico', 'Content/robots.txt', 'Content/humans.txt'])
  .pipe(gulp.dest('./Build/Common'));
});

gulp.task('copy-and-minimise-css', () => {
    gulp.src(['Content/css/*.css'])  
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({compatibility: 'ie8'})) 
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./Build/Common/css'));
});

gulp.task('compile-stylus-templates', () => {
    gulp.src(['Content/css/*.styl'])
    .pipe(sourcemaps.init())
    .pipe(stylus({compress: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./Build/Common/css'));
});

gulp.task('build-apps', ['webpack-angular1', 'angular1-compile-pug-templates'], () => {
    
});

gulp.task('angular1-compile-pug-templates', () => {
   return gulp.src('AngularApp/Page/index.pug')
  .pipe(pug({
    pretty: true
  }))
   .pipe(gulp.dest('Build/Angular1'))
});

gulp.task('webpack-angular1', () => {
   
    let entryFile = path.join(__dirname, 'AngularApp', 'app.js');
    let outputPath = path.join(__dirname, 'Build', 'Angular1', 'js');

    webpack({
      devtool: 'inline-source-map',
      entry: [entryFile],
      output: {
        path: outputPath,
        filename: 'app.min.js',
        publicPath: '/__build__/'
      },
      module: {
        loaders: [{
          test: /\.js$/,
          loaders: ['ng-annotate', 'babel-loader?{"presets":["es2015"]}'],
          exclude: /node_modules/
        }, {
            include: /\.pug/,
            loader: 'pug-html-loader'
        }]
      }
    }, (err, stats) => {
        if(!!err) {
            console.log(`err: ${err}`);
        } else {
            console.log(`stats = ${stats}`);
        }
    });
});

gulp.task('code-coverage', function () {
  return gulp.src(['Controllers/**/*.js', 'DataAccess/**/*.js', 'ExpressApp/**/*.js'])
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['code-coverage'], () => {
   
    return gulp.src(['specs/**/*.js', '!specs/stubs/**', '!DataAccess/testDataSeeder.js', '!AngularApp/**'])
    .pipe(mocha({reporter: 'nyan'}))
    .pipe(istanbul.writeReports({
        dir: './coverage',
        reporters: [ 'lcov', 'json', 'text', 'text-summary' ],
        reportOpts: { dir: './coverage' }
  }));
});


gulp.task('angular-test', done => {
      new Server({
            configFile: path.join(__dirname, 'karma.conf.js'),
            singleRun: true
          }, done).start();
});


gulp.task('build', ['copy', 'compile-stylus-templates', 'build-apps'], () => {
  // return gulp.src('./output/index.htm')
  //       .pipe(plug.open(), {app: 'chrome'})
});