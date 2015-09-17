var
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	react = require('gulp-react'),
	del = require('del'),

	less = require('gulp-less'),

	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),

	JSXPath = 'app/scripts',
	JSXFile = JSXPath + '/**/*.js',


	STYLEPath = 'app/style',
	STYLEFile = STYLEPath + '/**/*.less',

	DISTPath = 'dist'


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

gulp.task('less', function() {

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



gulp.task('serve', function() {

})