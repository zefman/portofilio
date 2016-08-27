( function() {
    // jQuery elements
    var $window   = $( window );
    var $logo     = $( '.site-header .logo' );
    var $logoNav  = $logo.find( '.logo__expand-nav' );
    var $logoText = $logo.find( '.logo__text' );
    var $siteNav  = $( '.site-nav' );

    var finishedOffset = $logoNav.offset().top - $siteNav.height();
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
    $('body').on({
        'touchmove': throttle( updateOffset, 16 )
    });

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

    /**
     * Set the favicon based on a hex code
     * @param String colour
     */
    function setFavicon( colour ) {
        var favicon = 'favicon.png';
        switch ( colour ) {
            case '#1ABC9C':
                favicon = 'favicon-turquoise.png';
                break;
            case '#16A085':
                favicon = 'favicon-green-sea.png';
                break;
            case '#2ECC71':
                favicon = 'favicon-emerald.png';
                break;
            case '#27AE60':
                favicon = 'favicon-nephritis.png';
                break;
            case '#3498DB':
                favicon = 'favicon-peter-river.png';
                break;
            case '#2980B9':
                favicon = 'favicon-belize-hole.png';
                break;
            case '#34495E':
                favicon = 'favicon-wet-asphalt.png';
                break;
            case '#2C3E50':
                favicon = 'favicon-midnight-blue.png';
                break;
            case '#9B59B6':
                favicon = 'favicon-amethyst.png';
                break;
            case '#8E44AD':
                favicon = 'favicon-wisteria.png';
                break;
            case '#F1C40F':
                favicon = 'favicon-sunflower.png';
                break;
            case '#F39C12':
                favicon = 'favicon-orange.png';
                break;
            case '#E67E22':
                favicon = 'favicon-carrot.png';
                break;
            case '#D35400':
                favicon = 'favicon-pumpkin.png';
                break;
            case '#D35400':
                favicon = 'favicon-pumpkin.png';
                break;
            case '#E74C3C':
                favicon = 'favicon-alizarin.png';
                break;
            case '#C0392B':
                favicon = 'favicon-pomegranate.png';
                break;
            case '#ECF0F1':
                favicon = 'favicon-clouds.png';
                break;
            case '#BDC3C7':
                favicon = 'favicon-silver.png';
                break;
            case '#95A5A6':
                favicon = 'favicon-concrete.png';
                break;
            case '#7F8C8D':
                favicon = 'favicon-asbestos.png';
                break;
        }

        changeFavicon( 'assets/images/favicons/' + favicon );
    }

    window.setFavicon = setFavicon;
    document.head = document.head || document.getElementsByTagName('head')[0];

    function changeFavicon(src) {
        var link = document.createElement('link');
        var oldLink = document.getElementById('favicon');
        link.id = 'favicon';
        link.rel = 'shortcut icon';
        link.href = src;
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
        document.head.appendChild(link);
    }

    var sections = [];
    function measureSections() {
        sections = [];
        $( '.js-section' ).each( function( index, section ) {
            sections.push( {
                element: $( section ),
                start: $( section ).offset().top,
                end: $( section ).offset().top + $( section ).height(),
                inView: false
            } );
        } );
    }
    measureSections();

    function setActiveSection() {
        var scrollTop = $( window ).scrollTop();
        sections.forEach( function( section ) {
            if ( scrollTop >= section.start && scrollTop <= section.end ) {
                section.inView = true;
                var colour = section.element.css( 'background-color' );
                $( '.logo--nav .logo__text' ).css( {
                    color: colour,
                    borderColor: colour
                } );
            } else {
                section.inView = false;
            }
        } );
    }

    $( window ).on( 'scroll', throttle( setActiveSection, 250 ) );

} )();
