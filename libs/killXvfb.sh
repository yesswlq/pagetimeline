#!/bin/sh

NAME="Xvfb"
for pid in $(pgrep "$NAME"); 
do 
   kill -9 $pid
done
