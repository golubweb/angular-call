/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: This controller rejects paramethar after klicking on pagination, start number is multiplying with number of calls per page, and its used as a paramater for taking storageFactory from which we get part of 5 objects for new list of calls on page that we are appending troughout new template
*
***************************/

myApp.controller('paginationCtrl', ['$scope', '$compile', '$templateRequest', 'storageFactory', function($scope, $compile, $templateRequest, storageFactory){
	$scope.pgnStorage = function(startNmb){
		var startItm = startNmb * $scope.pagination;
		promise = storageFactory.partItems(startItm, $scope.howMany);

		promise.then(function(result){
			$scope.pgnItms = result;

			if(angular.isObject($scope.pgnItms)){
				$templateRequest('app/templates/pagination_Items.tpl.html').then(function(html){
					var template = angular.element(html);
					$('.listWrap').empty().append($compile(template)($scope));
					$('.pagination li').removeClass('active');
					$('.pagination li:eq(' + startNmb + ')').addClass('active');
				});
			}
		});
	}
}])