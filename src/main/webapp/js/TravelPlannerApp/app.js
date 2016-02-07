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