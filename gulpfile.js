/**
 * Created by Vicfeel on 2016/6/12.
 */

var gulp = require('gulp'),
    cssmin = require('gulp-minify-css');


gulp.task('css', function () {
    gulp.src('./src/css/*.css')
        .pipe(cssmin({}))
        .pipe(gulp.dest('./dist/css/'));
});


gulp.task('default', ['css']);
