angular.module('pioupiou.services', [])

.factory('resource', ['$http', '$timeout', function($http, $timeout) {
	
	return function(url){

		var timeout;
		var pollStart_promise;
		
		var resource = {
			error: false,
			data : null,
			pollCancel : function(){
				$timeout.cancel(timeout);
			},
			pollStart : function(delay){
				pollStart_promise = $http({
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

				return pollStart_promise;
			}, 
			withData : function(fct){
				pollStart_promise.then(fct);
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
	
	var pioupious = resource('http://api.pioupiou.fr/v1/live/all');

	pioupious.getPioupiou = function(id){
		return _.find(pioupious.data, function(pioupiou){
			return pioupiou.id == id;
		});
	};

	return pioupious;
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



