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
   	  treeGenerator.createTree($scope.eval, $scope.inputbox.value,function(lista)
  		{

      	console.log('albero creato');	
        var render = function(r, n) 
        {
          var label = r.text(0, 0, n.label).attr({opacity:1});
          label.attr({'font-size':14});
          //the Raphael set is obligatory, containing all you want to display 
          var set = r.set()
            .push(r.circle(0, 0, 0)
              .attr({ fill: '#fafafa', 'stroke-width': 1, r: 50 })
            )
            .push(label);

          return set;
        };

        var g = new Graph();

        //Aggiungo l'elento grafico nodo
        for(var i =0; i < lista.length; i++)
        {
          g.addNode(lista[i].id, {label: lista[i].label, render: render});
        }

        //Aggiungo l'elemento grafico arco
        for(var i =0; i < lista.length; i++)
        {
          if(lista[i].parent!=null)
          {
            g.addEdge(lista[i].id, lista[i].parent);
          }
        }
        
        var layouter = new Graph.Layout.Spring(g);
        layouter.layout();
         
        var renderer = new Graph.Renderer.Raphael('canvas', g, 600, 600);
        renderer.draw();
      });
   }

  });
