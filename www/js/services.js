angular.module('pioupiou.services', [])

.factory('dataFetcher', ['$http', '$timeout', function($http, $timeout) {
	
	return function(url){
		
		var fetcher = {
			error: false,
			data : null
		};

		function getData(){
			$http({
				method : 'GET',
				url : url
			}).then(
				function(response){
					fetcher.error = false;
					fetcher.data = response.data.data;
					$timeout(getData, 5000);
				},
				function(error){
					fetcher.error = true;
					$timeout(getData, 1000);
				}
			);
		}

		getData();
			
		return fetcher;
	}
}])

.factory('pioupiou', ['dataFetcher', function(dataFetcher) {
	
	return function(pioupiou_id){
		return dataFetcher('http://api.pioupiou.fr/v1/live/' + pioupiou_id);
	};
}])

.factory('pioupious', ['dataFetcher', function(dataFetcher) {
	
	return dataFetcher('http://api.pioupiou.fr/v1/live/all');
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



