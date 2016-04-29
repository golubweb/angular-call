//Storage Factory
myApp.factory('storageFactory', ['$q', function($q) {
	return {
		insetItms: function(items) {
			localStorage.removeItem('call_items');
			localStorage.setItem('call_items', JSON.stringify(items));
		},

		getItms: function() {
			return localStorage.getItem('call_items');
		},

		singleItm: function(id) {
			var item = JSON.parse(localStorage.getItem('call_items'));
			
			return item[id];
		},

		partItems: function(start, end) {
			var q = $q.defer();

			var itemsPgn = JSON.parse(localStorage.getItem('call_items'));

			q.resolve(itemsPgn.splice(start, end));
				
			return q.promise;
		},

		removeItms: function(key) {
			localStorage.removeItem(key);
		}
	}
}]);