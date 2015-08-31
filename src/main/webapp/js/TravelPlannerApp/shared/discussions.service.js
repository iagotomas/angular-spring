/* Filters */
(function() {

	angular.module('TravelPlannerApp.shared')
	.factory('discussionsService', discussionsService);

	discussionsService.$inject = [ '$resource', '$routeParams' ];
	
	function discussionsService($resource, $routeParams) {
		var data = {};
		data.discussions = [
				{
					id : '1ae2dasdasd',
					name : 'Discussion 1',
					description : 'This is the description on discussion 1',
					image : 'http://www.2gb.com/sites/default/files/field/image/20150127/travel-1z8o7ii.jpg',
					tags : [ "#travel", "#trip" ],
					child : [ "2ae2dasdasd" ],
					content : 'The #trip to make our lifes better is not another thing we may do easily this #travel',
					votes_up : [ "iagotomas@gmail.com" ],
					votes_down : [],
					is_leaf : false
				},
				{
					id : '2ae2dasdasd',
					name : 'Discussion 1 child 1',
					description : 'This is the description on discussion 1 child 1',
					image : 'http://www.2gb.com/sites/default/files/field/image/20150127/travel-1z8o7ii.jpg',
					tags : [ "#travel", "#trip", "#bangkok" ],
					child : [],
					content : 'The #trip to make our lifes better is not another thing we may do easily this #travel to #bangkok',
					votes_up : [],
					votes_down : [],
					is_leaf : true
				},
				{
					id : '3ae2dasdasd',
					name : 'Discussion 2',
					description : 'This is the description on discussion 2 ',
					image : '/images/travel_plan.jpg',
					tags : [ "#bangkok" ],
					child : [],
					content : 'The #trip to make our lifes better is not another thing we may do easily this #travel',
					votes_up : [ "iagotomas@gmail.com" ],
					votes_down : [],
					is_leaf : false
				},
				{
					id : '4ae2dasdasd',
					name : 'Discussion 3',
					description : 'This is the description on discussion 3 ',
					image : 'http://www.2gb.com/sites/default/files/field/image/20150127/travel-1z8o7ii.jpg',
					tags : [ "#bangkok" ],
					child : [],
					content : 'The #trip to make our lifes better is not another thing we may do easily this #travel',
					votes_up : [ "iagotomas@gmail.com" ],
					votes_down : [],
					is_leaf : true
				},
				{
					id : '5ae2dasdasd',
					name : 'Discussion 4',
					description : 'This is the description on discussion 2 ',
					image : 'http://www.2gb.com/sites/default/files/field/image/20150127/travel-1z8o7ii.jpg',
					tags : [ "#bangkok" ],
					child : ['4ae2dasdasd'],
					content : 'The #trip to make our lifes better is not another thing we may do easily this #travel',
					votes_up : [ "iagotomas@gmail.com" ],
					votes_down : [],
					is_leaf : false
				} ];
		return data;
	}

})();