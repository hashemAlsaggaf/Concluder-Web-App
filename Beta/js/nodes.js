//variables to assign id's
var idPrefix = "node_";
var idCounter = 1;
var newId = idPrefix + idCounter;

//variable to hold selected node
var selectedNode = null; // only id of node is saved here
var targetNode = null; // actual node is saved here
var parentNode = null;

var nodesList = [];

/*
	Function to clear selection
	go through each node (by class) and remove background color
	Used for visual node selection
*/
function clearSelection(){
	$('.node').each(function(){
		$(this).css({'background-color': 'gray', 'color': 'black'}); 
	});
	selectedNode = null;
	targetNode = null;
}

// tree configuration used as described on http://fperucic.github.io/treant-js/
var relationTree;
var relationTreeRoot;
var Tree = {
    chart: {
        container: "",
		node: {
			HTMLclass: "nodeClick",
			collapsable: true
		},
		callback: {
			onTreeLoaded : function(){
				$('.nodeClick').click(function(){
					clearSelection();
					$(this).css({'background-color': 'gray', 'color': 'white'});
					selectedNode = $(this).attr('id');
					findNode(selectedNode, root);
					console.log("Selected Node Is: " + selectedNode);
					console.log("Target Node Is: " + targetNode);
				});
			}
		},
		//animateOnInit: true,
		animation: {
			nodeAnimation: "easeInOutBack"
		}
    },
    
    nodeStructure: {
		HTMLid: "node_root",
        text: { name: "Root",  weight: 100},
		parent: "",
        children: [
			
		],
		matrix: []
    }
};

var root = Tree.nodeStructure;

function findNode(id, currentNode) {
	//console.log("inside " + currentNode.HTMLid);
	
    if (currentNode.HTMLid == id) {
		console.log("Found It!");
		targetNode = currentNode;
		//parentNode = findParent(currentNode, root);
		console.log(targetNode);
    } else {
		currentNode.children.forEach(function (currentChild) {            
			findNode(id, currentChild);
		});
    }
}

function addNode(target, name){
	
	if(target == null || name == ""){
		console.log("Please select a node and make sure the name is not empty!");
		return;
	}
	
	target.children.push({
		HTMLid: newId,
		text: {name: name, weight: 100},
		parent: target.HTMLid,
		children: [],
		matrix: []
	});
	
	distributeWeight(target, 100)
	//chart = new Treant(Tree, function() { }, $);
	drawTree("#editTreeChart", Tree);
	idCounter++;
	newId = idPrefix + idCounter;
	//console.log(Tree);
	addNodeNameInput.val('');
	
	//reconstruct the matrix for the target (target is the parent where the new node is added)
	for(i = 0 ; i < target.children.length ; i++){
		target.matrix[i] = [];
		for(j = 0 ; j < target.children.length ; j++){
			target.matrix[i][j] = 1;
		}
	}
	printMatrix(target.matrix);
}

function deleteNode(id, currentNode){
	
	var i = 0;
	currentNode.children.forEach(function (child){
		if(child.HTMLid == id){
			currentNode.children.splice(i, 1);
			distributeWeight(currentNode, 100);

			return true;
		}else{
			deleteNode(id, child);
		}
		i++;
	});
}

function editNodeName(id, currentNode, name){
	if (currentNode.HTMLid == id) {
		currentNode.text.name = name;
		console.log("node " + id + " edited. Name = " + name);
    } else {
		currentNode.children.forEach(function (currentChild){
			
			
			editNodeName(id, currentChild, name);
		});
    }
}

function distributeWeight(parent, weight){
	var factor = parent.children.length;
	parent.children.forEach(function (child){
		newWeight = weight/factor;
		child.text.weight = newWeight.toFixed(3);
	});
}

function findParent(id, currentNode){
	currentNode.children.forEach(function (child){

		if(child.HTMLid === id){
			console.log(child.HTMLid + " = " + id);
			parentNode = currentNode;
			return;
		}else{
			console.log('looking for ' + currentNode.HTMLid + ' parent' + ', matching: ' + id);
			findParent(id, child);
		}
		
	});
}

function countChildren(node){
	counter = 0;
	node.children.forEach(function(child){
		counter++;
	});
	console.log(node.text.name + " has "+counter+" children");
	return counter;
}

