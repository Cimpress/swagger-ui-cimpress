'use strict';

var gulp = require('gulp');
var es = require('event-stream');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var header = require('gulp-header');
var pkg = require('./package.json');
var order = require('gulp-order');
var nano = require('gulp-cssnano');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

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
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Handlebars.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
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
    .pipe(order(['scripts.js', 'templates.js']))
    .pipe(concat('swagger-ui.js'))
    .pipe(wrap('(function(){<%= contents %>}).call(this);'))
    .pipe(header(banner, { pkg: pkg } ))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .on('error', log)
    .pipe(rename({extname: '.min.js'}))
    .on('error', log)
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

/**
 * Processes less files into CSS files
 */
gulp.task('less', ['clean'], function() {

  return gulp
    .src([
      './src/main/less/screen.less', // screen.less includes highlight_default.less, specs.less, and auth.less
      './src/main/less/print.less',
      './src/main/less/reset.less'
    ])
    .pipe(less())
    .on('error', log)
    .pipe(gulp.dest('./src/main/html/css/'))
    .pipe(connect.reload());
});


/**
 * Copy lib and html folders
 */
gulp.task('copy', function() {

  // copy JavaScript files inside lib folder
  gulp
    .src(['./lib/**/*.{js,map}'])
    .pipe(gulp.dest('./dist/lib'))
    .on('error', log);

  // copy all files inside html folder
  gulp
    .src(['./src/main/html/**/*'])
    .pipe(gulp.dest('./dist'))
    .on('error', log);
});

/**
 * Concatenate and minify all CSS in the proper order
 */
gulp.task('minify:css', function() {
  return gulp
    .src([
      // './src/main/html/css/reset.css',  // api-explorer.css supplants reset.css
      // './src/main/html/css/print.css',  // api-explorer.css supplants print.css
      // './src/main/html/css/screen.css', // api-explorer.css supplants screen.css
      './src/main/html/css/index.css',
      './src/main/html/css/standalone.css',
      './src/main/html/css/api-explorer.css'
    ])
    .pipe(concat('min.css'))
    .pipe(nano())
    .pipe(gulp.dest('./dist'))
    .on('error', log);
});

/**
 * Concatenate and minify all JS in the proper order
 */
gulp.task('minify:js', ['dist'], function() {
  return gulp
    .src([
      './lib/jquery.slideto.min.js',
      './lib/jquery.wiggle.min.js',
      './lib/jquery.ba-bbq.min.js',
      './lib/handlebars-2.0.0.js',
      './lib/underscore-min.js',
      './lib/backbone-min.js',
      './lib/highlight.7.3.pack.js',
      './lib/marked.js',
      './lib/swagger-oauth.js',
      './lib/bootstrap.min.js',
      './lib/clipboard.min.js',
      './lib/copyToClipboard.js',
    ])
    .pipe(concat('min.js'))
    .pipe(uglify())
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
