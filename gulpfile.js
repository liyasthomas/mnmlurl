let gulp = require('gulp')
let browserify = require('browserify')
let htmlmin = require('gulp-htmlmin')
let postcss = require('gulp-postcss')
let cssnano = require('cssnano')
let uglify = require('gulp-uglify')
let babel = require('gulp-babel')
let del = require('del')
let zip = require('gulp-zip')
let source = require('vinyl-source-stream')
const compress = () => {
	return gulp
		.src('output/*')
		.pipe(zip('package.zip'))
		.pipe(gulp.dest('output'))
}
const pre_js = () => {
	return gulp
		.src(['src/index.js', 'src/head.js'])
		.pipe(babel({
			plugins: ['@babel/transform-runtime'],
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('comp'))
}
const m_html = () => {
	return gulp
		.src(['src/index.html', 'src/404.html'])
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('output'))
}
const m_css = () => {
	const plugins = [
cssnano()
]
	return gulp
		.src('src/index.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('output'))
}
const m_js = () => {
	return gulp
		.src(['comp/index.js', 'comp/head.js'])
		.pipe(uglify({
			compress: {
				unused: false
			}
		}))
		.pipe(gulp.dest('output'))
}
const copy_extras = () => {
	return gulp
		.src(['src/manifest.json', 'src/favicon.ico', 'src/icons/*', 'src/sw.js'], {
			base: 'src'
		})
		.pipe(gulp.dest('output'))
}
const clean = () => {
	return del(['./comp'])
}
const bundle = () => {
	return browserify('output/index.js')
		.bundle()
		.pipe(source('index.js'))
		.pipe(gulp.dest('output'))
}
gulp.task('html', m_html)
gulp.task('css', m_css)
gulp.task('js', m_js)
gulp.task('pre_js', pre_js)
gulp.task('clean', clean)
gulp.task('copy_extras', copy_extras)
gulp.task('compress', compress)
gulp.task('bundle', bundle)
gulp.task(
	'build',
	gulp.series('html', 'css', 'pre_js', 'js', 'bundle', 'copy_extras', 'clean')
)
gulp.task(
	'packit',
	gulp.series('build', 'compress')
)
