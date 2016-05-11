/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Directive Audios will replace Div element on single item page and take value of attribute code which name call mp3's
* Than it will replace Div with new HTML5 element audios and load path to the mp3 call.
*
***************************/

myApp.directive('audios', ['$sce', function($sce) {
	return {
		restrict: 'A',
		scope: { code:'=' },
		link: function (scope) {
			scope.$watch('code', function (newVal, oldVal) {
				if (newVal !== undefined) {
					scope.url = $sce.trustAsResourceUrl("assets/audio/" + newVal);
				}
			});
		},
		replace: true,
		template: '<audio class="audioVoice" ng-src="{{url}}" controls></audio>'
	};
}]);