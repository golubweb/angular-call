/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Main controller is used for loading data from calls.json file into the local storage, unless he isn't already there.
* This is the place where we set the number of calls per page and it takes current day and year. Then for every row from calls.jason is passing trough filtrer for lenght and age of call. Result is saved in local storage as calls_items and insert in scope.list which we use in template
*
***************************/

myApp.controller('mainCtrl', ['$scope', '$rootScope', '$filter', 'callServices', 'storageFactory', function($scope, $rootScope, $filter, callServices, storageFactory){
	$scope.howMany = 5;
	$scope.pagination = 5;
	$scope.date = new Date();
	$scope.year = $scope.date.getFullYear();
	$scope.day = $scope.date.getDate();

	$scope.storage = function(){
		if(!localStorage['call_items']){
			$scope.list = [];
	
			callServices.getData('assets/data/calls.json').then(function(response){
				$rootScope.pagCount = Object.keys(response.data).length;
	
				angular.forEach(response.data, function(item, index){
					var convert = item.callStart.slice(4, 15);
					var convertDate = convert.split(/[ ,]+/);
	
					var durationStart = item.callStart.slice(15, 24);
					var durationEnd = item.callEnd.slice(15, 24);
	
					item = $filter('durationConvert')(item, durationStart, durationEnd);
					item = $filter('dateConvert')(item, convertDate, $scope.year, $scope.day);
	
					$scope.list.push(item);
				});
	
				storageFactory.insetItms($scope.list);
			});
	
		} else {
			var storageData = JSON.parse(storageFactory.getItms());
			$rootScope.pagCount = Object.keys( storageData ).length;
			$scope.list = storageData;
		}
	}

	$scope.range = function(nmb) {
		return new Array(nmb);
	};

}]);