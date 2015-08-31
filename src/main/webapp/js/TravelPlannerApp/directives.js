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