(function() {

	'use strict';

	angular.module('TravelPlannerApp.breadcrumb')
	.controller('BreadcrumbController',BreadcrumbController)
	
	BreadcrumbController.$inject = ['$scope','breadcrumbService'];
	
	function BreadcrumbController($scope,breadcrumbService) {
		var vm=$scope;
		vm.currentPath = breadcrumbService.get();
		vm.currentEditPath = [{name:'Name',href:'/trip/id3/category/3/discussion/4'}];
	}
	
	
	
	
})();