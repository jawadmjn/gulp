var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
var runSequence = require('run-sequence');

var paths = {
    scripts: ['src/js/ext/*', 'src/js/lib/*'],
    css: 'src/css/styles.css',
    index: ['src/index.php', 'src/curlCall.php'],
    images: 'src/images/**/*'
};

gulp.task('compress', function () {
    return gulp.src(paths.scripts)
            .pipe(uglify())
            .pipe(sourcemaps.init())
            .pipe(concat('all.min.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('www/js'));
});

// Copy all static images
gulp.task('images', function () {
    return gulp.src(paths.images)
            // Pass in options to the task
            .pipe(imagemin({optimizationLevel: 5}))
            .pipe(gulp.dest('www/images'));
});

gulp.task('minify-css', function () {
    return gulp.src(paths.css)
            .pipe(sourcemaps.init())
            .pipe(cleanCss())
            .pipe(concat('all.min.css'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('www/css'));
});

gulp.task('copy-files', function () {
    gulp.src(paths.index).pipe(gulp.dest('www'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(paths.index, ['copy-files']);
    gulp.watch(paths.scripts, ['compress']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.css, ['minify-css']);
});

var tasks = [
    'copy-files',
    'compress',
    'images',
    'minify-css'
];

gulp.task('once', function(callback) {
    runSequence(tasks, function(error) {
        if (error) {
            console.log(error.message);
        } else {
            console.log('BUILD FINISHED SUCCESSFULLY.');
            console.log('GULP is watching your changes, to terminate Watching press Ctrl + C');
        }
        callback(error);
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['once', 'watch']);