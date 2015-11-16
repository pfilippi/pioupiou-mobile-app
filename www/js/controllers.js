angular.module('pioupiou.controllers', [])

.controller('AppCtrl',['$scope', 'bookmarks', 'pioupious', function($scope, bookmarks, pioupious) {
	
	$scope.bookmarks = bookmarks;

	$scope.pioupious = pioupious;
	$scope.pioupious.pollStart(10000);
	
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
controller('pioupiouCtrl', 
		   ['$scope', '$stateParams', 'pioupiou', 'pioupiouLastHour',  '$timeout',
		   function($scope, $stateParams, pioupiou, pioupiouLastHour, $timeout) {
	
	$scope.pioupiou = pioupiou($stateParams.id);
	$scope.pioupiou.pollStart(5000);

	$scope.last_hour = pioupiouLastHour($stateParams.id);
	$scope.last_hour.pollStart(5000);
	
	$scope.selected_measurement = {};

	$scope.resetSelectedMeasurement = function(){
		if(!$scope.last_hour.data) return;
		$scope.selected_measurement.index = $scope.last_hour.data.length - 1;
	}

	$scope.$watch('last_hour.data', function(){
		//Wrap in a timeout to ensure safely executed in next digest cycle
		$timeout(function(){
			$scope.resetSelectedMeasurement();
		});
	}, true);

	$scope.getCurrentMeasurement = function(){
		return $scope.last_hour.data[$scope.selected_measurement.index];
	}

	$scope.$on('$destroy', function(){
		$scope.pioupiou.pollCancel();
		$scope.last_hour.pollCancel();
	});
	
}]);
