/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Directive pagination waits for rootScope.pagCount with lenght of object call, on which ground he will have lenght of pagination that he will forward  to template in shape of scope.pgnSize
*
***************************/

myApp.directive('pagination', ['$rootScope', '$interval', '$compile', '$templateRequest', function($rootScope, $interval, $compile, $templateRequest) {
	return {
		restrict: 'E',
		scope: true,
		link: function (scope, element, attr) {
			var promise = $interval(function(){

				if($rootScope.pagCount !== null){
					$interval.cancel(promise);
					scope.pgnSize = attr.size;

					$templateRequest('app/templates/pagination_Board.tpl.html').then(function(html){
						element.replaceWith($compile(angular.element(html))(scope));
					});
				}
			}, 1000);
		}
	}
}]);