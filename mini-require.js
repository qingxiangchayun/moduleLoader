;(function(window){
	
	'use strict';
	
	// 模块缓存
	var moduleCache = null;

	var moduleMap = {};

	var loadModule = function(name,callback){

		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.src = name;
		oScript.charset = 'usf-8';
		oScript.async = true;

		oScript.setAttribute('data-modulename',name);

		var oHead = document.getElementsByTagName('head')[0];
		oHead.appendChild(oScript);
		
		oScript.onload = function(){
			var moduleName = this.getAttribute('data-modulename');

			alert(name)

			moduleMap[moduleName] = moduleCache;

			callback(moduleName, moduleCache);

			moduleCache = null;
		}

	};

	var loadModules = function(deps,callback){

		var depCount = 0;
		var loadedCount = 0;

		for (var i=0, len=deps.length; i<len; i++){

			depCount ++ ;

			loadModule(deps[i], function(){
				loadedCount ++;

				if( loadedCount == depCount){
					callback();
				}

			});
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
			
			loadModules(deps,function(m){
				moduleCache = callback(m);
			});

		}else{
			moduleCache = callback();
		}
	};
	
	window.define = define;

})(window);

// 推荐 https://github.com/sxzhangjia/tinyblog/blob/v1/static/js/g.js