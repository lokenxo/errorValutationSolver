'use strict';

/**
 * @ngdoc directive
 * @name errorValutationSolverApp.directive:outputbox
 * @description
 * # outputbox
 */
angular.module('errorValutationSolverApp').directive('outputbox', function () {
  	function link(scope)
	{
	
	}
	return { templateUrl: 'views/output-box.html', link: link };
});
