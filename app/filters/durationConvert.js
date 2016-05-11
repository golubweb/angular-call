/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: This filtrer receives three parametres (call from the list of calls, begining and end of call) which we are using in moment.js and we get the accurate number of hours, minutes and second from which we make objects new values. 
* hours,minutes and durationTime from which we get lenght of calls
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