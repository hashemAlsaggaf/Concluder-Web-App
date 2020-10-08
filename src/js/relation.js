/*
	relation.js is responsible for all relations operations
*/

var relationsDiv = $('#relationsDiv');
var selectedA = $('#selectedA');
var selectedB = $('#selectedB');

var relationsList = [];
var selectedRelation;
var relId = 0;

/*
	deleteSubtreeRelations
	removes all relations under a parent
	Input: node id (Ex: node.HTMLid, map[nodeA.HTMLid])
*/
function deleteSubtreeRelations(nodeId){
	for(var i = 0; i < relationsList.length-1; i++){
		//remove all relations that include a parent node that is nodeId
		try{
			if(relationsList[i].parent.HTMLid == nodeId){
				relationsList.splice(i,1);// the list will get smaller by 1 index
				var div = $('#parent_'+nodeId+'_div');
				div.text('');
				i--; //set i one index behind
				console.log('Div to delete: ' + div);
			}
		}catch(e){
			console.log(e);
		}
		
	}
	
	//remove all relations under this node
	//remove a relation if any of the children are reltaed
	var startNode = map[nodeId];
	
	startNode.children.forEach(function (child){
		deleteSubtreeRelations(child.HTMLid);
	});
	
	//Debugging
	console.log('--relationsList Below--');
	console.log(relationsList);
}

/*
	remove a relation from the html div and from relationList
	Input: node id (Ex: node.HTMLid, map[nodeA.HTMLid])
*/
function deleteRelatedRelation(nodeId){
	console.log("--- deleteRelatedRelation ---");
	console.log("relationsList before: ");
	console.log(relationsList);
	var index = 0;
	for(var i = 0; i < relationsList.length; i++){
		if(relation.nodeA.HTMLid === nodeId || relation.nodeB.HTMLid === nodeId){
			div = $('#'+relation.HTMLid);
			div.hide();
			
			//delete relation;
			relationsList.splice(i, 1);
			i--;
			console.log("Deleted... Node ID: " + nodeId);
			
		}
		
	}
	
	console.log("Node ID: " + nodeId);
	console.log("relationsList after");
	console.log(relationsList);
}
/*
	relationSelectionFunction will execute when the user clicks on nodes in the relation screen
	it will detect first and second selections
*/
var relationSelectionFunction = function(){
	$('.nodeClick').click(function(){
		if(nodeA == null && nodeB == null){ // this is first selection, need to check if this node has siblings
			nodeA = map[$(this).attr('id')];
			$(this).css({'background-color': '#2fb1d1', 'color': 'white'});
		}else if(nodeA != null && nodeB == null){
			
			$(this).css({'background-color': '#2fb1d1', 'color': 'white'});
			
			nodeB = map[$(this).attr('id')];
			
			//Make sure nodeA and nodeB are not the same
			if(nodeA === nodeB){
				message('Same node is selected twice!','Please select different nodes under the same parent.');
				nodeA = null;
				nodeB = null;
				clearSelection();
				return;
			}
			
			// Make sure both nodes are under the same parent
			if(nodeA.parent != nodeB.parent){
				message("Not the same Parents!","Please select nodes under the same parents.");
				nodeA = null;
				nodeB = null;
				clearSelection();
				return;
			}
			
			// show the two selections
			selectedA.text(nodeA.text.name);
			selectedB.text(nodeB.text.name);
			
			relationWizard.show(250);
			selectedA.css({"background-color": "lime"});
			
		}else if(nodeA != null && nodeB != null){
			nodeA = null;
			nodeB = null;			
			drawTree("#relateTreeChart", Tree);
		}
		console.log("node A = " + nodeA + " && node B = " + nodeB);

		selectedNode = $(this).attr('id');
		//Debugging
		console.log("This nodes parent is " + map[selectedNode].parent);
		console.log("Selected Node is " + selectedNode);
		
	});	
}

/*
	Function to check if a jquery selector is empty or not
*/

$.fn.exists = function () {
    return this.length !== 0;
}

/*
	Adds a relation between two nodes
	variables relNodeA, and relNodeB are node refrences, not ids (use map[node.HTMLid])
	Inputs: 
		relNodeA:	first node in the relation (this is the bigger node)
		relNodeB:	second node in the relation
		value:		The value of the relation
*/
function addRelation(relNodeA, relNodeB, value){

	
	//debug input:
	console.log("addRelation:nodeA = "+relNodeA);
	console.log("addRelation:nodeB = "+relNodeB);

	// make sure both nodes are under the same parent
	relNodeAParent = relNodeA.parent;
	relNodeBParent = relNodeB.parent;
	if(relNodeAParent != relNodeBParent){
		return message("Not the same Parrents!","Please select nodes under the same parents.");
	}
	
	/*
		if a relation exist between both nodes A and B, update the existing relation.
	*/
	var relNodeA_id = relNodeA.HTMLid;
	var relNodeB_id = relNodeB.HTMLid;
	for(var i=0; i<relationsList.length; i++){
	
		if(relationsList[i] != undefined){ // might be undefined due to deleting relations (there might be gaps in relationList)
			
			listNodeA_id = relationsList[i].nodeA.HTMLid;
			listNodeB_id = relationsList[i].nodeB.HTMLid;
			if((relNodeA_id == listNodeA_id || relNodeA_id == listNodeB_id) && (relNodeB_id == listNodeA_id || relNodeB_id == listNodeB_id)){
				
				editRelation(i, relNodeA, relNodeB, value);
				return;
				
			}
			
		}
			
	}
	
	
	parent = map[relNodeA.parent];
	
	/*
		update matrix
	*/
	
	var i = findIndex(parent, relNodeA);
	var j = findIndex(parent, relNodeB);
	
	matrixRelation(parent.matrix, i, j, value);

	/*
		add relation div
	*/
	var parentPrefix = "parent_";
	var parentId = parentPrefix + parent.HTMLid;
	
	var div = "";
	
	/*
		if a parent div exist, add the relation div in it, or add a parent div to contain the new relation div.
	*/
	
	if($('#'+parentId).exists()){
		div += '<div id="rel'+relId+'Div" class="node-relation-div"> <div class="row w-row"> <div class="relation-buttons w-col w-col-2 w-col-small-2 w-col-tiny-2"> <img data-div="#rel'+relId+'Div" data-relId="'+relId+'" onclick="deleteRelationClick(this.getAttribute(\'data-relId\'),this.getAttribute(\'data-div\'))" src="images/deleteBtn.svg" class="relation-buttons-icon-delete"> <img data-relId="'+relId+'" src="images/editBtn.svg" class="relation-buttons-icon-edit" onclick="editRelationClick(this.getAttribute(\'data-relId\'))"> </div> <div class="relation w-col w-col-10 w-col-small-10 w-col-tiny-10"> <div class="w-row"> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div id="rel_'+relId+'NodeA" class="node-text">'+relNodeA.text.name+'</div> </div> <div class="column w-col w-col-4 w-col-small-4 w-col-tiny-4"> <img src="images/arrow.svg" width="58" class="arrow"> <div id="rel_'+relId+'value" class="relation-input">'+value+'</div> </div> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div id="rel_'+relId+'NodeB" class="node-text">'+relNodeB.text.name+'</div> </div> </div> </div> </div> </div> </div>';
		
		$('#'+parentId).append(div);
	}else{
		div += '<div id="'+parentId+'_div" class="parents"> <div id="'+parentId+'" class="parent-name-saved-relation">'+parent.text.name+'</div> <div id="rel'+relId+'Div" class="node-relation-div"> <div class="row w-row"> <div class="relation-buttons w-col w-col-2 w-col-small-2 w-col-tiny-2"> <img data-div="#rel'+relId+'Div" data-relId="'+relId+'" onclick="deleteRelationClick(this.getAttribute(\'data-relId\'), this.getAttribute(\'data-div\'))" src="images/deleteBtn.svg" class="relation-buttons-icon-delete"> <img data-relId="'+relId+'" src="images/editBtn.svg" class="relation-buttons-icon-edit" onclick="editRelationClick(this.getAttribute(\'data-relId\'))"> </div> <div class="relation w-col w-col-10 w-col-small-10 w-col-tiny-10"> <div class="w-row"> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div id="rel_'+relId+'NodeA" class="node-text">'+relNodeA.text.name+'</div> </div> <div class="column w-col w-col-4 w-col-small-4 w-col-tiny-4"> <img src="images/arrow.svg" width="58" class="arrow"> <div id="rel_'+relId+'value" class="relation-input">'+value+'</div> </div> <div class="node-to-relate w-col w-col-4 w-col-small-4 w-col-tiny-4"> <div id="rel_'+relId+'NodeB" class="node-text">'+relNodeB.text.name+'</div> </div> </div> </div> </div> </div> </div> </div>';

		relationsDiv.append(div);	
	}
	
	//evaluate weights
	matrixEvalWeight(parent.HTMLid);
	
	// add to relations list
	relation = {
		parent: parent,
		HTMLid: 'rel'+relId+'Div',
		nodeA: relNodeA,
		nodeA_div: "rel_"+relId+"NodeA",
		nodeB: relNodeB,
		nodeB_div: "rel_"+relId+"NodeB",
		value: parseFloat(value),
		value_div: "rel_"+relId+"value"
	}
	relationsList.push(relation);
	relId++; // make a new relation id
	console.log(relationsList);
}

/*
	Edit a relation that is located in a relation list
*/
function editRelation(relationId, nodeA, nodeB, value){

	var relation = relationsList[relationId];
	
	var i = findIndex(relation.parent, nodeA);
	var j = findIndex(relation.parent, nodeB);
	
	matrixRelation(relation.parent.matrix, i, j , value);
	
	relation.nodeA = nodeA;
	relation.nodeB = nodeB;
	relation.value = value;
	matrixEvalWeight(relation.parent.HTMLid);
	
	//Edit the relation tab divs accordingly
	nodeA_targetDiv = $('#'+relation.nodeA_div);
	nodeB_targetDiv = $('#'+relation.nodeB_div);
	value_targetDiv = $('#'+relation.value_div);
	
	nodeA_targetDiv.text(relation.nodeA.text.name);
	nodeB_targetDiv.text(relation.nodeB.text.name);
	value_targetDiv.text(relation.value);
}


/*
	find an index
	node is a refrence, not an id
*/
function findIndex(parent, node){
	for(var i = 0; i<parent.children.length; i++){
		if(parent.children[i].HTMLid == node.HTMLid){
			console.log(node.text.name + " index = " + i);
			return i;
		}	
	}
	console.log('index of '+node.HTMLid+' not found! there is ' + parent.children.length + " children for " + parent.HTMLid);
}
