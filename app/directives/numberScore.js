/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: numberScore directive forwards five parameters searchForm directive that process parameters, and depending from the results, it sets methodes and templates
*
***************************/

myApp.directive('numberScore', function(){
	return {
		restrict: 'A',
		require: '^searchForm',
		link: function(scope, element, attrs, searchFormController){
			searchFormController.numberInput(element, attrs.numberScore, 'app/templates/search_ScoreTotal.tpl.html', 'keyup', '.search-score');
		}
	}
});