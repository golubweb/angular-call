/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: based on route parameters, we are setting appropriate controller and template
*
***************************/

myApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {templateUrl: 'app/templates/items_List.tpl.html', controller: 'mainCtrl'}).
		when('/call/:callID', {templateUrl: 'app/templates/item_Detail.tpl.html', controller: 'itemCtrl'}).
		otherwise({redirectTo: '/'});
}]);