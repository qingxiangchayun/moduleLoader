;(function(window){
	
	'use strict';
	
	// 模块缓存
	var moduleCache = null;

	// 模块映射 { 'a.js' : 'a' , 'b.js' : b}
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

			console.log('name',name)

			// 关键代码 script onload完成 取缓存
			moduleMap[moduleName] = moduleCache;  

			console.log('moduleCache==',moduleCache);

			callback(moduleName, moduleCache);

			moduleCache = null;
		}

	};

	var util = {

	};

	// 使用AMD require写法
	// define(id?,[]?,factory(mod1,mod2){});

	// { 'a.js' : 'a' , 'b.js' : b} --> ['a','b']  a/b的顺序和deps的顺序一致
	var mapToArray = function(deps,map){
		var arr = [];

		for(var i=0,len=deps.length; i<len; i++){
			arr.push( map[deps[i]] );
		}

		return arr;
	};


	var loadModules = function(deps,callback){

		var loadedDepsCount = 0;  // 已加载完成的deps num
		var modules = null;

		for (var i=0, len=deps.length; i<len; i++){

			loadModule(deps[i], function(){
				
				// 关键代码： 每次script.onload完成 执行loadedDepsCount ++
				loadedDepsCount ++; 

				console.log( 'loadedDepsCount' , loadedDepsCount)

				if( loadedDepsCount == len ){

					modules = mapToArray(deps,moduleMap);

					callback(modules);
				}

			});
		}

	};

	var define = function(name, deps, callback){

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
			
			// 所有的deps加载完成，执行callback，并将缓存的modules作为参数传入
			loadModules(deps,function(modules){
				moduleCache = callback.apply(window,modules);
			});

		}else{
			moduleCache = callback();
		}
	};
	
	window.define = define;

})(window);
