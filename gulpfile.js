const { src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function buildStyles() {
    return src('assets/css/screen.scss')
        .pipe(sass())
        .pipe(dest('assets/built'))
}

// here we watch an array of files
function watchTask() {
  watch(['assets/css/**/*.scss'], buildStyles);
}

exports.default = series(
  buildStyles,
  watchTask
);