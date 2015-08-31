(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.controller('CategoriesController',CategoriesController)
	
	CategoriesController.$inject = ['$scope','$location','$routeParams','discussionsService'];
	
	function CategoriesController($scope,$location,$routeParams,discussionsService) {
		var vm=$scope;
		vm.discussions = discussionsService.discussions;
		vm.categoryId = typeof $routeParams.categoryId !== 'undefined'?$routeParams.categoryId:null;
		vm.tripId = $routeParams.tripId;
		vm.show = function(discussion){
			vm.tripId = $routeParams.tripId;
			vm.categoryId = $routeParams.categoryId;
			var url = "trip/"+vm.tripId+"/category/"+vm.categoryId+"/discussion/"+discussion.id;
			$location.path(url);
		};
		vm.hoverIn = function(event){

			var el = angular.element(event.target)
		    //el.css({'height' : '100%'});
		};

		vm.hoverOut = function(event){
			var el = angular.element(event.target)
		   // el.css({'height' : '250px'});
		};
	}
	
	
	
})();