/*
	analyze.js is responsible for all analyzing tasks
*/

var matrixWizard = $('#matrixWizard');
var matrixTitle = $('#matrixTitle');
var matrixView = $('#matrixView');
var matrixStatistics = $('#matrixStatistics');

var inconsList = []; // a dynamic list that will hold traids and thier inconsistency

var traidTurn = 0; // a variable to keep track of traid turns for traid's navigation

var backupMatrix = []; // a variable to store a matrix (used to restore a matrix)

/*
	analyzeSelectionFunction is the function that will execute when a user click on a node in the analyze screen
*/
var analyzeSelectionFunction = function(){
	$('.nodeClick').click(function(){
		selectedNode = $(this).attr('id'); // grab the selected node's id
		numberOfChildren = countChildren(selectedNode); // count the node's children
		if(numberOfChildren > 2){ // check if the node has more than two children (only nodes with more than two children can be analyzed)
			matrixTitle.text("Matrix (" + map[selectedNode].text.name+")"); // present the matrix name as the node name in the title of the matrix view
			printMatrix(map[selectedNode], '#matrixView');
			matrixStatistics.text('');
			removeHighlights(map[selectedNode].matrix);
			matrixWizard.show();
			
			// a list of inconsistencies is created (inconsList)
			calcInconsistency(map[selectedNode].matrix); 
			
			//backup this node's matrix, incase we need it to restore it later
			//slice() and deep copy are used to clone the matrix instead of just refrencing it
			for (var i = 0; i < map[selectedNode].matrix.length; i++){
				backupMatrix[i] = map[selectedNode].matrix[i].slice();
			}
		}
	});	
}
/*
	Calculates all inconsistency in a matrix
	add them all in a list (inconsList)
	each incons item is a json object
	{
		incons: inconsistency value,
		x:[i,j],
		y:[i,k],
		z:[j,k]
		
	}
*/
function calcInconsistency(matrix){
	inconsList = [];
	for(i = 0 ; i < matrix.length; i++){
		for(j = i+1; j < matrix.length; j++){
			for(k = j+1; k < matrix.length; k++){
				x = matrix[i][j];
				y = matrix[i][k];
				z = matrix[j][k];
				var note = x + " X " + y + " = " + z + "<br>"+
				"inconsistency = " + (1-Math.min((x*z)/y,y/(x*z))).toFixed(5) + "<br>";
				
				inconsList.push(
					{
						incons: (1-Math.min((x*z)/y,y/(x*z))).toFixed(5),
						x:[i,j],
						y:[i,k],
						z:[j,k]
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
	find maximum inconsistency in a list of inconsistency
*/
function findMaxIncons(list){
	max = 0;
	result = null;
	var i = 0;
	list.forEach(function(traid){
		if(traid.incons >= max){
			max = traid.incons;
			result = traid;
			traidTurn = i;
		}
		i ++;
	});
	
	if(max == 0){
		return list[0];
	}else{
		return result;
	}
}

/*
	highlight a traid
	each traid is a json object
	{
		incons: inconsistency value,
		x:[i,j],
		y:[i,k],
		z:[j,k]
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
	Remove highlights in a matrix
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
	Show next traid
	
*/
function showNextTraid(){
	removeHighlights(map[selectedNode].matrix);
	if(traidTurn < inconsList.length-1){
		traidTurn++;
		showTraid(inconsList[traidTurn]);
	}else if(traidTurn === inconsList.length-1){
		traidTurn = 0;
		showTraid(inconsList[traidTurn]);
	}
}

/*
	Show Prev. traid
*/

function showPrevTraid(){
	removeHighlights(map[selectedNode].matrix);
	if(traidTurn > 0){
		traidTurn--;
		showTraid(inconsList[traidTurn]);
	}else if(traidTurn === 0){
		traidTurn = inconsList.length-1;
		showTraid(inconsList[traidTurn]);
	}
}
/*
	Highligh the nodes that has a matrix bigger than 2x2
*/
function highlightMatrixNodes(id){
	if (countChildren(id) > 2) {
		var node = $('#'+map[id].HTMLid);
		node.css({'background-color': '#876eff8f'});
		node.css({'color': 'white'});
		console.log('highlight ' + node.attr('id'));
    }
	map[id].children.forEach(function (currentChild) {            
		highlightMatrixNodes(currentChild.HTMLid);
	});
    
}

/*
	Show maximum cell
*/
function showMaxElement(matrix){
	var max = 1;
	var maxCell = null;
	for(i=0; i<matrix.length; i++){
		for(j=0; j<matrix.length; j++){
			if(matrix[i][j] > max){
				max = matrix[i][j];
				maxCell = $('#cell_'+i+j);
				var stat = "Max element is  cell M["+i+"]["+j+"]";
			}
		}
	}
	
	maxCell.css({"background-color": "#9EE7D9"});
	matrixStatistics.text(stat);
}

function autoReduce(){
	inconsList.forEach(function(traid){
		// x, y, z are matrix cell locations
		//  1) Grab the values of x, y, z
		var r = map[selectedNode].matrix[traid.x[0]][traid.x[1]];
		var s = map[selectedNode].matrix[traid.y[0]][traid.y[1]];
		var t = map[selectedNode].matrix[traid.z[0]][traid.z[1]];
		
		//  2) reduce the inconsistency
		var x = Math.pow(r,(2/3)) * Math.pow(s,(-1/3)) * Math.pow(t,(1/3));
		var y = Math.pow(r,(1/3)) * Math.pow(s,(1/3)) * Math.pow(t,(2/3));
		var z = Math.pow(r,(-1/3)) * Math.pow(s,(2/3)) * Math.pow(t,(1/3));
		
		//  3) put the new values in the matrix with the transistive value ([i][j] & [j][i])
		map[selectedNode].matrix[traid.x[0]][traid.x[1]] = x.toFixed(3);
		map[selectedNode].matrix[traid.x[1]][traid.x[0]] = (1/x).toFixed(3);
		//apply change in relationsList and relations tab
		addRelation(map[selectedNode].children[traid.x[0]], map[selectedNode].children[traid.x[1]], x.toFixed(3));
		//-----------------------------------------------------		
		map[selectedNode].matrix[traid.y[0]][traid.y[1]] = y.toFixed(3);
		map[selectedNode].matrix[traid.y[1]][traid.y[0]] = (1/y).toFixed(3);
		//apply change in relationsList and relations tab
		addRelation(map[selectedNode].children[traid.y[0]], map[selectedNode].children[traid.y[1]], y.toFixed(3));	
		//-----------------------------------------------------		
		map[selectedNode].matrix[traid.z[0]][traid.z[1]] = z.toFixed(3);		
		map[selectedNode].matrix[traid.z[1]][traid.z[0]] = (1/z).toFixed(3);		
		//apply change in relationsList and relations tab
		addRelation(map[selectedNode].children[traid.z[0]], map[selectedNode].children[traid.z[1]], z.toFixed(3));
		//-----------------------------------------------------
		
	});

}


function reduceTraid(traid){

		// x, y, z are matrix cell locations
		//  1) Grab the values of x, y, z
		var r = map[selectedNode].matrix[traid.x[0]][traid.x[1]];
		var s = map[selectedNode].matrix[traid.y[0]][traid.y[1]];
		var t = map[selectedNode].matrix[traid.z[0]][traid.z[1]];
		
		//  2) reduce the inconsistency
		var x = Math.pow(r,(2/3)) * Math.pow(s,(-1/3)) * Math.pow(t,(1/3));
		var y = Math.pow(r,(1/3)) * Math.pow(s,(1/3)) * Math.pow(t,(2/3));
		var z = Math.pow(r,(-1/3)) * Math.pow(s,(2/3)) * Math.pow(t,(1/3));
		
		//  3) put the new values in the matrix with the transistive value ([i][j] & [j][i])
		map[selectedNode].matrix[traid.x[0]][traid.x[1]] = x.toFixed(3);
		map[selectedNode].matrix[traid.x[1]][traid.x[0]] = (1/x).toFixed(3);
		//apply change in relationsList and relations tab
		addRelation(map[selectedNode].children[traid.x[0]], map[selectedNode].children[traid.x[1]], x.toFixed(3));
		//-----------------------------------------------------
		
		map[selectedNode].matrix[traid.y[0]][traid.y[1]] = y.toFixed(3);
		map[selectedNode].matrix[traid.y[1]][traid.y[0]] = (1/y).toFixed(3);
		//apply change in relationsList and relations tab
		addRelation(map[selectedNode].children[traid.y[0]], map[selectedNode].children[traid.y[1]], y.toFixed(3));		
		//-----------------------------------------------------
		
		
		map[selectedNode].matrix[traid.z[0]][traid.z[1]] = z.toFixed(3);		
		map[selectedNode].matrix[traid.z[1]][traid.z[0]] = (1/z).toFixed(3);	
		//apply change in relationsList and relations tab
		addRelation(map[selectedNode].children[traid.z[0]], map[selectedNode].children[traid.z[1]], z.toFixed(3));
		//-----------------------------------------------------
}







