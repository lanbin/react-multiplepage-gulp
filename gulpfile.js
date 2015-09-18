var
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	source = require('vinyl-source-stream'),
	react = require('gulp-react'),
	del = require('del'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	reactify = require('reactify'),
	$ = require('gulp-load-plugins')(),

	browserSync = require('browser-sync'),
	reload = browserSync.reload,

	less = require('gulp-less'),

	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),

	JSXPath = 'app/scripts',
	JSXFile = JSXPath + '/app.js',


	STYLEPath = 'app/style',
	STYLEFile = STYLEPath + '/**/*.less',

	HTMLFile = 'app/**/*.html',

	destFileName = 'app.js',

	DISTPath = 'dist'

var bundler = watchify(browserify({
	entries: [JSXFile],
	debug: true,
	insertGlobals: true,
	cache: {},
	packageCache: {},
	transform: ['reactify'],
	fullPaths: true
}))

bundler.on('update', rebundle)
bundler.on('log', $.util.log)

function rebundle() {
	return bundler.bundle()
		.on('error', $.util.log.bind($.util, 'Browserify Error'))
		.pipe(source(destFileName))
		.pipe(gulp.dest(DISTPath))
		.on('end', function() {
			reload()
		})
}

// Scripts
gulp.task('scripts', rebundle)

gulp.task('buildScripts', function() {
    return browserify(JSXFile)
        .bundle()
        .pipe(source(DISTPath))
        .pipe(gulp.dest(DISTPath + '/scripts'))
})

//HTML
gulp.task('html', function() {
    return gulp.src(HTMLFile)
        .pipe($.useref())
        .pipe(gulp.dest(DISTPath))
        .pipe($.size())
})


gulp.task('bundle', ['styles', 'scripts'], function() {
    return gulp.src(HTMLFile)
        .pipe($.useref.assets())
        .pipe($.useref())
        .pipe(gulp.dest(DISTPath));
});

gulp.task('buildBundle', ['styles', 'buildScripts'], function() {
    return gulp.src(HTMLFile)
        .pipe($.useref.assets())
        .pipe($.useref())
        .pipe(gulp.dest(DISTPath));
});


gulp.task('del', function() {

	del([DISTPath])
})

gulp.task('lint', function() {

	return gulp.src(JSXFile)
		.pipe(jshint({
			linter: require('jshint-jsx').JSXHINT
		}))
		.pipe(jshint.reporter(stylish));
})

gulp.task('styles', function() {

	return gulp.src(STYLEFile)
		.pipe(less())
		.pipe(gulp.dest(DISTPath + '/style'))
})

gulp.task('react', ['del'], function() {

	return gulp.src(JSXFile)
		.pipe(sourcemaps.init())
		.pipe(react())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(DISTPath + '/scripts'))
})



gulp.task('watch', ['html', 'bundle'], function() {

    browserSync({
        notify: true,
        logPrefix: 'BS',
        server: ['dist', 'app']
    });

    // Watch .json files
    gulp.watch(JSXFile, ['scripts']);

    // Watch .html files
    gulp.watch(HTMLFile, ['html']);

    gulp.watch([STYLEFile], ['styles', reload]);

    // Watch image files
    gulp.watch('app/images/**/*', reload);
});
