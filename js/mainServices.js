
myApp.service('callServices', ['$http', function($http){
	return {
		getData: function(url) {
			var getData = {};

			this.getData = $http({
				method: 'GET',
				url: url
			});

			return this.getData;
		},

		itemData: function() {
			var itmData = {};

			this.itmData = $http({
				method: 'GET',
				url: url
			});

			return this.itmData;
		}
	}
}]);