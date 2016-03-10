'use strict';

/**
 * @ngdoc function
 * @name errorValutationSolverApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the errorValutationSolverApp
 */
angular.module('errorValutationSolverApp').controller('MainCtrl', function ($scope, treeGenerator) {
	
   $scope.eval = '';
   $scope.inputbox = '';

   $scope.valuta = function()
   {
   		$scope.eval= jsep($scope.inputbox.value);
   		treeGenerator.createTree($scope.eval, function()
		{
			console.log('albero creato');	
		});
   }

  });
