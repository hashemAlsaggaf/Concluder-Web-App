/*
	index.js is responsible for:
		- Starting the application
		- Starting a new project
		- Open an existing project
		- Saving a project
		- Navigation buttons
		- Shrtcuts
*/

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

//New File button
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

//Open File button
openIcon.click(function(){
	fileInput.click();
});

//Action for selecting a file
fileInput.on("change",function(){
	
	var fileSelector = document.getElementById('fileInput');
	file = fileSelector.files[0];
	
	//validate the selected file
	if(file === undefined){
		return;
	}else{
		fileName = file.name;
	}
	
	console.log('Selected file name is ' + fileName);
	
	//read selected file by creating a file reader
	var fr = new FileReader();
	fr.readAsText(fileSelector.files[0]);
	
	//action for loading a file
	fr.onload = function(){
		/*
		load Tree, Map, and relation list by splitting the file into
		three elements using '</jsonBreak/>'
		*/
		result = fr.result.split('</jsonBreak/>');
		console.log(result);
		
		//initiate a new map and a new relation list
		var newMap = null;
		var newRelList = null;
		
		//try to read a file and report an error if file is not compatible
		try{
			//bring the tree from result[0]
			var newTree = JSON.parse(result[0]);
			
			try{
				//bring the map from result[1] if found
				newMap = JSON.parse(result[1]);
			}catch(e){
				newMap = {
					'node_root': root
				};
				console.log('--Loading: No map found!');
			}
			
			
			try{
				//bring the relations list from result[2] if found
				newRelList = JSON.parse(result[2]);
				relId = 0; // reset relation id counter
			}catch(e){
				newRelList = [];
				console.log('--Loading: No relations list found!');
			}

			welcomeScreen.hide(250);
		}catch(e){
			return message('Ooops!','Sorry, the file is not compatible or corrupted.');
		}
			
		
		//load the tree
		nodeIdCounter = 1; // reset the node counter in nodes.js
		//make a fresh tree by cloning the treeConfig (located in nodes.js)
		Tree = $.extend(true, {}, treeConfig);
		//assign the root
		root = Tree.nodeStructure;
		
		//refresh the refrence map table
		map = {
			'node_root': root
		};
		
		var newTreeRoot = newTree.nodeStructure;
		
		root.text.name = newTreeRoot.text.name;
		
		/*
		A for-each recursive method to assemble the new tree by iterating through each child
		*/
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

		
		//load relationsList from newRelList to Relation Tab
		function loadRelations(){
			relationsList = [];
			newRelList.forEach(function(relation){
				if(relation != null){
					addRelation(map[relation.nodeA.HTMLid], map[relation.nodeB.HTMLid], relation.value);
					console.log(relation);
				}
				
			});
		}
		// empty Relations Panel then load relations
		relationsDiv.html('');
		loadRelations();
		
		//show the edit screen and draw the tree
		analyzeScreen.hide(250);
		relationScreen.hide(250);
		editNodeScreen.show();
		drawTree(editTreeChart, Tree);
	}
	
	
	//refresh fileSelector
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

//We need to copy the tree, map, and the relations list
var fileLink = $('#saveFileLink');
saveFileBtn.click(function(){
	
	var treeToSave = {};
	for(var i in Tree){
		treeToSave[i] = Tree[i];
	}
	
	var mapToSave = {};
	for(var i in Tree){
		mapToSave[i] = map[i];
	}

	// stringify the tree object (convert to text)
	fileLink[0].href = 'data:attachment/text,' + JSON.stringify(treeToSave)+'</jsonBreak/>'+JSON.stringify(mapToSave)+'</jsonBreak/>'+JSON.stringify(relationsList); 
	fileLink[0].target = '_blank'; // open in new tab
	fileLink[0].download = saveFileNameInput.val()+".json"; // get filename from user input field
	fileLink[0].click();
	saveFileBox.hide();
	//Debugging
	console.log('save button click detected!');
	console.log(fileLink);
});

//Main Panel Buttons
var treeIcon = $('#treeIcon');
var relationIcon = $('#relationIcon');
var analyzeIcon = $('#analyzeIcon');

//Tree button
treeIcon.click(function(){
	//assign selection function
	Tree.chart.callback.onTreeLoaded = editingSelectionFunction;
	//show edit screen
	relationScreen.hide();
	analyzeScreen.hide();
	editNodeScreen.show();
	
	//refresh tree charts
	editTreeChart.empty();
	relateTreeChart.empty();
	analyzeTreeChart.empty();
	
	drawTree("#editTreeChart", Tree);
});

//Relation button
relationIcon.click(function(){
	//initiate selection variables
	var nodeA = null;
	var nodeB = null;
	//show relation screen
	relationWizard.hide();
	editNodeScreen.hide();
	analyzeScreen.hide();
	relationScreen.show();
	//disable collapsable option
	Tree.chart.node.collapsable = false;
	Tree.chart.callback.onTreeLoaded = relationSelectionFunction;
	//refresh tree charts
	editTreeChart.empty();
	relateTreeChart.empty();
	analyzeTreeChart.empty();
	//draw the tree in the relation screen
	drawTree("#relateTreeChart", Tree);
	
});

//Analyze button
analyzeIcon.click(function(){
	//hide other screens and wizards
	relationWizard.hide();
	editNodeScreen.hide();
	relationScreen.hide();
	matrixWizard.hide();
	//refresh status text
	matrixStatistics.text('');
	//show analyze screen
	analyzeScreen.show();
	//disable collapsable nodes in the tree
	Tree.chart.node.collapsable = false;
	//assign selection function
	Tree.chart.callback.onTreeLoaded = analyzeSelectionFunction;
	//refresh tree charts
	editTreeChart.empty();
	relateTreeChart.empty();
	analyzeTreeChart.empty();
	//draw tree in analyze screen
	drawTree("#analyzeTreeChart", Tree);
	//highlight nodes that can be analyzed
	highlightMatrixNodes('node_root');
});


//panel animation (Slide left / Slide right)
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

//Start application
var welcomeScreen = $('#welcomeScreen');
var openProjectBtn = $('#openProjectBtn');
var startFreshBtn = $('#startFreshBtn');

//show welcome screen
welcomeScreen.show(250);

//"Open existing project" button
openProjectBtn.click(function(){
	openIcon.click();
});

//"Start Fresh" button
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


