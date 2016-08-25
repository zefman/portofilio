/*******************************************************************************
 *      The Unit SCSS Base Template
 ******************************************************************************/

var gulp         = require( 'gulp' );
var compass      = require( 'gulp-compass' );           // https://www.npmjs.com/package/gulp-compass
var autoprefixer = require( 'gulp-autoprefixer');       // npm install --save-dev gulp-autoprefixer
var concat       = require( 'gulp-concat' );            // https://www.npmjs.com/package/gulp-concat

// Local server
var connect      = require('gulp-connect');

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
        .pipe( connect.reload() );
});

gulp.task('connect', function() {
  connect.server();
});

// Compile and watch for changes (no server)
gulp.task( 'watch', [ 'css'], function() {
    gulp.watch( "./assets/scss/**/*.scss", [ 'css' ] );
    gulp.watch( "./*.html" ).on( 'change', connect.reload() );
} );

// Compile
gulp.task( 'default', [ 'watch', 'connect' ] );
