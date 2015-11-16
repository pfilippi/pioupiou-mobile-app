angular.module('pioupiou.services', [])

.factory('resource', ['$http', '$timeout', function($http, $timeout) {
	
	return function(url){

		var timeout;
		
		var resource = {
			error: false,
			data : null,
			pollCancel : function(){
				$timeout.cancel(timeout);
			},
			pollStart : function(delay){
				return $http({
					method : 'GET',
					url : url
				}).then(
					function(response){
						resource.error = false;
						resource.data = response.data.data;
						timeout = $timeout(function(){resource.pollStart(delay)}, delay);
					},
					function(error){
						resource.error = true;
						timeout = $timeout(function(){resource.pollStart(1000)}, 1000);
					}
				);
			}
		};
			
		return resource;
	}
}])

.factory('pioupiou', ['resource', function(resource) {
	
	return function(pioupiou_id){
		return resource('http://api.pioupiou.fr/v1/live/' + pioupiou_id);
	};
}])

.factory('pioupiouLastHour', ['resource', function(resource) {
	
	return function(pioupiou_id){
		return resource('http://api.pioupiou.fr/v1/archive/' + pioupiou_id + '?start=last-hour&stop=now');
	};
}])

.factory('pioupious', ['resource', function(resource) {
	
	return resource('http://api.pioupiou.fr/v1/live/all');
}])

.factory('bookmarks', [function() {

	var bookmarks = JSON.parse(window.localStorage['bookmarks'] || '{}');

	function store(){
		window.localStorage['bookmarks'] = JSON.stringify(bookmarks);
	}

	return {
		add : function(pioupiou){
			bookmarks[pioupiou.id] = pioupiou.meta.name;
			store();
		},
		remove : function(pioupiou_id){
			delete bookmarks[pioupiou_id];
			store();
		},
		bookmarks : bookmarks
	};
}]);



