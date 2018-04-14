var relationsDiv = $('#relationsDiv');

//relationSelectionFunction used for relation tree intilization
var relationSelectionFunction = function(){
	$('.nodeClick').click(function(){
		if(nodeA == null && nodeB == null){ // this is first selection, need to check if this node has siblings
			findNode($(this).attr('id'), root);
			nodeA = targetNode;
			$(this).css({'background-color': '#2fb1d1', 'color': 'white'});
		}else if(nodeA != null && nodeB == null){
			
			$(this).css({'background-color': '#2fb1d1', 'color': 'white'});
			findNode($(this).attr('id'), root);
			nodeB = targetNode;
			// show the two selections
			selectedA.text(nodeA.text.name);
			selectedB.text(nodeB.text.name);
			
			relationWizard.show(250);
		}else if(nodeA != null && nodeB != null){
			nodeA = null;
			nodeB = null;			
			drawTree("#relateTreeChart", Tree);
		}
		console.log("node A = " + nodeA + " && node B = " + nodeB);

		findNode($(this).attr('id'), root);
		console.log("This nodes parent is " + targetNode.parent);
		console.log("Selected Node is " + $(this).attr('id'));
		
	});	
}

/*
	Function to check if a jquery selector is empty or not
*/

$.fn.exists = function () {
    return this.length !== 0;
}

/*
	parent, relNodeA, relNodeB
	are actual nodes, not ids
*/

function addRelation(parent, relNodeA, relNodeB, value){
	
	findParent(relNodeA.HTMLid, root);
	relNodeAParent = parentNode;
	
	findParent(relNodeB.HTMLid, root);
	relNodeBParent = parentNode;
	
	if(relNodeAParent != relNodeBParent){
		return message("Not the same Parrents!","Please select nodes under the same parents.");
	}
	
	
	var i = findIndex(parent, relNodeA);
	var j = findIndex(parent, relNodeB);
	
	matrixRelation(parent.matrix, i, j, value);
	printMatrix(parent.matrix);
	
	var parentPrefix = "parent_";
	var parentId = parentPrefix + parent.HTMLid;
	
	var div = "";
	
	if($('#'+parentId).exists()){
		div += '<div class="node-relation-div"> <div class="row w-row"> <div class="relation-buttons w-col w-col-2 w-col-small-2 w-col-tiny-2"> <img id="relDeleteBtn" src="images/deleteBtn.svg" class="relation-buttons-icon-delete"> <img id="relEditBtn" src="images/editBtn.svg" class="relation-buttons-icon-edit"> </div> <div class="relation w-col w-col-10 w-col-small-10 w-col-tiny-10"> <div class="w-row"> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div class="node-text">'+relNodeA.text.name+'</div> </div> <div class="column w-col w-col-4 w-col-small-4 w-col-tiny-4"> <img src="images/arrow.svg" width="58" class="arrow"> <div class="relation-input">'+value+'</div> </div> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div class="node-text">'+relNodeB.text.name+'</div> </div> </div> </div> </div> </div> </div>';
		
		$('#'+parentId).append(div);
	}else{
		div += '<div class="parents"> <div id="'+parentId+'" class="parent-name-saved-relation">'+parent.text.name+'</div> <div class="node-relation-div"> <div class="row w-row"> <div class="relation-buttons w-col w-col-2 w-col-small-2 w-col-tiny-2"> <img id="relDeleteBtn" src="images/deleteBtn.svg" class="relation-buttons-icon-delete"> <img id="relEditBtn" src="images/editBtn.svg" class="relation-buttons-icon-edit"> </div> <div class="relation w-col w-col-10 w-col-small-10 w-col-tiny-10"> <div class="w-row"> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div class="node-text">'+relNodeA.text.name+'</div> </div> <div class="column w-col w-col-4 w-col-small-4 w-col-tiny-4"> <img src="images/arrow.svg" width="58" class="arrow"> <div class="relation-input">'+value+'</div> </div> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div class="node-text">'+relNodeB.text.name+'</div> </div> </div> </div> </div> </div> </div> </div>';

		relationsDiv.append(div);	
	}
	
	matrixEvalWeight(parent);
	drawTree("#editTreeChart", Tree);
}

function findIndex(parent, node){
	for(var i = 0; i<parent.children.length; i++){
		if(parent.children[i].HTMLid == node.HTMLid){
			console.log(node.text.name + " index = " + i);
			return i;
		}	
	}
	console.log('index not found! there is ' + parent.children.length + " children for " + parent.HTMLid);
}