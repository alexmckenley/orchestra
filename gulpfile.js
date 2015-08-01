// Dependencies
var concat         = require('gulp-concat'),
    del            = require('del'),
    gulp           = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    runSequence    = require('run-sequence'),
    sass           = require('gulp-sass'),
    templateCache  = require('gulp-angular-templatecache');

// Paths
var paths = {
    dist  : 'dist',
    html   : ['app/javascript/**/*.html'],
    index  : ['app/index.html'],
    scripts: ['app/javascript/**/*.js'],
    styles : ['app/sass/**/*.scss']
};

/**
 * Concat scripts and move to dist dir.
 */
gulp.task('scripts', function() {
    return gulp
        .src(paths.scripts)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.dist + '/js'));
});

/**
 * Concat vendor scripts and move to dist dir.
 */
gulp.task('vendor-scripts', function() {
    return gulp
        .src(mainBowerFiles('**/*.js'), { base: 'bower_components' })
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.dist + '/js'));
});

/**
 * Concat vendor css and move to dist dir.
 */
gulp.task('vendor-styles', function() {
    return gulp
        .src(mainBowerFiles('**/*.css'), { base: 'bower_components' })
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(paths.dist + '/css'));
});

/**
 * Compile + concat css and move to dist dir.
 */
gulp.task('styles', function() {
    return gulp
        .src(paths.styles)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist + '/css'));
});

/**
 * Move index file to the dist dir.
 */
gulp.task('index', function() {
    return gulp
        .src(paths.index)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('html', function() {
    return gulp
        .src(paths.html)
        .pipe(templateCache('templates.js', {
            standalone: true,
            module: 'orchestra.templates'
        }))
        .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('clean', function(done) {
    return del([paths.dist], done);
});

/**
 * Build entire app.
 */
gulp.task('dist', function(done) {
    runSequence(
        'clean',
        ['vendor-scripts', 'vendor-styles', 'scripts', 'styles', 'index', 'html'],
        done
    );
});

/**
 * File watcher.
 */
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.styles, ['styles']);
});

/**
 * Default task.
 */
gulp.task('default', ['watch', 'dist']);