/**
 *
 * Created by nant on 2014/7/9.
 */

exports.version = '0.1';
exports.name = 'loadtimes';

exports.run = function(pagetimeline, callback){
	pagetimeline.log( 'load time...' );
	var startTime = pagetimeline.model.startTime;
	var timeout = pagetimeline.getParam( 'timeout' );
	var browser = pagetimeline.model.browser;

	var requestId_info = {};

	browser.onResponseReceived( function(res){
		var requestId = res['requestId'];
		var timestamp = res['timestamp'];
		var response = res.response;
		var url = response.url;
		if( !requestId_info[requestId] ){
			requestId_info[requestId] = {}
		}
		requestId_info[requestId] = {
			'url':url,
			'timestamp':timestamp,
			'responseBody':response
		};
	} );

	browser.onLoadEventFired( function(res){
		setTimeout( function(){
			var start = +new Date();
			var loadTime = getSlowestTime() - startTime;
			pagetimeline.log( 'load time done in ' + (+new Date() - start ) + 'ms' );
			pagetimeline.setMetric( 'loadTime', parseInt( loadTime ) );
		}, timeout );
	} );

	callback( false, {message:'add load time module!'} );

	function getSlowestTime(){
		var slowestTime = 0;
		for( var requestId in requestId_info ){
			var entry = requestId_info[requestId];
			var timestamp = entry['timestamp'];
			if( timestamp > slowestTime ){
				slowestTime = timestamp;
			}
		}
		return slowestTime * 1000;
	}

	function getRequestTimeByUrl(requests){
		var requestsByUrl = {};
		for( var requestId in requests ){
			var requestInfo = requests[requestId];
			var url = requestInfo['url'];
			var timestamp = requestInfo['timestamp'];
			if( timestamp && !requestsByUrl[url] ){
				requestsByUrl[url] = timestamp;
			}
		}
		return requestsByUrl;
	}
}
