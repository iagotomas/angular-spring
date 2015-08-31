(function() {

	'use strict';

	angular.module('TravelPlannerApp.profile')
	.controller('ProfileController',ProfileController)
	
	ProfileController.$inject = ['$scope','profileService'];
	
	function ProfileController($scope,profileService) {
		var vm=$scope;
		vm.user = profileService.query();
	}
	
	
	
})();