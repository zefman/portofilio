/*******************************************************************************
 *      The Unit SCSS Base Template
 ******************************************************************************/

var gulp         = require( 'gulp' );
var compass      = require( 'gulp-compass' );           // https://www.npmjs.com/package/gulp-compass
var autoprefixer = require( 'gulp-autoprefixer' );      // npm install --save-dev gulp-autoprefixer
var concat       = require( 'gulp-concat' );            // https://www.npmjs.com/package/gulp-concat
var nunjucks     = require( 'gulp-nunjucks' );
var surge        = require( 'gulp-surge' );

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
        .pipe( gulp.dest( "./dev/assets/css" ) )
        .pipe( connect.reload() );
});

gulp.task( 'images', function() {
    return gulp.src( './assets/images/**/*' )
        .pipe( gulp.dest( './dev/assets/images' ) )
        .pipe( connect.reload() );
} );

gulp.task( 'js', function() {
    return gulp.src( './assets/js/**/*' )
        .pipe( concat( 'main.js' ) )
        .pipe( gulp.dest( './dev/assets/js' ) )
        .pipe( connect.reload() );
} );

gulp.task( 'petridish', function() {
    return gulp.src( './assets/petridish/**/*' )
        .pipe( gulp.dest( './dev/assets/petridish' ) )
        .pipe( connect.reload() );
} );

gulp.task( 'nunjucks', function() {
    return gulp.src( './html/**/*.html' )
        .pipe( nunjucks.compile() )
        .pipe( gulp.dest( './dev' ) )
        .pipe( connect.reload() );
} );

gulp.task('connect', function() {
  connect.server({
      root: './dev',
      livereload: true,
      port: 8888
  });
});

gulp.task( 'vendor', function() {
    gulp.src( [
        'node_modules/jquery/dist/jquery.min.js',
        // 'node_modules/victor/index.js',
        'node_modules/owl.carousel/dist/owl.carousel.min.js',
    ] )
        .pipe( concat( 'vendor.js' ) )
        .pipe( gulp.dest( './dev/assets/js/' ) );

    gulp.src( [
        'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
    ] )
        .pipe( concat( 'vendor.css' ) )
        .pipe( gulp.dest( './dev/assets/css/' ) );
} );

gulp.task('deploy', [], function () {
    return surge( {
        project: './dev',         // Path to your static build directory
        domain: 'jozefmaxted.co.uk'  // Your domain or Surge subdomain
    } );
} );
gulp
// Compile and watch for changes (no server)
gulp.task( 'watch', [ 'css', 'js', 'vendor', 'nunjucks', 'images', 'petridish' ], function() {
    gulp.watch( "./assets/scss/**/*.scss", [ 'css' ] );
    gulp.watch( "./assets/js/**/*.js", [ 'js' ] );
    gulp.watch( "./assets/images/**/*", [ 'images' ] );
    gulp.watch( "./html/**/*.html", [ 'nunjucks' ] );
} );

// Compile
gulp.task('default', [ 'css', 'js', 'vendor', 'nunjucks', 'images', 'petridish'  ] );
