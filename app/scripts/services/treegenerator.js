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
  					elem.erroreLocale = 'E_'+elem.id;
				}
		 		if(elem.type=="Literal")
		 		{
	  				elem.label=elem.raw;
	  				elem.erroreLocale = 'E_'+elem.id;
				}
				coda.push(elem);
				list.push(elem);
  			}
  		}
  		while(coda.length!=0)
  		{
  			//Per ogni valore della coda, visito il parent e lo inserisco in coda, se non è stato già visitato, cioè è in list
  			var c = coda[0];
  			for(var j=0; j<lista.length; j++)
  			{
  				if(c.parent == lista[j].id)
  				{
  					c.parentNode=lista[j];

  					//Ecco il parent, calcolo il valore se non è già in lista
  					coda.push(lista[j]);

  					if(c.type=="BinaryExpression")
			 		{
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
  				listNoDuplicates.push(list[i]);
  			}
  		}
  		
  		return listNoDuplicates;
  	}

  	function calcolaErroriLocali(lista)
  	{
  		for(var i =lista.length-1; i>=0; i--)
  		{
  			var elem = lista[i];
  			console.log(elem);
  			if(elem.type=='Literal')
  			{
  				elem.erroreLocale='0';
  				elem.coefficienteAmpl='0';
  			}

			if(elem.type == "BinaryExpression")
			{



				//Calcola l'errore locale Literal
				var expr = 'E('+elem.id+') + ['+'[ '+elem.left.erroreLocale+'] * '+elem.left.coefficienteAmpl + '] + ['+'[ '+elem.right.erroreLocale+'] * '+elem.right.coefficienteAmpl+' ]'; 
				elem.erroreLocale = expr;

				
			/*	if(elem.left.type!='Literal' && elem.right.type!='Literal')
				{
					elem.erroreLocale = 'E('+elem.id+') + ['+'[ '+elem.left.erroreLocale+'] * '+elem.left.coefficienteAmpl + '] + ['+'[ '+elem.right.erroreLocale+'] * '+elem.right.coefficienteAmpl+' ]'; 

				}
				else
				{
					if(elem.left.type=='Literal' && elem.right.type!='Literal')
					{
						elem.erroreLocale = 'E('+elem.id+') + [ '+'[ '+elem.right.erroreLocale+'] * '+elem.right.coefficienteAmpl +' ]'; 

					}
					else
					{
						if(elem.left.type!='Literal' && elem.right.type=='Literal')
						{
							elem.erroreLocale = 'E('+elem.id+') + ['+'[ '+elem.left.erroreLocale+'] * '+elem.left.coefficienteAmpl +' ]';

						}
						else
						{
							elem.erroreLocale = 'E('+elem.id+')';
						}
					}
					
				}
				*/
			}
  		}
  		return lista;
  	}

  	function setValuesOfEdges(lista)
  	{
  		//Per ogni nodo:
  		//-Calcola il valore di ogni arco che conduce al figlio
  		for(var i =0; i< lista.length; i++)
  		{
  			var elem = lista[i];
  			console.log(elem);

  			var left = elem.left;
  			var right = elem.right;
  			if(elem.parentNode!=null)
  			{
  				//se non è il nodo radice, calcolo il valore dell'arco entrante(ogni nodo ha solo 1 arco entrante, tranne il root)
  				//elem.coefficienteAmpl = ""+elem.label+"/"+elem.parentNode.label+"* partialDerivative("+elem.parentNode.label+","+elem.label+")";
  				//In base all'operazione trovo il coefficiente di amplificazione
  				if(elem.parentNode.type == "BinaryExpression")
  				{

  					console.log(elem.parentNode.operator);
	  				switch(elem.parentNode.operator)
	  				{
	  					case '+': 
	  					{
	  						elem.coefficienteAmpl = "( "+elem.label+" ) / ( "+elem.parentNode.label+" )";
	  						break;
	  					}
	  					case '-': 
	  					{
	  						if(elem.id==elem.parentNode.left.id)
	  						{
	  							elem.coefficienteAmpl = "( "+elem.label+" ) / ( "+elem.parentNode.label+" )";
	  						}
	  						if(elem.id==elem.parentNode.right.id)
	  						{
	  							elem.coefficienteAmpl = "( -"+elem.label+" ) / ( "+elem.parentNode.label+" )";
	  						}
	  						break;
	  					}
	  					case '*': 
	  					{
	  						elem.coefficienteAmpl = 1;
	  						break;
	  					}
	  					case '/': 
	  					{
	  						if(elem.id==elem.parentNode.left.id)
	  						{
	  							elem.coefficienteAmpl = 1;
	  						}
	  						if(elem.id==elem.parentNode.right.id)
	  						{
	  							elem.coefficienteAmpl = -1;
	  						}
	  						break;
	  					}
	  					case '^':
	  					{
	  						var numberOfExp = elem.parentNode.right.label;
	  						elem.coefficienteAmpl = 1*numberOfExp;
	  						break;
	  					}
	  				}
	  			}
	  			
  			}
  		}
  		return lista;

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
		console.log(lista);
		lista.push(x);
		lista = setValuesOfEdges(lista);
		lista = calcolaErroriLocali(lista);
		console.log(lista);

		
		return callback(lista);
	}

	return service;
});
