( function() {
    // jQuery elements
    var $window   = $( window );
    var $logo     = $( '.site-header .logo' );
    var $logoNav  = $logo.find( '.logo__expand-nav' );
    var $logoText = $logo.find( '.logo__text' );
    var $siteNav  = $( '.site-nav' );

    var finishedOffset = $logo.offset().top;
    var maxRotatation  = 90;
    var maxWidth       = $window.width();
    var minWidth       = $logo.outerWidth();

    $window.on( 'scroll', rotateLogo );

    function rotateLogo( event ) {
        var percentDone = Math.min( $window.scrollTop() / finishedOffset, 1 );
        var fadePercentDone = Math.min( Math.max( $window.scrollTop() - ( finishedOffset / 2 ), 0 ) / ( finishedOffset / 2 ), 1 );

        var rotateAmount = percentDone * -maxRotatation;
        $logo.css( {
            transform: 'rotateX( ' + rotateAmount + 'deg )'
        } );

        $logoText.css( {
            opacity: 1 - fadePercentDone
        } );

        var opacity = $window.scrollTop() * 0.01;
        $logoNav.css( {
            opacity: fadePercentDone,
            width: Math.max( ( percentDone * maxWidth ), minWidth ) + 'px'
        } );

        if ( percentDone === 1 ) {
            $siteNav.addClass( 'site-nav--active' );
        } else {
            $siteNav.removeClass( 'site-nav--active' );
        }
    }


} )();
