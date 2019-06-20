var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		pug			  = require('gulp-pug'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles:dev', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});
gulp.task('styles:build', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(gulp.dest('dist/css'))
});
gulp.task('styles:build-min', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('dist-min/css'))
	.pipe(browserSync.stream())
});


gulp.task('scripts:build', function() {
	return gulp.src('app/js/**/*.js')
	// .pipe(concat('scripts.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('dist/js'))
});
gulp.task('scripts:build-min', function() {
	return gulp.src('app/js/**/*.js')
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('dist-min/js'))
});


gulp.task('html:dev', function(){
    return gulp.src('app/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream: true}))
});
gulp.task('html:build', function(){
    return gulp.src('app/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'))
});
gulp.task('html:build-min', function(){
    return gulp.src('app/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('dist-min'))
});


gulp.task('img:build', function(){
    return gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist/img'))
});
gulp.task('img:build-min', function(){
    return gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('dist/img'))
});


// gulp.task('rsync', function() {
// 	return gulp.src('app/**')
// 	.pipe(rsync({
// 		root: 'app/',
// 		hostname: 'username@yousite.com',
// 		destination: 'yousite/public_html/',
// 		// include: ['*.htaccess'], // Includes files to deploy
// 		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });




gulp.task('watch', function() {
	gulp.watch('app/**/*.sass', gulp.parallel('styles:dev'));
	gulp.watch(['app/js/**/*.js'], browserSync.reload({ stream: true }));
	gulp.watch('app/*.pug', gulp.parallel('html:dev'))
});
gulp.task('default', gulp.parallel('styles:dev', 'html:dev', 'browser-sync', 'watch'));

gulp.task('build', gulp.parallel('styles:build', 'scripts:build', 'html:build', 'img:build'));
gulp.task('build-min', gulp.parallel('styles:build-min', 'scripts:build-min', 'html:build-min', 'img:build-min'));


