/**
 * Created by nant on 2014/7/9.
 */
exports.version = '0.1';

exports.module = function(pagetimeline, callback){
	var startTime = pagetimeline.startTime;
	var browser = pagetimeline.browser;
	function getFirstPaintTime(){
		var loadtimes = chrome.loadTimes();
		return loadtimes.firstPaintTime;
	}

	with( browser ){
		var str = getFirstPaintTime.toString() + ';getFirstPaintTime()';
		send( 'Runtime.evaluate', {'expression':str, returnByValue:true}, function(err, data){
			if( !err ){
				var firstPaintTime = data.result['value'] * 1000;
				var whiteScreenTime = firstPaintTime - startTime;
				pagetimeline.setMetric('whiteScreenTime', whiteScreenTime );
				callback( false, {message:'get white screen time done!'} );
			}else{
				callback( err, data );
			}
		} );
	}
}
