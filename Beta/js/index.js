var panelHand = $('#panelHand');
var panel = $('#panel');
var panelState = "open";

var editNodeScreen = $('#editNodeScreen');
var relationScreen = $('#relationScreen');
var analyzeScreen = $('#analyzeScreen');

var editTreeChart = $('#editTreeChart');
var relateTreeChart = $('#relateTreeChart');
var analyzeTreeChart = $('#analyzeTreeChart');


//Main Panel Buttons
var treeIcon = $('#treeIcon');
var relationIcon = $('#relationIcon');
var analyzeIcon = $('#analyzeIcon');

// tree icon
treeIcon.click(function(){
	Tree.chart.node.collapsable = true;
	Tree.chart.callback.onTreeLoaded = editingTreeSelectionFunction;
	relationScreen.hide();
	analyzeScreen.hide();
	editNodeScreen.show();
	
	//refresh tree charts
	editTreeChart.empty();
	relateTreeChart.empty();
	analyzeTreeChart.empty();
	
	drawTree("#editTreeChart", Tree);
});

//relation icon
relationIcon.click(function(){
	var nodeA = null;
	var nodeB = null;
	relationWizard.hide();
	editNodeScreen.hide();
	analyzeScreen.hide();
	relationScreen.show();
	Tree.chart.node.collapsable = false;
	Tree.chart.callback.onTreeLoaded = relationSelectionFunction;
	//refresh tree charts
	editTreeChart.empty();
	relateTreeChart.empty();
	analyzeTreeChart.empty();
	drawTree("#relateTreeChart", Tree);
	
});

//analyze icon
analyzeIcon.click(function(){
	relationWizard.hide();
	editNodeScreen.hide();
	relationScreen.hide();
	matrixWizard.hide();
	matrixStatistics.text('');
	analyzeScreen.show();
	Tree.chart.node.collapsable = false;
	Tree.chart.callback.onTreeLoaded = analyzeSelectionFunction;
	//refresh tree charts
	editTreeChart.empty();
	relateTreeChart.empty();
	analyzeTreeChart.empty();
	drawTree("#analyzeTreeChart", Tree);
	highlightMatrixNodes(root);
});


panelHand.click(function(){
	switch(panelState){
		case "open":
			panel.animate({
				"left" : "-=55px"
			}, 250);
			panelState = "closed";
			break;
		case "closed":
			panel.animate({
				"left" : "+=55px"
			}, 250);
			panelState = "open";
			break;
	}
	
});

//Start app
message("Welcome", "Start by adding the first node");
editNodeScreen.show(250);
selectedNode = root.HTMLid; // Select root by id
targetNode = root;
editNodeBtn.click();

/*
	Keyboard shortcuts
*/

//Ctrl + Q = Add Node


$(document).keypress("q",function(e) {
  if(e.ctrlKey)
    addNodeBtn.click();
});


//testing:

