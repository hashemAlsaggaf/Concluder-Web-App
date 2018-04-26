var panelHand = $('#panelHand');
var panel = $('#panel');
var panelState = "open";

var editNodeScreen = $('#editNodeScreen');
var relationScreen = $('#relationScreen');
var analyzeScreen = $('#analyzeScreen');

var editTreeChart = $('#editTreeChart');
var relateTreeChart = $('#relateTreeChart');
var analyzeTreeChart = $('#analyzeTreeChart');

/*
	New File
*/

var newfileIcon = $('#newfileIcon');

newfileIcon.click(function(){
	nodeIdCounter = 1;
	//new tree
	Tree = $.extend(true, {}, treeConfig);
	
	root = Tree.nodeStructure;
	
	//new map
	map = {
		'node_root': root
	};

	//new relationsList
	relationsList = [];
	relId = 0; // reset relation id counter
	
	//show editNodeScreen and reset the relation tab
	analyzeScreen.hide(250);
	relationsDiv.html('');
	relationScreen.hide(250);
	editNodeScreen.show();

	//draw the tree in editNodeScreen
	drawTree(editTreeChart, Tree);
	var rootDiv = $('#node_root');
	rootDiv.click();
	
});





/*
	Open File (Tree as JSON Object)
*/

var openIcon = $('#openIcon');
var fileInput = $('#fileInput');

openIcon.click(function(){
	fileInput.click();
});

fileInput.on("change",function(){
	
	var fileSelector = document.getElementById('fileInput');
	file = fileSelector.files[0];
	
	if(file === undefined){
		return;
	}else{
		loadingAnim(1);//show loading message
		fileName = file.name;
	}
	
	console.log('Selected file name is ' + fileName);
	
	//----read selected file
	var fr = new FileReader();
	fr.readAsText(fileSelector.files[0]);
	fr.onload = function(){
		
		result = fr.result.split('</jsonBreak/>');
		console.log(result);
		
		var newMap = null;
		var newRelList = null;
		
		try{
			var newTree = JSON.parse(result[0]);
			
			try{
				newMap = JSON.parse(result[1]);
			}catch(e){
				newMap = {
					'node_root': root
				};
				console.log('--Loading: No map found!');
			}
			
			
			try{
				newRelList = JSON.parse(result[2]);
				relId = 0; // reset relation id counter
			}catch(e){
				newRelList = [];
				console.log('--Loading: No relations list found!');
			}
			
			
			//nodeIdCounter = newMap.length;
			welcomeScreen.hide(250);
		}catch(e){
			
			return message('Ooops!','Sorry, the file is not compatible or corrupted.');
		}
			
		
		//Tree = newTree;
		
		//----load tree
		nodeIdCounter = 1;
		Tree = $.extend(true, {}, treeConfig);
		root = Tree.nodeStructure;
		
		map = {
			'node_root': root
		};
		
		var newTreeRoot = newTree.nodeStructure;
		
		root.text.name = newTreeRoot.text.name;
		
		function loadTree(node){
			
			
			node.children.forEach(function (child){
				assembleNode(map[node.HTMLid], child.text.name, child.HTMLid);
			});
			
			node.children.forEach(function (child){
				loadTree(child);
			});
			
		}
		
		loadTree(newTreeRoot);
		
		console.log(newTree);

		
		//----load relationsList from newRelList to Relation Tab
		function loadRelations(){
			relationsList = [];
			newRelList.forEach(function(relation){
				if(relation != null){
					addRelation(map[relation.parent.HTMLid], map[relation.nodeA.HTMLid], map[relation.nodeB.HTMLid], relation.value);
					console.log(relation);
				}
				
			});
		}
		relationsDiv.html(''); // empty Relations Panel then load relations
		loadRelations();
		
		analyzeScreen.hide(250);
		
		relationScreen.hide(250);
		editNodeScreen.show();
		drawTree(editTreeChart, Tree);
		loadingAnim(0);
	}
	
	
	loadingAnim(0);//hide loading message
	
	fileSelector.value = '';
});






/*
	Save File (Tree as JSON Object)
*/

var saveIcon = $('#saveIcon');
var saveFileBox = $('#saveFileBox');
var saveFileNameInput = $('#saveFileNameInput');
var saveFileBtn = $('#saveFileBtn');
var cancelSaveFileBtn = $('#cancelSaveFileBtn');

saveIcon.click(function(){
	saveFileNameInput.val(map['node_root'].text.name);// show the root node name as default filename
	saveFileBox.show(250);
});

cancelSaveFileBtn.click(function(){
	saveFileBox.hide(250);
});

saveFileBtn.click(function(){
	var fileLink = document.createElement('a');
	fileLink.href = 'data:attachment/text,' + encodeURI(JSON.stringify(Tree)+'</jsonBreak/>'+JSON.stringify(map)+'</jsonBreak/>'+JSON.stringify(relationsList)); // stringify the tree object (convert to text)
	fileLink.target = '_blank'; // open in new tab
	fileLink.download = saveFileNameInput.val()+".json"; // get filename from user input field
	fileLink.click();
	saveFileBox.hide();
});


//Main Panel Buttons
var treeIcon = $('#treeIcon');
var relationIcon = $('#relationIcon');
var analyzeIcon = $('#analyzeIcon');

// tree icon
treeIcon.click(function(){

	Tree.chart.callback.onTreeLoaded = editingSelectionFunction;
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
	highlightMatrixNodes('node_root');
});


panelHand.click(function(){
	switch(panelState){
		case "open":
			panel.animate({
				"left" : "-=75px"
			}, 250);
			panelState = "closed";
			break;
		case "closed":
			panel.animate({
				"left" : "+=75px"
			}, 250);
			panelState = "open";
			break;
	}
	
});

//Start app
var welcomeScreen = $('#welcomeScreen');
var openProjectBtn = $('#openProjectBtn');
var startFreshBtn = $('#startFreshBtn');

welcomeScreen.show(250);

openProjectBtn.click(function(){
	openIcon.click();
});

startFreshBtn.click(function(){
	welcomeScreen.hide(250);
	treeIcon.click();
	
});

selectedNode = root.HTMLid; // Select root by id


/*
	Keyboard shortcuts
*/

//Ctrl + Q = Add Node


$(document).keypress("q",function(e) {
  if(e.ctrlKey)
    addNodeBtn.click();
});


//testing:

