/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: This directive takes the value input fields in which user searches agent ID and forwards it into search controller that further processed parameter
* Than new template is loaded for finded values if there are ones
*
***************************/

myApp.directive('numberAgent', ['$compile', '$templateRequest', function($compile, $templateRequest){
	return {
		restrict: 'A',
		scope: true,
		controller: 'searchCtrl',
		link: function(scope, elem, attr, searchCtrl){
			var agentName = '';
			var searchWrap = $('.search-wrap');

			elem.bind("keyup", function (event) {
				$(searchWrap.selector).remove();
				agentName = event.target.value;

				if(agentName.length >= 3){
					searchCtrl.agentResult(agentName);

					$templateRequest('app/templates/search_AgentID.tpl.html').then(function(html){
						var template = angular.element(html);

						elem.parent().append($compile(template)(scope));
					});
				} else {
					$(searchWrap.selector).remove();
				}
			});
		}
	}
}]);