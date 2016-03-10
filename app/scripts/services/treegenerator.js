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

		//Aggiungi i figli alla pila e dagli un id univoco
		treeFile.id=0;

		var coda = [];
		var lista = [];

		coda.push(treeFile);
		var identifier=0;
	 	while(coda.length!=0)
	 	{

	 		var elem = coda[0];
	
	 		coda = coda.slice(1,coda.length);

		 	if(elem.left!=null)
	 		{
	 			identifier=identifier+1;
	 			elem.left.id=identifier;
	 			elem.left.parent=elem.id;
	 			coda.push(elem.left);
	 		}
	 		if(elem.right!=null)
	 		{
	 			identifier=identifier+1;
	 			elem.right.id=identifier;
	 			elem.right.parent=elem.id;
	 			coda.push(elem.right);
	 		}
	 		lista.push(elem);
		}

		var g = new Graph();

		for(var i =0; i < lista.length; i++)
		{

			if(lista[i].type=="BinaryExpression")
	 		{
	 			g.addNode(lista[i].id, {label: lista[i].operator});
	 		}
	 		else
	 		{
	 			if(lista[i].type=="Identifier")
		 		{
					g.addNode(lista[i].id, {label: lista[i].name});		 		
				}
		 		else
		 		{
					g.addNode(lista[i].id, {label: lista[i].raw});		 		
				}
	 		}
	 		if(lista[i].parent!=null)
	 		{
	 			g.addEdge(lista[i].id, lista[i].parent);	
	 		}
	 		

	 	}
		
		var layouter = new Graph.Layout.Spring(g);
		layouter.layout();
		 
		var renderer = new Graph.Renderer.Raphael('canvas', g, 600, 700);
		renderer.draw();
		
		return callback();
	}

	return service;
});
