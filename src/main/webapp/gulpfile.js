'use strict';

var config = {
     sassPath: '../resources/sass',
     bowerDir: './libs' 
}
var gulp = require('gulp'),     
    sass = require('gulp-ruby-sass') ,
    notify = require("gulp-notify") ,
   	bower = require('gulp-bower'),
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
	sourcemaps = require('gulp-sourcemaps'), 
	jslint = require('gulp-jslint');
   
 
// build the main source into the min file 
gulp.task('jslint', function () {
    return gulp.src([
  'js/TravelPlannerApp/app.js',
  'js/TravelPlannerApp/config.js',
  'js/TravelPlannerApp/filters.js',
  'js/TravelPlannerApp/directives.js',
  'js/TravelPlannerApp/**/*module*.js',
  'js/TravelPlannerApp/**/*controller*.js',
  'js/TravelPlannerApp/**/*service*.js'])
 
        // pass your directives 
        // as an object 
        .pipe(jslint({
            // these directives can 
            // be found in the official 
            // JSLint documentation. 
            node: false,
            evil: false,
            nomen: false,
            browser:true,
            white:true,
 
            // you can also set global 
            // declarations for all source 
            // files like so: 
            global: [],
            predef: ['angular'],
            // both ways will achieve the 
            // same result; predef will be 
            // given priority because it is 
            // promoted by JSLint 
 
            // pass in your prefered 
            // reporter like so: 
            reporter: 'default',
            // ^ there's no need to tell gulp-jslint 
            // to use the default reporter. If there is 
            // no reporter specified, gulp-jslint will use 
            // its own. 
 
            // specify whether or not 
            // to show 'PASS' messages 
            // for built-in reporter 
            errorsOnly: true
        }))
 
        // error handling: 
        // to handle on error, simply 
        // bind yourself to the error event 
        // of the stream, and use the only 
        // argument as the error object 
        // (error instanceof Error) 
        .on('error', function (error) {
            console.error(String(error));
        });
});
   
gulp.task('css', function() {

    return gulp.src(config.sassPath + '/style.scss')

        .pipe(sass({

            style: 'compressed',

            loadPath: [

                './resources/sass',

                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',

                config.bowerDir + '/fontawesome/scss',

            ]

        })

            .on("error", notify.onError(function (error) {

                return "Error: " + error.message;

            })))


        .pipe(gulp.dest('./css'));

});
gulp.task('watch', function() {
	gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
}); 
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});

gulp.task('minify', ['javascript'] , function() {
	return gulp.src('js/TravelPlannerApp.js')
        .pipe(ngAnnotate())
        .pipe(gulp.dest('js/dist'));
});
gulp.task('javascript', function() {
  return gulp.src([
  'js/TravelPlannerApp/app.js',
  'js/TravelPlannerApp/config.js',
  'js/TravelPlannerApp/filters.js',
  'js/TravelPlannerApp/directives.js',
  'js/TravelPlannerApp/**/*module*.js',
  'js/TravelPlannerApp/**/*controller*.js',
  'js/TravelPlannerApp/**/*service*.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('TravelPlannerApp.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('js'));
});

gulp.task('default', ['bower','javascript']);