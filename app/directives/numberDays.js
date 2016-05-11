/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: numberDays directive forwards five parameters searchForm directive that process parameters, and depending from the results, it sets methodes and templates
*
***************************/

myApp.directive('numberDays', function(){
	return {
		restrict: 'A',
		require: '^searchForm',
		link: function(scope, element, attrs, searchFormController){
			searchFormController.numberInput(element, attrs.numberDays, 'app/templates/search_Days.tpl.html', 'keyup', '.search-days');
		}
	}
});