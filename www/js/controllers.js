angular.module('pioupiou.controllers', [])

.controller('AppCtrl',[
	'$scope', 
	'bookmarks', 
	'pioupious',
	'speed',
	function(
		$scope, 
		bookmarks, 
		pioupious,
		speed) {
	
	$scope.bookmarks = bookmarks;

	$scope.pioupious = pioupious;
	$scope.pioupious.pollStart(10000);
	
	$scope.speed = speed;
}])
.controller('searchCtrl', ['$scope', function($scope) {

	$scope.search = {
		str : ''
	};

	$scope.doSearch = function(item){
		return (item.meta.name.indexOf($scope.search.str) >= 0) || (item.id == $scope.search.str);
	};
}])
.controller('pioupiouCtrl', [
	'$scope', 
	'$stateParams', 
	'pioupiou', 
	'pioupiouLastHour',  
	'$timeout', 
	'$ionicHistory', 
	'$rootScope',
	function(
		$scope, 
		$stateParams, 
		pioupiou, 
		pioupiouLastHour, 
		$timeout, 
		$ionicHistory, 
		$rootScope) {
	
	$scope.pioupiou = pioupiou($stateParams.id);
	$scope.pioupiou.pollStart(5000);

	$scope.pioupiou.withData(function(){
		$scope.show_see_on_map_link = $scope.pioupiou.data.location.success;
		if($ionicHistory.viewHistory().backView){
			$scope.show_see_on_map_link = $scope.show_see_on_map_link && $ionicHistory.viewHistory().backView.stateId.indexOf('map') == -1;
		}
	});

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

	$scope.$on('$ionicView.leave', function(){
		$scope.pioupiou.pollCancel();
		$scope.last_hour.pollCancel();	
	});

}]).controller('mapCtrl', [
	'$scope', 
	'pioupious', 
	'geolocation', 
	'$stateParams',
	'$rootScope',
	'$window',
	function(
		$scope, 
		pioupious, 
		geolocation, 
		$stateParams,
		$rootScope,
		$window) {

	//Hack to fix leaflet display bug
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      if(toState.name.indexOf('map') >= 0) {
          $window.dispatchEvent(new Event('resize'));
      }});

	$scope.tiles = {
		url: 'http://pioupiou.fr/tiles/{z}/{x}/{y}.png'
    };

	$scope.center = {
        lat: 46.227638,
        lng: 2.213749, //center of France
        zoom: 5
    };

    $scope.defaults = {
    	zoomControl : false
    };

   	pioupious.withData(function(){
		
		if($stateParams.pioupiou_id){
			var pioupiou = pioupious.getPioupiou($stateParams.pioupiou_id);
			
			pioupiou.open_marker_popup = true;

			$scope.center = {
		        lat: pioupiou.location.latitude,
		        lng: pioupiou.location.longitude, //center of France
		        zoom: 13
		    };
	    } else {
			geolocation.getLocation().then(function(data){
				$scope.center.lat = data.coords.latitude;
				$scope.center.lng = data.coords.longitude;
				$scope.center.zoom = 9;
		    });
	    }

	    $scope.markers = pioupious.data;
	});

}]);
