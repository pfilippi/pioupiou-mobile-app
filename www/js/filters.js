angular.module('pioupiou.filters', [])

.filter('windDirectionDegreesToText', function() {
	return function(angle){
		var index = Math.floor(angle / 22.5); /* 22.5 is 360° divided by 16 directions */
		var directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
		
		return directions[index];
	};
});
