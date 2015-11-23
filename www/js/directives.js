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
}])

.directive('pioupiouStatus', [function() {
	return {
		restrict : 'E',
		templateUrl : 'templates/directives/pioupiouStatus.html',
		scope : {
			status : '='
		}
	};
}])

.directive('windJaugeCanvas', ['speed', function(speed) {
	return {
		restrict : 'E',
		replace : true,
		template : '<div style="margin-left:auto;margin-right:auto"></div>',
		scope : {
			direction : '=',
			speed : '=',
			unit : '='
		},
		link : function(scope, element, attrs, ctrl){

			var html_id_prefix = 'wind-jauge-canvas-';

			var scale = 4;

			var paper = Raphael(element[0], '100%', '100%');

			var center = {
				x : paper.canvas.offsetWidth / 2,
				y : paper.canvas.offsetHeight / 2
			};

			paper.circle(center.x, center.y).attr({"stroke-width": 1}).animate({r: 10 * scale}, 300).node.id = html_id_prefix + 'graduation-1';
			paper.circle(center.x, center.y).attr({"stroke-width": 1}).animate({r: 20 * scale}, 300).node.id = html_id_prefix + 'graduation-2';
			paper.circle(center.x, center.y).attr({"stroke-width": 1}).animate({r: 30 * scale}, 300).node.id = html_id_prefix + 'graduation-3';

			paper.circle(center.x, center.y).attr({stroke : 0}).animate({r: 5}, 300).node.id = html_id_prefix + 'center';

			scope.$watchGroup(['direction', 'speed'], function(){
				if(scope.direction !== undefined && scope.speed !== undefined){
					drawArrow();
				}
			});

			var arrow;

			function drawArrow(){

				var x = center.x - Math.sin(scope.direction * Math.PI / 180) * scope.speed * scale;
				var y = center.y + Math.cos(scope.direction * Math.PI / 180) * scope.speed * scale;

				if(arrow)arrow.remove();
				arrow = paper.path('M'+center.x+','+center.y+' L'+x+','+y).attr({'stroke-width' : 3, 'stroke' : '#346bbf'}); //Need to put stroke color here otherwize marker won't be colored. Dam.
				arrow.node.id = html_id_prefix + 'arrow';
				if(scope.speed >= 2){
					arrow.attr({ 'arrow-end':'classic-wide-long'});
				}
			};
		}
	};
}]);
