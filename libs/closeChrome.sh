#!/bin/sh

getXvfbAuthDir()
{
	xvfbDir=$(ls -t /tmp | grep 'xvfb-run\..*');
	for dir in $xvfbDir
	do
	    if [ $dir = $1 ]; then
		    echo "$dir";
		    return 0;
	    fi
	done
	return 1;
}

getXvfbPid()
{
	echo $(ps aux | pgrep -f $1);
	return 0;
}

killProc()
{
	if [ ! $1 ]; then
		if [ $1 -gt 0 ];then
			kill -9 $1;
		fi
	fi
}

xvfbKey="xvfb.*--remote-debugging-port=$1";
xvfbPid=$(getXvfbPid $xvfbKey);
killProc $xvfbPid;
xvfbAuthDir=$(getXvfbAuthDir $2);
xvfbAuthPid=$(getXvfbPid $xvfbAuthDir);
killProc $xvfbAuthPid;
curDir=$( pwd )
cd /tmp
rm -rf $xvfbAuthDir
cd $curDir


