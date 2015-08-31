(function() {

	'use strict';

	angular.module('TravelPlannerApp.breadcrumb')
	.service('breadcrumbService', breadcrumbService);

	breadcrumbService.$inject = [];
	function breadcrumbService() {
		var path=[];
		return {
			get:function(){
				return path;
			},
			add:function(href,name){
				path.push({"href":href,"name":name});
			},
			reset:function(){
				path=[];
			}
			
		};
	}
})();