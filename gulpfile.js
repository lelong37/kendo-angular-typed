"use strict";

var gulp = require('gulp');
var ts = require('gulp-typescript');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var exec = require('gulp-exec');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {

    var tsResult = tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./"));
});

gulp.task('auto', function () {
    nodemon({
        script: 'app.js',
        ext: 'js html',
        ignore: ["public/app/**", "app.js"],
        env: { 'NODE_ENV': 'development' }
    })
});

gulp.task('start', function () {
    exec("node app.js");
});

gulp.task("reload", function () {
    livereload.changed("/");
});

gulp.task('default', ["compile", "auto"], function () {
    livereload.listen();
    gulp.watch(["./**/*.ts"], ["compile"]);
    gulp.watch(["./**/*.html", "./**/*.js", "./**/*.css"], ["reload"]);
});