(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.controller('MenuController',MenuController)
	
	MenuController.$inject = ['$scope','$location','$routeParams','tripsService','breadcrumbService'];
	
	function MenuController($scope,$location,$routeParams,tripsService,breadcrumbService) {
		var vm=$scope;
		vm.menu = tripsService.query();
		vm.toggle = function(item){
			item.active = !item.active;
			if(item.active){
				breadcrumbService.reset();
				breadcrumbService.add(item.id,item.name);
			}
		}
		$scope.$on('$routeChangeSuccess', function() {
			breadcrumbService.add("/trip/id1","Algo");
	    });
		/*
		 * See:
		 * http://stackoverflow.com/questions/12592472/how-to-highlight-a-current-menu-item-in-angularjs
		 */
		vm.getClass = function (item) {
		    if ($routeParams.tripId == item.id) {
		        return "active"
		    } else {
		        return ""
		    }
		}
	}
	
})();