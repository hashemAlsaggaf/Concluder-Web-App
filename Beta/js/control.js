


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
	msgDiv.text(msg);
	msgTitle.text(title);
	msgBox.show(250);
}
//------------------------------------------------


msgBoxOk.click(function (){
	msgBox.hide(250);
});

// start with tree configuration
/*
	Draw Tree:
	target is a div id (ex. "#treeDiv")
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
var editingTreeSelectionFunction = function(){
	$('.nodeClick').click(function(){
		clearSelection();
		$(this).css({'background-color': 'gray', 'color': 'white'});
		selectedNode = $(this).attr('id');
		findNode(selectedNode, root);
		console.log("Selected Node Is: " + selectedNode);
		console.log("Target Node Is: " + targetNode);
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


addNodeBtn.click(function(){
	addNodeBox.show(250);
	addNodeNameInput.focus();
});

addNodeBtnOk.click(function(){
	value = addNodeNameInput.val();
	addNode(targetNode, value);
	addNodeBox.hide(250);
});

addNodeBtnCancel.click(function(){
	addNodeBox.hide(250);
});

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

deleteNodeBox.click(function(){
	deleteNodeBox.hide(250);
});

deleteNodeBtn.click(function(){
	deleteNodeBox.show(250);
});

deleteNodeYes.click(function(){
	findParent(selectedNode,root);
	deleteNode(selectedNode, root);
	console.log('after deleting, the targetNode is: ' + targetNode.HTMLid + ', parentNode = ' + parentNode.HTMLid);
	//adjust the matrix
	matrixDeleteElement(targetNode);
	matrixEvalWeight(parentNode);
	drawTree("#editTreeChart", Tree);
});

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

editNodeBtn.click(function(){
	editNodeBox.show(250);
	editNodeInput.focus();
});

editNodeOk.click(function(){
	value = editNodeInput.val();
	editNodeName(selectedNode, root, value);
	editNodeInput.val('');
	editNodeBox.hide(250);
	drawTree("#editTreeChart", Tree);
});

editNodeCancel.click(function(){
	editNodeBox.hide(250);
});

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


relationTabOpenBtn.click(function(){
	relationTab.show(250);
});

relationTabCloseBtn.click(function(){
	relationTab.hide(250);
});

//selecting
var nodeA = null;
var nodeB = null;
var selectedA = $('#selectedA');
var selectedB = $('#selectedB');
var biggerSelection = null;




selectedA.click(function(){
	$(this).css({"background-color": "lime"});
	selectedB.css({"background-color": ""});
	biggerSelection = nodeA.HTMLid;
	console.log("Bigger is: " + biggerSelection);
});

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

relationCancelBtn.click(function(){
	selectedA.css({"background-color": ""});
	selectedB.css({"background-color": ""});
	biggerSelection = null;
	relationWizard.hide(250);
});

relationApplyBtn.click(function(){
	var value = relationValueInput.val();
	findParent(nodeA.HTMLid, root);
	addRelation(parentNode, nodeA, nodeB, value);
	relationWizard.hide(250);
	relationValueInput.val("");
	drawTree("#relateTreeChart", Tree);
});

/*
	Analyze Control
*/
var mstrixWizardCloseBtn = $('#mstrixWizardCloseBtn');
var analyzePanelBtn = $('#analyzePanelBtn');
var analyzePanel = $('#analyzePanel');
var analyzePanelCloseBtn = $('#analyzePanelCloseBtn');
var inconsElementBtn = $('#inconsElementBtn');
var reduceBtn = $('#reduceBtn');
var showTraidsBtn = $('#showTraidsBtn');
var hideTraidsBtn = $('#hideTraidsBtn');
var nextTraidBtn = $('#nextTraidBtn');
var inconsTraidBtn = $('#inconsTraidBtn');



mstrixWizardCloseBtn.click(function(){
	matrixWizard.hide(250);
});

analyzePanelBtn.click(function(){
	analyzePanel.show(250);
});

analyzePanelCloseBtn.click(function(){
	analyzePanel.hide(250);
});

showTraidsBtn.click(function(){
	showTraidsBtn.hide(100);
	hideTraidsBtn.show(100);
	nextTraidBtn.show(100);
	
	showTraid(inconsList[0]);
	
});

hideTraidsBtn.click(function(){
	showTraidsBtn.show(100);
	hideTraidsBtn.hide(100);
	nextTraidBtn.hide(100);	
	
	removeHighlights(targetNode.matrix);
	matrixStatistics.text('');
	traidTurn = 0;
});

nextTraidBtn.click(function(){
	showNextTraid();
});

inconsTraidBtn.click(function(){
	removeHighlights(targetNode.matrix);
	var maxTraid = findMaxIncons(inconsList);
	showTraid(maxTraid);
	matrixStatistics.text('Inconsistancy Value = ' + maxTraid.incons);
});