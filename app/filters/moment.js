/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: for moment filter we are forwarding the year, month and day as parameters, as a result we get age of calls
*
***************************/

myApp.filter('moment', function () {
	return function (date, method) {
		var momented = moment(date);
		return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
	};
});	