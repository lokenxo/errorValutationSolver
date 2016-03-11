'use strict';

/**
 * @ngdoc directive
 * @name errorValutationSolverApp.directive:inputbox
 * @description
 * # inputbox
 */
angular.module('errorValutationSolverApp').directive('inputbox', function () {
   	function link(scope)
	{
		var input = document.getElementById('inputbox');
		scope.inputbox = input;
	}
	return { templateUrl: 'views/input-box.html', link: link };
  });
