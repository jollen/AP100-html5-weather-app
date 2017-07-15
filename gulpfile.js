'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserify = require('gulp-browserify');

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('src/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
});

gulp.task('apps', function() {
    gulp.src('src/index.js')
        .pipe(browserify({
          insertGlobals : false
        }))
        .pipe(gulp.dest('dist'))
});

// Build Android apk
var android = require('gulp-cordova-build-android');
 
gulp.task('android', function() {
    return gulp.src('myApp')
        .pipe(android())
        .pipe(gulp.dest('dist'));        
});

// Optimize Images
gulp.task('images', function () {
    return gulp.src('images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images'}));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(['src/*'], ['apps']);
});

// Build Production Files
gulp.task('build', function (cb) {
    runSequence('apps', ['images'], cb);
});

// Default Task
gulp.task('default', [], function (cb) {
    gulp.start('build', cb);
});

// BrowserSync: Live Reload, UI Sync, Remote Debug, and etc.
var browserSync = require("browser-sync");

gulp.task('browser', function (cb) {
    browserSync.init(null, {
        server: {
            baseDir: ['dist']
        },                                                                                      
        notify: false
    });
    gulp.watch([
        'dist/**/*.html',
        'dist/**/*.js',
        'dist/**/*.css'
    ], browserSync.reload);
});
