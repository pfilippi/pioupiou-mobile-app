angular.module('pioupiou.directives', ['leaflet-directive'])

.directive('pioupiouClusteredMarkers', ['leafletData', '$parse', '$timeout', function(leafletData, $parse, $timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs, ctrl){

			var markers = new L.MarkerClusterGroup();

			scope.$watch(function(){
				return $parse(attrs.pioupiouClusteredMarkers)(scope);
			}, function(pioupious){

				markers.clearLayers();

				_.each(pioupious, function(pioupiou){
					var marker = L.marker([pioupiou.location.latitude, pioupiou.location.longitude]);
					
					marker.bindPopup('<a href="#/app/pioupiou/'+pioupiou.id+'">'+pioupiou.meta.name+'</a>');
					
					if(pioupiou.open_marker_popup){
						$timeout(function(){
							marker.openPopup();
						});
					}
	
	 				markers.addLayer(marker);
				});
			})
		 	
		 	$timeout(function(){
	            leafletData.getMap(attrs.id).then(function(map) {
			 	    map.addLayer(markers);
	            });
			});
		}
	};
}]);
