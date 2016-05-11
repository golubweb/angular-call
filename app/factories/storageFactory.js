/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Storagefactory is used for saving call_items list in localStorage, from where we can take whole list or a single call. We can take a part from few items or we can erase the whole list
*
***************************/

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