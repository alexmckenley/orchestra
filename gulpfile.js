// Dependencies
var concat         = require('gulp-concat'),
    connect        = require('gulp-connect'),
    del            = require('del'),
    gulp           = require('gulp'),
    rename         = require('gulp-rename'),
    mainBowerFiles = require('main-bower-files'),
    runSequence    = require('run-sequence'),
    sass           = require('gulp-sass'),
    templateCache  = require('gulp-angular-templatecache');

// Paths
var paths = {
    dist    : 'dist',
    html    : ['app/javascript/**/*.html'],
    index   : ['app/index.html', 'CNAME'],
    scripts : ['app/javascript/**/*.js'],
    styles  : ['app/sass/**/*.scss']
};

/**
 * Concat scripts and move to dist dir.
 */
gulp.task('scripts', function() {
    return gulp
        .src(paths.scripts)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.dist + '/js'))
        .pipe(connect.reload());
});

/**
 * Concat vendor scripts and move to dist dir.
 */
gulp.task('vendor-scripts', function() {
    return gulp
        .src(mainBowerFiles('**/*.js'), { base: 'bower_components' })
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.dist + '/js'))
        .pipe(connect.reload());
});

/**
 * Concat vendor css and move to dist dir.
 */
gulp.task('vendor-styles', function() {
    return gulp
        .src(mainBowerFiles('**/*.css'), { base: 'bower_components' })
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(paths.dist + '/css'))
        .pipe(connect.reload());
});

/**
 * Compile + concat css and move to dist dir.
 */
gulp.task('styles', function() {
    return gulp
        .src(paths.styles)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist + '/css'))
        .pipe(connect.reload());
});

/**
 * Setup Web Server
 */
gulp.task('connect', function() {
    return connect.server({
        root: paths.dist,
        livereload: true,
        port: 8888,
        fallback: paths.index[0]
    });
});

/**
 * Move index file to the dist dir.
 */
gulp.task('index', function() {
    return gulp
        .src(paths.index[0])
        .pipe(rename('404.html'))   // Github-pages compatibility hack
        .pipe(gulp.dest(paths.dist));
});

gulp.task('cname', function() {
    return gulp
        .src(paths.index[1])
        .pipe(gulp.dest(paths.dist));
});

gulp.task('html', function() {
    return gulp
        .src(paths.html)
        .pipe(templateCache('templates.js', {
            standalone: true,
            module: 'orchestra.templates'
        }))
        .pipe(gulp.dest(paths.dist + '/js'))
        .pipe(connect.reload());
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
        ['vendor-scripts', 'vendor-styles', 'scripts', 'styles', 'index', 'cname', 'html'],
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
gulp.task('default', ['watch', 'dist', 'connect']);
