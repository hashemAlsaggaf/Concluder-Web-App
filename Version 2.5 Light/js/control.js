// start with tree configuration

//Variables
var treeView = $('#mainTreeView');

/*
	Draw Tree:
	target is a div id (ex. "#treeDiv")
	tree is a json object
*/
function drawTree(tree){
	Tree.chart.container = treeView;
	chart = new Treant(tree, function() { }, $);
	console.log(tree.chart.container);
}



/*TREE ACTIONS*/

nodeMenuBg.click(function(){
	hideNodeMenu();
});

/*
	Add nodes
*/
var addNodeBox = $('#addNodeBox');
var addNodeBtn = $('#addNodeBtn');
var addNodeCloseBtn = $('#addNodeCloseBtn');
var addNodeNameInput = $('#addNodeNameInput');
var addNodeDescInput = $('#nodeDescInput');
var addNodeOkBtn = $('#addNodeOkBtn');

addNodeBtn.click(function(){
	addNodeNameInput.val("");
	addNodeDescInput.val("");
	addNodeBox.show(200);
	addNodeNameInput.focus();
});

addNodeCloseBtn.click(function(){
	addNodeBox.hide(200);
});

addNodeOkBtn.click(function(){
	var desc = addNodeDescInput.val();
	addNode(map[selectedNode], addNodeNameInput.val(), desc);
	drawTree(Tree);
	addNodeBox.hide(200);
});

/*
	Edit Node
*/
var editNodeBox = $('#editNodeBox');
var editNodeBtn = $('#editNodeBtn');
var editNodeBoxCloseBtn = $('#editNodeBoxCloseBtn');
var editNodeNameInput = $('#editNodeNameInput');
var editNodeDescInput = $('#editNodeDescInput');
var editNodeOkBtn = $('#editNodeOkBtn');

editNodeBtn.click(function(){
	editNodeNameInput.val(map[selectedNode].text.name);
	editNodeDescInput.val(map[selectedNode].text.desc);
	editNodeBox.show(200);
});

editNodeBoxCloseBtn.click(function(){
	editNodeBox.hide(200);
});

editNodeOkBtn.click(function(){
	var desc = editNodeDescInput.val();
	editNodeName(selectedNode, editNodeNameInput.val(), desc);
	drawTree(Tree);
	editNodeBox.hide(200);
});



/*
	Delete nodes
*/
var deleteNodeBox = $('#deleteNodeBox');
var deleteNodeBoxExitBtn = $('#deleteNodeBoxExitBtn');
var deleteNodeYesBtn = $('#deleteNodeYesBtn');
var deleteNodeNoBtn = $('#deleteNodeNoBtn');
var deleteNodeBtn = $('#deleteNodeBtn');

deleteNodeBtn.click(function(){
	deleteNodeBox.show(200);
});

deleteNodeNoBtn.click(function(){
	deleteNodeBox.hide(200);
});

deleteNodeBoxExitBtn.click(function(){
	deleteNodeBox.hide(200);
});

deleteNodeYesBtn.click(function(){
	deleteNode(selectedNode);
	deleteNodeBox.hide(200);
	drawTree(Tree);
});

/*RELATION*/
var relationDialog = $('#relationDialog');
var relationDialogCloseBtn = $('#relationDialogCloseBtn');
var relationNodeAText = $('#relationNodeAText');
var relationNodeBText = $('#relationNodeBText');
var relationValue = $('#relationValue');
var relationApplyBtn = $('#relationApplyBtn');
var relateNodeBtn = $('#relateNodeBtn');
var relationModeMsg = $('#relationModeMsg');
var relationModeMsgExitButton = $('#relationModeMsgExitButton');

var selectedNodeA = null;
var selectedNodeB = null;

relateNodeBtn.click(function(){
	//console.log($(this).attr('id'));
	//if this is not the root node
	if(map[selectedNode].HTMLid != "node_root"){
		relationMode = true;
		Tree.chart.callback.onTreeLoaded = nodeRelationClickFunction;
		drawTree(Tree);
		$('#'+selectedNode).css({'background-color': '#2fb1d1', 'color': 'white'});
		$('.node').each(function(){
			$(this).css({'opacity': 0.3});
		});
		map[map[selectedNode].parent].children.forEach(function(child){
			if(child.HTMLid != $(this).attr('id')){
				$('#'+child.HTMLid).css({opacity: 100});
			}
		});
		selectedNodeA = selectedNode;
		//console.log(Tree);

		relationModeMsg.show(200);
		relationValue.text('');
		relationValue.focus();
	}else{
		console.log('--> the root cannot be related to any node');
	}
});

/*
	Relate button actions
	1- hide all nodes
	2- only show relatable nodes (siblings)
*/
var nodeRelationClickFunction = function(){
	$('.nodeClick').click(function(){
		//if this is not the first selected node, and a sibling of the first selected node
		console.log(map[$(this).attr('id')]);
		console.log(map[selectedNodeA]);
		if($(this).attr('id') != selectedNodeA && map[$(this).attr('id')].parent == map[selectedNodeA].parent){
			selectedNodeB = $(this).attr('id'); //select the second node
			$('#'+selectedNodeA).css({'background-color': '#2fb1d1', 'color': 'white'});
			$('#'+selectedNodeB).css({'background-color': '#2fb1d1', 'color': 'white'});
			relationNodeAText.text(map[selectedNodeA].text.name);
			relationNodeBText.text(map[selectedNodeB].text.name);
			relationDialog.show(200);
		}else{
			console.log('error in relation selection :(');
		}
	});
};

function exitRelateMode(){
	selectedNode = selectedNodeA = selectedNodeB = null;
	Tree.chart.callback.onTreeLoaded = defaultNodeClickFunction;
	relationDialog.hide(200);
	relationModeMsg.hide();
	drawTree(Tree);
}

relationDialogCloseBtn.click(function(){
	exitRelateMode();
});

relationModeMsgExitButton.click(function(){
	exitRelateMode();
});

relationApplyBtn.click(function(){
	var value = relationValue.val();
	addRelation(map[selectedNodeA], map[selectedNodeB], value);
	exitRelateMode();
});








