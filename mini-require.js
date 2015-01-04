var define;
var require; 

;(function(window){
	
	'use strict';

	var requireConf = {
		baseUrl : './',
		paths : {},
		urlArgs : '' 
	};
	
	// 模块缓存
	var moduleCache = null;

	// 模块映射 { 'a.js' : 'a' , 'b.js' : b}
	var moduleMap = {};

	/**
	 * 将 [moduleName + '.extension'] 形式的字符串转为url  for script src
	 * @param  {[String]} source 源字符串 'lib/jquery' + '.js' 'lib/common/jquery.ui.sortable-1.0.0'
	 * @return {[String]}  url
	 */
	var toUrl = function(source){
		var url = source;

		console.log(requireConf.baseUrl)

		// 相对路径时，添加baseUrl
		//if (!/^([a-z]{2,10}:\/)?\//i.test(url)) {
			url = requireConf.baseUrl + url;
		//}

		// lib/jquery.js?v=version
		if(requireConf.urlArgs){
			url += requireConf.urlArgs;
		}

		return url;
	};

	/**
	 * load module
	 * @param  {[String]}   id 依赖模块
	 * @param  {Function} callback 回调函数
	 */
	var loadModule = function(id,callback){

		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.src = toUrl( id + '.js');
		oScript.charset = 'usf-8';
		oScript.async = true;

		oScript.setAttribute('data-modulename',id);

		var oHead = document.getElementsByTagName('head')[0];
		oHead.appendChild(oScript);
		
		oScript.onload = function(){
			var moduleName = this.getAttribute('data-modulename');

			console.log('id',id)

			// 关键代码 script onload完成 取缓存
			moduleMap[moduleName] = moduleCache;  

			console.log('moduleCache==',moduleCache);

			callback(moduleName, moduleCache);

			moduleCache = null;
		}

	};


	// define(id?,deps?,factory(mod1,mod2){});

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

	/**
	 * 定义模块方法
	 * @param  {[String]} id 模块标识 
	 * @param  {[Array]} deps 依赖模块列表
	 * @param  {[Function]} factory 创建模块的工厂方法
	 */
	var define = function(id, deps, factory){

		// anonymous modules
		if(typeof id != 'string'){ 
			factory = deps;
			deps = id;
			id = null;
		}

		// this module may not have dependencies
		if( !Array.isArray(deps) ){
			factory = deps;
			deps = [];
		}

		if(deps.length){
			
			// 所有的deps加载完成，执行factory，并将缓存的modules作为参数传入
			loadModules(deps,function(modules){
				moduleCache = factory.apply(window,modules);
			});

		}else{
			moduleCache = factory();
		}

		console.log( document.currentScript )
	};

	/**
	 * 加载模块方法
	 * @param  {[Array]}   ids 模块id数组
	 * @param  {Function} callback 加载完成的回调函数
	 */
	var require = function(ids,callback){
		loadModules(ids,function(modules){
			moduleCache = factory.apply(window,modules);
		});
	};

	/**
	 * extend
	 * @target  {[Object]} 
	 * @clone  {[Object]}  
	 * @deep  {[Boolean]} 是否深copy
	 * @return {[Object]} target 
	 */
	var extend = function(target,clone,deep){
	    var deep = deep ? deep : false;
	    if(deep){

	        for(var key in clone){
	            if(typeof clone[key] === 'object'){
	                extend(deep,target[key],clone[key]);
	            }else{
	                target[key] = clone[key];
	            }
	        }

	    }else{
	        for(var key in clone){
	            target[key] = clone[key];
	        }
	    }

	    return target;
	}

	/**
	 * 配置参数
	 * @param  {[Object]} conf 配置参数
	 */
	require.config = function(conf){
		if(conf){
			extend( requireConf, conf, true )
		}
		console.log(requireConf)
	};
	
	window.define = define;
	window.require = require;


})(window);
