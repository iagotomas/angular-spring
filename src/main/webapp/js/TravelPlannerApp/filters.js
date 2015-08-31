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