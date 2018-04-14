//variables to assign id's
//var idPrefix = "node_";
var date = new Date();
var idPrefix = "node_"+date.getTime() ;
var nodeIdCounter = 1;
var newId = idPrefix + nodeIdCounter;

var nodesBackColor = "#5d6c7b3b";

var selectedNode = 'node_root';
/*
	Function to clear selection
	go through each node (by class) and remove background color
	Used for visual node selection
*/
function clearSelection(){
	$('.node').each(function(){
		$(this).css({'background-color': nodesBackColor, 'color': 'black'}); 
	});
	selectedNode = null;
}

// tree configuration used as described on http://fperucic.github.io/treant-js/
var treeConfig = {
	    chart: {
        container: "",
		node: {
			HTMLclass: "nodeClick"
		},
		callback: {
			onTreeLoaded : function(){
				$('.nodeClick').click(function(){
					clearSelection();
					$(this).css({'background-color': '#2fb1d1', 'color': 'white'});
					selectedNode = $(this).attr('id');
					findNode(selectedNode);// for debugging
				});
			}
		}
    },
    
    nodeStructure: {
		HTMLid: "node_root",
        text: { name: "Root",  weight: 100},
		parent: "",
        children: [
			
		],
		matrix: [
		
		]
    }
};

var Tree = $.extend(true, {}, treeConfig);//a clone of treeConfig

var root = Tree.nodeStructure;

var map = {
	'node_root': root
};


function findNode(id) {
	console.log(map[id].HTMLid);
}

//target is an actual node, not ID
function addNode(target, name){
	
	if(target == null || name == ""){
		console.log("Please select a node and make sure the name is not empty!");
		console.log(target);
		console.log(name);
		return;
	}
	
	target.children.push({
		HTMLid: newId,
		text: {name: name, weight: 100},
		parent: target.HTMLid,
		children: [],
		matrix: []
	});
	
	//create map ref of the recent child (the last child (length-1))
	map[newId] = target.children[target.children.length - 1];
	
	distributeWeight(target, 100);
	//chart = new Treant(Tree, function() { }, $);
	drawTree("#editTreeChart", Tree);
	nodeIdCounter++;
	newId = idPrefix + nodeIdCounter;
	//console.log(Tree);
	addNodeNameInput.val('');
	
	//reconstruct the matrix for the target (target is the parent where the new node is added)
	for(i = 0 ; i < target.children.length ; i++){
		target.matrix[i] = [];
		for(j = 0 ; j < target.children.length ; j++){
			target.matrix[i][j] = 1;
		}
	}
	
	console.log('----map below----');
	console.log(map);
	
}


/*
	assembleNode()
	used with opeining a tree from a file
	startign from the root of a file, attatch nodes to the tree.
	parent: is where the node will be assembled (a node object)
	name: is the nodes name
	id: is the node id
*/

function assembleNode(parent, name, id){
	
	parent.children.push({
		HTMLid: id,
		text: {name: name, weight: 100},
		parent: parent.HTMLid,
		children: [],
		matrix: []
	});
	
	//create hash map link
	map[id] = parent.children[parent.children.length - 1];
	distributeWeight(parent, 100); 
	
	//reconstruct the matrix for the target (target is the parent where the new node is added)
	for(i = 0 ; i < parent.children.length ; i++){
		parent.matrix[i] = [];
		for(j = 0 ; j < parent.children.length ; j++){
			parent.matrix[i][j] = 1;
		}
	}
	nodeIdCounter++;
	newId = idPrefix + nodeIdCounter;
}


function deleteNode(id){

	var parentId = map[id].parent;
	var parent = map[parentId];
	console.log('parent is: ' + parent.HTMLid);
	
	var i = 0;
	parent.children.forEach(function (child){
		if(child.HTMLid == id){
			parent.children.splice(i, 1);
		}else{
			i++;
		}
	});
	//delete from map and delete all its children from map
	/*
	delete map[id];
	for(key in map){
		if(map.hasOwnProperty(key) && map[key].parent == id){
			delete map[key];
		}else{
			console.log('----Node parent: ' + map[key].parent);
		}
	}
	*/
	console.log(map);

}

function editNodeName(id, currentNode, name){
	/*
	if (currentNode.HTMLid == id) {
		currentNode.text.name = name;
		console.log("node " + id + " edited. Name = " + name);
    } else {
		currentNode.children.forEach(function (currentChild){
			editNodeName(id, currentChild, name);
		});
    }
	*/
	map[id].text.name = name;
}

function distributeWeight(parent, weight){
	var factor = parent.children.length;
	parent.children.forEach(function (child){
		newWeight = weight/factor;
		child.text.weight = newWeight.toFixed(3);
	});
}

function getParent(id){
	return map[id].parent;
}

function countChildren(id){
	counter = 0;
	map[id].children.forEach(function(child){
		counter++;
	});
	console.log(map[id].text.name + " has "+counter+" children");
	return counter;
}

