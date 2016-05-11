/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: orderOneItem filtrer returns list of calls ordered by call ID's
*
***************************/

myApp.filter('orderOneItem', function(){
	return function(collection, keyname) {
		var output = [], 
		keys = [];

		angular.forEach(collection, function(item) {
			var key = item[keyname];

			if(keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});

		return output;
	}
});