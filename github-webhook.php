<?php

date_default_timezone_set( 'Europe/Paris' );
$curDateTime = date( 'Y-m-d – H:i:s' );

main();

function main()
{
    global $curDateTime;
    if( isset( $_POST[ 'payload' ] ) )
    {
        $myfile = fopen( "github-webhook.log", "w" ) or die ( "Impossible d’ouvrir “github-webhook.log” en écriture" );
        fwrite( $myfile, $curDateTime );
        fclose( $myfile );

        chdir( '$HOME/revelation-1/' );
        $cmd = "git pull > /dev/null &";
        exec( $cmd );
    }
}

?>
