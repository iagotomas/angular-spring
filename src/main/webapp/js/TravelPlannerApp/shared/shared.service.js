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