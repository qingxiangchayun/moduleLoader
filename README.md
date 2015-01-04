a javascript module loader
==============

一个简单的AMD模块加载器

通过学习requirejs源码、自己写的一个简单的模块加载器。

### API

* 定义模块 define(id?, dependencies?, factory)
* 加载模块 require(deps,factory)

### tips
所有依赖声明方式为：依赖前置，占不支持以下两种方式 （这种方式需要 factory.toString() 使用正则去分析依赖，并将依赖文件预加载）
1、`var module = require('mod1') ;`
2、`define( function(){
	require('mod1',function(mod1){})
});`


### 参考
[requirejs](https://github.com/jrburke/requirejs);
[seajs](https://github.com/seajs/seajs);
[amdjs-api](https://github.com/amdjs/amdjs-api/wiki/AMD-%28%E4%B8%AD%E6%96%87%E7%89%88%29);

