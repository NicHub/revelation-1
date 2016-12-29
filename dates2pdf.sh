#!/bin/bash

INFILE=accompagnement-programme-dates.html
OUTFILE=accompagnement-programme-dates.pdf

prince                                         \
	$INFILE                                    \
	-o $OUTFILE                                \
	--no-author-style                          \
	--style=accompagnement-programme-dates.css


open $OUTFILE

echo -e "\n\n\n!!! MODIFIER LA DATE DE MISE À JOUR DANS LE FICHIER $INFILE !!!"