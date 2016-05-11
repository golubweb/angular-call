/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: numberDuration directive forwards five parameters searchForm directive that process parameters, and depending from the results, it sets methodes and templates
*
***************************/

myApp.directive('numberDuration', function(){
	return {
		restrict: 'A',
		require: '^searchForm',
		link: function(scope, element, attrs, searchFormController){
			searchFormController.numberInput(element, attrs.numberDuration, 'app/templates/search_Duration.tpl.html', 'keyup', '.search-duration');
		}
	}
});