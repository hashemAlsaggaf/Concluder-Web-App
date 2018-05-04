/*
	control.js is responsible for all buttons and UI/UX controls
*/


/*------------------------------------------------
	MESSAGE SYSTEM
	opens a message box with text
	input: string
*/
var msgBox = $('#msgBox');
var msgDiv = $('#msgDiv');
var msgBoxOk = $('#msgBoxOk');
var msgTitle = $('#msgTitle');

function message(title, msg){
	msgDiv.html(msg);
	msgTitle.text(title);
	msgBox.show(250);
}



msgBoxOk.click(function (){
	msgBox.hide(250);
});
//------------------------------------------------

/*
	loading animation
	0 = hide
	1 = show
*/
function loadingAnim(status){
	switch(status){
		case 0:
			msgBoxOk.show();
			msgBox.hide();
			break;
		case 1:
			msgBoxOk.hide();
			message('Loading', 'Building tree and matrices...');
			break;
	}
}


// start with tree configuration
/*
	Draw Tree:
	target is a div id (ex. "#treeDiv")
	tree is a json object
*/
function drawTree(target ,tree){
	Tree.chart.container = target;
	chart = new Treant(tree, function() { }, $);
	console.log(tree.chart.container);
}




// buttons and inputs variables

var editNodeBtn = $('#editNodeBtn');
var deleteNodeBtn = $('#deleteNodeBtn');

/*-------------TREE FUNCTIONS--------------*/
var editingSelectionFunction = function(){
	$('.nodeClick').click(function(){
		clearSelection();
		$(this).css({'background-color': 'gray', 'color': 'white'});
		selectedNode = $(this).attr('id');
		console.log("Selected Node Is: " + selectedNode);

	});
}
/*
	ADDING A NODE TO THE TREE
*/
var addNodeBtn = $('#addNodeBtn');
var addNodeBox = $('#addNodeBox');
var addNodeNameInput = $('#addNodeNameInput');
var addNodeBtnOk = $('#addNodeBtnOk');
var addNodeBtnCancel = $('#addNodeBtnCancel');

/*Add Node Panel button*/
addNodeBtn.click(function(){
	addNodeBox.show(250); // show "Add Node" box
	addNodeNameInput.focus(); // switch input focus to input field
});

addNodeBtnOk.click(function(){
	//remove all relations under the selected node (remove the relations among the new node's siblings)	
	//remove selected node and all sub-tree under it from Relation Tab div and from relationsList[] (matrix is edited through node.js 'Add' function after this)
	deleteSubtreeRelations(selectedNode);
	
	var nodeName = addNodeNameInput.val();
	//Make sure no siblings with the same name exists
	var nodeNameUnique = true;
	map[selectedNode].children.forEach(function(child){
		if(child.text.name == nodeName){
			nodeNameUnique = false;
		}
	});
	if(nodeNameUnique == true){
		addNode(map[selectedNode], nodeName);
		$('#'+selectedNode).css({'background-color': '#2fb1d1', 'color': 'white'});
		addNodeBox.hide(250);
	}else{
		message('Error!','A sibling with the same name already exists');
	}
	
	
});

/*Add Node box - Cancel Button*/
addNodeBtnCancel.click(function(){
	addNodeBox.hide(250);
});

/*Add Node box - Listen to the Enter button*/
addNodeNameInput.keyup(function (e) {
    if(e.which ==13)
		addNodeBtnOk.click();
       
});

/*
	DELETEING A NODE FROM THE TREE
*/
var deleteNodeBox = $('#deleteNodeBox');
var deleteNodeYes = $('#deleteNodeYes');
var deleteNodeCancel = $('#deleteNodeCancel');

/*Delete Node Panel button*/
deleteNodeBtn.click(function(){
	deleteNodeBox.show(250);
});

/*Delete Node box - "Yes" Button*/
deleteNodeYes.click(function(){
	
	deleteSubtreeRelations(selectedNode); // always empty relations when deleteing nodes
	deleteRelatedRelation(selectedNode);
	//delete element from matrix
	matrixDeleteElement(selectedNode);
	//store its parent before you delete it
	var parent = map[selectedNode].parent;
	deleteNode(selectedNode);
	
	//redistribute weights among siblings
	distributeWeight(map[parent], 100);
	
	//eval matrix
	matrixEvalWeight(parent);
	
	selectedNode = 'node_root';
	
	console.log(map[selectedNode].parent);
	drawTree("#editTreeChart", Tree);
});

/*Delete Node box - "No" button*/
deleteNodeCancel.click(function(){
	deleteNodeBox.hide(250);
});

/*
	EDIT A NODE IN THE TREE
*/

var editNodeBox = $('#editNodeBox');
var editNodeInput = $('#editNodeInput');
var editNodeOk = $('#editNodeOk');
var editNodeCancel = $('#editNodeCancel');

/*Edit Node Panel button*/
editNodeBtn.click(function(){
	editNodeBox.show(250);
	editNodeInput.focus();
});

/*Edit Node box - "Ok" Button*/
editNodeOk.click(function(){
	value = editNodeInput.val();
	editNodeName(selectedNode, value);
	//restore relationsList and relations tab
	relationsDiv.html('');
	function loadRelations(){
		newRelList = relationsList;
		relationsList = [];
		newRelList.forEach(function(relation){
			if(relation != null){
				addRelation(map[relation.nodeA.HTMLid], map[relation.nodeB.HTMLid], relation.value);
				console.log(relation);
			}
			
		});
	}
	loadRelations();
	editNodeInput.val('');
	editNodeBox.hide(250);
	drawTree("#editTreeChart", Tree);
});

/*Edit Node box - "Cancel" button*/
editNodeCancel.click(function(){
	editNodeBox.hide(250);
	drawTree("#editTreeChart", Tree);
});

/*Listen to Enter button*/
editNodeInput.keyup(function (e){
	if(e.which == 13)
		editNodeOk.click();
});

/*
	RELATION CONTROL
*/

var relationTab = $("#relationTab");
var relationTabCloseBtn = $("#relationTabCloseBtn");
var relationTabOpenBtn = $("#relationTabOpenBtn");
var relationWizard = $("#relationWizard");

/*Relation Tab Open button*/
relationTabOpenBtn.click(function(){
	relationTab.show(250);
});

/*Relation Tab Close button*/
relationTabCloseBtn.click(function(){
	relationTab.hide(250);
});


/*SELECTING THE BIGGER ITEM MECHANISM*/
var nodeA = null;
var nodeB = null;
var biggerSelection = null;

/*Item A*/
selectedA.click(function(){
	$(this).css({"background-color": "lime"});
	selectedB.css({"background-color": ""});
	biggerSelection = nodeA.HTMLid;
	console.log("Bigger is: " + biggerSelection);
});

/*item B*/
selectedB.click(function(){
	$(this).css({"background-color": "lime"});
	selectedA.css({"background-color": ""});
	biggerSelection = nodeB.HTMLid;
	nodeTemp = nodeA;
	nodeA = nodeB;
	nodeB = nodeTemp;
	console.log("Bigger is: " + biggerSelection);
});

var relationApplyBtn = $('#relationApplyBtn');
var relationCancelBtn = $('#relationCancelBtn');
var relationValueInput = $('#relationValueInput');

/*Relation Wizard - "Cancel" button*/
relationCancelBtn.click(function(){
	selectedA.css({"background-color": ""});
	selectedB.css({"background-color": ""});
	biggerSelection = null;
	relationWizard.hide(250);
});

/*Relation Wizard - "Apply" button*/
relationApplyBtn.click(function(){
	// validate input
	var value = relationValueInput.val();
	if(isNaN(value) || value <= 0){
		relationValueInput.val(1);
		return message('Invalid Input', 'Please make sure you enter a valid number larger than zero.');
	}
	
	addRelation(nodeA, nodeB, value);
	nodeA = null;
	nodeB = null;
	relationWizard.hide(250);
	relationValueInput.val("");
	drawTree("#relateTreeChart", Tree);
});

//Edit Relation
var editRelationWizard = $('#editRelationWizard');
var edit_nodeA_bigger = $('#edit_nodeA_div');// bigger selection
var edit_nodeB_bigger = $('#edit_nodeB_div');// bigger selection
var editRelationValueInput = $('#editRelationValueInput');
var editRelationApplyBtn = $('#editRelationApplyBtn');
var editRelationCancelBtn = $('#editRelationCancelBtn');

/*
	This function is triggered from an edit relation button in the Relations Tab
	Each relation in the relation tab has a unique relationId
	Input:
		relationId
*/
function editRelationClick(relationId){
	console.log("relId: " + relationId);
	selectedRelation = relationId;
	
	//show relation property in Edit Relation Wizard
	edit_nodeA_bigger.text(relationsList[relationId].nodeA.text.name);
	edit_nodeB_bigger.text(relationsList[relationId].nodeB.text.name);
	editRelationValueInput.val(relationsList[relationId].value);
	
	editRelationWizard.show(250);
	
}

/*Selecting the bigger node*/
edit_nodeA_bigger.click(function(){
	$(this).css({"background-color": "lime"});
	edit_nodeB_bigger.css({"background-color": ""});
	biggerSelection = relationsList[selectedRelation].nodeA.HTMLid;
	console.log("Bigger is: " + biggerSelection + " -> " + relationsList[selectedRelation].nodeA.name);
});

edit_nodeB_bigger.click(function(){
	$(this).css({"background-color": "lime"});
	edit_nodeA_bigger.css({"background-color": ""});
	biggerSelection = relationsList[selectedRelation].nodeB.HTMLid;
	var nodeTemp = relationsList[selectedRelation].nodeA;
	relationsList[selectedRelation].nodeA = relationsList[selectedRelation].nodeB;
	relationsList[selectedRelation].nodeB = nodeTemp;
	console.log("Bigger is: " + biggerSelection);
});

/*Edit Relation - Apply button*/
editRelationApplyBtn.click(function(){
	console.log("-----Apply relation-----");
	console.log("Relation Id: " + selectedRelation);
	console.log("Bigger Selection: " + biggerSelection);
	console.log("NodeA: " + relationsList[selectedRelation].nodeA);
	console.log("NodeB: " + relationsList[selectedRelation].nodeB);
	console.log("Value: " + editRelationValueInput.val());
	
	//validate user input for the value of the relation
	if(isNaN(editRelationValueInput.val()) || editRelationValueInput.val() <= 0){
		editRelationValueInput.val(1);
		return message('Invalid Input', 'Please make sure you enter a valid number larger than zero.');
	}
	
	//Edit the relation
	editRelation(selectedRelation, relationsList[selectedRelation].nodeA, relationsList[selectedRelation].nodeB, editRelationValueInput.val());
	
	//change the HTML elements accordingly
	var nodeA_div = $('#'+relationsList[selectedRelation].nodeA_div);
	nodeA_div.text(relationsList[selectedRelation].nodeA.text.name);
	
	var nodeB_div = $('#'+relationsList[selectedRelation].nodeB_div);
	nodeB_div.text(relationsList[selectedRelation].nodeB.text.name);
	
	var value_div = $('#'+relationsList[selectedRelation].value_div);
	value_div.text(editRelationValueInput.val());
	//refresh the input field
	editRelationValueInput.val('');
	//draw the tree in the relation screen
	drawTree("#relateTreeChart", Tree);
	editRelationWizard.hide(250);
});
//Edit Relation - Cancel button
editRelationCancelBtn.click(function(){
	editRelationValueInput.val('');
	editRelationWizard.hide(250);
});

//Delete Realtion
var deleteRelationBox = $('#deleteRelationBox');
var confirmDeleteRelation = $('#confirmDeleteRelation');
var cancelDeleteRealtion = $('#cancelDeleteRealtion');
var divToDelete;


/*
	Called from a relation delete button (Relation Tab).
	relationId and relationDiv comes from a generated code 
	(the relation delete button).
*/
function deleteRelationClick(relationId, relationDiv){
	
	console.log("-----Delete Relation-----");
	console.log("Relation ID: " + relationId);
	console.log("Relation Div: " + relationDiv);

	selectedRelation = relationId;
	divToDelete = $(relationDiv);
	deleteRelationBox.show(250);
}

confirmDeleteRelation.click(function(){
	//repair the relation back to 1 between the two before deleting the relation
	var relation = relationsList[selectedRelation];
	try{
		editRelation(selectedRelation, relation.nodeA, relation.nodeB, 1);
	}catch(e){
		console.log('Delete Relation: Index not found, item might not exist in tree!');
	}
	
	
	//delete the relation
	delete relationsList[selectedRelation]; //selectedRelation is assigned by clicking on the relation delete button
	
	//hide the relation delete window
	divToDelete.hide(150);
	deleteRelationBox.hide(250);
	drawTree("#relateTreeChart", Tree);
});

cancelDeleteRealtion.click(function(){
	deleteRelationBox.hide(250);
});

/*
	Analyze Control
*/
//initilze variables for Analyze Screen
var mstrixWizardCloseBtn = $('#mstrixWizardCloseBtn');
var analyzePanelBtn = $('#analyzePanelBtn');
var analyzePanel = $('#analyzePanel');
var analyzePanelCloseBtn = $('#analyzePanelCloseBtn');
var inconsElementBtn = $('#inconsElementBtn');
var reduceBtn = $('#reduceBtn');
var restoreMatrixBtn = $('#restoreMatrixBtn');
var showTraidsBtn = $('#showTraidsBtn');
var hideTraidsBtn = $('#hideTraidsBtn');
var nextTraidBtn = $('#nextTraidBtn');
var prevTraidBtn = $('#prevTraidBtn');
var maxInconsTraidBtn = $('#inconsTraidBtn');
var reduceTraidBtn = $('#reduceTraidBtn');



/*Analyze Screen - Matrix Close button*/
mstrixWizardCloseBtn.click(function(){
	matrixWizard.hide(250);
});
/*Analyze Screen - Analyze panel button*/
analyzePanelBtn.click(function(){

	analyzePanel.show(250);
});
/*Analyze Screen - Close analyze panel button*/
analyzePanelCloseBtn.click(function(){
	analyzePanel.hide(250);
});
/*Analyze Screen - show traids button*/
showTraidsBtn.click(function(){
	removeHighlights(map[selectedNode].matrix);
	showTraidsBtn.hide(100);
	hideTraidsBtn.show(100);
	nextTraidBtn.show(100);
	prevTraidBtn.show(100);
	maxInconsTraidBtn.show(100);
	showTraid(inconsList[0]);
	reduceTraidBtn.show(250);
});
/*Analyze Screen - hide traids button*/
hideTraidsBtn.click(function(){
	showTraidsBtn.show(100);
	hideTraidsBtn.hide(100);
	nextTraidBtn.hide(100);	
	prevTraidBtn.hide(100);
	reduceTraidBtn.hide(250);
	maxInconsTraidBtn.hide(250);
	removeHighlights(map[selectedNode].matrix);
	matrixStatistics.text('');
	traidTurn = 0;
});
/*Analyze Screen - next traid button*/
nextTraidBtn.click(function(){
	showNextTraid();
});
/*Analyze Screen - prev. traid button*/
prevTraidBtn.click(function(){
	showPrevTraid();
});
/*Analyze Screen - Maximum traid button*/
maxInconsTraidBtn.click(function(){
	removeHighlights(map[selectedNode].matrix);
	var maxTraid = findMaxIncons(inconsList);
	showTraid(maxTraid);
	matrixStatistics.text('inconsistency Value = ' + maxTraid.incons);
});
/*Analyze Screen - Maximum element button*/
inconsElementBtn.click(function(){
	removeHighlights(map[selectedNode].matrix);
	showMaxElement(map[selectedNode].matrix);
});

/*Analyze Screen - Reduce Incosistency button*/
reduceBtn.click(function(){

	for(i=0 ; i<10; i++)
	autoReduce();
	printMatrix(map[selectedNode], '#matrixView');
	matrixEvalWeight(selectedNode);
	calcInconsistency(map[selectedNode].matrix);
	console.log("Backup Matrix: " + backupMatrix);
	matrixStatistics.text("");
});

//bring back the backed up matrix
//re-evaluate weights
//re-calculate inconsistency
//print the matrix
restoreMatrixBtn.click(function(){
	// restore the matrix from backupMatrix
	for (var i = 0; i < backupMatrix.length; i++){
		map[selectedNode].matrix[i] = backupMatrix[i].slice();
	}
	matrixEvalWeight(selectedNode);
	calcInconsistency(map[selectedNode].matrix);
	printMatrix(map[selectedNode], '#matrixView');
	matrixStatistics.text("");
	
	
	
	//restore relationsList and relations tab
	relationsDiv.html('');
	function loadRelations(){
		newRelList = relationsList;
		relationsList = [];
		newRelList.forEach(function(relation){
			if(relation != null){
				addRelation(map[relation.nodeA.HTMLid], map[relation.nodeB.HTMLid], relation.value);
				console.log(relation);
			}
			
		});
	}
	loadRelations();
	
	hideTraidsBtn.click(); //hide traid control buttons
});
/*Analyze Screen - Reduce traid button*/
reduceTraidBtn.click(function(){
	
	reduceTraid(inconsList[traidTurn]);
	printMatrix(map[selectedNode], '#matrixView');
	showTraid(inconsList[traidTurn]);
	matrixEvalWeight(selectedNode);
	calcInconsistency(map[selectedNode].matrix); // re-calculate incosistancy
	matrixStatistics.text('inconsistency Value = ' + inconsList[traidTurn].incons);
});

/*
	Direct Interact With The Matrix
	cell is cell id. (ex: cell_13, cell_14, etc....)
	
	user might change a cell that exist in the relationsList,
	or might enter a new relation

	variable relationApply is used to determine if the change is applied in relationsList or should we add a new relation
*/

var cellDirectAccess = true;

function cellClick(cellId){
	
	var relationApplied = false; // 
	var cell = $('#'+cellId);
	var cellInput = $("#"+cellId+"_input");
	var i = cell.data('i');
	var j = cell.data('j');
	
	if(cellDirectAccess){
		cellInput.attr("readonly", false);
	}
	
	
	cellInput.select();
	//backup cell value incase of an invalid input from userAgent
	var tempVal = cellInput.val();

	cellInput.on("keydown", function(event) {
		if(event.which == 13 && (i != j)){
			if(isNaN(cellInput.val()) || cellInput.val() <0){
				cellInput.val(tempVal);
				return message('Invalid Input', 'Please make sure you enter a valid number larger than 0.');
			}
			console.log('enter detected on cell ' + cell);
			console.log('i = ' + i);
			console.log('j = ' + j);
			
			//apply the change in the relationsList and relation tab
			//nodeA index = i, nodeB index = j
			for(var loop = 0; loop < relationsList.length; loop++){
				//variabkl 'loop' is used instead of i for the loop to avoid mix up with the variable i for the matrix
				//if this relation contains nodeA and nodeB, then edit accordingly
				
				if(relationsList[loop] != undefined){
					var relNodeA = relationsList[loop].nodeA.HTMLid;
					var cellNodeA = map[selectedNode].children[i].HTMLid;
					var relNodeB = relationsList[loop].nodeB.HTMLid;
					var cellNodeB = map[selectedNode].children[j].HTMLid;
					
					//edit existing relation
					if((relNodeA == cellNodeA && relNodeB == cellNodeB) || (relNodeA == cellNodeB && relNodeB == cellNodeA)){
						
						editRelation(loop, map[selectedNode].children[i], map[selectedNode].children[j], cellInput.val());
						relationApplied = true;
							
					}
				}
				
			}
			//after checking and no relation found
			//add a new relation
			if(relationApplied === false){
				addRelation(map[selectedNode].children[i], map[selectedNode].children[j], cellInput.val());
				relationApplied = true;
			}
			
			matrixEvalWeight(selectedNode);
			calcInconsistency(map[selectedNode].matrix);
			
			printMatrix(map[selectedNode], '#matrixView');
			calcInconsistency(map[selectedNode].matrix);
			
			drawTree("#analyzeTreeChart", Tree);
			showTraid(inconsList[traidTurn]);
			return;
		}
	});
}