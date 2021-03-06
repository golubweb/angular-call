/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Ovde definisemo modul myApp i ucitavamo (Dependencies route)
*
***************************/

var myApp = angular.module('myApp', ['ngRoute']);
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Na osnovu route parametara setujemo odgovarajuci controller i template
*
***************************/

myApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {templateUrl: 'app/templates/items_List.tpl.html', controller: 'mainCtrl'}).
		when('/call/:callID', {templateUrl: 'app/templates/item_Detail.tpl.html', controller: 'itemCtrl'}).
		otherwise({redirectTo: '/'});
}]);
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Main Controller sluzi za ucitavanje podataka iz calls.json fajla u localstorade ukoliko se vec ne nalazi tamo. Ovde se setuje broj poziva po stranici i uzima trenutna godina i dan, zatim se svaki red iz calls.json
*  provlaci kroz filter za duzinu poziva i starost poziva. Rezultat toga se cuva u localstorage kao 'call_items' i ubacuje u scope.list koji koristimo u templete
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Ovaj kontroler prima parametar callID na osnovu kog se iz localstoraga uzima jedan item i ubacuje u scope.item koji se koristi u templete za single iteme.
* Takodje imamo tri metode, prva totalScore za izracunavanje skora za item. Druga metoda za menja item posle submita forme i cuva promene u localstorage. Treca restartuje vrednosti forme da bi se unele nove.
*
***************************/

myApp.controller('itemCtrl', ['$scope', '$routeParams', 'storageFactory', function($scope, $routeParams, storageFactory){
	$scope.call = storageFactory.singleItm($routeParams.callID - 1);

	$scope.call.oldTotal = true;
	$scope.call.newTotal = false;

	$scope.filterCondition = {
		operator: $scope.call.evaluation.improvement
	}

	$scope.improvement = [
		{'name': 'Soft skills ­ communication', 'value': 'Soft skills ­ communication'},
		{'name': 'hard skills ­ products', 'value': 'hard skills ­ products'},
		{'name': 'call technique', 'value': 'call technique'}
	];

	$scope.totalScore = function(){
		$scope.call.oldTotal = false;
		$scope.call.newTotal = true;
		$scope.total = (parseInt($scope.call.evaluation.customerScore) + parseInt($scope.call.evaluation.managerScore)) / 2;
	}

	$scope.insertCallFrm = function() {
		var id = $scope.call.callId - 1;
		$scope.item = JSON.parse(storageFactory.getItms());

		$scope.item[id].evaluation.customerScore = $scope.call.evaluation.customerScore;
		$scope.item[id].evaluation.managerScore = $scope.call.evaluation.managerScore;
		$scope.item[id].evaluation.improvement = $scope.call.evaluation.improvement;
		$scope.item[id].evaluation.resume = $scope.call.evaluation.resume;
		$scope.item[id].evaluation.totalScore = $scope.total;

		storageFactory.insetItms($scope.item);
		$scope.msgForm = 'Successful update';
	}
	
    $scope.resetFrm = function() {
    	$scope.call.evaluation.customerScore = '';
    	$scope.call.evaluation.managerScore = '';
    	$scope.call.evaluation.resume = '';
        $scope.totalScore();
    	$scope.total = 0;
    }
}]);
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Ovaj controller odbija parametar nakon klika na paginaciju, pocetni broj se mnozi sa brojem poziva po stranici i koristi kao parametar za uzimanje iz storageFacrtory iz koga dobijamo deo 
* od 5 objekata za novu listu poziva na stranici koju appendujemo kroz novi template
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Ovaj controller dobija string parametar kojim se vrsi poredjenje po agendID svojstvu objekta iz localstorage. Prolazi se kroz sve pozive i mecuje parametar sa agendID, ukoliko ima 
* rezultata ubacuju se u scope.agent
*
***************************/

myApp.controller('searchCtrl', ['$scope', 'storageFactory', function($scope, storageFactory){
	this.agentResult = function(searchText){
		$scope.agent = [];
		$scope.searchAgent = JSON.parse(storageFactory.getItms());

		angular.forEach($scope.searchAgent, function(item) {
			if(item.agent.agendID.toLowerCase() == searchText.toLowerCase()){
				$scope.agent.push(item);
			}
		});
	}

}]);
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Audios directiva ce zameniti div element na na single item stranici i uzeti vednost atributa code koji je naziv call mp3-a. 
* Zatim ce zamenti div novim html5 elementom (audios) i ucitati putanju do mp3 poziva. 
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Pagination directiva ceka rootScope.pagCount sa duzinom objekta call na osnovu kog ce imati duzinu paginacije koju ce proslediti templatu u vidu scope.pgnSize
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: audioSource directiva uzma src putanju do mp3 zatim ga setuje na click u audio element na vrhu stranice i pusta poziv. 
*
***************************/

myApp.directive('audioSource', function() {
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
						'src': 'assets/audio/' + attr.audioSource,
						'ngSrc': 'assets/audio/' + attr.audioSource,
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
		}
	};
});
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: searchForm directiva vrsi prijem parametara koje prosledjuju direktive za search poziva, u zavisnosti od parametara pretrazuju pozive iz localstorage i vracaju vrednost sa odgovarajucim template
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: numberScore directiva prosledjuje pet parametara searchForm directivi koja obradjuje parametre i u zavisnosti od toga setuje metode i template
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: numberDuration directiva prosledjuje pet parametara searchForm directivi koja obradjuje parametre i u zavisnosti od toga setuje metode i template
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: numberDays directiva prosledjuje pet parametara searchForm directivi koja obradjuje parametre i u zavisnosti od toga setuje metode i template
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Ova direktiva uzima value input polja u koje korisnik search-uje agentID i prosledjuje ga search controlleru koji dalje obradjuje parametar. 
* Zatim se ucitava novi template za pronadjene vrednosti ukoliko ih ima.
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
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Storagefactory nam sluzi za cuvanje call_items liste u localStorage odakle ga mozemo uzimati celu listu ili pojedinacni poziv. Mozemo uzeti i deo od nekoliko itema ili obrisati celu listu.
*
***************************/

myApp.factory('storageFactory', ['$q', function($q) {
	return {
		insetItms: function(items) {
			localStorage.removeItem('call_items');
			localStorage.setItem('call_items', JSON.stringify(items));
		},

		getItms: function() {
			return localStorage.getItem('call_items');
		},

		singleItm: function(id) {
			var item = JSON.parse(localStorage.getItem('call_items'));
			
			return item[id];
		},

		partItems: function(start, end) {
			var q = $q.defer();

			var itemsPgn = JSON.parse(localStorage.getItem('call_items'));

			q.resolve(itemsPgn.splice(start, end));
				
			return q.promise;
		},

		removeItms: function(key) {
			localStorage.removeItem(key);
		}
	}
}]);
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Opis fajla i za sta sluzi
*
***************************/

myApp.filter("trustUrl", ['$sce', function ($sce) {
	return function (recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]);
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Opis fajla i za sta sluzi
*
***************************/

myApp.filter('moment', function () {
	return function (date, method) {
		var momented = moment(date);
		return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
	};
});	
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Opis fajla i za sta sluzi
*
***************************/

myApp.filter('orderOneItem', function(){
	return function(collection, keyname) {
		var output = [], 
		keys = [];

		angular.forEach(collection, function(item) {
			var key = item[keyname];

			if(keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});

		return output;
	}
});
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Ovaj filter prima tri parametra (poziv iz liste poziva, pocetak poziva i kraj poziva) koji koristimo u moment.js i dobijamo tacan broj sata, minuta i sekundi iz kojih pravimo nova svojstva objekta
* hours, minutes i durationTime iz kog dobijamo duzinu poziva 
*
***************************/

myApp.filter('durationConvert', function(){
	return function(item, start, end){
		var startTime = moment(start, "HH:mm:ss");
		var endTime = moment(end, "HH:mm:ss");

		var duration = moment.duration(endTime.diff(startTime));
		var hours = parseInt(duration.asHours());
		var minutes = parseInt(duration.asMinutes()) - hours * 60;

		item.hours = (hours < 10) ? "0" + hours : hours;

		var minutes = parseInt(duration.asMinutes()) - hours * 60;
		item.minutes = (minutes < 10) ? "0" + minutes : minutes;

		var seconds = parseInt(duration.asSeconds() / 1000 % 60);
		item.seconds = (seconds < 10) ? "0" + seconds : seconds;

		var durationHours = (hours < 1) ? 0 : hours;
		item.durationTime = (durationHours * 60) + minutes;

		return item;
	}
});
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Ovaj filter prima cetiri parametra (poziv iz liste poziva{objekat}, datum{string}, tenutnu godinu, trenutni dan). Drugi parametar konvertuje String meseca u string broj koji dodajemo item objektu
* , uz to dobijamo i starost poziva kao novo svojstvo item.ago u danima
*
***************************/

myApp.filter('dateConvert', function(){
	return function(item, date, currentYear, currentDay){
		switch (date[0]){
			case 'Jan': item.month = '01' 
				break;
			case 'Feb': item.month = '02' 
				break;
			case 'Mar': item.month = '03' 
				break;
			case 'Apr': item.month = '04' 
				break;
			case 'May': item.month = '05' 
				break;
			case 'Jun': item.month = '06' 
				break;
			case 'Jul': item.month = '07' 
				break;
			case 'Aug': item.month = '08' 
				break;
			case 'Sep': item.month = '09' 
				break;
			case 'Oct': item.month = '10' 
				break;
			case 'Nov': item.month = '11' 
				break;
			case 'Dec': item.month = '12'
				break;
		}

		item.day = date[1];
		item.year = date[2];

		var year = (currentYear - parseInt(item.year)) * 12;
		item.ago = year + (parseInt(item.month) * 31) + (parseInt(item.day) - currentDay);

		return item;
	}
});
/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: callServices nam sluzi da uzmemo calls.json i vracamo ga kao listu objekata
*
***************************/

myApp.service('callServices', ['$http', function($http){
	return {
		getData: function(url) {
			var getData = {};

			this.getData = $http({
				method: 'GET',
				url: url
			});

			return this.getData;
		}
	}
}]);