var matrixTestDiv = $('#matrixTestDiv');

function printMatrix(matrix, div){
	var table = "";
	
	for(i = 0 ; i < matrix.length; i++){
		
		table += "<tr>";
		for(j = 0 ; j < matrix.length; j++){
				table += "<td id='cell_"+i+j+"' data-i='"+i+"' data-j='"+j+"' onClick='cellClick(this)'>" + matrix[i][j] + "</td>";
		}
		table += "</tr>";
	}
	
	$(div).text('');
	$(div).append(table);
}


function matrixRelation(matrix,i,j,value){
	matrix[i][j] = value;
	matrix[j][i] = (1/value).toFixed(2);
}

function matrixSum(matrix){
	var sum = 0;
	for(var i = 0 ; i < matrix.length; i++){
		for(var j = 0 ; j < matrix.length; j++){
			sum += parseFloat(matrix[i][j]);
		}
	}
	console.log("Matrix sum = " + sum);
	return sum;
}

function matrixEvalWeight(node){
	
	var sum = matrixSum(node.matrix);
	for(var i = 0; i < node.matrix.length; i++){
		weight = 0;
		for(j = 0 ; j < node.matrix.length; j++){
			weight += parseFloat(node.matrix[i][j]);
		}
		console.log('Child: ' + node.children[i].HTMLid);
		node.children[i].text.weight = ((weight/sum)*100).toFixed(2);
	}
}

function matrixDeleteElement(node){
	nodeIndex = getNodeIndex(node);
	console.log('Matrix OP: Deleting element ' + node.HTMLid + " @ index("+nodeIndex+")");
	node.matrix.forEach(function (row){
		row.splice(nodeIndex, 1);
	});
	node.matrix.splice(nodeIndex, 1);
	console.log('Matrix OP: node ' + node.HTMLid + " has a matrix of "+node.matrix.length+"X"+node.matrix.length);
}
/*
	getNodeIndex is used to get the index of a node under a parent
	very helpful to target an element by index in a matrix
*/
function getNodeIndex(node){
	//get the node index under its parent
	findNode(node.parent, root);
	var index = 0;
	targetNode.children.forEach(function (child){
		if(child.HTMLid == node.HTMLid){
			return index;
		}else{
			index ++;
		}
	});
}