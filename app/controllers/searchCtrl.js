/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: This controller gets string of Parameters it with which we do comparison ID after Agenda capacity of object from local storage . It goes through all calls and parameter match with agent ID, Unless it has a results, then scope.Agent is inputed
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