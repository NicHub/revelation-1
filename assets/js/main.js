"use strict";


$( document ).ready( function() {



  // Lit l’heure de la dernière mise à jour des fichiers
  // (pull de Github avec Webhook)
  ( function() {
    var last_update = $( 'p#last-update' );
    // On ne fait la requête que si p#last-update existe sur la page
    if( last_update.length > 0 )
    {
      $.getJSON( "http://osonsnousreveler.com/github-webhook-log.json", function( data ) {
        last_update.html( "Dernière mise à jour<br/>" + data.github_webhook_last_pull_time );
      });
    }
  })();



  // http://jedfoster.com/Readmore.js/
  ( function() {
    $('article').readmore({
      collapsedHeight: 293,
      speed: 200
    });

    // Wait a tick before firing Readmore on the #info block to give Prettify time to finish painting.
    setTimeout(function() {
      $('#info').readmore({
        moreLink: '<a href="#">Usage, examples, and options</a>',
        collapsedHeight: 632,
        speed: 200,
        afterToggle: function(trigger, element, expanded) {
          if(! expanded) { // The "Close" link was clicked
            $('html, body').animate({scrollTop: $(element).offset().top}, {duration: 100});
          }
        }
      });
    }, 100);
  })();




  // Ajoute target="_blank" aux liens externes.
  ( function() {
    var internal = location.host.replace( "www.", "" );
    internal = new RegExp( internal, "i" );
    var a = document.getElementsByTagName( 'a' );
    for( var i = 0; i < a.length; i++ ) {
      var href = a[ i ].host;
      if( !internal.test( href ) ) {
        a[ i ].setAttribute( 'target', '_blank' );
      }
    }
  })();




  // Navigation avec le clavier.
  ( function() {
    var menuLinks = $( "ul.nav li:not(.dropdown)" );
    var nbLinks = menuLinks.length;

    var activeLinkIndex = -1;
    for( var i=0; i<nbLinks; i++ ) {
      if( $( menuLinks[ i ] ).hasClass( "active" ) )
      {
        activeLinkIndex = i;
        break;
      }
    }

    var nextLink = $( menuLinks[ activeLinkIndex < (nbLinks - 1) ? activeLinkIndex + 1 : 0           ] ).children( "a" ).attr( 'href' );
    var prevLink = $( menuLinks[ activeLinkIndex > 0             ? activeLinkIndex - 1 : nbLinks - 1 ] ).children( "a" ).attr( 'href' );
    var firstLink = $( "ul.nav li" ).first().children( "a" ).attr( 'href' );

    $( 'a#bouton-prec' ).attr( "href", prevLink );
    $( 'a#bouton-suiv' ).attr( "href", nextLink );

    Mousetrap.bind( 'left',       function( e ) { navigate_to_page( e, prevLink  ); });
    // Mousetrap.bind( 'esc',        function( e ) { navigate_to_page( e, firstLink ); });
    Mousetrap.bind( 'right',      function( e ) { navigate_to_page( e, nextLink  ); });

    $( 'body' ).on( 'mousedown',  function( e ) { disable_swipe( e ); });
    $( 'body' ).on( 'touchstart', function( e ) { enable_swipe( e );  });

    var navigate_to_page = function( e, targetHref ) {
      window.location.href = targetHref;
    }
    function disable_swipe( e ) {
      $( 'body' ).off( 'swiperight swipeleft' );
    }
    function enable_swipe( e ) {
      $( 'body' ).on( 'swiperight', function( e ) { navigate_to_page( e, prevLink ); });
      $( 'body' ).on( 'swipeleft',  function( e ) { navigate_to_page( e, nextLink ); });
    }
  })();

});
