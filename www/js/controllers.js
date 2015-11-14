angular.module('pioupiou.controllers', [])

.controller('AppCtrl',['$scope', 'bookmarks', 'pioupious', function($scope, bookmarks, pioupious) {
	
	$scope.bookmarks = bookmarks;
	$scope.pioupious = pioupious;
	
	$scope.speed_unit = 'km/h';
		
	$scope.toggleSpeedUnit = function(){
		$scope.speed_unit = $scope.speed_unit == 'km/h' ? 'nds' : 'km/h';
	};
	
	$scope.convertSpeed = function(km_per_hour_speed){
		return $scope.speed_unit == 'km/h' ? km_per_hour_speed : km_per_hour_speed / 1.852;
	};
}])
.controller('searchCtrl', ['$scope', function($scope) {

	$scope.search = {
		str : ''
	};

	$scope.doSearch = function(item){
		return (item.meta.name.indexOf($scope.search.str) >= 0) || (item.id == $scope.search.str);
	};
}]).
controller('pioupiouCtrl', ['$scope', '$stateParams', 'pioupiou',  function($scope, $stateParams, pioupiou) {
	
	$scope.pioupiou = pioupiou($stateParams.id);
}]);
