webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(1);
	__webpack_require__(14);
	__webpack_require__(18);
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function() {

		'use strict';

		angular.module('TravelPlannerApp.shared',['ngResource','ngRoute','TravelPlannerApp.breadcrumb']);
		
	}());

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	(function() {

		'use strict';

		angular.module('TravelPlannerApp.shared')
		.factory('tripsService', tripsService);

		tripsService.$inject = ['$resource'];
		
		function tripsService($resource) {

			return $resource('trips', {}, {});
		}
	})();

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports) {

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

/***/ },
/* 8 */
/***/ function(module, exports) {

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

/***/ },
/* 9 */
/***/ function(module, exports) {

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

/***/ },
/* 10 */
/***/ function(module, exports) {

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

/***/ },
/* 11 */
/***/ function(module, exports) {

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


/***/ },
/* 12 */
/***/ function(module, exports) {

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

/***/ },
/* 13 */
/***/ function(module, exports) {

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

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(16);
	__webpack_require__(17);
	(function() {

		'use strict';

		angular.module('TravelPlannerApp.breadcrumb',['ngResource']);
		
	}());

/***/ },
/* 16 */
/***/ function(module, exports) {

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

/***/ },
/* 17 */
/***/ function(module, exports) {

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

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);

/***/ },
/* 19 */
/***/ function(module, exports) {

	(function() {

		'use strict';

		angular.module('TravelPlannerApp.profile',['ngResource']);
		
	}());

/***/ },
/* 20 */
/***/ function(module, exports) {

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

/***/ },
/* 21 */
/***/ function(module, exports) {

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

/***/ }
]);