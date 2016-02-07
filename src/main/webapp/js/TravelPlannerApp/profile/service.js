(function() {
	'use strict';

	angular.module('TravelPlannerApp.profile')
	.factory('profileService',profileService);
	profileService.$inject = ['$resource'];
	
	function profileService($resource) {
		
		
		return $resource('profile', {}, {
			query : {
				method : 'GET',
				isArray : false
			}
		});
	}
	
})();