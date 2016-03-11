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


  	//visita a partire dalle foglie a ritroso fino alla radice, così propaga all'indietro i valori valutati
  	function setValueOfLeaves(lista)
  	{
  		var coda = [];
  		var list = [];

  		//Setto le label a tutte le foglie e le inserisco in coda
  		for(var i =0; i< lista.length; i++)
  		{
  			var elem = lista[i];
  			if(elem.left==null && elem.right==null)
  			{
  				if(elem.type=="Identifier")
		 		{
					elem.label=elem.name;
				}
		 		if(elem.type=="Literal")
		 		{
	  				elem.label=elem.raw;
				}
				coda.push(elem);
				list.push(elem);
  			}
  		}
  		console.log(coda);
  		while(coda.length!=0)
  		{
  			//Per ogni valore della coda, visito il parent e lo inserisco in coda, se non è stato già visitato, cioè è in list
  			var c = coda[0];
  			//console.log(c);
  			for(var j=0; j<lista.length; j++)
  			{
  				//console.log(lista[j]);
  				if(c.parent == lista[j].id)
  				{
  					console.log('trovato parent');
  					//Ecco il parent, calcolo il valore se non è già in lista
  					coda.push(lista[j]);
  					if(c.type=="BinaryExpression")
			 		{
			 			console.log('binart');
			 			if(c.left.type=='BinaryExpression' && c.right.type=='BinaryExpression')
			 			{
			 				c.label='('+c.left.label+')'+c.operator+'('+c.right.label+')';
			 			}
			 			if(c.left.type=='BinaryExpression' && c.right.type!='BinaryExpression')
			 			{
			 				c.label='('+c.left.label+')'+c.operator+c.right.label;
			 			}
			 			if(c.left.type!='BinaryExpression' && c.right.type=='BinaryExpression')
			 			{
			 				c.label=c.left.label+c.operator+'('+c.right.label+')';

			 			}
			 			if(c.left.type!='BinaryExpression' && c.right.type!='BinaryExpression')
			 			{
			 				c.label=c.left.label+c.operator+c.right.label;
			 			}
		  				
		  				list.push(c);
		  				break;
					}
  				}
  				if(c.parent==null)
  				{
  					//l'elemento radice
  					if(c.type=="BinaryExpression")
			 		{
			 			console.log('binartRadice');
			 			if(c.left.type=='BinaryExpression' && c.right.type=='BinaryExpression')
			 			{
			 				c.label='('+c.left.label+')'+c.operator+'('+c.right.label+')';
			 			}
			 			if(c.left.type=='BinaryExpression' && c.right.type!='BinaryExpression')
			 			{
			 				c.label='('+c.left.label+')'+c.operator+c.right.label;
			 			}
			 			if(c.left.type!='BinaryExpression' && c.right.type=='BinaryExpression')
			 			{
			 				c.label=c.left.label+c.operator+'('+c.right.label+')';

			 			}
			 			if(c.left.type!='BinaryExpression' && c.right.type!='BinaryExpression')
			 			{
			 				c.label=c.left.label+c.operator+c.right.label;

			 			}
			 		}
  				}
  			}
  			//coda.push(c);
  			coda=coda.slice(1,coda.length);
  		}

  		//La lista va bene, devo eliminare i duplicati
  		var listNoDuplicates = [];
  		for(var i=0; i< list.length;i++)
  		{
  			var trovato = false;
  			for(var j=0; j< listNoDuplicates.length; j++)
  			{
  				if(list[i].id==listNoDuplicates[j].id)
  				{
  					trovato=true;
  				}
  			}
  			if(!trovato)
  			{
  				//Aggiungo
  				listNoDuplicates.push(list[i]);
  			}
  		}
  		
  		return listNoDuplicates;
  	}


	service.createTree = function(treeFile, func, callback)
	{

		//Aggiungi i figli alla pila e dagli un id univoco
		treeFile.id=0;
		treeFile.label=func;
		var x = treeFile;
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

		lista = setValueOfLeaves(lista);
		lista.push(x);
		
		return callback(lista);
	}

	return service;
});
