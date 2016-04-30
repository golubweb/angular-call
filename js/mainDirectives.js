myApp.directive('audios', ['$sce', function($sce) {
	return {
		restrict: 'A',
		scope: { code:'=' },
		link: function (scope) {
			scope.$watch('code', function (newVal, oldVal) {
				if (newVal !== undefined) {
					scope.url = $sce.trustAsResourceUrl("audio/" + newVal);
				}
			});
		},
		replace: true,
		template: '<audio class="audioVoice" ng-src="{{url}}" controls></audio>'
	};
}]);

myApp.directive('pagination', ['$rootScope', '$interval', '$compile', '$templateRequest', function($rootScope, $interval, $compile, $templateRequest) {
	return {
		restrict: 'E',
		scope: true,
		link: function (scope, element, attr) {
			var promise = $interval(function(){

				if($rootScope.pagCount !== null){
					$interval.cancel(promise);
					scope.pgnSize = attr.size;

					$templateRequest('partials/pagination_Board.tpl.html').then(function(html){
						element.replaceWith($compile(angular.element(html))(scope));
					});
				}
			}, 1000);
		}
	}
}]);

myApp.directive('audioSource', [ function() {
	return {
		restrict: 'A',
		scope: true,
		link: function (scope, element, attr) {
			element.addClass('voicePlay');

			element.on('click', function(e) {
				var myAudio = $('.audioVoice');

				if( myAudio.attr('data-voice') === undefined || myAudio.attr('data-voice') !== attr.voice ){
					myAudio.removeAttr('data-voice');

					myAudio.attr({
						'src': 'audio/' + attr.audioSource,
						'ngSrc': 'audio/' + attr.audioSource,
						'data-voice': attr.voice
					});
				}

				if(!myAudio.ended && $(this).hasClass('voicePlay')) {
					myAudio.trigger("play");
					$(this).removeClass('voicePlay');

				} else{
					myAudio.trigger("pause");
					$(this).addClass('voicePlay');
				}
			});
			//myAudio.paused && myAudio.currentTime > 0 && !myAudio.ended
		}
	};
}]);

myApp.directive('searchForm', ['$compile', '$templateRequest', '$timeout', 'storageFactory', function($compile, $templateRequest, $timeout, storageFactory){
	return {
		restrict: 'A',
		controller: function($scope) {
			$scope.days = [];
			$scope.agent = [];
			$scope.score = [];
			$scope.duration = [];

			this.numberInput = function(elmt, attrs, tmp, evt, ul) {
				var elem = elmt[0];
				var regex = RegExp(attrs.numberScore);
				var value = elem.value;

				elem.addEventListener(evt, function(e){
					$timeout($scope.removeList($(this)), 500);

					if(regex.test(elem.value)) {
						if(attrs.numberScore){
							$scope.scoreResult(elem.value);

						} else if(attrs.numberDuration) {
							$scope.durationResult(elem.value);

						} else {
							$scope.deysResult(elem.value);
						}

						if(e.keyCode === 8 || elem.value == "" || elem.value == null) {
							$timeout($scope.removeList($(this)), 1000); 
						}

						$scope.getTpl(tmp, elmt.parent());
					}else {
						elem.value = value;
					}

				});
			};

			$scope.scoreResult = function(score){
				$scope.searchScore = JSON.parse(storageFactory.getItms());  

				angular.forEach($scope.searchScore, function(item) {
					if(parseInt(item.evaluation.totalScore) == parseInt(score)){
						$scope.score.push(item);
					} 
				});
			};

			$scope.durationResult = function(duration){
				$scope.searchDuration = JSON.parse(storageFactory.getItms());  

				angular.forEach($scope.searchDuration, function(item) {
					if(parseInt(item.durationTime) <= parseInt(duration)){
						$scope.duration.push(item);
					} 
				});
			};

			$scope.deysResult = function(days){
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

myApp.directive('numberScore', [ function(){
	return {
		restrict: 'A',
		require: '^searchForm',
		link: function(scope, element, attrs, searchFormController){
			searchFormController.numberInput(element, attrs, '../angularCall/partials/search_ScoreTotal.tpl.html', 'keyup', '.search-score');
		}
	}
}]);

myApp.directive('numberDuration', [ function(){
	return {
		restrict: 'A',
		require: '^searchForm',
		link: function(scope, element, attrs, searchFormController){
			searchFormController.numberInput(element, attrs, '../angularCall/partials/search_Duration.tpl.html', 'keyup', '.search-duration');
		}
	}
}]);

myApp.directive('numberDays', [ function(){
	return {
		restrict: 'A',
		require: '^searchForm',
		link: function(scope, element, attrs, searchFormController){
			searchFormController.numberInput(element, attrs, '../angularCall/partials/search_Days.tpl.html', 'keyup', '.search-days');
		}
	}
}]);

myApp.directive('onKeydown', ['$compile', '$templateRequest', function($compile, $templateRequest){
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

					$templateRequest('/partials/search_AgentID.tpl.html').then(function(html){
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