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