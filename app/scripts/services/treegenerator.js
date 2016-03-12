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

	service.erroreAlgoritmico = '';
	service.erroreInerente ='';
	service.erroreTotale='';

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
					elem.erroreInerente==String.fromCharCode(65 + elem.id);
				}
		 		if(elem.type=="Literal")
		 		{
	  				elem.label=elem.raw;
	  				elem.erroreInerente==String.fromCharCode(65 + elem.id);
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
		var Fraction = algebra.Fraction;
		var Expression = algebra.Expression;
		var Equation = algebra.Equation;
  		for(var i =0; i<lista.length; i++)
  		{
  			var elem = lista[i];
  			if(elem.type=='Literal')
  			{
  				elem.coefficienteAmpl='0';
  				elem.erroreInerente=String.fromCharCode(65 + elem.id);
				
  			}
  			if(elem.type=='Identifier')
  			{
  				elem.erroreInerente=String.fromCharCode(65 + elem.id);
				
  			}
  		}

  		//Ordina i nodi per ID ( dal più grande al più piccolo)
  		var lista_ord =[];
  		for(var i=0; i<lista.length; i++)
  		{
  			lista_ord[lista.length-lista[i].id-1] = lista[i];
  		}
  		lista=lista_ord;


  		for(var i =0; i<lista.length; i++)
  		{
  			var elem = lista[i];
  		

			if(elem.type == "BinaryExpression")
			{

				//Calcola l'errore locale algoritmico
				if(elem.left.erroreAlgoritmico==null && elem.right.erroreAlgoritmico!=null)
				{
					var expr = String.fromCharCode(97 + elem.id)+' + ('+'( '+elem.right.erroreAlgoritmico+') * '+elem.right.coefficienteAmpl + ')';
					elem.erroreAlgoritmico = expr;
				}
				if(elem.left.erroreAlgoritmico!= null && elem.right.erroreAlgoritmico==null)
				{
					var expr = String.fromCharCode(97 + elem.id)+' + ('+'( '+elem.left.erroreAlgoritmico+') * '+elem.left.coefficienteAmpl + ')';
					elem.erroreAlgoritmico = expr;
				}
				if(elem.right.erroreAlgoritmico!=null && elem.left.erroreAlgoritmico!=null)
				{
					var expr = String.fromCharCode(97 + elem.id)+' + ('+'( '+elem.left.erroreAlgoritmico+') * '+elem.left.coefficienteAmpl + ') + ('+'( '+elem.right.erroreAlgoritmico+') * '+elem.right.coefficienteAmpl+' )'; 
					elem.erroreAlgoritmico = expr;
				}
				if(elem.right.erroreAlgoritmico== null && elem.left.erroreAlgoritmico == null)
				{
					var expr = String.fromCharCode(97 + elem.id)+''; 
					elem.erroreAlgoritmico = expr;
				}
			}
  		}

  		for(var i =0 ; i< lista.length; i++)
  		{

			var elem = lista[i];
  			//Calcola l'errore locale TOTALE

			if(elem.type == "BinaryExpression")
			{
  				//Calcola l'errore locale algoritmico
				if(elem.left.erroreInerente==null && elem.right.erroreInerente!=null)
				{
					var expr = '( '+' ( '+elem.right.erroreInerente+' ) * '+elem.right.coefficienteAmpl + ')';
					elem.erroreInerente = expr;
				}
				if(elem.left.erroreInerente!= null && elem.right.erroreInerente==null)
				{

					var expr = '( '+' ( '+elem.left.erroreInerente+' ) * '+elem.left.coefficienteAmpl + ')';
					elem.erroreInerente = expr;
				}
				if(elem.right.erroreInerente!=null && elem.left.erroreInerente!=null)
				{

					var expr = '( '+' ( '+elem.left.erroreInerente+' ) * '+elem.left.coefficienteAmpl + ') + ('+'( '+elem.right.erroreInerente+' ) * '+elem.right.coefficienteAmpl+' )'; 
					elem.erroreInerente = expr;
				}
				if(elem.right.erroreInerente== null && elem.left.erroreInerente == null)
				{
					var expr = elem.erroreInerente;
					elem.erroreInerente = expr;
				}
			}
  		}

  		for(var i =0 ; i< lista.length; i++)
  		{

			var elem = lista[i];
  			//Calcola l'errore locale TOTALE

  			if(elem.left==null && elem.right==null)
  			{
  				elem.erroreTotale = elem.erroreInerente;
  			}
			if(elem.type == "BinaryExpression")
			{
  				//Calcola l'errore locale algoritmico
				if(elem.left.erroreTotale==null && elem.right.erroreTotale!=null)
				{
					var expr = String.fromCharCode(97 + elem.id)+' + ('+'( '+elem.right.erroreTotale+' ) * '+elem.right.coefficienteAmpl + ')';
					elem.erroreTotale = expr;
				}
				if(elem.left.erroreTotale!= null && elem.right.erroreTotale==null)
				{
					var expr = String.fromCharCode(97 + elem.id)+' + ('+'( '+elem.left.erroreTotale+' ) * '+elem.left.coefficienteAmpl + ')';
					elem.erroreTotale = expr;
				}
				if(elem.right.erroreTotale!=null && elem.left.erroreTotale!=null)
				{
					var expr = String.fromCharCode(97 + elem.id)+' + ('+'( '+elem.left.erroreTotale+' ) * '+elem.left.coefficienteAmpl + ') + ('+'( '+elem.right.erroreTotale+' ) * '+elem.right.coefficienteAmpl+' )'; 
					elem.erroreTotale = expr;
				}
				if(elem.right.erroreTotale== null && elem.left.erroreTotale == null)
				{
					var expr = String.fromCharCode(97 + elem.id)+''; 
					elem.erroreTotale = expr;
				}
			}
  		}

  		return lista;
  	}

  	function calcolaErroreAlgoritmico(lista)
  	{

  		//l'errore locale del nodo radice è l'errore algoritmico totale
  		return lista[lista.length-1].erroreAlgoritmico;
  	}

  	function calcolaErroreInerente(lista)
  	{
  		return lista[lista.length-1].erroreInerente;
  	}

  	function calcolaErroreTotale(lista)
  	{
  		return lista[lista.length-1].erroreTotale;
  	}

  	function tokenizzaVariabiliErrore(lista)
  	{

  		return lista;
  	}

  	function setValuesOfEdges(lista)
  	{
  		//Per ogni nodo:
  		//-Calcola il valore di ogni arco che conduce al figlio
  		for(var i =0; i< lista.length; i++)
  		{
  			var elem = lista[i];

  			var left = elem.left;
  			var right = elem.right;
  			if(elem.parentNode!=null)
  			{
  				//se non è il nodo radice, calcolo il valore dell'arco entrante(ogni nodo ha solo 1 arco entrante, tranne il root)
  				//elem.coefficienteAmpl = ""+elem.label+"/"+elem.parentNode.label+"* partialDerivative("+elem.parentNode.label+","+elem.label+")";
  				//In base all'operazione trovo il coefficiente di amplificazione
  				if(elem.parentNode.type == "BinaryExpression")
  				{

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
		lista.push(x);
		lista = setValuesOfEdges(lista);
		lista = calcolaErroriLocali(lista);

		//E(id) è l'errore dovuto all'operazione
		//E_(id) è l'errore di rappresentazione della variabile, dovuto alla conversione in numero di macchina

		lista.erroreAlgoritmico = calcolaErroreAlgoritmico(lista);
		lista.erroreInerente = calcolaErroreInerente(lista);
		lista.erroreTotale = calcolaErroreTotale(lista);
		return callback(lista);
	}

	service.valutaErroreAlgoritmico = function(lista, callback)
	{
		//Trasforma tutti i - in +
		var newList = "";
		for(var i =0 ; i< lista.length;i++)
		{
			if(lista[i]=='-')
			{
				newList[i]='+';
			}
			else
			{
				newList[i]=lista[i];
			}
		}
		console.log(newList);

		return callback(newList)
	}
	return service;
});
