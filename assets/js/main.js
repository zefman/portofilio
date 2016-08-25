( function() {
    // jQuery elements
    var $window   = $( window );
    var $logo     = $( '.site-header .logo' );
    var $logoNav  = $logo.find( '.logo__expand-nav' );
    var $logoText = $logo.find( '.logo__text' );
    var $siteNav  = $( '.site-nav' );

    var finishedOffset = $logoNav.offset().top - $logoNav.height() + 15;
    var maxRotatation  = 90;
    var maxWidth       = $window.width();
    var minWidth       = $logo.outerWidth();
    var lastScrollTop  = 0;
    var needsUpdate    = false;
    var navFixed       = false;

    // $window.on( 'scroll', rotateLogo );
    $window.on( 'scroll', throttle( updateOffset, 16 ) );
    $window.on( 'scroll', debounce( stopUpdate, 200 ) );
    function updateOffset() {
        if ( needsUpdate === false ) {
            needsUpdate = true;
            window.requestAnimationFrame( rotateLogo );
        }
    }

    function stopUpdate() {
        needsUpdate = false;
    }

    function rotateLogo() {
        var lastScrollTop = $window.scrollTop();
        var percentDone = Math.min( lastScrollTop / finishedOffset, 1 );
        var fadePercentDone = Math.min( Math.max( lastScrollTop - ( finishedOffset / 2 ), 0 ) / ( finishedOffset / 2 ), 1 );

        var rotateAmount = percentDone * -maxRotatation;
        $logo.css( 'transform', 'rotateX( ' + rotateAmount + 'deg )' );

        $logoText.css( {
            opacity: 1 - fadePercentDone
        } );

        var opacity = lastScrollTop * 0.01;
        $logoNav.css( {
            opacity: fadePercentDone,
            width: Math.max( ( fadePercentDone * maxWidth ), minWidth ) + 'px'
        } );

        if ( percentDone === 1 && !navFixed ) {
            $siteNav.addClass( 'site-nav--active' );
            navFixed = true;
        } else if ( percentDone !== 1 && navFixed ) {
            $siteNav.removeClass( 'site-nav--active' );
            navFixed = false;
        }

        if ( needsUpdate ) {
            window.requestAnimationFrame( rotateLogo );
        }
    }

    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function() {
            var context = scope || this;

            var now = +new Date(),
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    function debounce(fn, delay) {
        var timer = null;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        };
    }

    $( '.experience-logos' ).css( 'height', $( '.experience-logos' ).width() );

} )();
