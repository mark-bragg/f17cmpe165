angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			template: '<home></home>'
		})

		.when('/login',{
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})
		
		.when('/login/:id',{
			templateUrl: 'views/redirection.html',
			controller: 'LoginController'
		})
  
		.when('/registration', {
			template: '<registrationform></registrationform>'
		})
		
		.when('/account/:id?', {
			template: '<accountmanager></accountmanager>'
		})

		.when('/create-launch', {
			template: '<create-launch></create-launch>'
		})
		
		.when('/about', {
			templateUrl: 'views/aboutus.html'
		})
		
		.when('/launch-board/:userId?', {
			template: '<launch-board user-id="$resolve.userId"></launch-board>',
			resolve: {
				userId: ['$route', function ($route) {
					return $route.current.params.userId
				}]
			}
		})

		.when('/view/:launchId', {
			template: '<social-share></social-share>',
		})
		
	$locationProvider.html5Mode(true);

}]);