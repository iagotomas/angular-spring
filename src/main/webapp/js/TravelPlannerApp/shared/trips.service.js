(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.factory('tripsService', tripsService);

	tripsService.$inject = ['$resource'];
	
	function tripsService($resource) {

		return $resource('trips', {}, {});
	}
})();