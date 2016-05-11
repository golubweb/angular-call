/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: This controller receive parameter call ID on which ground we take one item from local storage and put it in scope. Item that is used for single item template
* Also, we have three metodes, first TotalScore for counting the score for items. Secund method that changes items after submiting a form and saves changes in local storage. Third restarts fom values so we can enter new one.
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