define(function(){
	'use strict';

	var add = function(){
		var result = arguments[0];

		for(var i=1, len=arguments.length; i<len; i++){
			result += arguments[i]
		}

		return result;

	}

	return {
		add : add
	};
});

