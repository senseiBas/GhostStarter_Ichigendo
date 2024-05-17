const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss');

function buildStyles() {
  return src('assets/css/screen.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(purgecss({
      content: ['**/*.hbs'],
      safelist: {
        standard: [
            'kg-width-wide',
            'kg-width-full'
        ]
    }
    }))
    .on('error', (err) => {
      console.error('Error in purgecss task', err.toString());
    })
    .pipe(dest('assets/built'))
}

// here we watch an array of files
function watchTask() {
  return watch(['assets/css/**/*.scss', '**/*.hbs'], buildStyles);
}

exports.default = series(buildStyles, watchTask);