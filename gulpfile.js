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
    return gulp.src("./scss/**/**/*.scss")
        .pipe( compass( {
            css:  './css',
            sass: './scss'
        } ) )
        .pipe( autoprefixer( {
            browsers: [ 'last 2 versions', 'ie > 9' ],
            cascade: false
        } ) )
        .pipe( minifyCss() )
        .pipe( gulp.dest( "./css" ) )
        .pipe( browserSync.stream() );
});

// Create a local server
gulp.task( 'serve', [ 'css'], function() {
    browserSync.init( {
        server: {
            baseDir: "./"
        }
    } );

    gulp.watch( "./scss/**/*.scss", [ 'css' ] );
    gulp.watch( "./scss/**/*.scss" ).on( 'change', browserSync.reload );
} );

gulp.task( 'default', [ 'css' ] );
