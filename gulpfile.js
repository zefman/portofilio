/*******************************************************************************
 *      The Unit SCSS Base Template
 ******************************************************************************/
 
var gulp         = require( 'gulp' );
var compass      = require( 'gulp-compass' );           // https://www.npmjs.com/package/gulp-compass
var autoprefixer = require( 'gulp-autoprefixer');       // npm install --save-dev gulp-autoprefixer
var concat       = require( 'gulp-concat' );            // https://www.npmjs.com/package/gulp-concat

// Local server
var serve        = require( 'gulp-serve' );             // https://www.npmjs.com/package/gulp-serve
var browserSync  = require( 'browser-sync').create();   // https://www.npmjs.com/package/browser-sync

// Minify
var minifyCss    = require( 'gulp-minify-css' );

// Compile SCSS into CSS
// use autoprefixer and inject into browser
// minify, and copy to "CSS" directory
gulp.task( 'css', function() {
    return gulp.src("./assets/scss/**/**/*.scss")
        .pipe( compass( {
            css:  './assets/css',
            sass: './assets/scss'
        } ) )
        .pipe( autoprefixer( {
            browsers: [ 'last 2 versions', 'ie > 9' ],
            cascade: false
        } ) )
        .pipe( minifyCss() )
        .pipe( gulp.dest( "./assets/css" ) )
        .pipe( browserSync.stream() );
});

// Compile and create a local server
gulp.task( 'serve', [ 'css'], function() {
    browserSync.init( {
        server: {
            baseDir: "./"
        }
    } );
    gulp.watch( "./assets/scss/**/*.scss", [ 'css' ] );
    gulp.watch( "./assets/scss/**/*.scss" ).on( 'change', browserSync.reload );
    gulp.watch( "./*.html" ).on( 'change', browserSync.reload );
} );

// Compile and watch for changes (no server)
gulp.task( 'watch', [ 'css'], function() {
    gulp.watch( "./assets/scss/**/*.scss", [ 'css' ] );
    gulp.watch( "./assets/scss/**/*.scss" ).on( 'change', browserSync.reload );
    gulp.watch( "./*.html" ).on( 'change', browserSync.reload );
} );

// Compile
gulp.task( 'default', [ 'css' ] );
