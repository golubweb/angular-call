/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: trustURL filtrer returns sourceUrl
*
***************************/

myApp.filter("trustUrl", ['$sce', function ($sce) {
	return function (recordingUrl) {
		return $sce.trustAsResourceUrl(recordingUrl);
	};
}]);