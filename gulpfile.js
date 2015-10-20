var gulp         = require( 'gulp' );
var compass      = require( 'gulp-compass' );           // https://www.npmjs.com/package/gulp-compass
var autoprefixer = require( 'gulp-autoprefixer');       // npm install --save-dev gulp-autoprefixer
var concat       = require( 'gulp-concat' );            // https://www.npmjs.com/package/gulp-concat

// Local server
var serve        = require( 'gulp-serve' );             // https://www.npmjs.com/package/gulp-serve
var browserSync  = require( 'browser-sync').create();   // https://www.npmjs.com/package/browser-sync

// Compress Images
// var imagemin     = require( 'gulp-imagemin');
// var pngquant     = require( 'imagemin-pngquant');

// Minify
// var uglify       = require( 'gulp-uglify' );
// var minifyCss    = require( 'gulp-minify-css' );
// var minifyHTML   = require( 'gulp-minify-html');

// Concatenate vendor css into one file
// gulp.task( 'vendorjs', function() {
//   return gulp.src( ['./bower_components/jquery/dist/jquery.min.js',
//                     ])
//     .pipe( concat( 'vendor.js' ) )
//     .pipe( gulp.dest( './js/' ) )
//     .pipe( browserSync.stream() );
// } );


// Compile sass into CSS & auto-inject into browsers
gulp.task( 'compass', function() {
    return gulp.src("./scss/**/**/*.scss")
        .pipe( compass( {
            css:  './css',
            sass: './scss'
        } ) )
        .pipe( autoprefixer( {
            browsers: [ 'last 2 versions', 'ie > 9' ],
            cascade: false
        } ) )
        .pipe( gulp.dest( "./css" ) )
        .pipe( browserSync.stream() );
});

// Create a local server
gulp.task( 'serve', [ 'compass'], function() {
    browserSync.init( {
        server: {
            baseDir: "./"
        }
    } );

    gulp.watch( "./scss/**/*.scss", [ 'compass' ] );
    gulp.watch( "./*.html" ).on( 'change', browserSync.reload );
} );

/**
 *  Compress all images and move to dist
 *  Uncomment to use
 */
// gulp.task ( 'images', function() {
//     return gulp.src('./assets/**/*.*')
//         .pipe(imagemin({
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()]
//         }))
//         .pipe(gulp.dest('dist/assets'));
// });

/**
 *  Build the app for production
 *  Uncomment to use
 */
// gulp.task( 'build', function() {
//     // Copy accross fonts
//     gulp.src( './fonts/*' )
//         .pipe( gulp.dest( './dist/fonts' ) );
//
//     // Minify and copy js
//     gulp.src( ['./js/vendor.js' ] )
//         .pipe( uglify() )
//         .pipe( gulp.dest( './dist/js/' ) );
//
//     // Copy and minify css
//     gulp.src( './css/*.css' )
//         .pipe( minifyCss() )
//         .pipe( gulp.dest( './dist/css' ) );
//
//     // Copy html
//     gulp.src( [ 'index.html' ] )
//         .pipe( minifyHTML( {} ) )
//         .pipe( gulp.dest( './dist' ) );
// } );

gulp.task( 'default', [ 'compass' ] );
