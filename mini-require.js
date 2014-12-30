;(function(window){
	
	'use strict';

	var define ;
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


	define = function(name, deps, callback){

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
			deps.forEach(function(value, index ,array){
				loadModule(value,function(m){
					moduleCache = callback(m);
				});
			});
		}else{
			moduleCache = callback();
		}


	}
	
	window.define = define;

})(window);