"use strict";

$( function() {

    var delayFrameRate = 60; // Number of ms bewtween 2 frames.
    var width, height, canvas, ctx, points, target, animateHeader = true;

    if( $( '#spiders' ).length > 0 )
        { main(); }

    function main() {
        initHeader();
        initAnimation();
        addListeners();
    }

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;

        target = {
            x: width / 2,
            y: height / 2
        };

        canvas = document.getElementById( 'spiders' );
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext( '2d' );

        // create points
        points = [];
        var nbPoints = 400;
        points.length = nbPoints;
        var i = 0;
        var xRes = width / 20;
        var yRes = height / 20;
        for( var x=0; x<width; x=x+xRes ) {
            for( var y=0; y<height; y=y+yRes ) {
                var px = x + Math.random() * xRes;
                var py = y + Math.random() * yRes;
                var p =
                {
                    x:       px,
                    originX: px,
                    y:       py,
                    originY: py
                };
                points[ i++ ] = p;
            }
        }

        // for each point find the 5 closest points
        for( var i=0; i<nbPoints; i++ ) {
            var closest = [];
            var p1 = points[ i ];
            for( var j=0; j<nbPoints; j++ ) {
                var p2 = points[ j ]
                if( !( p1 == p2 ) ) {
                    var placed = false;
                    for( var k=0; k<5; k++ ) {
                        if( !placed ) {
                            if( closest[ k ] == undefined ) {
                                closest[ k ] = p2;
                                placed = true;
                            }
                        }
                    }

                    for( var k=0; k<5; k++ ) {
                        if( !placed ) {
                            if( getDistance( p1, p2 ) < getDistance( p1, closest[ k ] ) ) {
                                closest[ k ] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for( var i in points ) {
            var c = new Circle( points[ i ], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)' );
            points[ i ].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        var delayResize = 200;
        var delayMouseMove = 5;
        var timeoutResize = false;
        var timeoutMouseMove = false;
        if( !( 'ontouchstart' in window ) )
        {
            window.addEventListener( 'mousemove', function( e ) {
                // Debouncing
                clearTimeout( timeoutMouseMove );
                timeoutMouseMove = setTimeout( function(){ mouseMove( e ); }, delayMouseMove  );
            });
        }

        window.addEventListener( 'scroll', scrollCheck );

        window.addEventListener( 'resize', function() {
            // Debouncing
            clearTimeout( timeoutResize );
            timeoutResize = setTimeout( resize, delayResize );
        });
    }

    function mouseMove( e ) {
        var posx = 0;
        var posy = 0;
        if( e.pageX || e.pageY ) {
            posx = e.pageX;
            posy = e.pageY;
        } else if( e.clientX || e.clientY ) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if( document.body.scrollTop > height ) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        initHeader();
        initAnimation();
    }

    // animation
    function initAnimation() {
        animate();
        for( var i in points ) {
            shiftPoint( points[ i ] );
        }
    }

    function animate( timestamp ) {
        if( animateHeader ) {
            ctx.clearRect( 0, 0, width, height );
            for( var i in points ) {
                // detect points in range
                var curDistance = getDistance( target, points[ i ] );
                if( curDistance < 4000 ) {
                    points[ i ].active = 0.3;
                    points[ i ].circle.active = 0.6;
                } else if( curDistance < 20000 ) {
                    points[ i ].active = 0.1;
                    points[ i ].circle.active = 0.3;
                } else if( curDistance < 40000 ) {
                    points[ i ].active = 0.02;
                    points[ i ].circle.active = 0.1;
                } else {
                    points[ i ].active = 0;
                    points[ i ].circle.active = 0;
                }
                drawLines( points[ i ] );
                points[ i ].circle.draw();
            }
        }
        setTimeout( function(){ requestAnimationFrame( animate ); }, delayFrameRate  );
    }

    function shiftPoint( p ) {
        TweenLite.to( p, 1 + 1 * Math.random(), {
            x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100,
            onComplete: function() {
                shiftPoint( p );
            }
        } );
    }

    // Canvas manipulation
    function drawLines( p ) {
        if( !p.active ) return;
        for( var i in p.closest ) {
            ctx.beginPath();
            ctx.moveTo( p.x, p.y );
            ctx.lineTo( p.closest[ i ].x, p.closest[ i ].y );
            ctx.strokeStyle = 'rgba(255,255,255,' + p.active + ')';
            ctx.stroke();
        }
    }

    function Circle( pos, rad, color ) {
        var _this = this;

        // constructor
        ( function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        } )();

        this.draw = function() {
            if( !_this.active ) return;
            ctx.beginPath();
            ctx.arc( _this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false );
            ctx.fillStyle = 'rgba(255,255,255,' + _this.active + ')';
            ctx.fill();
        };
    }

    // Util
    function getDistance( p1, p2 ) {
        return Math.pow( p1.x - p2.x, 2 ) + Math.pow( p1.y - p2.y, 2 );
    }

} );