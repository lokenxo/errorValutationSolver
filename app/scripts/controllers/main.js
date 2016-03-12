'use strict';

/**
 * @ngdoc function
 * @name errorValutationSolverApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the errorValutationSolverApp
 */
angular.module('errorValutationSolverApp').controller('MainCtrl', function ($scope, treeGenerator) 
{
  var Fraction = algebra.Fraction;
  var Expression = algebra.Expression;
  var Equation = algebra.Equation;
  $scope.eval = '';
  $scope.inputbox = '';

  $scope.erroreAlgoritmico='';
  $scope.erroreInerente='';
  $scope.erroreTotale='';

  $scope.valuta = function()
  {
  	$scope.eval= jsep($scope.inputbox.value);

  	treeGenerator.createTree($scope.eval, $scope.inputbox.value,function(lista)
  	{

    	console.log('albero creato');	
      var render = function(r, n) 
      {
        //Label del valore del nodo
        var label = r.text(0, 0, n.label).attr({opacity:1});
        label.attr({'font-size':12, color: '#000000'});

        //Label dell'ID del nodo
        var label_id = r.text(0,-40, n.id).attr({opacity:1});
        label_id.attr({'font-size':14, color:'#FF0000'});

        //the Raphael set is obligatory, containing all you want to display 
        var set = r.set()
          .push(r.circle(0, 0, 0)
            .attr({ fill: '#000000', 'stroke-width': 1, r: 50 })
          ).push(label).push(label_id);

        var error = r.text(-100, -50, n.error).attr({opacity:1});
        error.attr({'font-size':10, fill: 'red', color: '#000000',  "font-weight": "bold"});
        var tooltip = r.set().push(error);

        for(var i in set.items) {
          set.items[i].tooltip(tooltip);
        }

        return set;
      };

      var g = new Graph();

      //Aggiungo l'elento grafico nodo
      for(var i =0; i < lista.length; i++)
      {
        g.addNode(lista[i].id, {label: lista[i].label, error:lista[i].erroreTotale, id:lista[i].id, render: render});
      }

      //Aggiungo l'elemento grafico arco
      for(var i =0; i < lista.length; i++)
      {
        if(lista[i].parent!=null)
        {
          g.addEdge(lista[i].id, lista[i].parent, { directed: 'true', 'font-weight':'bold', stroke: '#bfa' , fill: '#56f', 'color':'blue','font-size':14,label: lista[i].coefficienteAmpl });
        }
      }
      
      var layouter = new Graph.Layout.Spring(g);
      layouter.layout();
       
      var renderer = new Graph.Renderer.Raphael('canvas', g, 600, 600);
      renderer.draw();

      /*$scope.erroreAlgoritmico=lista.erroreAlgoritmico;
      $scope.erroreInerente=lista.erroreInerente;
      $scope.erroreTotale=lista.erroreTotale;*/

      var rowDataErroreAlgoritmico = algebra.parse(lista.erroreAlgoritmico);
     // var exErroreAlgoritmico_expr = new Expression(lista.erroreAlgoritmico);
      var exErroreAlgoritmico = new Equation(rowDataErroreAlgoritmico, 0);
      katex.render(exErroreAlgoritmico.toTex(), erroreAlgoritmico);

      var rowDataErroreInerente = algebra.parse(lista.erroreInerente);
      //var exErroreInerente_expr = new Expression(lista.erroreInerente);
      var exErroreInerente = new Equation(rowDataErroreInerente, 0);
      katex.render(exErroreInerente.toTex(), erroreInerente);

      var rowDataErroreTotale = algebra.parse(lista.erroreTotale);
      //var exErroreTotale_expr = new Expression(lista.erroreTotale);
      var exErroreTotale = new Equation(rowDataErroreTotale, 0);
      katex.render(exErroreTotale.toTex(), erroreTotale);     

      $scope.erroreAlgoritmico=lista.erroreAlgoritmico;   
      console.log($scope.erroreAlgoritmico);
       treeGenerator.valutaErroreAlgoritmico($scope.erroreAlgoritmico, function(lista_trans)
    {
        var rowDataErroreAlgoritmico = algebra.parse(lista_trans);
        var exErroreAlgoritmico = new Equation(rowDataErroreAlgoritmico, 0);
        katex.render(exErroreAlgoritmico.toTex(), erroreAlgoritmico);
        var answer = exErroreAlgoritmico.solveFor("a");
        console.log(answer.toString());
    });
    });

   
  }

});
