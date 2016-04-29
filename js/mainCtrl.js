
myApp.controller('mainCtrl', ['$scope', '$rootScope', '$filter', 'callServices', 'storageFactory', function($scope, $rootScope, $filter, callServices, storageFactory){
	$scope.howMany = 5;
	$scope.pagination = 5;
	$scope.date = new Date();
	$scope.year = $scope.date.getFullYear();
	$scope.day = $scope.date.getDate();

	$scope.storage = function(){
		if(!localStorage['call_items']){
			$scope.list = [];
	
			callServices.getData('data/calls.json').then(function(response){
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

myApp.controller('paginationCtrl', ['$scope', '$compile', '$templateRequest', 'storageFactory', function($scope, $compile, $templateRequest, storageFactory){
	$scope.pgnStorage = function(startNmb){
		var startItm = startNmb * $scope.pagination;
		promise = storageFactory.partItems(startItm, $scope.howMany);

		promise.then(function(result){
			$scope.pgnItms = result;

			if(angular.isObject($scope.pgnItms)){
				$templateRequest('partials/pagination_Items.tpl.html').then(function(html){
					var template = angular.element(html);
					$('.listWrap').empty().append($compile(template)($scope));
					$('.pagination li').removeClass('active');
					$('.pagination li:eq(' + startNmb + ')').addClass('active');
				});
			}
		});
	}
}]);


myApp.controller('searchCtrl', ['$scope', 'storageFactory', function($scope, storageFactory){
	$scope.agent = [];

	this.agentResult = function(searchText){
		$scope.searchAgent = JSON.parse(storageFactory.getItms());

		angular.forEach($scope.searchAgent, function(item) {
			if(item.agent.agendID.toLowerCase() == searchText.toLowerCase()){
				$scope.agent.push(item);
			}
		});
	}

}]);
