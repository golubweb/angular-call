/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: CallServise is used that we can take calls.json and return it like object list
*
***************************/

myApp.service('callServices', ['$http', function($http){
	return {
		getData: function(url) {
			var getData = {};

			this.getData = $http({
				method: 'GET',
				url: url
			});

			return this.getData;
		}
	}
}]);