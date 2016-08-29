( function() {
    // jQuery elements
    var $window   = $( window );
    var $logo     = $( '.site-header .logo' );
    var $logoNav  = $logo.find( '.logo__expand-nav' );
    var $logoText = $logo.find( '.logo__text' );
    var $siteNav  = $( '.site-nav' );

    var finishedOffset = $logoNav.offset().top - $siteNav.height() + 15;
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
                $( '.burger' ).css( {
                    borderColor: colour
                } );
                $( '.burger .burger__line' ).css( {
                    backgroundColor: colour
                } );
            } else {
                section.inView = false;
            }
        } );
    }

    $( window ).on( 'scroll', throttle( setActiveSection, 250 ) );

    // Smooth scroll
    $(function() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });

    // Mobile menu
    var burger = $( '.burger' );
    var mobileMenu = $( '.mobile-menu' );
    var body = $( 'body' );
    var menuOpen = false;
    $( '.js-menu-trigger' ).on( 'click', function( event ) {
        event.preventDefault();
        if ( !menuOpen ) {
            showMenu();
        } else {
            closeMenu();
        }
    } );
    $( '.js-mobile-menu-link' ).on( 'click', closeMenu );
    mobileMenu.on( 'click', closeMenu );
    $( window ).on( 'resize', debounce( closeMenu, 250 ) );

    function showMenu() {
        var colour = $( 'header' ).css( 'background-color' );
        burger.addClass( 'burger--active' );
        mobileMenu.addClass( 'mobile-menu--active' );
        mobileMenu.css( {
            backgroundColor: colour
        } );
        $( '.logo--nav .logo__text' ).css( {
            color: colour,
            borderColor: colour
        } );
        $( '.burger' ).css( {
            borderColor: colour
        } );
        $( '.burger .burger__line' ).css( {
            backgroundColor: colour
        } );
        $( '.burger .burger__cross-line' ).css( {
            backgroundColor: colour
        } );
        body.css( 'overflow', 'hidden' );
        menuOpen = true;
    }

    function closeMenu() {
        mobileMenu.removeClass( 'mobile-menu--active' );
        burger.removeClass( 'burger--active' ).addClass( 'burger--closing' );
        body.css( 'overflow', 'visible' );
        menuOpen = false;
        setTimeout( function() {
            burger.removeClass( 'burger--closing' );
        }, 800 );
    }

    // Work slider
    var workItems = $( '.work-item' );
    var workTransition = $( '.work__transition' );
    $( '.js-work-trigger-next' ).on( 'click', function( event ) {
        event.preventDefault();
        var activeID = parseInt( $( '.work-item--active' ).data( 'work-id' ) );
        var nextID   = activeID + 1;

        if ( nextID > workItems.length ) {
            nextID = 1;
        }

        workItems.removeClass( 'work-item--active' ).addClass( 'work-item--leaving' );
        workTransition.addClass( 'work__transition--animate' );
        setTimeout( function() {
            workItems.addClass( 'hidden' );
            workTransition.removeClass( 'work__transition--animate' );
            workItems.each( function( index, item ) {
                item = $( item );
                if ( item.data( 'work-id' ) == nextID ) {
                    item.removeClass( 'hidden' ).removeClass( 'work-item--leaving' ).addClass( 'work-item--active' );
                }
            } );
        }, 700 );

    } );

    $( '.js-work-trigger-previous' ).on( 'click', function( event ) {
        event.preventDefault();
        var activeID = parseInt( $( '.work-item--active' ).data( 'work-id' ) );
        var nextID   = activeID - 1;

        if ( nextID < 1 ) {
            nextID = workItems.length;
        }

        workItems.removeClass( 'work-item--active' ).addClass( 'work-item--leaving' );
        workTransition.addClass( 'work__transition--animate' );
        setTimeout( function() {
            workItems.addClass( 'hidden' );
            workTransition.removeClass( 'work__transition--animate' );
            workItems.each( function( index, item ) {
                item = $( item );
                if ( item.data( 'work-id' ) == nextID ) {
                    item.removeClass( 'hidden' ).removeClass( 'work-item--leaving' ).addClass( 'work-item--active' );
                }
            } );
        }, 700 );

    } );

} )();

( function() {
    'use strict';

    function Animation( $scope, $window, $timeout, $interval ) {
        var vm = {};

        // TODO: Start position modes, center, random, sets, draw
        // Allow stroke to be individual rather than whole generation

        var winWidth;
        var winHeight;
        var canvas;
        var ctx;
        var pointerX;
        var pointerY;
        var fadeAmount;
        var colours;
        var bgColour;
        var numSets;
        var numBirds;
        var stroke;
        var target;
        var birds;
        var resetNow;
        var pause;
        var interval;
        var placeInterval;
        var setVariables;

        // Controllable variables
        vm.numBirds = 100;
        vm.numSets = 3;
        vm.fadeAmount = 0.5;
        vm.stroke = 0.5;
        vm.maxRadius = 7;
        vm.desiredSeparation = 30;
        vm.maxSpeed = 6;
        vm.maxForce = 1.4;
        vm.regenTime = 20;
        vm.positions = [
            [ winWidth / 2, winHeight / 2 ]
        ];
        vm.placedStartPositions = [];
        vm.placeStartPositionMarkers = [];
        vm.startPositionMode = 'center';
        vm.showPlacedPositions = false;
        vm.clearPlacedPositions = false;
        vm.avoidMouse = false;
        vm.link = "";

        activate();

        /**
         * Set up the canvas and controller
         */
        function activate() {
            winWidth  = $( window ).innerWidth();
            winHeight = $( window ).innerHeight();

            canvas = document.getElementById("header-canvas");
            ctx    = canvas.getContext( "2d" );

            // Set the canvas to the size of the window
            $( 'canvas' ).attr( 'width', winWidth );
            $( 'canvas' ).attr( 'height', winHeight );

            // Resize the canvas on window resize
            $( window ).on('resize', function(){
                winWidth  = $( window ).innerWidth();
                winHeight = $( window ).innerHeight();
                $( 'canvas' ).attr( 'width', winWidth );
                $( 'canvas' ).attr( 'height', winHeight );
                console.log( 'Hello' );
            });

            pointerX = 0;
            pointerY = 0;

            birds = [];
            fadeAmount = ( Math.random() * vm.fadeAmount ).toFixed( 3 );
            colours = getColours( fadeAmount );
            stroke = ( Math.random() > vm.stroke );
            target = new Victor( winWidth / 2, winHeight / 2 );
            resetNow = false;
            pause = false;

            addCanvasListeners();

            // Listen for keypresses
            var doc = $(document);
            doc.on( 'keydown', handleKeydown );

            // Add the listener to the copy to clipboard button
            // var clipboard = new Clipboard('.copy-link');

            // Start the animation
            resetAnimation();
            update();
        }

        /**
         * Applies mouse listeners to the canvas so we can
         * draw start positions etc
         */
        function addCanvasListeners() {
            // Keep a log of mouse movements
            $( 'canvas' ).mousemove( function( e ) {
                pointerX = e.offsetX;
                pointerY = e.offsetY;
            } );

            // Store positions when the canvas is clicked upon
            $( 'canvas' ).click( function( e ) {
                if ( vm.clearPlacedPositions ) {
                    vm.clearPlacedPositions = false;
                    vm.placedStartPositions = [];
                }
                vm.placedStartPositions.push( [
                    e.offsetX, e.offsetY
                ] );
            } );

            $( 'canvas' ).mousedown( function( e ) {
                if ( vm.clearPlacedPositions ) {
                    vm.clearPlacedPositions = false;
                    vm.placedStartPositions = [];
                    vm.placeStartPositionMarkers = [];
                }
                if ( vm.startPositionMode == 'place' ) {
                    if ( vm.placedStartPositions.length === 0 ) {
                        vm.placedStartPositions.push( [
                            pointerX, pointerY
                        ] );
                        vm.placeStartPositionMarkers.push( {
                            x: pointerX,
                            y: pointerY,
                            phase: 1
                        } );
                    }
                    placeInterval = $interval( function() {
                        var lastPos = vm.placedStartPositions[ vm.placedStartPositions.length - 1 ];
                        lastPos = new Victor( lastPos[ 0 ], lastPos[ 1 ] );
                        var newPos = new Victor( pointerX, pointerY );
                        if ( lastPos.distance( newPos ) > 10 ) {
                            vm.placedStartPositions.push( [
                                newPos.x, newPos.y
                            ] );
                            vm.placeStartPositionMarkers.push( {
                                x: newPos.x,
                                y: newPos.y,
                                phase: 1
                            } );
                        }
                    }, 1000 / 30 );
                }
            } );

            $( 'canvas' ).mouseup( function() {
                cancelInterval( placeInterval );
            } );
        }

        /**
         * The bird model used in the simulation
         * @param Integer x The x co-ordinate
         * @param Integer y The y co-ordinate
         * @param Integer radius The radius of the bird in pixels
         * @param Integer desiredSeparation How far does this bird like
         *                                  to be away from others in pixels
         * @param Integer maxspeed The maximum speed of this bird
         * @param Integer maxforce The maximum force that can be applied to this bird
         * @param Object colour The hex and rgb colour of this bird
         */
        function Bird( x, y, radius, desiredSeparation, maxspeed, maxforce, colour ) {
            this.acceleration = new Victor( 0, 0 );
            this.velocity = new Victor( Math.random() * 2 - 1, Math.random() * 2 - 1 );
            this.location = new Victor( x, y );
            this.colour = typeof colour !== 'undefined' ? colour : colours[Math.floor(Math.random()*colours.length)];
            this.rot = 0;
            this.radius = typeof radius !== 'undefined' ? radius : 5;
            this.desiredSeparation = typeof desiredSeparation !== 'undefined' ? desiredSeparation : 30;
            this.maxspeed = typeof maxspeed !== 'undefined' ? maxspeed : 5;
            this.maxforce = typeof maxforce !== 'undefined' ? maxforce : 0.2;

            this.update = function() {
                this.velocity.add( this.acceleration );
                this.velocity = this.limitVector( this.velocity, this.maxspeed );
                this.location.add( this.velocity );

                // Wrap
                if ( this.location.x < 0 ) {
                    this.location.x = winWidth;
                }

                if ( this.location.x > winWidth ) {
                    this.location.x = 0;
                }

                if ( this.location.y < 0 ) {
                    this.location.y = winHeight;
                }

                if ( this.location.y > winHeight ) {
                    this.location.y = 0;
                }

                this.acceleration.x *= 0;
                this.acceleration.y *= 0;
            };

            this.applyForce = function( force ) {
                this.acceleration.add( force );
            };

            this.seek = function( target ) {
                var desired = target.clone().subtract( this.location );
                if ( desired.length() < 400 ) {
                  desired.normalize();
                  desired.x *= this.maxspeed;
                  desired.y *= this.maxspeed;

                  desired.subtract( this.velocity );
                  return this.limitVector( desired, this.maxforce );
                } else {
                  return new Victor( 0, 0 );
                }
            };

            this.avoidFloor = function() {
                if ( this.location.y > winHeight * 0.7 ) {
                    steer = new Victor( 0, -0.5 );

                    return steer;
                }

                if ( this.location.y < 0 ) {
                    steer = new Victor( 0, 0.5 );

                    return steer;
                }

                return new Victor( 0, 0 );
            };

            this.separate = function( birds ) {
                var totalBirds = birds.length;
                var sum = new Victor( 0, 0 );
                var count = 0;
                for ( var i = 0; i < totalBirds; i++ ) {
                    var dist = this.location.distance( birds[ i ].location );

                    if ( ( dist > 0 ) && ( dist < this.desiredSeparation ) ) {
                        var diff = this.location.clone().subtract( birds[ i ].location );
                        diff.normalize();
                        //diff.divide( new Victor( dist, dist ) );
                        sum.add( diff );
                        count++;
                    }
                }

                if ( count > 0 ) {
                    sum.divide( new Victor( count, count ) );
                    sum.normalize();
                    sum.x *= this.maxspeed;
                    sum.y *= this.maxspeed;

                    sum.subtract( this.velocity );
                    return this.limitVector( sum, this.maxforce );
                }

                return new Victor( 0, 0 );
            };

            // For flocking
            this.align = function( birds ) {
                var sum = new Victor( 0, 0 );
                var totalBirds = birds.length;
                var neighbourdist = 50;
                var count = 0;
                for ( var i = 0; i < totalBirds; i++ ) {
                    var dist = this.location.distance( birds[ i ].location );

                    if ( ( dist > 0 ) && ( dist < neighbourdist ) ) {
                        sum.add( birds[ i ].velocity );
                        count++;
                    }
                }

                if ( count > 0 ) {
                    sum.divide( new Victor( count, count ) );

                    sum.normalize();
                    sum.x *= this.maxspeed;
                    sum.y *= this.maxspeed;

                    sum.subtract( this.velocity );
                    return this.limitVector( sum, this.maxforce );
                }

                return new Victor( 0, 0 );
            };

            this.cohesion = function( birds ) {
                var sum = new Victor( 0, 0 );
                var totalBirds = birds.length;
                var neighbourdist = 50;
                var count = 0;
                for ( var i = 0; i < totalBirds; i++ ) {
                    var dist = this.location.distance( birds[ i ].location );

                    if ( ( dist > 0 ) && ( dist < neighbourdist ) ) {
                        sum.add( birds[ i ].location );
                        count++;
                    }
                }

                if ( count > 0 ) {
                    sum.divide( new Victor( count, count ) );

                    return this.seek( sum );
                }

                return new Victor( 0, 0 );
            };

            this.applyBehaviours = function( birds, target ) {
                var separate = this.separate( birds );
                var align    = this.align( birds );
                var coh      = this.cohesion( birds );
                //var avoidFloor = this.avoidFloor();

                separate.x *= 1.5;
                separate.y *= 1.5;

                align.x *= 0.7;
                align.y *= 0.7;

                coh.x *= 0.1;
                coh.y *= 0.1;

                if ( vm.avoidMouse ) {
                    var seek = this.seek( target );
                    seek.x *= 0.5;
                    seek.y *= 0.5;
                    this.applyForce( seek );
                }

                this.applyForce( separate );
                this.applyForce( align );
                this.applyForce( coh );

            };

            // this.arrive = function( target ) {
            //     var desired = target.clone().subtract( this.location );
            //     var d = desired.length;
            //     if ( d < 100 ) {
            //         var m = map(d,0,100,0,maxspeed);
            //         desired.mult(m);
            //     } else {
            //         desired.mult(maxspeed);
            //     }
            //     desired.normalize();
            //
            //     var steer = desired.clone().subtract( this.velocity );
            //     steer = this.limitVector( steer, this.maxforce );
            //     this.applyForce( steer );
            // };

            this.draw = function() {
                //ctx.fillRect( this.location.x, this.location.y, 1, 1 );
                ctx.fillStyle = this.colour.hex;
                ctx.beginPath();
                ctx.arc( this.location.x, this.location.y, this.radius, 0, Math.PI*2, true );
                ctx.fill();
                ctx.closePath();

                // Stroke
                if ( stroke ) {
                  ctx.beginPath();
                  ctx.arc( this.location.x, this.location.y, this.radius * 2, 0, Math.PI*2, true );
                  ctx.stroke();
                  ctx.closePath();
                }

            };

            this.limitVector = function( vector, limit ) {
                if ( vector.lengthSq() > limit*limit ) {
                    vector.normalize();
                    vector.x *= limit;
                    vector.y *= limit;
                }

                return vector;
            };
        }

        /**
         * Fills the birds array with a new set of randomised birds
         */
        function generateBirds() {
            birds.length = 0;
            var positions = getStartPositions();
            setVariables = getSetVariables();
            for ( var i = 0; i < numSets; i++ ) {
              var radius = setVariables[ i ].radius;
              var desiredSeparation = setVariables[ i ].desiredSeparation;
              var maxspeed = setVariables[ i ].maxSpeed;
              var maxforce = setVariables[ i ].maxForce;
              var colour = setVariables[ i ].colour;

              for ( var j = 0; j < vm.numBirds / numSets; j++ ) {
                var position = positions[ Math.floor( Math.random() * positions.length ) ];
                birds.push( new Bird( position[ 0 ], position[ 1 ], radius, desiredSeparation, maxspeed, maxforce, colour ) );
              }
            }
        }

        /**
         * Gets the variables for each set of bird
         * @return Array
         */
        function getSetVariables() {
            var setVariables = [];
            for ( var i = 0; i < numSets; i++ ) {
                setVariables[ i ] = {
                    radius: ( Math.random() * vm.maxRadius ).toFixed( 3 ),
                    desiredSeparation: ( Math.random() * vm.desiredSeparation ).toFixed( 3 ),
                    maxSpeed: ( Math.random() * vm.maxSpeed ).toFixed( 3 ),
                    maxForce: ( Math.random() * vm.maxForce ).toFixed( 3 ),
                    colour: colours[Math.floor(Math.random()*colours.length)]
                };
            }
            return setVariables;
        }

        /**
         * The main update loop of the animation
         */
        function update() {
            if ( !pause ) {
                target.x = pointerX;
                target.y = pointerY;

                // Clear the canvas
                ctx.fillStyle = bgColour.rgb;
                ctx.fillRect( 0, 0, winWidth, winHeight );

                for ( var j = 0; j < numBirds; j++ ) {
                    if ( birds[ j ] ) {
                        birds[ j ].applyBehaviours( birds, target );
                        birds[ j ].update();
                        birds[ j ].draw();
                    }
                }

                if ( resetNow ) {
                    resetNow = false;
                    resetAnimation();
                }
            }

            if ( vm.startPositionMode == 'place' && vm.showPlacedPositions ) {
                // If we are paused and the start position mode
                // is set to place we should draw the start positions
                vm.placeStartPositionMarkers.forEach( function( position ) {
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc( position.x, position.y, 5 + position.phase, 0, Math.PI*2, true );
                    ctx.stroke();
                    ctx.closePath();
                    position.phase += 0.1;
                    if ( position.phase > 10 ) {
                        position.phase = 0;
                    }
                } );
            }

            window.requestAnimationFrame( update );
        }

        /**
         * Resets the animation by randomising and generating
         * a new set of birds
         */
        function resetAnimation() {
            ctx.clearRect( 0, 0, winWidth, winHeight );
            fadeAmount = ( Math.random() * vm.fadeAmount ).toFixed( 3 );
            colours = getColours( fadeAmount );
            // Randomise tings
            bgColour = colours.splice( Math.floor( Math.random() * colours.length ), 1 )[ 0 ];
            $( 'canvas' ).css( {
              'background': bgColour.hex
            } );
            $( 'canvas' ).closest( '.js-section' ).css( {
                backgroundColor: bgColour.hex
            } );
            // window.setFavicon( bgColour.hex );
            numSets = ( ( Math.random() * vm.numSets ) + 1 ).toFixed( 0 );
            stroke = ( Math.random() > 0.5 );
            numBirds = vm.numBirds;
            generateBirds();

            clearTimeout( interval );
            interval = setTimeout( function() {
                resetNow = true;
            }, vm.regenTime * 1000 );

            // vm.link = getUrl();
        }

        /**
         * Get an array of colours to be used in the animation
         * @param  float fadeAmount The opacity of the background colour
         * @return Array The array of colours
         */
        function getColours( fadeAmount ) {
            fadeAmount = ( typeof fadeAmount != 'undefined' ) ? fadeAmount : 1;
            return [
                {
                    "hex": "#1ABC9C",
                    "rgb": "rgba(26, 188, 156," + fadeAmount + ")"
                },
                {
                    "hex": "#16A085",
                    "rgb": "rgba(22, 160, 133," + fadeAmount + ")"
                },
                {
                    "hex": "#2ECC71",
                    "rgb": "rgba(46, 204, 113," + fadeAmount + ")"
                },
                {
                    "hex": "#27AE60",
                    "rgb": "rgba(39, 174, 96," + fadeAmount + ")"
                },
                {
                    "hex": "#3498DB",
                    "rgb": "rgba(52, 152, 219," + fadeAmount + ")"
                },
                {
                    "hex": "#2980B9",
                    "rgb": "rgba(41, 128, 185," + fadeAmount + ")"
                },
                {
                    "hex": "#9B59B6",
                    "rgb": "rgba(155, 89, 182," + fadeAmount + ")"
                },
                {
                    "hex": "#8E44AD",
                    "rgb": "rgba(142, 68, 173," + fadeAmount + ")"
                },
                {
                    "hex": "#34495E",
                    "rgb": "rgba(52, 73, 94," + fadeAmount + ")"
                },
                {
                    "hex": "#2C3E50",
                    "rgb": "rgba(44, 62, 80," + fadeAmount + ")"
                },
                {
                    "hex": "#F1C40F",
                    "rgb": "rgba(241, 196, 15," + fadeAmount + ")"
                },
                {
                    "hex": "#F39C12",
                    "rgb": "rgba(243, 156, 18," + fadeAmount + ")"
                },
                {
                    "hex": "#E67E22",
                    "rgb": "rgba(230, 126, 34," + fadeAmount + ")"
                },
                {
                    "hex": "#D35400",
                    "rgb": "rgba(211, 84, 0," + fadeAmount + ")"
                },
                {
                    "hex": "#E74C3C",
                    "rgb": "rgba(231, 76, 60," + fadeAmount + ")"
                },
                {
                    "hex": "#C0392B",
                    "rgb": "rgba(192, 57, 43," + fadeAmount + ")"
                },
                {
                    "hex": "#ECF0F1",
                    "rgb": "rgba(236, 240, 241," + fadeAmount + ")"
                },
                {
                    "hex": "#BDC3C7",
                    "rgb": "rgba(189, 195, 199," + fadeAmount + ")"
                },
                {
                    "hex": "#95A5A6",
                    "rgb": "rgba(149, 165, 166," + fadeAmount + ")"
                },
                {
                    "hex": "#7F8C8D",
                    "rgb": "rgba(127, 140, 141," + fadeAmount + ")"
                }
            ];
        }

        /**
         * Handles keypress used as keybaord shortcutes
         * @param  Event e
         */
        function handleKeydown( e ) {
            console.log( e.keyCode );
            // Reset on spacebar
            if(e.keyCode === 32) {
                e.preventDefault();
                resetAnimation();
            }

            if ( e.keyCode === 80 ) {
                // P key should pause
                pause = !pause;
            }

            if ( e.keyCode == 39 ) {
                // Right arrow shift user placed start positions to right
                vm.placedStartPositions = vm.placedStartPositions.map( function( position ) {
                    position[ 0 ] += 10;
                    return position;
                } );
            }

            if ( e.keyCode == 37 ) {
                // Left arrow shift user placed start positions to right
                vm.placedStartPositions = vm.placedStartPositions.map( function( position ) {
                    position[ 0 ] -= 10;
                    return position;
                } );
            }

            if ( e.keyCode == 38 ) {
                // Up arrow shift user placed start positions to right
                vm.placedStartPositions = vm.placedStartPositions.map( function( position ) {
                    position[ 1 ] -= 10;
                    return position;
                } );
            }

            if ( e.keyCode == 40 ) {
                // Down arrow shift user placed start positions to right
                vm.placedStartPositions = vm.placedStartPositions.map( function( position ) {
                    position[ 1 ] += 10;
                    return position;
                } );
            }
        }

        /**
         * Returns and array of start positions dependent
         * on the start mode the user has selected
         * @return Array
         */
        function getStartPositions() {
            switch( vm.startPositionMode ) {
                case 'center':
                    return [
                        [ winWidth / 2, winHeight / 2 ]
                    ];
                case 'sets':
                    return [
                        [ winWidth / 2, winHeight / 2 ]
                    ];
                case 'random':
                    var positions = [];
                    for ( var i = 0; i < vm.numBirds; i++ ) {
                        positions.push( [
                            Math.random() * winWidth,
                            Math.random() * winHeight,
                        ] );
                    }
                    return positions;
                case 'place':
                    if ( vm.placedStartPositions.length > 0 ) {
                        return vm.placedStartPositions;
                    } else {
                        return [
                            [ winWidth / 2, winHeight / 2 ]
                        ];
                    }
            }
        }

        /**
         * Gets a url to the current simulation
         * @return String
         */
        function getUrl() {
            var params = "?";
            // Get all the basic params
            params += 'numBirds=' + vm.numBirds;
            params += '&numSets=' + vm.numSets;
            params += '&fadeAmount=' + vm.fadeAmount;
            params += '&stroke=' + vm.stroke;
            params += '&maxRadius=' + vm.maxRadius;
            params += '&desiredSeparation=' + vm.desiredSeparation;
            params += '&maxSpeed=' + vm.maxSpeed;
            params += '&maxForce=' + vm.maxForce;
            params += '&regenTime=' + vm.regenTime;
            params += '&startPositionMode=' + vm.startPositionMode;
            params += '&avoidMouse=' + vm.avoidMouse;

            // Get the current state
            params += '&bgColourHex=' + encodeURIComponent( bgColour.hex );
            params += '&bgColourRGB=' + encodeURIComponent( bgColour.rgb );
            params += '&setVariables=' + encodeURIComponent( JSON.stringify( setVariables ) );
            params += '&placedStartPositions=' + encodeURIComponent( JSON.stringify( vm.placedStartPositions ) );

            var url = window.location.origin + window.location.pathname + params;
            return url;
        }

        /**
         * Gets a specific url parameter
         * @param  String sParam
         * @return String
         */
        function getUrlParameter( sParam ) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }

        /**
         * Used to instantiate variables that may be passed through in
         * a url parameter. Handles checking if the url param exists, parsing
         * its content, or returning a defualt if it doesn't exist
         * @param  String parameter The name of the url parameter
         * @param  String type The type of variable, eg string, int, float, json
         * @param  Varied defaultValue
         * @return Varied
         */
        function getUrlParameterOrDefault( parameter, type, defaultValue ) {
            var urlParameter = getUrlParameter( parameter );
            if ( typeof urlParameter == 'undefined' ) {
                return defaultValue;
            }

            switch ( type ) {
                case 'int':
                    return parseInt( urlParameter );
                case 'float':
                    return parseFloat( urlParameter );
                case 'json':
                    return JSON.parse( decodeURIComponent( urlParameter ) );
                case 'bool':
                    return ( urlParameter == 'true' );
                default:
                    return decodeURIComponent( urlParameter );
            }
        }

    }

    Animation( {}, window );
} )();
