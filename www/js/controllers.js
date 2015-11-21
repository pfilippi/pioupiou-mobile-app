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
}])
.controller('pioupiouCtrl', 
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
	};

	$scope.$on('$destroy', function(){
		$scope.pioupiou.pollCancel();
		$scope.last_hour.pollCancel();
	});
	
}]).controller('mapCtrl', ['$scope', 'pioupious', 'geolocation', function($scope, pioupious, geolocation) {

	$scope.tiles = {
		url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };

	$scope.center = {
        lat: 46.227638,
        lng: 2.213749, //center of France
        zoom: 5
    };

	geolocation.getLocation().then(function(data){
		$scope.center.lat = data.coords.latitude;
		$scope.center.lng = data.coords.longitude;
		$scope.center.zoom = 9;
    });

    $scope.defaults = {
    	zoomControl : false
    };

   	pioupious.pollStart(10000).then(function(){
		$scope.markers = pioupious.data;
	});

}]);
