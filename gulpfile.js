//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');


// //Порядок подключения css файлов

const cssFiles = [
   './src/css/main.less',
   './src/css/media.less'
]
//Порядок подключения js файлов
const jsFiles  = [
   './src/js/lib.js',
   './src/js/main.js'
]

//Таск на стили CSS
gulp.task('styles', () => {
   //Шаблон для поиска файлов CSS
   //Всей файлы по шаблону './src/css/**/*.css'
   return gulp.src(cssFiles)
   .pipe(sourcemaps.init())
   .pipe(less())
   //Объединение файлов в один
   .pipe(concat('style.css'))
   //Добавить префиксы
   .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
   }))
   //Минификация CSS
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write('./'))
   //Выходная папка для стилей
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
});

//Таск на скрипты JS
gulp.task('scripts', () => {
   //Шаблон для поиска файлов JS
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src(jsFiles)
   //Объединение файлов в один
   .pipe(concat('script.js'))
   //Минификация JS
   .pipe(uglify({
      toplevel: true
   }))
   //Выходная папка для скриптов
   .pipe(gulp.dest('./build/js'))
   .pipe(browserSync.stream());
});

//Таск для очистки папки build
gulp.task('del', () => {
   return del(['build/*'])
});

// Таск для image
gulp.task('img-compress', () => {
   return gulp.src('./src/img/**')
   .pipe(imagemin({
      progressive: true
   }))
   .pipe(gulp.dest('./build/img/'))
});

//Таск для отслеживания изменений в файлах
gulp.task('watch', () => {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });

   gulp.watch('./src/img/**', gulp.series('img-compress'))
  //Следить за файлами со стилями с нужным расширением
  gulp.watch('./src/css/**/*.less', gulp.series
  ('styles'))
  //Следить за JS файлами
  gulp.watch('./src/js/**/*.js', gulp.series
  ('scripts'))
  //При изменении HTML запустить синхронизацию
  gulp.watch("./*.html").on('change', browserSync.reload);
});

//Таск по умолчанию, Запускает del , less, scripts и watch
gulp.task('default', gulp.series('del', gulp.parallel
('styles', 'scripts', 'img-compress'), 'watch'));