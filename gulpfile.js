'use strict';

var gulp = require('gulp');
var es = require('event-stream');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var gulpDeclare = require('gulp-declare');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

var prod = true;

gulp.task('clean', function() {
  return del.sync(['./dist/**', 'rev-manifest.json']);
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
    .on('error', log);
}

/**
 * Build a distribution
 */
gulp.task('minify:js', ['clean'], function() {
  return es.merge(
      gulp.src([
        './lib/backbone-migrate.js',
        './lib/swagger-oauth.js',
        './lib/copyToClipboard.js',
        './src/main/javascript/**/*.js',
        './node_modules/swagger-client/browser/swagger-client.js',
      ]),
      templates()
    )
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('swagger-ui.min.js'))
    .pipe(gulpif(prod, uglify({mangle: false, compress: false})))
    .pipe(sourcemaps.write('.'))
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest({
      base: 'dist',
      merge: true
    }))
    .pipe(gulp.dest('./dist'));
});

/**
 * Copy lib and html folders
 */
gulp.task('copy', ['clean'], function() {
  gulp.src([
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/jquery-migrate/dist/jquery-migrate.min.js',
      './node_modules/bootstrap/dist/js/bootstrap.min.js',
      './lib/jquery.slideto.min.js',
      './lib/jquery.wiggle.min.js',
      './lib/jquery.ba-bbq.min.js',
      './node_modules/handlebars/dist/handlebars.min.js',
      './node_modules/underscore/underscore-min.js',
      './node_modules/backbone/backbone-min.js',
      // './lib/highlight.9.9.0.pack.js',
      './lib/highlight.7.3.pack.js',
      // './lib/highlight.min.js',
      './node_modules/marked/marked.min.js',
      './node_modules/clipboard/dist/clipboard.min.js',
    ])
    .pipe(concat('lib.js'))
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest({
      base: 'dist',
      merge: true
    }))
    .pipe(gulp.dest('./dist'));

  gulp.src([
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
      './src/main/html/css/budicon.fixed.css',
      './src/main/html/css/atelier-seaside-dark.css'
    ])
    .pipe(concat('lib.css'))
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest({
      base: 'dist',
      merge: true
    }))
    .pipe(gulp.dest('./dist'));

  gulp.src([
    './src/main/html/*.html',
    './src/main/html/*.json',
    './src/main/html/images/**'
  ], {
    'base' : './src/main/html'
  })
    .pipe(gulp.dest('./dist'));
});

/**
 * Concatenate and minify all CSS in the proper order
 */
gulp.task('minify:css', ['clean'], function() {
  return gulp
    .src([
      // './src/main/html/css/reset.css',  // api-explorer.css supplants reset.css
      // './src/main/html/css/print.css',  // api-explorer.css supplants print.css
      // './src/main/html/css/screen.css', // api-explorer.css supplants screen.css
      './src/main/html/css/index.css',
      './src/main/html/css/standalone.css',
      './src/main/html/css/api-explorer.css'
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('min.css'))
    .pipe(gulpif(prod, cleanCSS()))
    .pipe(sourcemaps.write('.'))
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest({
      base: 'dist',
      merge: true
    }))
    .pipe(gulp.dest('./dist'))
    .on('error', log);
});

gulp.task('revReplace', ['clean', 'copy', 'minify:js', 'minify:css'], function(){
  var manifest = gulp.src('rev-manifest.json');
  return gulp.src(['./dist/*'])
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
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
  prod = true;
  connect.server({
    root: 'dist',
    livereload: true
  });
});

function log(error) {
  console.error(error.toString && error.toString());
}


gulp.task('default', ['copy', 'minify:js', 'minify:css', 'revReplace']);
gulp.task('serve', ['connect', 'watch', 'default']);
