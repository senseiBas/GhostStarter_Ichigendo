const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

function buildStyles() {
  return src('assets/css/screen.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(purgecss({
      content: ['**/*.hbs'], // Exclude the file to be safelisted
    }))
    .on('error', (err) => {
      console.error('Error in purgecss task', err.toString());
    })
    .pipe(dest('assets/built'))
}

function buildScripts() {
  return src('assets/js/index.js')
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(dest('assets/built'));
}

// here we watch an array of files
function watchTask() {
  watch(['assets/css/**/*.scss', '**/*.hbs'], buildStyles);
  watch('assets/js/**/*.js', buildScripts);
}

exports.default = series(buildStyles, buildScripts, watchTask);