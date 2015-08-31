/*global 
 configure 
 */
(function() {
	'use strict';

	angular.module('TravelPlannerApp').config(configure);
	
	configure.$inject = ['$locationProvider', '$routeProvider','$httpProvider'];
	
	function configure($locationProvider, $routeProvider,$httpProvider) {
		// browser reload doesn't work when html5 mode is turned
		// on..
		// $locationProvider.html5Mode(true);
		// .when('/', {
		// templateUrl : '/index.html'
		// })
		$routeProvider
		.when('/trip/:tripId', 
				{
			templateUrl : '/partials/category.tpl.html',
			controller : 'CategoriesController'
				}
		)
		.when('/trip/:tripId/category/:categoryId', 
				{
			templateUrl : '/partials/category.tpl.html',
			controller : 'CategoriesController'
				}
		)
		.when('/trip/:tripId/category/:categoryId/discussion/:discussionId',
				{
					templateUrl : '/partials/editor.tpl.html',
					controller : 'EditorController'
				}
		)
		.otherwise({
			redirectTo : '/trip/-1'
		});
		
		$httpProvider.interceptors.push('authHttpResponseInterceptor');
	}


}());
