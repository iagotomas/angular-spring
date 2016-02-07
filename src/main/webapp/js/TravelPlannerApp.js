require("config.js");
require("directives.js");
require("filters.js");
require("shared");
require("breadcrumb");
require("profile");
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


}());
/*global 
 configure 
 */
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


}());

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
	
	.directive('focusOnShow', function($timeout) {
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
	})
})();
require("./service.js");
require("./controller.js");
(function() {

	'use strict';

	angular.module('TravelPlannerApp.breadcrumb',['ngResource']);
	
}());
(function() {

	'use strict';

	angular.module('TravelPlannerApp.shared',['ngResource','ngRoute','TravelPlannerApp.breadcrumb']);
	
}());
(function() {

	'use strict';

	angular.module('TravelPlannerApp.profile',['ngResource']);
	
}());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImZpbHRlcnMuanMiLCJkaXJlY3RpdmVzLmpzIiwiYnJlYWRjcnVtYi9tb2R1bGUuanMiLCJzaGFyZWQvc2hhcmVkLm1vZHVsZS5qcyIsInByb2ZpbGUvbW9kdWxlLmpzIiwiYnJlYWRjcnVtYi9jb250cm9sbGVyLmpzIiwic2hhcmVkL2NhdGVnb3JpZXMuY29udHJvbGxlci5qcyIsInNoYXJlZC9lZGl0b3IuY29udHJvbGxlci5qcyIsInNoYXJlZC9tZW51LmNvbnRyb2xsZXIuanMiLCJzaGFyZWQvc3VibWVudS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVyLmpzIiwiYnJlYWRjcnVtYi9zZXJ2aWNlLmpzIiwic2hhcmVkL2NhdGVnb3JpZXMuc2VydmljZS5qcyIsInNoYXJlZC9kaXNjdXNzaW9ucy5zZXJ2aWNlLmpzIiwic2hhcmVkL3NoYXJlZC5zZXJ2aWNlLmpzIiwic2hhcmVkL3RyaXBzLnNlcnZpY2UuanMiLCJwcm9maWxlL3NlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlRyYXZlbFBsYW5uZXJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKFwiY29uZmlnLmpzXCIpO1xucmVxdWlyZShcImRpcmVjdGl2ZXMuanNcIik7XG5yZXF1aXJlKFwiZmlsdGVycy5qc1wiKTtcbnJlcXVpcmUoXCJzaGFyZWRcIik7XG5yZXF1aXJlKFwiYnJlYWRjcnVtYlwiKTtcbnJlcXVpcmUoXCJwcm9maWxlXCIpO1xuKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4vKiBBcHAgTW9kdWxlICovXG5hbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcCcsXG5cdFx0XHRcdFsgXG5cdFx0XHRcdCAgLy8gcmVxdWlyZWQgbW9kdWxlc1xuXHRcdFx0XHQgICduZ1Jlc291cmNlJywnbmdSb3V0ZScsJ3Nob3BwaW5wYWwubW9iaWxlLW1lbnUnLCdhbmd1bGFyVXRpbHMuZGlyZWN0aXZlcy5kaXJQYWdpbmF0aW9uJywndWkuYm9vdHN0cmFwJyxcblx0XHRcdFx0ICAvLyBcblx0XHRcdFx0ICAnVHJhdmVsUGxhbm5lckFwcC5wcm9maWxlJywnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnLCdUcmF2ZWxQbGFubmVyQXBwLmJyZWFkY3J1bWInXG5cdFx0XHRcdCAgXSk7XG5cblxufSgpKTsiLCIvKmdsb2JhbCBcbiBjb25maWd1cmUgXG4gKi9cbihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwJykuY29uZmlnKGNvbmZpZ3VyZSk7XG5cdFxuXHRjb25maWd1cmUuJGluamVjdCA9IFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHJvdXRlUHJvdmlkZXInLCckaHR0cFByb3ZpZGVyJ107XG5cdFxuXHRmdW5jdGlvbiBjb25maWd1cmUoJGxvY2F0aW9uUHJvdmlkZXIsICRyb3V0ZVByb3ZpZGVyLCRodHRwUHJvdmlkZXIpIHtcblx0XHQvLyBicm93c2VyIHJlbG9hZCBkb2Vzbid0IHdvcmsgd2hlbiBodG1sNSBtb2RlIGlzIHR1cm5lZFxuXHRcdC8vIG9uLi5cblx0XHQvLyAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG5cdFx0Ly8gLndoZW4oJy8nLCB7XG5cdFx0Ly8gdGVtcGxhdGVVcmwgOiAnL2luZGV4Lmh0bWwnXG5cdFx0Ly8gfSlcblx0XHQkcm91dGVQcm92aWRlclxuXHRcdC53aGVuKCcvdHJpcC86dHJpcElkJywgXG5cdFx0XHRcdHtcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9wYXJ0aWFscy9jYXRlZ29yeS50cGwuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyIDogJ0NhdGVnb3JpZXNDb250cm9sbGVyJ1xuXHRcdFx0XHR9XG5cdFx0KVxuXHRcdC53aGVuKCcvdHJpcC86dHJpcElkL2NhdGVnb3J5LzpjYXRlZ29yeUlkJywgXG5cdFx0XHRcdHtcblx0XHRcdHRlbXBsYXRlVXJsIDogJy9wYXJ0aWFscy9jYXRlZ29yeS50cGwuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyIDogJ0NhdGVnb3JpZXNDb250cm9sbGVyJ1xuXHRcdFx0XHR9XG5cdFx0KVxuXHRcdC53aGVuKCcvdHJpcC86dHJpcElkL2NhdGVnb3J5LzpjYXRlZ29yeUlkL2Rpc2N1c3Npb24vOmRpc2N1c3Npb25JZCcsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICcvcGFydGlhbHMvZWRpdG9yLnRwbC5odG1sJyxcblx0XHRcdFx0XHRjb250cm9sbGVyIDogJ0VkaXRvckNvbnRyb2xsZXInXG5cdFx0XHRcdH1cblx0XHQpXG5cdFx0Lm90aGVyd2lzZSh7XG5cdFx0XHRyZWRpcmVjdFRvIDogJy90cmlwLy0xJ1xuXHRcdH0pO1xuXHRcdFxuXHRcdCRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhIdHRwUmVzcG9uc2VJbnRlcmNlcHRvcicpO1xuXHR9XG5cblxufSgpKTtcbiIsIi8qIEZpbHRlcnMgKi9cbihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAnKVxuXHRcblx0LmZpbHRlcignaXNOb3RMZWFmJywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGl0ZW1zKSB7XG5cdFx0XHRyZXR1cm4gaXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuICFpdGVtLmlzX2xlYWY7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pXG5cdC5maWx0ZXIoJ2NoaWxkJywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNoaWxkSWQsIGRpc2N1c3Npb25zKSB7XG5cdFx0XHRyZXR1cm4gZGlzY3Vzc2lvbnMuZmlsdGVyKGZ1bmN0aW9uKGNoaWxkKSB7XG5cdFx0XHRcdHJldHVybiBjaGlsZC5pZCA9PSBjaGlsZElkO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KVxuXHQuZmlsdGVyKCdjaGFyYWN0ZXJzJywgZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBjaGFycywgYnJlYWtPbldvcmQpIHtcblx0XHRcdGlmIChpc05hTihjaGFycykpXG5cdFx0XHRcdHJldHVybiBpbnB1dDtcblx0XHRcdGlmIChjaGFycyA8PSAwKVxuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHRpZiAoaW5wdXQgJiYgaW5wdXQubGVuZ3RoID4gY2hhcnMpIHtcblx0XHRcdFx0aW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgY2hhcnMpO1xuXG5cdFx0XHRcdGlmICghYnJlYWtPbldvcmQpIHtcblx0XHRcdFx0XHR2YXIgbGFzdHNwYWNlID0gaW5wdXQubGFzdEluZGV4T2YoJyAnKTtcblx0XHRcdFx0XHQvLyBnZXQgbGFzdCBzcGFjZVxuXHRcdFx0XHRcdGlmIChsYXN0c3BhY2UgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBsYXN0c3BhY2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR3aGlsZSAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aCAtIDEpID09PSAnICcpIHtcblx0XHRcdFx0XHRcdGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gaW5wdXQgKyAn4oCmJztcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbnB1dDtcblx0XHR9O1xuXHR9KVxuXG59KSgpOyIsIi8qIERpcmVjdGl2ZXMgKi9cbihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwJylcblx0XG5cdC5kaXJlY3RpdmUoXCJiYWNraW1nXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdHZhciB1cmwgPSBhdHRycy5iYWNraW1nO1xuXHRcdFx0aWYgKHVybCAhPSAnJykge1xuXHRcdFx0XHRlbGVtZW50LmNzcyh7XG5cdFx0XHRcdFx0J2JhY2tncm91bmQtaW1hZ2UnIDogJ3VybCgnICsgdXJsICsgJyknLFxuXHRcdFx0XHRcdCdiYWNrZ3JvdW5kLXNpemUnIDogJ2NvdmVyJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pXG5cdFxuXHQuZGlyZWN0aXZlKCdmb2N1c09uU2hvdycsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0IDogJ0EnLFxuXHRcdFx0bGluayA6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRyKSB7XG5cdFx0XHRcdGlmICgkYXR0ci5uZ1Nob3cpIHtcblx0XHRcdFx0XHQkc2NvcGUuJHdhdGNoKCRhdHRyLm5nU2hvdywgZnVuY3Rpb24obmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmIChuZXdWYWx1ZSkge1xuXHRcdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHQkZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHR9LCAwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICgkYXR0ci5uZ0hpZGUpIHtcblx0XHRcdFx0XHQkc2NvcGUuJHdhdGNoKCRhdHRyLm5nSGlkZSwgZnVuY3Rpb24obmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdGlmICghbmV3VmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0fSwgMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fTtcblx0fSlcbn0pKCk7IiwicmVxdWlyZShcIi4vc2VydmljZS5qc1wiKTtcbnJlcXVpcmUoXCIuL2NvbnRyb2xsZXIuanNcIik7XG4oZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwLmJyZWFkY3J1bWInLFsnbmdSZXNvdXJjZSddKTtcblx0XG59KCkpOyIsIihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuc2hhcmVkJyxbJ25nUmVzb3VyY2UnLCduZ1JvdXRlJywnVHJhdmVsUGxhbm5lckFwcC5icmVhZGNydW1iJ10pO1xuXHRcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5wcm9maWxlJyxbJ25nUmVzb3VyY2UnXSk7XG5cdFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwLmJyZWFkY3J1bWInKVxuXHQuY29udHJvbGxlcignQnJlYWRjcnVtYkNvbnRyb2xsZXInLEJyZWFkY3J1bWJDb250cm9sbGVyKVxuXHRcblx0QnJlYWRjcnVtYkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnYnJlYWRjcnVtYlNlcnZpY2UnXTtcblx0XG5cdGZ1bmN0aW9uIEJyZWFkY3J1bWJDb250cm9sbGVyKCRzY29wZSxicmVhZGNydW1iU2VydmljZSkge1xuXHRcdHZhciB2bT0kc2NvcGU7XG5cdFx0dm0uY3VycmVudFBhdGggPSBicmVhZGNydW1iU2VydmljZS5nZXQoKTtcblx0XHR2bS5jdXJyZW50RWRpdFBhdGggPSBbe25hbWU6J05hbWUnLGhyZWY6Jy90cmlwL2lkMy9jYXRlZ29yeS8zL2Rpc2N1c3Npb24vNCd9XTtcblx0fVxuXHRcblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuY29udHJvbGxlcignQ2F0ZWdvcmllc0NvbnRyb2xsZXInLENhdGVnb3JpZXNDb250cm9sbGVyKVxuXHRcblx0Q2F0ZWdvcmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvY2F0aW9uJywnJHJvdXRlUGFyYW1zJywnZGlzY3Vzc2lvbnNTZXJ2aWNlJ107XG5cdFxuXHRmdW5jdGlvbiBDYXRlZ29yaWVzQ29udHJvbGxlcigkc2NvcGUsJGxvY2F0aW9uLCRyb3V0ZVBhcmFtcyxkaXNjdXNzaW9uc1NlcnZpY2UpIHtcblx0XHR2YXIgdm09JHNjb3BlO1xuXHRcdHZtLmRpc2N1c3Npb25zID0gZGlzY3Vzc2lvbnNTZXJ2aWNlLmRpc2N1c3Npb25zO1xuXHRcdHZtLmNhdGVnb3J5SWQgPSB0eXBlb2YgJHJvdXRlUGFyYW1zLmNhdGVnb3J5SWQgIT09ICd1bmRlZmluZWQnPyRyb3V0ZVBhcmFtcy5jYXRlZ29yeUlkOm51bGw7XG5cdFx0dm0udHJpcElkID0gJHJvdXRlUGFyYW1zLnRyaXBJZDtcblx0XHR2bS5zaG93ID0gZnVuY3Rpb24oZGlzY3Vzc2lvbil7XG5cdFx0XHR2bS50cmlwSWQgPSAkcm91dGVQYXJhbXMudHJpcElkO1xuXHRcdFx0dm0uY2F0ZWdvcnlJZCA9ICRyb3V0ZVBhcmFtcy5jYXRlZ29yeUlkO1xuXHRcdFx0dmFyIHVybCA9IFwidHJpcC9cIit2bS50cmlwSWQrXCIvY2F0ZWdvcnkvXCIrdm0uY2F0ZWdvcnlJZCtcIi9kaXNjdXNzaW9uL1wiK2Rpc2N1c3Npb24uaWQ7XG5cdFx0XHQkbG9jYXRpb24ucGF0aCh1cmwpO1xuXHRcdH07XG5cdFx0dm0uaG92ZXJJbiA9IGZ1bmN0aW9uKGV2ZW50KXtcblxuXHRcdFx0dmFyIGVsID0gYW5ndWxhci5lbGVtZW50KGV2ZW50LnRhcmdldClcblx0XHQgICAgLy9lbC5jc3MoeydoZWlnaHQnIDogJzEwMCUnfSk7XG5cdFx0fTtcblxuXHRcdHZtLmhvdmVyT3V0ID0gZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0dmFyIGVsID0gYW5ndWxhci5lbGVtZW50KGV2ZW50LnRhcmdldClcblx0XHQgICAvLyBlbC5jc3MoeydoZWlnaHQnIDogJzI1MHB4J30pO1xuXHRcdH07XG5cdH1cblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuY29udHJvbGxlcignRWRpdG9yQ29udHJvbGxlcicsRWRpdG9yQ29udHJvbGxlcilcblx0XG5cdEVkaXRvckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XG5cdFxuXHRmdW5jdGlvbiBFZGl0b3JDb250cm9sbGVyKCRzY29wZSkge1xuXHRcdHZhciB2bT0kc2NvcGU7XG5cdFx0XG5cdFx0dm0udGFncyA9IFtdO1xuXHRcdHZtLmVkaXRvckRhdGEgPSAnJztcblx0XHR2bS5pc0NvbGxhcHNlZCA9IHRydWU7XG5cdFx0XG4vL1x0XHR2bS4kd2F0Y2goJ2lzQ29sbGFwc2VkJywgZnVuY3Rpb24oaW5wdXQpe1xuLy9cdCAgICAgICAgXG4vL1x0ICAgIH0pXG5cdCAgICB2bS5zYXZlID0gZnVuY3Rpb24oKXtcblx0XHRcdGFsZXJ0KHZtLmVkaXRvckRhdGEpO1xuXHRcdFx0dm0uZWRpdG9yRGF0YSA9ICcnO1xuXHRcdFx0dm0uaXNDb2xsYXBzZWQgPSB0cnVlO1xuXHRcdH07XG5cdFx0dm0uY2FuY2VsID0gZnVuY3Rpb24oKXtcblx0XHRcdHZtLmVkaXRvckRhdGEgPSAnJztcblx0XHRcdHZtLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblx0XHR9XG5cdFx0dm0ucGFyc2VUYWdzID0gZnVuY3Rpb24oKXtcblxuXHRcdFx0XG5cdCAgICAgICAgdmFyIHdvcmRzID0gdHlwZW9mIHZtLmVkaXRvciAhPT0gJ3VuZGVmaW5lZCc/IHZtLmVkaXRvci5zcGxpdCgvXFxzKy9nKTpbXTtcblx0ICAgICAgICB2YXIgd29yZE9iamVjdHMgPSBbXTtcblx0ICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgXHRpZih3b3Jkc1tpXS5zdGFydHNXaXRoKCcjJykpe1xuXHQgICAgICAgIFx0XHR3b3JkT2JqZWN0cy5wdXNoKHdvcmRzW2ldKTtcblx0ICAgICAgICBcdH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKCh3b3Jkcy5sZW5ndGggPT0gMSkgJiYgKHdvcmRzWzBdID09PSAnJykpIHtcblx0ICAgICAgICAgICAgdm0udGFncyA9IFtdO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgdm0udGFncyA9IGFuZ3VsYXIuY29weSh3b3JkT2JqZWN0cyk7XG5cdCAgICAgICAgfVxuXHRcdH07XG5cdH1cblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLE1lbnVDb250cm9sbGVyKVxuXHRcblx0TWVudUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJGxvY2F0aW9uJywnJHJvdXRlUGFyYW1zJywndHJpcHNTZXJ2aWNlJywnYnJlYWRjcnVtYlNlcnZpY2UnXTtcblx0XG5cdGZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCRzY29wZSwkbG9jYXRpb24sJHJvdXRlUGFyYW1zLHRyaXBzU2VydmljZSxicmVhZGNydW1iU2VydmljZSkge1xuXHRcdHZhciB2bT0kc2NvcGU7XG5cdFx0dm0ubWVudSA9IHRyaXBzU2VydmljZS5xdWVyeSgpO1xuXHRcdHZtLnRvZ2dsZSA9IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0aXRlbS5hY3RpdmUgPSAhaXRlbS5hY3RpdmU7XG5cdFx0XHRpZihpdGVtLmFjdGl2ZSl7XG5cdFx0XHRcdGJyZWFkY3J1bWJTZXJ2aWNlLnJlc2V0KCk7XG5cdFx0XHRcdGJyZWFkY3J1bWJTZXJ2aWNlLmFkZChpdGVtLmlkLGl0ZW0ubmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdCRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcblx0XHRcdGJyZWFkY3J1bWJTZXJ2aWNlLmFkZChcIi90cmlwL2lkMVwiLFwiQWxnb1wiKTtcblx0ICAgIH0pO1xuXHRcdC8qXG5cdFx0ICogU2VlOlxuXHRcdCAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI1OTI0NzIvaG93LXRvLWhpZ2hsaWdodC1hLWN1cnJlbnQtbWVudS1pdGVtLWluLWFuZ3VsYXJqc1xuXHRcdCAqL1xuXHRcdHZtLmdldENsYXNzID0gZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHQgICAgaWYgKCRyb3V0ZVBhcmFtcy50cmlwSWQgPT0gaXRlbS5pZCkge1xuXHRcdCAgICAgICAgcmV0dXJuIFwiYWN0aXZlXCJcblx0XHQgICAgfSBlbHNlIHtcblx0XHQgICAgICAgIHJldHVybiBcIlwiXG5cdFx0ICAgIH1cblx0XHR9XG5cdH1cblx0XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuc2hhcmVkJylcblx0LmNvbnRyb2xsZXIoJ1N1Ym1lbnVDb250cm9sbGVyJyxTdWJtZW51Q29udHJvbGxlcilcblx0XG5cdFN1Ym1lbnVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsJyRsb2NhdGlvbicsJyRyb3V0ZScsJyRyb3V0ZVBhcmFtcycsJ2NhdGVnb3JpZXNTZXJ2aWNlJ107XG5cdFxuXHRmdW5jdGlvbiBTdWJtZW51Q29udHJvbGxlcigkc2NvcGUsJGxvY2F0aW9uLCRyb3V0ZSwkcm91dGVQYXJhbXMsY2F0ZWdvcmllc1NlcnZpY2UpIHtcblx0XHR2YXIgdm09JHNjb3BlO1xuXHRcdHZtLnN1Ym1lbnUgPSBjYXRlZ29yaWVzU2VydmljZS5xdWVyeSgkcm91dGVQYXJhbXMudHJpcElkKTtcblx0XHQvLyBsaXN0ZW4gcm91dGUgY2hhbmdlcyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3NDQ5NzQzL2hvdy10by11c2UtY3VycmVudC11cmwtcGFyYW1zLWluLWFuZ3VsYXItY29udHJvbGxlclxuXHRcdCRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZtLnN1Ym1lbnUgPSBjYXRlZ29yaWVzU2VydmljZS5xdWVyeSgkcm91dGUuY3VycmVudC5wYXJhbXMudHJpcElkKTtcblx0ICAgIH0pO1xuXHRcdHZtLmdldFN1YkNsYXNzID0gZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHQgICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkgPT0gaXRlbS5ocmVmKSB7XG5cdFx0ICAgICAgICByZXR1cm4gXCJhY3RpdmVcIlxuXHRcdCAgICB9IGVsc2Uge1xuXHRcdCAgICAgICAgcmV0dXJuIFwiXCJcblx0XHQgICAgfVxuXHRcdH1cblx0fVxuXHRcblx0XG5cdFxuXHRcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5wcm9maWxlJylcblx0LmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJyxQcm9maWxlQ29udHJvbGxlcilcblx0XG5cdFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsJ3Byb2ZpbGVTZXJ2aWNlJ107XG5cdFxuXHRmdW5jdGlvbiBQcm9maWxlQ29udHJvbGxlcigkc2NvcGUscHJvZmlsZVNlcnZpY2UpIHtcblx0XHR2YXIgdm09JHNjb3BlO1xuXHRcdHZtLnVzZXIgPSBwcm9maWxlU2VydmljZS5xdWVyeSgpO1xuXHR9XG5cdFxuXHRcblx0XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuYnJlYWRjcnVtYicpXG5cdC5zZXJ2aWNlKCdicmVhZGNydW1iU2VydmljZScsIGJyZWFkY3J1bWJTZXJ2aWNlKTtcblxuXHRicmVhZGNydW1iU2VydmljZS4kaW5qZWN0ID0gW107XG5cdGZ1bmN0aW9uIGJyZWFkY3J1bWJTZXJ2aWNlKCkge1xuXHRcdHZhciBwYXRoPVtdO1xuXHRcdHJldHVybiB7XG5cdFx0XHRnZXQ6ZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0XHR9LFxuXHRcdFx0YWRkOmZ1bmN0aW9uKGhyZWYsbmFtZSl7XG5cdFx0XHRcdHBhdGgucHVzaCh7XCJocmVmXCI6aHJlZixcIm5hbWVcIjpuYW1lfSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVzZXQ6ZnVuY3Rpb24oKXtcblx0XHRcdFx0cGF0aD1bXTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH07XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuZmFjdG9yeSgnY2F0ZWdvcmllc1NlcnZpY2UnLGNhdGVnb3JpZXNTZXJ2aWNlKTtcblx0XG5cdGNhdGVnb3JpZXNTZXJ2aWNlLiRpbmplY3QgPSBbICckcmVzb3VyY2UnXTtcblx0XG5cdGZ1bmN0aW9uIGNhdGVnb3JpZXNTZXJ2aWNlKCRyZXNvdXJjZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRxdWVyeSA6IGZ1bmN0aW9uKGlkKSB7XG5cdFxuXHRcdFx0XHRyZXR1cm4gWyB7XG5cdFx0XHRcdFx0Y2xhc3MgOiBcIlwiLFxuXHRcdFx0XHRcdGhyZWYgOiBcIi90cmlwL1wiICsgaWQgKyBcIi9jYXRlZ29yeS8xXCIsXG5cdFx0XHRcdFx0bmFtZSA6IFwiU3VibWVudSAxIC0gXCIgKyBpZFxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0Y2xhc3MgOiBcIlwiLFxuXHRcdFx0XHRcdGhyZWYgOiBcIi90cmlwL1wiICsgaWQgKyBcIi9jYXRlZ29yeS8yXCIsXG5cdFx0XHRcdFx0bmFtZSA6IFwiU3VibWVudSAyIC0gXCIgKyBpZFxuXHRcdFx0XHR9IF07XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufSkoKTsiLCIvKiBGaWx0ZXJzICovXG4oZnVuY3Rpb24oKSB7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAuc2hhcmVkJylcblx0LmZhY3RvcnkoJ2Rpc2N1c3Npb25zU2VydmljZScsIGRpc2N1c3Npb25zU2VydmljZSk7XG5cblx0ZGlzY3Vzc2lvbnNTZXJ2aWNlLiRpbmplY3QgPSBbICckcmVzb3VyY2UnLCAnJHJvdXRlUGFyYW1zJyBdO1xuXHRcblx0ZnVuY3Rpb24gZGlzY3Vzc2lvbnNTZXJ2aWNlKCRyZXNvdXJjZSwgJHJvdXRlUGFyYW1zKSB7XG5cdFx0dmFyIGRhdGEgPSB7fTtcblx0XHRkYXRhLmRpc2N1c3Npb25zID0gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWQgOiAnMWFlMmRhc2Rhc2QnLFxuXHRcdFx0XHRcdG5hbWUgOiAnRGlzY3Vzc2lvbiAxJyxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA6ICdUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvbiBkaXNjdXNzaW9uIDEnLFxuXHRcdFx0XHRcdGltYWdlIDogJ2h0dHA6Ly93d3cuMmdiLmNvbS9zaXRlcy9kZWZhdWx0L2ZpbGVzL2ZpZWxkL2ltYWdlLzIwMTUwMTI3L3RyYXZlbC0xejhvN2lpLmpwZycsXG5cdFx0XHRcdFx0dGFncyA6IFsgXCIjdHJhdmVsXCIsIFwiI3RyaXBcIiBdLFxuXHRcdFx0XHRcdGNoaWxkIDogWyBcIjJhZTJkYXNkYXNkXCIgXSxcblx0XHRcdFx0XHRjb250ZW50IDogJ1RoZSAjdHJpcCB0byBtYWtlIG91ciBsaWZlcyBiZXR0ZXIgaXMgbm90IGFub3RoZXIgdGhpbmcgd2UgbWF5IGRvIGVhc2lseSB0aGlzICN0cmF2ZWwnLFxuXHRcdFx0XHRcdHZvdGVzX3VwIDogWyBcImlhZ290b21hc0BnbWFpbC5jb21cIiBdLFxuXHRcdFx0XHRcdHZvdGVzX2Rvd24gOiBbXSxcblx0XHRcdFx0XHRpc19sZWFmIDogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlkIDogJzJhZTJkYXNkYXNkJyxcblx0XHRcdFx0XHRuYW1lIDogJ0Rpc2N1c3Npb24gMSBjaGlsZCAxJyxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA6ICdUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvbiBkaXNjdXNzaW9uIDEgY2hpbGQgMScsXG5cdFx0XHRcdFx0aW1hZ2UgOiAnaHR0cDovL3d3dy4yZ2IuY29tL3NpdGVzL2RlZmF1bHQvZmlsZXMvZmllbGQvaW1hZ2UvMjAxNTAxMjcvdHJhdmVsLTF6OG83aWkuanBnJyxcblx0XHRcdFx0XHR0YWdzIDogWyBcIiN0cmF2ZWxcIiwgXCIjdHJpcFwiLCBcIiNiYW5na29rXCIgXSxcblx0XHRcdFx0XHRjaGlsZCA6IFtdLFxuXHRcdFx0XHRcdGNvbnRlbnQgOiAnVGhlICN0cmlwIHRvIG1ha2Ugb3VyIGxpZmVzIGJldHRlciBpcyBub3QgYW5vdGhlciB0aGluZyB3ZSBtYXkgZG8gZWFzaWx5IHRoaXMgI3RyYXZlbCB0byAjYmFuZ2tvaycsXG5cdFx0XHRcdFx0dm90ZXNfdXAgOiBbXSxcblx0XHRcdFx0XHR2b3Rlc19kb3duIDogW10sXG5cdFx0XHRcdFx0aXNfbGVhZiA6IHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlkIDogJzNhZTJkYXNkYXNkJyxcblx0XHRcdFx0XHRuYW1lIDogJ0Rpc2N1c3Npb24gMicsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb24gOiAnVGhpcyBpcyB0aGUgZGVzY3JpcHRpb24gb24gZGlzY3Vzc2lvbiAyICcsXG5cdFx0XHRcdFx0aW1hZ2UgOiAnL2ltYWdlcy90cmF2ZWxfcGxhbi5qcGcnLFxuXHRcdFx0XHRcdHRhZ3MgOiBbIFwiI2Jhbmdrb2tcIiBdLFxuXHRcdFx0XHRcdGNoaWxkIDogW10sXG5cdFx0XHRcdFx0Y29udGVudCA6ICdUaGUgI3RyaXAgdG8gbWFrZSBvdXIgbGlmZXMgYmV0dGVyIGlzIG5vdCBhbm90aGVyIHRoaW5nIHdlIG1heSBkbyBlYXNpbHkgdGhpcyAjdHJhdmVsJyxcblx0XHRcdFx0XHR2b3Rlc191cCA6IFsgXCJpYWdvdG9tYXNAZ21haWwuY29tXCIgXSxcblx0XHRcdFx0XHR2b3Rlc19kb3duIDogW10sXG5cdFx0XHRcdFx0aXNfbGVhZiA6IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZCA6ICc0YWUyZGFzZGFzZCcsXG5cdFx0XHRcdFx0bmFtZSA6ICdEaXNjdXNzaW9uIDMnLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uIDogJ1RoaXMgaXMgdGhlIGRlc2NyaXB0aW9uIG9uIGRpc2N1c3Npb24gMyAnLFxuXHRcdFx0XHRcdGltYWdlIDogJ2h0dHA6Ly93d3cuMmdiLmNvbS9zaXRlcy9kZWZhdWx0L2ZpbGVzL2ZpZWxkL2ltYWdlLzIwMTUwMTI3L3RyYXZlbC0xejhvN2lpLmpwZycsXG5cdFx0XHRcdFx0dGFncyA6IFsgXCIjYmFuZ2tva1wiIF0sXG5cdFx0XHRcdFx0Y2hpbGQgOiBbXSxcblx0XHRcdFx0XHRjb250ZW50IDogJ1RoZSAjdHJpcCB0byBtYWtlIG91ciBsaWZlcyBiZXR0ZXIgaXMgbm90IGFub3RoZXIgdGhpbmcgd2UgbWF5IGRvIGVhc2lseSB0aGlzICN0cmF2ZWwnLFxuXHRcdFx0XHRcdHZvdGVzX3VwIDogWyBcImlhZ290b21hc0BnbWFpbC5jb21cIiBdLFxuXHRcdFx0XHRcdHZvdGVzX2Rvd24gOiBbXSxcblx0XHRcdFx0XHRpc19sZWFmIDogdHJ1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWQgOiAnNWFlMmRhc2Rhc2QnLFxuXHRcdFx0XHRcdG5hbWUgOiAnRGlzY3Vzc2lvbiA0Jyxcblx0XHRcdFx0XHRkZXNjcmlwdGlvbiA6ICdUaGlzIGlzIHRoZSBkZXNjcmlwdGlvbiBvbiBkaXNjdXNzaW9uIDIgJyxcblx0XHRcdFx0XHRpbWFnZSA6ICdodHRwOi8vd3d3LjJnYi5jb20vc2l0ZXMvZGVmYXVsdC9maWxlcy9maWVsZC9pbWFnZS8yMDE1MDEyNy90cmF2ZWwtMXo4bzdpaS5qcGcnLFxuXHRcdFx0XHRcdHRhZ3MgOiBbIFwiI2Jhbmdrb2tcIiBdLFxuXHRcdFx0XHRcdGNoaWxkIDogWyc0YWUyZGFzZGFzZCddLFxuXHRcdFx0XHRcdGNvbnRlbnQgOiAnVGhlICN0cmlwIHRvIG1ha2Ugb3VyIGxpZmVzIGJldHRlciBpcyBub3QgYW5vdGhlciB0aGluZyB3ZSBtYXkgZG8gZWFzaWx5IHRoaXMgI3RyYXZlbCcsXG5cdFx0XHRcdFx0dm90ZXNfdXAgOiBbIFwiaWFnb3RvbWFzQGdtYWlsLmNvbVwiIF0sXG5cdFx0XHRcdFx0dm90ZXNfZG93biA6IFtdLFxuXHRcdFx0XHRcdGlzX2xlYWYgOiBmYWxzZVxuXHRcdFx0XHR9IF07XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCdUcmF2ZWxQbGFubmVyQXBwLnNoYXJlZCcpXG5cdC5mYWN0b3J5KCdhdXRoSHR0cFJlc3BvbnNlSW50ZXJjZXB0b3InLGF1dGhIdHRwUmVzcG9uc2VJbnRlcmNlcHRvcik7XG5cblx0YXV0aEh0dHBSZXNwb25zZUludGVyY2VwdG9yLiRpbmplY3QgPSBbICckcScsICckbG9jYXRpb24nLCckd2luZG93JyBdO1xuXHRmdW5jdGlvbiBhdXRoSHR0cFJlc3BvbnNlSW50ZXJjZXB0b3IoJHEsICRsb2NhdGlvbiwkd2luZG93KSB7XG5cdFx0cmV0dXJuIHtcblx0ICAgICAgICByZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHQgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcblx0ICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgNDAxXCIpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDMwMikge1xuXHQgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSAzMDJcIik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8ICRxLndoZW4ocmVzcG9uc2UpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XG5cdCAgICAgICAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09PSA0MDEpIHtcblx0ICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgRXJyb3IgNDAxXCIscmVqZWN0aW9uKTtcblx0ICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZ29vZ2xlTG9naW4nKS5zZWFyY2goJ3JldHVyblRvJywgJGxvY2F0aW9uLnBhdGgoKSk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDMwMikge1xuXHQgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSAzMDJcIik7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGEgQ09SUyBwcm9ibGVtIG1lYW5pbmcgd2UgaGF2ZSBsb3N0IHRoZSBzZXNzaW9uXG5cdCAgICAgICAgICAgIGlmKHJlamVjdGlvbi5zdGF0dXMgPT0gMCl7XG5cdCAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIEVycm9yIDAsIENPUlMgcHJvYmxlbVwiLHJlamVjdGlvbik7XG5cdCAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2dvb2dsZUxvZ2luJykuc2VhcmNoKCdyZXR1cm5UbycsICRsb2NhdGlvbi5wYXRoKCkpO1xuXHQgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbj0nL2dvb2dsZUxvZ2luJztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG5cdCAgICAgICAgfVxuXHRcdH1cblxuXHR9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgnVHJhdmVsUGxhbm5lckFwcC5zaGFyZWQnKVxuXHQuZmFjdG9yeSgndHJpcHNTZXJ2aWNlJywgdHJpcHNTZXJ2aWNlKTtcblxuXHR0cmlwc1NlcnZpY2UuJGluamVjdCA9IFsnJHJlc291cmNlJ107XG5cdFxuXHRmdW5jdGlvbiB0cmlwc1NlcnZpY2UoJHJlc291cmNlKSB7XG5cblx0XHRyZXR1cm4gJHJlc291cmNlKCd0cmlwcycsIHt9LCB7fSk7XG5cdH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhci5tb2R1bGUoJ1RyYXZlbFBsYW5uZXJBcHAucHJvZmlsZScpXG5cdC5mYWN0b3J5KCdwcm9maWxlU2VydmljZScscHJvZmlsZVNlcnZpY2UpO1xuXHRwcm9maWxlU2VydmljZS4kaW5qZWN0ID0gWyckcmVzb3VyY2UnXTtcblx0XG5cdGZ1bmN0aW9uIHByb2ZpbGVTZXJ2aWNlKCRyZXNvdXJjZSkge1xuXHRcdFxuXHRcdFxuXHRcdHJldHVybiAkcmVzb3VyY2UoJ3Byb2ZpbGUnLCB7fSwge1xuXHRcdFx0cXVlcnkgOiB7XG5cdFx0XHRcdG1ldGhvZCA6ICdHRVQnLFxuXHRcdFx0XHRpc0FycmF5IDogZmFsc2Vcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9