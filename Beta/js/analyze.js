var matrixWizard = $('#matrixWizard');
var matrixTitle = $('#matrixTitle');
var matrixView = $('#matrixView');
var matrixStatistics = $('#matrixStatistics');

var inconsList = [];

var traidTurn = 0;

var analyzeSelectionFunction = function(){
	$('.nodeClick').click(function(){
		findNode($(this).attr('id'), root);
		numberOfChildren = countChildren(targetNode);
		if(numberOfChildren > 2){
			matrixTitle.text("Matrix (" + targetNode.text.name+")");
			printMatrix(targetNode.matrix, '#matrixView');
			matrixStatistics.text('');
			removeHighlights(targetNode.matrix)
			matrixWizard.show();
			
			// a list of inconsistancies is created (inconsList)
			calcInconsistancy(targetNode.matrix); 
		}
	});	
}
/*
	Calculates all inconsistancy in a matrix
	add them all in a list (inconsList)
	each incons item is a json object
	{
		incons: inconsistancy value,
		x: [i,j],
		y: [i,j],
		z: [i,j]
		
	}
*/
function calcInconsistancy(matrix){
	inconsList = [];
	for(i = 0 ; i < matrix.length; i++){
		for(j = i+1; j < matrix.length; j++){
			for(k = j+1; k < matrix.length; k++){
				x = matrix[i][j];
				y = matrix[j][k];
				z = matrix[i][k];
				var note = x + " X " + y + " = " + z + "<br>"+
				"Inconsistancy = " + (1-Math.min((x*y)/z,z/(x*y))).toFixed(5) + "<br>";
				
				inconsList.push(
					{
						incons: (1-Math.min((x*y)/z,z/(x*y))).toFixed(5),
						x:[i,j],
						y:[j,k],
						z:[i,k]
					}
				);
				
				//matrixView.append(note);
				console.log(note);
				//alert("incons. appended");
			}
		}
	}
	console.log(inconsList);
}

/*
	find maximum inconsistancy in a list of incons
*/
function findMaxIncons(list){
	max = 0;
	result = null;
	list.forEach(function(traid){
		if(traid.incons >= max){
			max = traid.incons;
			result = traid;
		}
	});
	
	if(max == 0){
		return list[0];
	}else{
		return result;
	}
}

/*
	hilight a traid
	each traid is a json list
	{
		incons: inconsistancy value,
		x:[i,j],
		y:[j,k],
		z:[i,k]
	}
*/
function showTraid(traid){
	var cell_x = $('#cell_'+traid.x[0]+traid.x[1]);
	var cell_y = $('#cell_'+traid.y[0]+traid.y[1]);
	var cell_z = $('#cell_'+traid.z[0]+traid.z[1]);
	
	cell_x.css({"background-color": "#9EE7D9"});
	cell_y.css({"background-color": "#9EE7D9"});
	cell_z.css({"background-color": "#9EE7D9"});
	
	matrixStatistics.text("Traid " + (traidTurn+1) + " of " + (inconsList.length));
	matrixStatistics.append("<br>Value = " + traid.incons);
}

/*
	Function to remove highlights in a matrix
*/
function removeHighlights(matrix){
	for(var i = 0 ; i < matrix.length; i++){
		for(var j = 0 ; j < matrix.length; j++){
			var cell = $('#cell_'+i+j);
			cell.css({"background-color": ""});
		}
	}
}

/*
	removes highlights of all cells in a matrix
*/
function showNextTraid(){
	removeHighlights(targetNode.matrix);
	if(traidTurn < inconsList.length-1){
		traidTurn++;
		showTraid(inconsList[traidTurn]);
	}else if(traidTurn === inconsList.length-1){
		traidTurn = 0;
		showTraid(inconsList[traidTurn]);
	}
}

/*
	Highligh the nodes that has a matrix bigger than 2x2
*/
function highlightMatrixNodes(currentNode){
	if (countChildren(currentNode) > 2) {
		var node = $('#'+currentNode.HTMLid);
		node.css({'background-color': '#9EE7D9'});
		console.log('highlight ' + node.attr('id'));
    }
	currentNode.children.forEach(function (currentChild) {            
		highlightMatrixNodes(currentChild);
	});
    
}











