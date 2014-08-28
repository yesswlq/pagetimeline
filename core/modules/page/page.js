/**
 * Created by nant on 2014/7/12.
 */

exports.version = '0.1';

exports.module = function(pagetimeline, callback){
	pagetimeline.log( 'dom ready and onLoad, and open page ...' );

	var browser = pagetimeline.model.browser;
	var startTime = pagetimeline.model.startTime;
	var timeout = pagetimeline.getParam( 'timeout' ) + 1000;
	var url = pagetimeline.model.url;
	var runstep = pagetimeline.model.runstep;

	browser.onDomContentEventFired( function(res){
		var toInejctScript = getInjectScript();
		browser.evaluate( toInejctScript, function(err, res){} );

		getStartTime( function(err, tmpRes){
			if( !err ) startTime = tmpRes.result.value['navigationStart'];

			var domreadyTime = res.timestamp * 1000 - startTime;
			pagetimeline.setMetric( 'domreadyEvent', parseInt( domreadyTime ) );
		} );
	} );

	browser.onLoadEventFired( function(res){
		getStartTime( function(err, tmpRes){
			if( !err ) startTime = tmpRes.result.value['navigationStart'];

			var onloadTime = res.timestamp * 1000 - startTime;
			pagetimeline.setMetric( 'onloadEvent', parseInt( onloadTime ) );

			setTimeout( function(callback){
				callback( false, {message:'analyze page done!'} );
			}, timeout, callback );
		} );
	} );

	if( runstep == 1 ){
		browser.setCacheDisabled( true, function(err, res){
		} );
	}else{
		browser.setCacheDisabled( false, function(err, res){
		} );
	}

	browser.navigate( url, function(err, res){
		if( err ){
			callback( true, {message:'page open fail!'} );
		}
	} );

	function getTiming(){
		return window.performance.timing;
	}

	function getStartTime(callback){
		var script = getTiming.toString() + ';getTiming()';
		browser.evaluate( script, function(err, res){
			callback( err, res );
		} );
	}

	function getInjectScript(){
		//jquery, see at:http://www.learningjquery.com/2009/04/better-stronger-safer-jquerify-bookmarklet/
		return '(function(){var el=document.createElement("div"),b=document.getElementsByTagName("body")[0],' +
			'otherlib=false,msg="";el.style.position="fixed";el.style.height="32px";el.style.width="220px";el.' +
			'style.marginLeft="-110px";el.style.top="0";el.style.left="50%";el.style.padding="5px 10px";el.style.' +
			'zIndex=1001;el.style.fontSize="12px";el.style.color="#222";el.style.backgroundColor="#f99";' +
			'if(typeof jQuery!="undefined"){msg="This page already using jQuery v"+jQuery.fn.jquery;return showMsg()' +
			'}else{if(typeof $=="function"){otherlib=true}}function getScript(url,success){var script=' +
			'document.createElement("script");script.src=url;var head=document.getElementsByTagName("head")[0],' +
			'done=false;script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||' +
			'this.readyState=="loaded"||this.readyState=="complete")){done=true;success();script.onload=' +
			'script.onreadystatechange=null;head.removeChild(script)}};head.appendChild(script)}getScript' +
			'("//libs.baidu.com/jquery/1.9.1/jquery.min.js?v=pagetimeline",function(){if(typeof jQuery=="undefined")' +
			'{msg="Sorry, but jQuery was not able to load"}else{msg="This page is now jQuerified with v"+' +
			'jQuery.fn.jquery;if(otherlib){msg+=" and noConflict(). Use $jq(), not $()."}}return showMsg()});' +
			'function showMsg(){el.innerHTML=msg;b.appendChild(el);window.setTimeout(function(){if(typeof jQuery' +
			'=="undefined"){b.removeChild(el)}else{jQuery(el).fadeOut("slow",function(){jQuery(this).remove()});' +
			'if(otherlib){$jq=jQuery.noConflict()}}},2500)}})();'
	}
}

exports.name = 'page';
