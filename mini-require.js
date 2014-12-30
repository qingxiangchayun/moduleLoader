;(function(window){
	
	'use strict';
	
	var moduleCache = null;

	var moduleMap = {};

	var loadModule = function(src,callback){

		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.src = src;
		oScript.charset = 'usf-8';
		oScript.async = true;

		oScript.setAttribute('data-modulename',src);

		var oHead = document.getElementsByTagName('head')[0];
		oHead.appendChild(oScript);
		
		oScript.onload = function(){
			var moduleName = this.getAttribute('data-modulename');

			moduleMap[moduleName] = moduleCache;

			callback(moduleMap);
		}

	};

	var define = function(name, deps, callback){

		var depCount = 0;

		// anonymous modules
		if(typeof name != 'string'){ 
			callback = deps;
			deps = name;
			name = null;
		}

		// this module may not have dependencies
		if( !Array.isArray(deps) ){
			callback = deps;
			deps = [];
		}

		if(deps.length){
			
			for (var i=0, len=deps.length; i<len; i++){

				(function(i){

					depCount ++ ;

					loadModule(deps[i], function(){

					});

				})(i)
			}

		}else{
			moduleCache = callback();
		}
	};
	
	window.define = define;

})(window);

// 推荐 https://github.com/sxzhangjia/tinyblog/blob/v1/static/js/g.js