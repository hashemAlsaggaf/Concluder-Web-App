var matrixTestDiv = $('#matrixTestDiv');

/*
function printMatrix(matrix, div){
	var table = "";
	
	for(i = 0 ; i < matrix.length; i++){
		
		table += "<tr>";
		for(j = 0 ; j < matrix.length; j++){
				if(i != j){
					//input id = cell_ij_input
					table += "<td id='cell_"+i+j+"' data-i='"+i+"' data-j='"+j+"' onClick='cellClick(this.id)' ><input id='cell_"+i+j+"_input' class='cellInput' type='text' value='"+matrix[i][j]+"' readonly></td>";
				}else{
					table += "<td>"+matrix[i][j]+"</td>";
				}
				
		}
		table += "</tr>";
	}
	
	$(div).text('');
	$(div).append(table);
}
*/

function printMatrix(node, targetDiv){
	var matrix = node.matrix;
	var children = node.children;
	var elementsNames = [];
	
	var table = "";
	
	//store elemts name in elementsNames
	children.forEach(function(child){
		elementsNames.push(child.text.name);
	});
	
	for(i = 0 ; i < matrix.length; i++){
		for(j = 0 ; j < matrix.length; j++){
			//if this is the first cell in the matrix
			if(i == 0 && j == 0){
				//put the elements names in the first row
				table += "<tr><td class='elementName'>~</td>";
				elementsNames.forEach(function(element){
					table += "<td class='elementName'>"+element+"</td>";
				});
				//close the first row and start a new row
				table += "</tr><tr>";
			
			}
			if(j == 0){ //if this is the first cell in any row
				//put the element name before it
				table += "<td class='elementName'>"+elementsNames[i]+"</td>";
			}
			
			if(i != j){ // if this is not a cell located in the diagonal line
				/* 
					add an input wraped around a table data
					<td> attributes
					data-i = i
					data-j = j
					onClick = cellClick(this.id)
					
					<input> attributes
					id = cell_ij_input
					class = cellInput
					type = text
					value = matrix[i][j]
					readonly
				*/
				
				table += "<td id='cell_"+i+j+"' data-i='"+i+"' data-j='"+j+"' onClick='cellClick(this.id)' ><input id='cell_"+i+j+"_input' class='cellInput' type='text' value='"+matrix[i][j]+"' readonly></td>";
			}else{// this is diagonal cell
				//draw as a table data
				table += "<td>"+matrix[i][j]+"</td>";
			}
					
		}
		table += "</tr>";
	}
	
	targetDiv = $(targetDiv);
	targetDiv.text('');
	targetDiv.append(table);
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

function matrixEvalWeight(id){
	
	var sum = matrixSum(map[id].matrix);
	for(var i = 0; i < map[id].matrix.length; i++){
		weight = 0;
		for(j = 0 ; j < map[id].matrix.length; j++){
			weight += parseFloat(map[id].matrix[i][j]);
		}
		console.log('Child: ' + map[id].children[i].HTMLid);
		map[id].children[i].text.weight = ((weight/sum)*100).toFixed(2);
	}
}

/*
	matrixDeleteElement(id)
	removes an element from its parent's matrix
*/
function matrixDeleteElement(id){
	var nodeIndex = getNodeIndex(id);
	var parent = getParent(id);
	console.log('Matrix OP: Deleting element ' + map[id].HTMLid + " @ index("+nodeIndex+")");
	
	//remove from matrix columns
	map[parent].matrix.forEach(function (row){
		row.splice(nodeIndex, 1);
	});
	//remove row
	map[parent].matrix.splice(nodeIndex, 1);
	
	//Debug parent matrix
	console.log('Matrix OP: node ' + map[parent].HTMLid + " has a matrix of "+map[parent].matrix.length+" X "+map[parent].matrix.length);
	
}
/*
	getNodeIndex is used to get the index of a node under a parent
	very helpful to target an element by index in a matrix
*/
function getNodeIndex(id){
	//get the node index under its parent
	var parent = getParent(id);
	var index = 0;
	var i = 0;
	map[parent].children.forEach(function(child){
		if(child.HTMLid == id){
			index = i;
		}else{
			i++;
			console.log('Parent is: ' + map[parent].HTMLid + ', Child is: ' + child.HTMLid);
		}
	});
	return index;
}

