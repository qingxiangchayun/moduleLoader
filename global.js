define(function(){
	'use strict';

	var Tool = function(){

	};

	Tool.a = 'aaa';

	Tool.fn = function(){
		console.log(this.a);
	}

	return Tool;
});

