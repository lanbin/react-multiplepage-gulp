var

	gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	browserSync = require('browser-sync'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	del = require('del'),

	JSXPath = 'app/scripts',
	JSXFile = JSXPath + '/app.js',

	STYLEPath = 'app/style',
	STYLEFile = STYLEPath + '/**/*.less',

	HTMLFile = 'app/**/*.html',

	IMAGEFile = 'app/images/**/*',

	destFileName = 'app.js',

	DISTPath = 'dist'


//style files
gulp.task('styles', function() {

	return gulp.src(STYLEFile)
		.pipe($.less())
		.pipe(gulp.dest(DISTPath + '/style'))
		.pipe(browserSync.stream())
})

//html files
gulp.task('html', function() {
	return gulp.src(HTMLFile)
		.pipe($.useref())
		.pipe(gulp.dest(DISTPath))
		.pipe($.size())
})

gulp.task('del', function() {

	$.del([DISTPath])
})


gulp.task('watch', ['html', 'styles'], function() {

    browserSync({
        notify: true,
        logPrefix: 'react',
        server: ['dist']
    });

    gulp.watch([HTMLFile, IMAGEFile])
    	.on('change', browserSync.reload)

    // Watch .html files
    gulp.watch(HTMLFile, ['html'])

    gulp.watch([STYLEFile], ['styles']);

    // Watch image files
    gulp.watch('app/images/**/*');
});