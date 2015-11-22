angular.module('pioupiou', ['ionic', 'pioupiou.controllers', 'pioupiou.filters', 'pioupiou.services', 'pioupiou.directives', 'leaflet-directive', 'geolocation'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })
	.state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
				controller: 'searchCtrl'
      }
    }
  }).state('app.pioupiou', {
	    url: '/pioupiou/:id',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/pioupiou.html',
					controller: 'pioupiouCtrl'
	      }
	    }
	  }).state('app.bookmarks', {
			url: '/bookmarks',
			views: {
				'menuContent': {
			  	templateUrl: 'templates/bookmarks.html'
				}
			}
		}).state('app.map', {
      url: '/map?pioupiou_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'mapCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/home');
});
