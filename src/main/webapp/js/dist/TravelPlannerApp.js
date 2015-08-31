
(function() {
'use strict';

/* App Module */
angular.module('TravelPlannerApp',
				[ 
				  // required modules
				  'ngResource','ngRoute','shoppinpal.mobile-menu','angularUtils.directives.dirPagination','ui.bootstrap',
				  // 
				  'TravelPlannerApp.profile','TravelPlannerApp.shared','TravelPlannerApp.breadcrumb'
				  ]);


})();
/* Config */
(function() {
	'use strict';

	angular.module('TravelPlannerApp').config(configure);
	
	configure.$inject = ['$locationProvider', '$routeProvider','$httpProvider'];
	
	function configure($locationProvider, $routeProvider,$httpProvider) {
		// browser reload doesn't work when html5 mode is turned
		// on..
		// $locationProvider.html5Mode(true);
		// .when('/', {
		// templateUrl : '/index.html'
		// })
		$routeProvider
		.when('/trip/:tripId', 
				{
			templateUrl : '/partials/category.tpl.html',
			controller : 'CategoriesController'
				}
		)
		.when('/trip/:tripId/category/:categoryId', 
				{
			templateUrl : '/partials/category.tpl.html',
			controller : 'CategoriesController'
				}
		)
		.when('/trip/:tripId/category/:categoryId/discussion/:discussionId',
				{
					templateUrl : '/partials/editor.tpl.html',
					controller : 'EditorController'
				}
		)
		.otherwise({
			redirectTo : '/trip/-1'
		});
		
		$httpProvider.interceptors.push('authHttpResponseInterceptor');
	}


})();

/* Filters */
(function() {

	'use strict';

	angular.module('TravelPlannerApp')
	
	.filter('isNotLeaf', function() {
		return function(items) {
			return items.filter(function(item) {
				return !item.is_leaf;
			});
		}
	})
	.filter('child', function() {
		return function(childId, discussions) {
			return discussions.filter(function(child) {
				return child.id == childId;
			});
		}
	})
	.filter('characters', function() {
		return function(input, chars, breakOnWord) {
			if (isNaN(chars))
				return input;
			if (chars <= 0)
				return '';
			if (input && input.length > chars) {
				input = input.substring(0, chars);

				if (!breakOnWord) {
					var lastspace = input.lastIndexOf(' ');
					// get last space
					if (lastspace !== -1) {
						input = input.substr(0, lastspace);
					}
				} else {
					while (input.charAt(input.length - 1) === ' ') {
						input = input.substr(0, input.length - 1);
					}
				}
				return input + '…';
			}
			return input;
		};
	})

})();
/* Directives */
(function() {
	'use strict';

	angular.module('TravelPlannerApp')
	
	.directive("backimg", function() {
		return function(scope, element, attrs) {
			var url = attrs.backimg;
			if (url != '') {
				element.css({
					'background-image' : 'url(' + url + ')',
					'background-size' : 'cover'
				});
			}
		}
	})
	
	.directive('focusOnShow', ["$timeout", function($timeout) {
		return {
			restrict : 'A',
			link : function($scope, $element, $attr) {
				if ($attr.ngShow) {
					$scope.$watch($attr.ngShow, function(newValue) {
						if (newValue) {
							$timeout(function() {
								$element.focus();
							}, 0);
						}
					})
				}
				if ($attr.ngHide) {
					$scope.$watch($attr.ngHide, function(newValue) {
						if (!newValue) {
							$timeout(function() {
								$element.focus();
							}, 0);
						}
					})
				}

			}
		};
	}])
})();
(function() {

	'use strict';

	angular.module('TravelPlannerApp.breadcrumb',['ngResource']);
	
})();
(function() {

	'use strict';

	angular.module('TravelPlannerApp.profile',['ngResource']);
	
})();
(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared',['ngResource','ngRoute','TravelPlannerApp.breadcrumb']);
	
})();
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
(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.controller('EditorController',EditorController)
	
	EditorController.$inject = ['$scope'];
	
	function EditorController($scope) {
		var vm=$scope;
		
		vm.tags = [];
		vm.editorData = '';
		vm.isCollapsed = true;
		
//		vm.$watch('isCollapsed', function(input){
//	        
//	    })
	    vm.save = function(){
			alert(vm.editorData);
			vm.editorData = '';
			vm.isCollapsed = true;
		};
		vm.cancel = function(){
			vm.editorData = '';
			vm.isCollapsed = true;
		}
		vm.parseTags = function(){

			
	        var words = typeof vm.editor !== 'undefined'? vm.editor.split(/\s+/g):[];
	        var wordObjects = [];
	        for (var i = 0; i < words.length; i++) {
	        	if(words[i].startsWith('#')){
	        		wordObjects.push(words[i]);
	        	}
	        }
	        if ((words.length == 1) && (words[0] === '')) {
	            vm.tags = [];
	        }
	        else {
	            vm.tags = angular.copy(wordObjects);
	        }
		};
	}
	
	
	
})();
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
(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.factory('authHttpResponseInterceptor',authHttpResponseInterceptor);

	authHttpResponseInterceptor.$inject = [ '$q', '$location','$window' ];
	function authHttpResponseInterceptor($q, $location,$window) {
		return {
	        response: function(response){
	            if (response.status === 401) {
	                console.log("Response 401");
	            }
	            if (response.status === 302) {
	                console.log("Response 302");
	            }
	            return response || $q.when(response);
	        },
	        responseError: function(rejection) {
	            if (rejection.status === 401) {
	                console.log("Response Error 401",rejection);
	                $location.path('/googleLogin').search('returnTo', $location.path());
	            }
	            if (rejection.status === 302) {
	                console.log("Response 302");
	            }
	            // Check for a CORS problem meaning we have lost the session
	            if(rejection.status == 0){
	                console.log("Response Error 0, CORS problem",rejection);
	                $location.path('/googleLogin').search('returnTo', $location.path());
	                $window.location='/googleLogin';
	            }
	            return $q.reject(rejection);
	        }
		}

	}

})();
(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared')
	.factory('tripsService', tripsService);

	tripsService.$inject = ['$resource'];
	
	function tripsService($resource) {

		return $resource('trips', {}, {});
	}
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImZpbHRlcnMuanMiLCJkaXJlY3RpdmVzLmpzIiwiYnJlYWRjcnVtYi9icmVhZGNydW1iLm1vZHVsZS5qcyIsInByb2ZpbGUvcHJvZmlsZS5tb2R1bGUuanMiLCJzaGFyZWQvc2hhcmVkLm1vZHVsZS5qcyIsImJyZWFkY3J1bWIvYnJlYWRjcnVtYi5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9wcm9maWxlLmNvbnRyb2xsZXIuanMiLCJzaGFyZWQvY2F0ZWdvcmllcy5jb250cm9sbGVyLmpzIiwic2hhcmVkL2VkaXRvci5jb250cm9sbGVyLmpzIiwic2hhcmVkL21lbnUuY29udHJvbGxlci5qcyIsInNoYXJlZC9zdWJtZW51LmNvbnRyb2xsZXIuanMiLCJicmVhZGNydW1iL2JyZWFkY3J1bWIuc2VydmljZS5qcyIsInByb2ZpbGUvcHJvZmlsZS5zZXJ2aWNlLmpzIiwic2hhcmVkL2NhdGVnb3JpZXMuc2VydmljZS5qcyIsInNoYXJlZC9kaXNjdXNzaW9ucy5zZXJ2aWNlLmpzIiwic2hhcmVkL3NoYXJlZC5zZXJ2aWNlLmpzIiwic2hhcmVkL3RyaXBzLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlRyYXZlbFBsYW5uZXJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLyogQXBwIE1vZHVsZSAqL1xuYW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAnLFxuXHRcdFx0XHRbIFxuXHRcdFx0XHQgIC8vIHJlcXVpcmVkIG1vZHVsZXNcblx0XHRcdFx0ICAnbmdSZXNvdXJjZScsJ25nUm91dGUnLCdzaG9wcGlucGFsLm1vYmlsZS1tZW51JywnYW5ndWxhclV0aWxzLmRpcmVjdGl2ZXMuZGlyUGFnaW5hdGlvbicsJ3VpLmJvb3RzdHJhcCcsXG5cdFx0XHRcdCAgLy8gXG5cdFx0XHRcdCAgJ1RyYXZlbFBsYW5uZXJBcHAucHJvZmlsZScsJ1RyYXZlbFBsYW5uZXJBcHAuc2hhcmVkJywnVHJhdmVsUGxhbm5lckFwcC5icmVhZGNydW1iJ1xuXHRcdFx0XHQgIF0pO1xuXG5cbn0pKCk7IiwiLyogQ29uZmlnICovXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcCcpLmNvbmZpZyhjb25maWd1cmUpO1xuXHRcblx0Y29uZmlndXJlLiRpbmplY3QgPSBbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRyb3V0ZVByb3ZpZGVyJywnJGh0dHBQcm92aWRlciddO1xuXHRcblx0ZnVuY3Rpb24gY29uZmlndXJlKCRsb2NhdGlvblByb3ZpZGVyLCAkcm91dGVQcm92aWRlciwkaHR0cFByb3ZpZGVyKSB7XG5cdFx0Ly8gYnJvd3NlciByZWxvYWQgZG9lc24ndCB3b3JrIHdoZW4gaHRtbDUgbW9kZSBpcyB0dXJuZWRcblx0XHQvLyBvbi4uXG5cdFx0Ly8gJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXHRcdC8vIC53aGVuKCcvJywge1xuXHRcdC8vIHRlbXBsYXRlVXJsIDogJy9pbmRleC5odG1sJ1xuXHRcdC8vIH0pXG5cdFx0JHJvdXRlUHJvdmlkZXJcblx0XHQud2hlbignL3RyaXAvOnRyaXBJZCcsIFxuXHRcdFx0XHR7XG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICcvcGFydGlhbHMvY2F0ZWdvcnkudHBsLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciA6ICdDYXRlZ29yaWVzQ29udHJvbGxlcidcblx0XHRcdFx0fVxuXHRcdClcblx0XHQud2hlbignL3RyaXAvOnRyaXBJZC9jYXRlZ29yeS86Y2F0ZWdvcnlJZCcsIFxuXHRcdFx0XHR7XG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICcvcGFydGlhbHMvY2F0ZWdvcnkudHBsLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciA6ICdDYXRlZ29yaWVzQ29udHJvbGxlcidcblx0XHRcdFx0fVxuXHRcdClcblx0XHQud2hlbignL3RyaXAvOnRyaXBJZC9jYXRlZ29yeS86Y2F0ZWdvcnlJZC9kaXNjdXNzaW9uLzpkaXNjdXNzaW9uSWQnLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnL3BhcnRpYWxzL2VkaXRvci50cGwuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlciA6ICdFZGl0b3JDb250cm9sbGVyJ1xuXHRcdFx0XHR9XG5cdFx0KVxuXHRcdC5vdGhlcndpc2Uoe1xuXHRcdFx0cmVkaXJlY3RUbyA6ICcvdHJpcC8tMSdcblx0XHR9KTtcblx0XHRcblx0XHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSHR0cFJlc3BvbnNlSW50ZXJjZXB0b3InKTtcblx0fVxuXG5cbn0pKCk7XG4iLCIvKiBGaWx0ZXJzICovXG4oZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwJylcblx0XG5cdC5maWx0ZXIoJ2lzTm90TGVhZicsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpdGVtcykge1xuXHRcdFx0cmV0dXJuIGl0ZW1zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHJldHVybiAhaXRlbS5pc19sZWFmO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KVxuXHQuZmlsdGVyKCdjaGlsZCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihjaGlsZElkLCBkaXNjdXNzaW9ucykge1xuXHRcdFx0cmV0dXJuIGRpc2N1c3Npb25zLmZpbHRlcihmdW5jdGlvbihjaGlsZCkge1xuXHRcdFx0XHRyZXR1cm4gY2hpbGQuaWQgPT0gY2hpbGRJZDtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSlcblx0LmZpbHRlcignY2hhcmFjdGVycycsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpbnB1dCwgY2hhcnMsIGJyZWFrT25Xb3JkKSB7XG5cdFx0XHRpZiAoaXNOYU4oY2hhcnMpKVxuXHRcdFx0XHRyZXR1cm4gaW5wdXQ7XG5cdFx0XHRpZiAoY2hhcnMgPD0gMClcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0aWYgKGlucHV0ICYmIGlucHV0Lmxlbmd0aCA+IGNoYXJzKSB7XG5cdFx0XHRcdGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGNoYXJzKTtcblxuXHRcdFx0XHRpZiAoIWJyZWFrT25Xb3JkKSB7XG5cdFx0XHRcdFx0dmFyIGxhc3RzcGFjZSA9IGlucHV0Lmxhc3RJbmRleE9mKCcgJyk7XG5cdFx0XHRcdFx0Ly8gZ2V0IGxhc3Qgc3BhY2Vcblx0XHRcdFx0XHRpZiAobGFzdHNwYWNlICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0aW5wdXQgPSBpbnB1dC5zdWJzdHIoMCwgbGFzdHNwYWNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0d2hpbGUgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGggLSAxKSA9PT0gJyAnKSB7XG5cdFx0XHRcdFx0XHRpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGlucHV0ICsgJ+KApic7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5wdXQ7XG5cdFx0fTtcblx0fSlcblxufSkoKTsiLCIvKiBEaXJlY3RpdmVzICovXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcCcpXG5cdFxuXHQuZGlyZWN0aXZlKFwiYmFja2ltZ1wiLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cdFx0XHR2YXIgdXJsID0gYXR0cnMuYmFja2ltZztcblx0XHRcdGlmICh1cmwgIT0gJycpIHtcblx0XHRcdFx0ZWxlbWVudC5jc3Moe1xuXHRcdFx0XHRcdCdiYWNrZ3JvdW5kLWltYWdlJyA6ICd1cmwoJyArIHVybCArICcpJyxcblx0XHRcdFx0XHQnYmFja2dyb3VuZC1zaXplJyA6ICdjb3Zlcidcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxuXHRcblx0LmRpcmVjdGl2ZSgnZm9jdXNPblNob3cnLCBmdW5jdGlvbigkdGltZW91dCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRcdGxpbmsgOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cikge1xuXHRcdFx0XHRpZiAoJGF0dHIubmdTaG93KSB7XG5cdFx0XHRcdFx0JHNjb3BlLiR3YXRjaCgkYXR0ci5uZ1Nob3csIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRpZiAobmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0fSwgMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoJGF0dHIubmdIaWRlKSB7XG5cdFx0XHRcdFx0JHNjb3BlLiR3YXRjaCgkYXR0ci5uZ0hpZGUsIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW5ld1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdCRlbGVtZW50LmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRcdH0sIDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH07XG5cdH0pXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuYnJlYWRjcnVtYicsWyduZ1Jlc291cmNlJ10pO1xuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5wcm9maWxlJyxbJ25nUmVzb3VyY2UnXSk7XG5cdFxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwLnNoYXJlZCcsWyduZ1Jlc291cmNlJywnbmdSb3V0ZScsJ1RyYXZlbFBsYW5uZXJBcHAuYnJlYWRjcnVtYiddKTtcblx0XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuYnJlYWRjcnVtYicpXG5cdC5jb250cm9sbGVyKCdCcmVhZGNydW1iQ29udHJvbGxlcicsQnJlYWRjcnVtYkNvbnRyb2xsZXIpXG5cdFxuXHRCcmVhZGNydW1iQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCdicmVhZGNydW1iU2VydmljZSddO1xuXHRcblx0ZnVuY3Rpb24gQnJlYWRjcnVtYkNvbnRyb2xsZXIoJHNjb3BlLGJyZWFkY3J1bWJTZXJ2aWNlKSB7XG5cdFx0dmFyIHZtPSRzY29wZTtcblx0XHR2bS5jdXJyZW50UGF0aCA9IGJyZWFkY3J1bWJTZXJ2aWNlLmdldCgpO1xuXHRcdHZtLmN1cnJlbnRFZGl0UGF0aCA9IFt7bmFtZTonTmFtZScsaHJlZjonL3RyaXAvaWQzL2NhdGVnb3J5LzMvZGlzY3Vzc2lvbi80J31dO1xuXHR9XG5cdFxuXHRcblx0XG5cdFxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwLnByb2ZpbGUnKVxuXHQuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLFByb2ZpbGVDb250cm9sbGVyKVxuXHRcblx0UHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywncHJvZmlsZVNlcnZpY2UnXTtcblx0XG5cdGZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKCRzY29wZSxwcm9maWxlU2VydmljZSkge1xuXHRcdHZhciB2bT0kc2NvcGU7XG5cdFx0dm0udXNlciA9IHByb2ZpbGVTZXJ2aWNlLnF1ZXJ5KCk7XG5cdH1cblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuY29udHJvbGxlcignQ2F0ZWdvcmllc0NvbnRyb2xsZXInLENhdGVnb3JpZXNDb250cm9sbGVyKVxuXHRcblx0Q2F0ZWdvcmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvY2F0aW9uJywnJHJvdXRlUGFyYW1zJywnZGlzY3Vzc2lvbnNTZXJ2aWNlJ107XG5cdFxuXHRmdW5jdGlvbiBDYXRlZ29yaWVzQ29udHJvbGxlcigkc2NvcGUsJGxvY2F0aW9uLCRyb3V0ZVBhcmFtcyxkaXNjdXNzaW9uc1NlcnZpY2UpIHtcblx0XHR2YXIgdm09JHNjb3BlO1xuXHRcdHZtLmRpc2N1c3Npb25zID0gZGlzY3Vzc2lvbnNTZXJ2aWNlLmRpc2N1c3Npb25zO1xuXHRcdHZtLmNhdGVnb3J5SWQgPSB0eXBlb2YgJHJvdXRlUGFyYW1zLmNhdGVnb3J5SWQgIT09ICd1bmRlZmluZWQnPyRyb3V0ZVBhcmFtcy5jYXRlZ29yeUlkOm51bGw7XG5cdFx0dm0udHJpcElkID0gJHJvdXRlUGFyYW1zLnRyaXBJZDtcblx0XHR2bS5zaG93ID0gZnVuY3Rpb24oZGlzY3Vzc2lvbil7XG5cdFx0XHR2bS50cmlwSWQgPSAkcm91dGVQYXJhbXMudHJpcElkO1xuXHRcdFx0dm0uY2F0ZWdvcnlJZCA9ICRyb3V0ZVBhcmFtcy5jYXRlZ29yeUlkO1xuXHRcdFx0dmFyIHVybCA9IFwidHJpcC9cIit2bS50cmlwSWQrXCIvY2F0ZWdvcnkvXCIrdm0uY2F0ZWdvcnlJZCtcIi9kaXNjdXNzaW9uL1wiK2Rpc2N1c3Npb24uaWQ7XG5cdFx0XHQkbG9jYXRpb24ucGF0aCh1cmwpO1xuXHRcdH07XG5cdFx0dm0uaG92ZXJJbiA9IGZ1bmN0aW9uKGV2ZW50KXtcblxuXHRcdFx0dmFyIGVsID0gYW5ndWxhci5lbGVtZW50KGV2ZW50LnRhcmdldClcblx0XHQgICAgLy9lbC5jc3MoeydoZWlnaHQnIDogJzEwMCUnfSk7XG5cdFx0fTtcblxuXHRcdHZtLmhvdmVyT3V0ID0gZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0dmFyIGVsID0gYW5ndWxhci5lbGVtZW50KGV2ZW50LnRhcmdldClcblx0XHQgICAvLyBlbC5jc3MoeydoZWlnaHQnIDogJzI1MHB4J30pO1xuXHRcdH07XG5cdH1cblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuY29udHJvbGxlcignRWRpdG9yQ29udHJvbGxlcicsRWRpdG9yQ29udHJvbGxlcilcblx0XG5cdEVkaXRvckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XG5cdFxuXHRmdW5jdGlvbiBFZGl0b3JDb250cm9sbGVyKCRzY29wZSkge1xuXHRcdHZhciB2bT0kc2NvcGU7XG5cdFx0XG5cdFx0dm0udGFncyA9IFtdO1xuXHRcdHZtLmVkaXRvckRhdGEgPSAnJztcblx0XHR2bS5pc0NvbGxhcHNlZCA9IHRydWU7XG5cdFx0XG4vL1x0XHR2bS4kd2F0Y2goJ2lzQ29sbGFwc2VkJywgZnVuY3Rpb24oaW5wdXQpe1xuLy9cdCAgICAgICAgXG4vL1x0ICAgIH0pXG5cdCAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcblx0XHRcdGFsZXJ0KHZtLmVkaXRvckRhdGEpO1xuXHRcdFx0dm0uZWRpdG9yRGF0YSA9ICcnO1xuXHRcdFx0dm0uaXNDb2xsYXBzZWQgPSB0cnVlO1xuXHRcdH07XG5cdFx0dm0uY2FuY2VsID0gZnVuY3Rpb24oKXtcblx0XHRcdHZtLmVkaXRvckRhdGEgPSAnJztcblx0XHRcdHZtLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblx0XHR9XG5cdFx0dm0ucGFyc2VUYWdzID0gZnVuY3Rpb24oKXtcblxuXHRcdFx0XG5cdCAgICAgICAgdmFyIHdvcmRzID0gdHlwZW9mIHZtLmVkaXRvciAhPT0gJ3VuZGVmaW5lZCc/IHZtLmVkaXRvci5zcGxpdCgvXFxzKy9nKTpbXTtcblx0ICAgICAgICB2YXIgd29yZE9iamVjdHMgPSBbXTtcblx0ICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgXHRpZih3b3Jkc1tpXS5zdGFydHNXaXRoKCcjJykpe1xuXHQgICAgICAgIFx0XHR3b3JkT2JqZWN0cy5wdXNoKHdvcmRzW2ldKTtcblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKCh3b3Jkcy5sZW5ndGggPT0gMSkgJiYgKHdvcmRzWzBdID09PSAnJykpIHtcblx0ICAgICAgICAgICAgdm0udGFncyA9IFtdO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdm0udGFncyA9IGFuZ3VsYXIuY29weSh3b3JkT2JqZWN0cyk7XG5cdCAgICAgICAgfVxuXHRcdH07XG5cdH1cblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLE1lbnVDb250cm9sbGVyKVxuXHRcblx0TWVudUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvY2F0aW9uJywnJHJvdXRlUGFyYW1zJywndHJpcHNTZXJ2aWNlJywnYnJlYWRjcnVtYlNlcnZpY2UnXTtcblx0XG5cdGZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCRzY29wZSwkbG9jYXRpb24sJHJvdXRlUGFyYW1zLHRyaXBzU2VydmljZSxicmVhZGNydW1iU2VydmljZSkge1xuXHRcdHZhciB2bT0kc2NvcGU7XG5cdFx0dm0ubWVudSA9IHRyaXBzU2VydmljZS5xdWVyeSgpO1xuXHRcdHZtLnRvZ2dsZSA9IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0aXRlbS5hY3RpdmUgPSAhaXRlbS5hY3RpdmU7XG5cdFx0XHRpZihpdGVtLmFjdGl2ZSl7XG5cdFx0XHRcdGJyZWFkY3J1bWJTZXJ2aWNlLnJlc2V0KCk7XG5cdFx0XHRcdGJyZWFkY3J1bWJTZXJ2aWNlLmFkZChpdGVtLmlkLGl0ZW0ubmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcblx0XHRcdGJyZWFkY3J1bWJTZXJ2aWNlLmFkZChcIi90cmlwL2lkMVwiLFwiQWxnb1wiKTtcblx0ICAgIH0pO1xuXHRcdC8qXG5cdFx0ICogU2VlOlxuXHRcdCAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI1OTI0NzIvaG93LXRvLWhpZ2hsaWdodC1hLWN1cnJlbnQtbWVudS1pdGVtLWluLWFuZ3VsYXJqc1xuXHRcdCAqL1xuXHRcdHZtLmdldENsYXNzID0gZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHQgICAgaWYgKCRyb3V0ZVBhcmFtcy50cmlwSWQgPT0gaXRlbS5pZCkge1xuXHRcdCAgICAgICAgcmV0dXJuIFwiYWN0aXZlXCJcblx0XHQgICAgfSBlbHNlIHtcblx0XHQgICAgICAgIHJldHVybiBcIlwiXG5cdFx0ICAgIH1cblx0XHR9XG5cdH1cblx0XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuc2hhcmVkJylcblx0LmNvbnRyb2xsZXIoJ1N1Ym1lbnVDb250cm9sbGVyJyxTdWJtZW51Q29udHJvbGxlcilcblx0XG5cdFN1Ym1lbnVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsJyRsb2NhdGlvbicsJyRyb3V0ZScsJyRyb3V0ZVBhcmFtcycsJ2NhdGVnb3JpZXNTZXJ2aWNlJ107XG5cdFxuXHRmdW5jdGlvbiBTdWJtZW51Q29udHJvbGxlcigkc2NvcGUsJGxvY2F0aW9uLCRyb3V0ZSwkcm91dGVQYXJhbXMsY2F0ZWdvcmllc1NlcnZpY2UpIHtcblx0XHR2YXIgdm09JHNjb3BlO1xuXHRcdHZtLnN1Ym1lbnUgPSBjYXRlZ29yaWVzU2VydmljZS5xdWVyeSgkcm91dGVQYXJhbXMudHJpcElkKTtcblx0XHQvLyBsaXN0ZW4gcm91dGUgY2hhbmdlcyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NDQ5NzQzL2hvdy10by11c2UtY3VycmVudC11cmwtcGFyYW1zLWluLWFuZ3VsYXItY29udHJvbGxlclxuXHRcdCRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZtLnN1Ym1lbnUgPSBjYXRlZ29yaWVzU2VydmljZS5xdWVyeSgkcm91dGUuY3VycmVudC5wYXJhbXMudHJpcElkKTtcblx0ICAgIH0pO1xuXHRcdHZtLmdldFN1YkNsYXNzID0gZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHQgICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkgPT0gaXRlbS5ocmVmKSB7XG5cdFx0ICAgICAgICByZXR1cm4gXCJhY3RpdmVcIlxuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgcmV0dXJuIFwiXCJcblx0XHQgICAgfVxuXHRcdH1cblx0fVxuXHRcblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5icmVhZGNydW1iJylcblx0LnNlcnZpY2UoJ2JyZWFkY3J1bWJTZXJ2aWNlJywgYnJlYWRjcnVtYlNlcnZpY2UpO1xuXG5cdGJyZWFkY3J1bWJTZXJ2aWNlLiRpbmplY3QgPSBbXTtcblx0ZnVuY3Rpb24gYnJlYWRjcnVtYlNlcnZpY2UoKSB7XG5cdFx0dmFyIHBhdGg9W107XG5cdFx0cmV0dXJuIHtcblx0XHRcdGdldDpmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gcGF0aDtcblx0XHRcdH0sXG5cdFx0XHRhZGQ6ZnVuY3Rpb24oaHJlZixuYW1lKXtcblx0XHRcdFx0cGF0aC5wdXNoKHtcImhyZWZcIjpocmVmLFwibmFtZVwiOm5hbWV9KTtcblx0XHRcdH0sXG5cdFx0XHRyZXNldDpmdW5jdGlvbigpe1xuXHRcdFx0XHRwYXRoPVtdO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5wcm9maWxlJylcblx0LmZhY3RvcnkoJ3Byb2ZpbGVTZXJ2aWNlJyxwcm9maWxlU2VydmljZSk7XG5cdHByb2ZpbGVTZXJ2aWNlLiRpbmplY3QgPSBbJyRyZXNvdXJjZSddO1xuXHRcblx0ZnVuY3Rpb24gcHJvZmlsZVNlcnZpY2UoJHJlc291cmNlKSB7XG5cdFx0XG5cdFx0XG5cdFx0cmV0dXJuICRyZXNvdXJjZSgncHJvZmlsZScsIHt9LCB7XG5cdFx0XHRxdWVyeSA6IHtcblx0XHRcdFx0bWV0aG9kIDogJ0dFVCcsXG5cdFx0XHRcdGlzQXJyYXkgOiBmYWxzZVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdFxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwLnNoYXJlZCcpXG5cdC5mYWN0b3J5KCdjYXRlZ29yaWVzU2VydmljZScsY2F0ZWdvcmllc1NlcnZpY2UpO1xuXHRcblx0Y2F0ZWdvcmllc1NlcnZpY2UuJGluamVjdCA9IFsgJyRyZXNvdXJjZSddO1xuXHRcblx0ZnVuY3Rpb24gY2F0ZWdvcmllc1NlcnZpY2UoJHJlc291cmNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHF1ZXJ5IDogZnVuY3Rpb24oaWQpIHtcblx0XG5cdFx0XHRcdHJldHVybiBbIHtcblx0XHRcdFx0XHRjbGFzcyA6IFwiXCIsXG5cdFx0XHRcdFx0aHJlZiA6IFwiL3RyaXAvXCIgKyBpZCArIFwiL2NhdGVnb3J5LzFcIixcblx0XHRcdFx0XHRuYW1lIDogXCJTdWJtZW51IDEgLSBcIiArIGlkXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRjbGFzcyA6IFwiXCIsXG5cdFx0XHRcdFx0aHJlZiA6IFwiL3RyaXAvXCIgKyBpZCArIFwiL2NhdGVnb3J5LzJcIixcblx0XHRcdFx0XHRuYW1lIDogXCJTdWJtZW51IDIgLSBcIiArIGlkXG5cdFx0XHRcdH0gXTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59KSgpOyIsIi8qIEZpbHRlcnMgKi9cbihmdW5jdGlvbigpIHtcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuZmFjdG9yeSgnZGlzY3Vzc2lvbnNTZXJ2aWNlJywgZGlzY3Vzc2lvbnNTZXJ2aWNlKTtcblxuXHRkaXNjdXNzaW9uc1NlcnZpY2UuJGluamVjdCA9IFsgJyRyZXNvdXJjZScsICckcm91dGVQYXJhbXMnIF07XG5cdFxuXHRmdW5jdGlvbiBkaXNjdXNzaW9uc1NlcnZpY2UoJHJlc291cmNlLCAkcm91dGVQYXJhbXMpIHtcblx0XHR2YXIgZGF0YSA9IHt9O1xuXHRcdGRhdGEuZGlzY3Vzc2lvbnMgPSBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZCA6ICcxYWUyZGFzZGFzZCcsXG5cdFx0XHRcdFx0bmFtZSA6ICdEaXNjdXNzaW9uIDEnLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uIDogJ1RoaXMgaXMgdGhlIGRlc2NyaXB0aW9uIG9uIGRpc2N1c3Npb24gMScsXG5cdFx0XHRcdFx0aW1hZ2UgOiAnaHR0cDovL3d3dy4yZ2IuY29tL3NpdGVzL2RlZmF1bHQvZmlsZXMvZmllbGQvaW1hZ2UvMjAxNTAxMjcvdHJhdmVsLTF6OG83aWkuanBnJyxcblx0XHRcdFx0XHR0YWdzIDogWyBcIiN0cmF2ZWxcIiwgXCIjdHJpcFwiIF0sXG5cdFx0XHRcdFx0Y2hpbGQgOiBbIFwiMmFlMmRhc2Rhc2RcIiBdLFxuXHRcdFx0XHRcdGNvbnRlbnQgOiAnVGhlICN0cmlwIHRvIG1ha2Ugb3VyIGxpZmVzIGJldHRlciBpcyBub3QgYW5vdGhlciB0aGluZyB3ZSBtYXkgZG8gZWFzaWx5IHRoaXMgI3RyYXZlbCcsXG5cdFx0XHRcdFx0dm90ZXNfdXAgOiBbIFwiaWFnb3RvbWFzQGdtYWlsLmNvbVwiIF0sXG5cdFx0XHRcdFx0dm90ZXNfZG93biA6IFtdLFxuXHRcdFx0XHRcdGlzX2xlYWYgOiBmYWxzZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWQgOiAnMmFlMmRhc2Rhc2QnLFxuXHRcdFx0XHRcdG5hbWUgOiAnRGlzY3Vzc2lvbiAxIGNoaWxkIDEnLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uIDogJ1RoaXMgaXMgdGhlIGRlc2NyaXB0aW9uIG9uIGRpc2N1c3Npb24gMSBjaGlsZCAxJyxcblx0XHRcdFx0XHRpbWFnZSA6ICdodHRwOi8vd3d3LjJnYi5jb20vc2l0ZXMvZGVmYXVsdC9maWxlcy9maWVsZC9pbWFnZS8yMDE1MDEyNy90cmF2ZWwtMXo4bzdpaS5qcGcnLFxuXHRcdFx0XHRcdHRhZ3MgOiBbIFwiI3RyYXZlbFwiLCBcIiN0cmlwXCIsIFwiI2Jhbmdrb2tcIiBdLFxuXHRcdFx0XHRcdGNoaWxkIDogW10sXG5cdFx0XHRcdFx0Y29udGVudCA6ICdUaGUgI3RyaXAgdG8gbWFrZSBvdXIgbGlmZXMgYmV0dGVyIGlzIG5vdCBhbm90aGVyIHRoaW5nIHdlIG1heSBkbyBlYXNpbHkgdGhpcyAjdHJhdmVsIHRvICNiYW5na29rJyxcblx0XHRcdFx0XHR2b3Rlc191cCA6IFtdLFxuXHRcdFx0XHRcdHZvdGVzX2Rvd24gOiBbXSxcblx0XHRcdFx0XHRpc19sZWFmIDogdHJ1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWQgOiAnM2FlMmRhc2Rhc2QnLFxuXHRcdFx0XHRcdG5hbWUgOiAnRGlzY3Vzc2lvbiAyJyxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA6ICdUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvbiBkaXNjdXNzaW9uIDIgJyxcblx0XHRcdFx0XHRpbWFnZSA6ICcvaW1hZ2VzL3RyYXZlbF9wbGFuLmpwZycsXG5cdFx0XHRcdFx0dGFncyA6IFsgXCIjYmFuZ2tva1wiIF0sXG5cdFx0XHRcdFx0Y2hpbGQgOiBbXSxcblx0XHRcdFx0XHRjb250ZW50IDogJ1RoZSAjdHJpcCB0byBtYWtlIG91ciBsaWZlcyBiZXR0ZXIgaXMgbm90IGFub3RoZXIgdGhpbmcgd2UgbWF5IGRvIGVhc2lseSB0aGlzICN0cmF2ZWwnLFxuXHRcdFx0XHRcdHZvdGVzX3VwIDogWyBcImlhZ290b21hc0BnbWFpbC5jb21cIiBdLFxuXHRcdFx0XHRcdHZvdGVzX2Rvd24gOiBbXSxcblx0XHRcdFx0XHRpc19sZWFmIDogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlkIDogJzRhZTJkYXNkYXNkJyxcblx0XHRcdFx0XHRuYW1lIDogJ0Rpc2N1c3Npb24gMycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb24gOiAnVGhpcyBpcyB0aGUgZGVzY3JpcHRpb24gb24gZGlzY3Vzc2lvbiAzICcsXG5cdFx0XHRcdFx0aW1hZ2UgOiAnaHR0cDovL3d3dy4yZ2IuY29tL3NpdGVzL2RlZmF1bHQvZmlsZXMvZmllbGQvaW1hZ2UvMjAxNTAxMjcvdHJhdmVsLTF6OG83aWkuanBnJyxcblx0XHRcdFx0XHR0YWdzIDogWyBcIiNiYW5na29rXCIgXSxcblx0XHRcdFx0XHRjaGlsZCA6IFtdLFxuXHRcdFx0XHRcdGNvbnRlbnQgOiAnVGhlICN0cmlwIHRvIG1ha2Ugb3VyIGxpZmVzIGJldHRlciBpcyBub3QgYW5vdGhlciB0aGluZyB3ZSBtYXkgZG8gZWFzaWx5IHRoaXMgI3RyYXZlbCcsXG5cdFx0XHRcdFx0dm90ZXNfdXAgOiBbIFwiaWFnb3RvbWFzQGdtYWlsLmNvbVwiIF0sXG5cdFx0XHRcdFx0dm90ZXNfZG93biA6IFtdLFxuXHRcdFx0XHRcdGlzX2xlYWYgOiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZCA6ICc1YWUyZGFzZGFzZCcsXG5cdFx0XHRcdFx0bmFtZSA6ICdEaXNjdXNzaW9uIDQnLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uIDogJ1RoaXMgaXMgdGhlIGRlc2NyaXB0aW9uIG9uIGRpc2N1c3Npb24gMiAnLFxuXHRcdFx0XHRcdGltYWdlIDogJ2h0dHA6Ly93d3cuMmdiLmNvbS9zaXRlcy9kZWZhdWx0L2ZpbGVzL2ZpZWxkL2ltYWdlLzIwMTUwMTI3L3RyYXZlbC0xejhvN2lpLmpwZycsXG5cdFx0XHRcdFx0dGFncyA6IFsgXCIjYmFuZ2tva1wiIF0sXG5cdFx0XHRcdFx0Y2hpbGQgOiBbJzRhZTJkYXNkYXNkJ10sXG5cdFx0XHRcdFx0Y29udGVudCA6ICdUaGUgI3RyaXAgdG8gbWFrZSBvdXIgbGlmZXMgYmV0dGVyIGlzIG5vdCBhbm90aGVyIHRoaW5nIHdlIG1heSBkbyBlYXNpbHkgdGhpcyAjdHJhdmVsJyxcblx0XHRcdFx0XHR2b3Rlc191cCA6IFsgXCJpYWdvdG9tYXNAZ21haWwuY29tXCIgXSxcblx0XHRcdFx0XHR2b3Rlc19kb3duIDogW10sXG5cdFx0XHRcdFx0aXNfbGVhZiA6IGZhbHNlXG5cdFx0XHRcdH0gXTtcblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuc2hhcmVkJylcblx0LmZhY3RvcnkoJ2F1dGhIdHRwUmVzcG9uc2VJbnRlcmNlcHRvcicsYXV0aEh0dHBSZXNwb25zZUludGVyY2VwdG9yKTtcblxuXHRhdXRoSHR0cFJlc3BvbnNlSW50ZXJjZXB0b3IuJGluamVjdCA9IFsgJyRxJywgJyRsb2NhdGlvbicsJyR3aW5kb3cnIF07XG5cdGZ1bmN0aW9uIGF1dGhIdHRwUmVzcG9uc2VJbnRlcmNlcHRvcigkcSwgJGxvY2F0aW9uLCR3aW5kb3cpIHtcblx0XHRyZXR1cm4ge1xuXHQgICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbihyZXNwb25zZSl7XG5cdCAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuXHQgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSA0MDFcIik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMzAyKSB7XG5cdCAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIDMwMlwiKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgJHEud2hlbihyZXNwb25zZSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZWplY3Rpb24pIHtcblx0ICAgICAgICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDQwMSkge1xuXHQgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBFcnJvciA0MDFcIixyZWplY3Rpb24pO1xuXHQgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9nb29nbGVMb2dpbicpLnNlYXJjaCgncmV0dXJuVG8nLCAkbG9jYXRpb24ucGF0aCgpKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZiAocmVqZWN0aW9uLnN0YXR1cyA9PT0gMzAyKSB7XG5cdCAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIDMwMlwiKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAvLyBDaGVjayBmb3IgYSBDT1JTIHByb2JsZW0gbWVhbmluZyB3ZSBoYXZlIGxvc3QgdGhlIHNlc3Npb25cblx0ICAgICAgICAgICAgaWYocmVqZWN0aW9uLnN0YXR1cyA9PSAwKXtcblx0ICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgRXJyb3IgMCwgQ09SUyBwcm9ibGVtXCIscmVqZWN0aW9uKTtcblx0ICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZ29vZ2xlTG9naW4nKS5zZWFyY2goJ3JldHVyblRvJywgJGxvY2F0aW9uLnBhdGgoKSk7XG5cdCAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uPScvZ29vZ2xlTG9naW4nO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcblx0ICAgICAgICB9XG5cdFx0fVxuXG5cdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwLnNoYXJlZCcpXG5cdC5mYWN0b3J5KCd0cmlwc1NlcnZpY2UnLCB0cmlwc1NlcnZpY2UpO1xuXG5cdHRyaXBzU2VydmljZS4kaW5qZWN0ID0gWyckcmVzb3VyY2UnXTtcblx0XG5cdGZ1bmN0aW9uIHRyaXBzU2VydmljZSgkcmVzb3VyY2UpIHtcblxuXHRcdHJldHVybiAkcmVzb3VyY2UoJ3RyaXBzJywge30sIHt9KTtcblx0fVxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=