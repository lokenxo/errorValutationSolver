'use strict';

/**
 * @ngdoc service
 * @name errorValutationSolverApp.treeGenerator
 * @description
 * # treeGenerator
 * Service in the errorValutationSolverApp.
 */
angular.module('errorValutationSolverApp').service('treeGenerator', function () 
{
	var service = {};
	service.createTree = function(treeFile, callback)
	{
		console.log(treeFile);
		var g = new Graph();
 
		g.addEdge("strawberry", "cherry");
		g.addEdge("strawberry", "apple");
		g.addEdge("strawberry", "tomato");
		 
		g.addEdge("tomato", "apple");
		g.addEdge("tomato", "kiwi");
		 
		g.addEdge("cherry", "apple");
		g.addEdge("cherry", "kiwi");
		 
		var layouter = new Graph.Layout.Spring(g);
		layouter.layout();
		 
		var renderer = new Graph.Renderer.Raphael('canvas', g, 400, 300);
		renderer.draw();
		
		return callback();
	}

	return service;
});
