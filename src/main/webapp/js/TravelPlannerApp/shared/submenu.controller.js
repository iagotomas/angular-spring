(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.controller('SubmenuController',SubmenuController)
	
	SubmenuController.$inject = ['$scope','$location','$route','$routeParams','categoriesService'];
	
	function SubmenuController($scope,$location,$route,$routeParams,categoriesService) {
		var vm=$scope;
		vm.submenu = categoriesService.query($routeParams.tripId);
		// listen route changes http://stackoverflow.com/questions/17449743/how-to-use-current-url-params-in-angular-controller
		$scope.$on('$routeChangeSuccess', function() {
			vm.submenu = categoriesService.query($route.current.params.tripId);
	    });
		vm.getSubClass = function (item) {
		    if ($location.path() == item.href) {
		        return "active"
		    } else {
		        return ""
		    }
		}
	}
	
	
	
	
})();