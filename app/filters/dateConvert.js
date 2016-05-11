/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: dateConvert filter receives four parametars (list of calls(objets), dates(strings), current year, current day.
* Secund parametar converts string of month into string number that we add to the item object
* From that we get history of the call as a new value item.ago into days
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