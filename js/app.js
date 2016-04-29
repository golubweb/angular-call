myApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {templateUrl: 'partials/items_List.tpl.html', controller: 'mainCtrl'}).
        when('/call/:callID', {templateUrl: 'partials/item_Detail.tpl.html', controller: 'itemCtrl'}).
        otherwise({redirectTo: '/'});
}]);