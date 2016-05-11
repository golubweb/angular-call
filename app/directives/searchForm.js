/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: searchForm directive is recieving parameter which forwards directives for call search, depending of parameter search from local storage and returns the value with right template
*
***************************/

myApp.directive('searchForm', ['$compile', '$templateRequest', '$timeout', 'storageFactory', function($compile, $templateRequest, $timeout, storageFactory){
	return {
		restrict: 'A',
		controller: function($scope) {

			this.numberInput = function(elmt, regAttr, tmp, evt, ul) {
				var elem = elmt[0];
				var regex = RegExp(regAttr);

				elem.addEventListener(evt, function(e){
					$scope.removeList($(this));

					if(regex.test(elem.value)) {
						if($(elem).is("[number-score]")){
							$scope.scoreResult(elem.value);

						} else if($(elem).is("[number-duration]")) {
							$scope.durationResult(elem.value);

						} else {
							$scope.deysResult(elem.value);
						}

						if(e.keyCode === 8 || elem.value == "" || elem.value == null) {
							$scope.removeList($(this)); 
						}

						$scope.getTpl(tmp, elmt.parent());
					}else {
						elem.value = elem.value.substring(0, elem.value.length - 1);
					}

				});
			};

			$scope.scoreResult = function(score){
				$scope.score = [];
				$scope.searchScore = JSON.parse(storageFactory.getItms());  

				angular.forEach($scope.searchScore, function(item) {
					if(parseInt(item.evaluation.totalScore) == parseInt(score)){
						$scope.score.push(item);
					} 
				});
			};

			$scope.durationResult = function(duration){
				$scope.duration = [];
				$scope.searchDuration = JSON.parse(storageFactory.getItms());  

				angular.forEach($scope.searchDuration, function(item) {
					if(parseInt(item.durationTime) <= parseInt(duration)){
						$scope.duration.push(item);
					} 
				});
			};

			$scope.deysResult = function(days){
				$scope.days = [];
				$scope.searchDays = JSON.parse(storageFactory.getItms());  

				angular.forEach($scope.searchDays, function(item) {
					if(parseInt(item.ago) <= parseInt(days)){
						$scope.days.push(item);
					} 
				});
			}

			$scope.getTpl = function(tmpUrl, rowElem) {
				$templateRequest(tmpUrl).then(function(html){
					var template = angular.element(html);

					rowElem.append($compile(angular.element(html))($scope));
				});
			}
			
			$scope.removeList = function(elem){
				$(elem).next().remove();
			}
		}
	};
}]);