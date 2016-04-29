myApp.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

myApp.filter('moment', [ function () {
  	return function (date, method) {
  		var momented = moment(date);
        return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
  	};
}]);	


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

      var durationHours = (hours < 1) ? 1 : hours;
      item.durationTime = (durationHours * 60) + minutes;

      return item;
    }
});

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

      console.log(parseInt(item.day) - currentDay);
      console.log(year + (parseInt(item.month) * 31) + (parseInt(item.day) - currentDay) );

      item.age = year + (parseInt(item.month) * 31) + (parseInt(item.day) - currentDay);

      return item;
    }
});