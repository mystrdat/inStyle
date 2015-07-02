var gulp = require('gulp');
var stylus = require('gulp-stylus');
var rename = require("gulp-rename");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var consolidate = require("gulp-consolidate");
var minifyCss = require('gulp-minify-css');
var iconfont = require('gulp-iconfont');
var lodash = require('lodash');

var fontName = 'icons';
var fontPath = 'assets/font/'

gulp.task('build-iconfont', function () {
  gulp.src(['./src/components/icons/*.svg'])
    .pipe(iconfont({
      fontName: fontName,
      fontHeight: 1001,
      normalize: true,
      appendUnicode: true,
      descent: 200
    }))
      .on('glyphs', function(glyphs, options) {
        gulp.src('./src/components/icons/template.styl')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: fontName,
            fontPath: fontPath
          }))
          .pipe(rename('icons.styl'))
          .pipe(gulp.dest('./src/components/'));
    })
  .pipe(gulp.dest('./build/' + fontPath));
});

gulp.task('build-styles', function () {
  gulp.src('./src/main.styl')
    .pipe(stylus({
      compress: true,
      'include css': true
    }))
    .pipe(rename('chilli.css'))
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch-styles', function() {
  gulp.watch('./src/**/*.styl', ['build-styles']);
});

gulp.task('watch-iconfont', function() {
  gulp.watch('.src/components/icons/*.*', ['build-iconfont']);
});

gulp.task('default', ['build-iconfont', 'watch-iconfont', 'build-styles', 'watch-styles']);
