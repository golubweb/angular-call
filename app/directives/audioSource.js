/***************************
*
* @author: Darko Golubovic
* @date: 11-05-2016
* @description: Audiosource directiv takes SRC path to the mp3, than it sets it on click in audio element on the top ot the page and plays the call
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