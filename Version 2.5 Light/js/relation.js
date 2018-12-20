/*
	relation.js is responsible for all relations operations
*/

var relationsList = [];
var selectedRelation;
var relId = 0;

var relationsDiv = $('#relationsDiv');

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

	
	var divToAppend = "";
	var relation_div = "rel_"+relId+"_div";
	var parent_div = "rel_"+parent.HTMLid+"_div";
	var parent_text_div = "rel_"+parent.HTMLid+"_text_div";
	var nodeA_div = "rel_"+relId+"_nodeA_div";
	var nodeB_div = "rel_"+relId+"_nodeB_div";
	var rel_value_div = "rel_"+relId+"_value_div";
	
	/*
		if a parent div exist, add the relation div in it, or add a parent div to contain the new relation div.
	*/
	
	if($('#'+parent_div).exists()){
		divToAppend += '<div class="relation-box"> <div class="relation-edit-container"> <img data-relId="rel_'+relId+'" onclick="editRelation(this.getAttribute(\'data-relId\'))" src="images/editBtn.svg" class="relation-edit-icon"> <img data-relId="rel_'+relId+'" onclick="deleteRelation(this.getAttribute(\'data-relId\'))" src="images/deleteBtn.svg" class="relation-edit-icon"> </div> <div class="relation"> <div class="relation-visual-container"> <div class="relation-visual"> <div id="'+nodeA_div+'" class="relation-a-text">'+relNodeA.text.name+'</div> </div> <img src="images/arrow.svg" width="20"> <div class="relation-visual"> <div id="'+nodeB_div+'"class="relation-a-text">'+relNodeB.text.name+'</div> </div> </div> <div id="'+rel_value_div+'" class="relation-value">'+value+'</div> </div> </div>';
		
		$('#'+parent_div).append(divToAppend);
	}else{
		divToAppend += '<div id="'+parent_div+'" class="relation-parent-box"> <div class="relation-parent-header"> <div id="parent_text_div" class="relation-parent-header-title">'+parent.text.name+'</div> </div> <div class="relation-box"> <div class="relation-edit-container"> <img data-relId="rel_'+relId+'" onclick="editRelation(this.getAttribute(\'data-relId\'))" src="images/editBtn.svg" class="relation-edit-icon"> <img data-relId="rel_'+relId+'" onclick="deleteRelation(this.getAttribute(\'data-relId\'))" src="images/deleteBtn.svg" class="relation-edit-icon"> </div> <div class="relation"> <div class="relation-visual-container"> <div class="relation-visual"> <div id="'+nodeA_div+'" class="relation-a-text">'+relNodeA.text.name+'</div> </div> <img src="images/arrow.svg" width="20"> <div class="relation-visual"> <div id="'+nodeB_div+'"class="relation-a-text">'+relNodeB.text.name+'</div> </div> </div> <div id="'+rel_value_div+'" class="relation-value">'+value+'</div> </div> </div> </div>';

		relationsDiv.append(divToAppend);	
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
