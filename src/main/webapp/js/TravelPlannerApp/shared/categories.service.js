(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.factory('categoriesService',categoriesService);
	
	categoriesService.$inject = [ '$resource'];
	
	function categoriesService($resource) {
		return {
			query : function(id) {
	
				return [ {
					class : "",
					href : "/trip/" + id + "/category/1",
					name : "Submenu 1 - " + id
				}, {
					class : "",
					href : "/trip/" + id + "/category/2",
					name : "Submenu 2 - " + id
				} ];
			}
		};
	}
})();