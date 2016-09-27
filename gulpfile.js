'use strict';

var gulp = require('gulp');
var es = require('event-stream');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
// var less = require('gulp-less');
var gulpif = require('gulp-if');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var gulpDeclare = require('gulp-declare');
var iife = require("gulp-iife");
var watch = require('gulp-watch');
var connect = require('gulp-connect');
// var header = require('gulp-header');
// var pkg = require('./package.json');
// var order = require('gulp-order');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

var prod = true;
/**
 * Clean ups ./dist folder
 */
gulp.task('clean', function() {
  return del.sync(['./dist/**']);
});

/**
 * Processes Handlebars templates
 */
function templates() {
  return gulp
    .src(['./src/main/template/**/*'])
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(gulpDeclare({
      namespace: 'Handlebars.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    // .pipe(concat('swagger-ui-templates.js'))
    // .pipe(gulp.dest('./dist'))
    .on('error', log);
}

/**
 * Build a distribution
 */
gulp.task('dist', ['clean'], function() {

  return es.merge(
      gulp.src([
        './src/main/javascript/**/*.js',
        './node_modules/swagger-client/browser/swagger-client.js'
      ]),
      templates()
    )
    // .pipe(order(['scripts.js', 'templates.js']))
    // .pipe(header(banner, { pkg: pkg } ))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(iife({bindThis: true}))
    .pipe(concat('swagger-ui.min.js'))
    .pipe(gulpif(prod, uglify({mangle: false, compress: false}))).on('error', log)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

/**
 * Processes less files into CSS files
 */
// gulp.task('less', ['clean'], function() {

//   return gulp
//     .src([
//       './src/main/less/screen.less', // screen.less includes highlight_default.less, specs.less, and auth.less
//       './src/main/less/print.less',
//       './src/main/less/reset.less'
//     ])
//     .pipe(less())
//     .on('error', log)
//     .pipe(gulp.dest('./src/main/css/'))
//     .pipe(connect.reload());
// });


/**
 * Copy lib and html folders
 */
gulp.task('copy', ['clean'], function() {

  // copy JavaScript files inside lib folder
  // gulp
  //   .src(['./lib/**/*.{js,map}'])
  //   .pipe(gulp.dest('./dist/lib'))
  //   .on('error', log);

  // copy all files inside html folder
  gulp
    .src(['./src/main/html/**/*'])
    .pipe(gulp.dest('./dist'))
    .on('error', log);
});

/**
 * Concatenate and minify all CSS in the proper order
 */
gulp.task('minify:css', ['clean'], function() {
  return gulp
    .src([
      // './src/main/css/reset.css',  // api-explorer.css supplants reset.css
      // './src/main/css/print.css',  // api-explorer.css supplants print.css
      // './src/main/css/screen.css', // api-explorer.css supplants screen.css
      './src/main/css/index.css',
      './src/main/css/standalone.css',
      './src/main/css/api-explorer.css'
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('min.css'))
    .pipe(gulpif(prod, cleanCSS()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .on('error', log);
});

/**
 * Concatenate and minify all JS in the proper order
 */
gulp.task('minify:js', ['clean'], function() {
  return gulp
    .src([
      './lib/jquery.slideto.min.js',
      './lib/jquery.wiggle.min.js',
      './lib/jquery.ba-bbq.min.js',
      './node_modules/handlebars/dist/handlebars.min.js',
      './node_modules/underscore/underscore-min.js',
      './node_modules/backbone/backbone-min.js',
      './lib/backbone-migrate.js',
      './lib/highlight.7.3.pack.js',
      './node_modules/marked/marked.min.js',
      './lib/swagger-oauth.js',
      './node_modules/clipboard/dist/clipboard.min.js',
      './lib/copyToClipboard.js',
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('min.js'))
    .pipe(gulpif(prod, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .on('error', log);
});

/**
 * Watch for changes and recompile
 */
gulp.task('watch', function() {
  return watch(['./src/**'], function() {
    gulp.start('default');
  });
});

/**
 * Live reload web server of `dist`
 */
gulp.task('connect', function() {
  prod = false;
  connect.server({
    root: 'dist',
    livereload: true
  });
});

function log(error) {
  console.error(error.toString && error.toString());
}


gulp.task('default', ['dist', 'copy', 'minify:js', 'minify:css']);
gulp.task('serve', ['connect', 'watch']);
