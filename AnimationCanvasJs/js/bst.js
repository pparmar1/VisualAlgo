let box = false;
let lastNodeId=6;
let lastEdgeId=0;
let elements = new Set([8,3,1,6,10,12]);

window.onload = function() {
// ************** Generate the tree diagram	 *****************
    let treeData = [{
        "name": 8,
        "parent": "null",
        "id": "n0",
        "children": [
            {
                "name": 3,
                "parent": 8,
                "id": "n1",
                "children": [
                    {
                        "name": 1,
                        "parent": 3,
                        "id": "n3",
                        "children": []
                    },
                    {
                        "name": 6,
                        "parent": 3,
                        "id": "n4",
                        "children": []
                    }
                ]
            },
            {
                "name": 10,
                "parent": 8,
                "id": "n2",
                "children": [
                    {
                        "name": 9,
                        "parent": 10,
                        "id": "n5",
                    },
                    {
                        "name": 12,
                        "parent": 10,
                        "id": "n6",
                    }
                ]
            }
        ]
    }];

    let margin = {top: 50, right: 0, bottom: 30, left: 380},
        width = 960 /*- margin.right - margin.left*/,
        height = 500 - margin.top - margin.bottom;
    let svgSelection;
    let tree;
    let root = treeData[0];

    function createSVGContainer(root) {
        let treeContainer = d3.select("#treeContainer");

        svgSelection = treeContainer.append("svg")
            .attr("class", "svgBody text-center").append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //create tree layout
        tree = d3.layout.tree()
            .size([height, width]);
        update(root);
    }

    createSVGContainer(treeData[0]);

    function removeSVGContainer() {
        console.log("remove");
        d3.select(".svgBody").remove();
        console.log("removed");
    }


    function update(data) {
        console.log(data);
        //Compute the tree layout
        let nodes = tree.nodes(data);
        console.log(nodes);
        let links = tree.links(nodes);
        console.log(links);
        nodes.forEach((d) => {
            d.y = d.depth * 180
        });
        console.log(nodes);
        //Enter the nodes
        let node = svgSelection.selectAll(".node")
            .data(nodes)
            .enter()
            .insert("g")
            .attr("class", "node")
            .attr("transform", (d) => {
                return "translate(" + d.x + "," + d.y + ")";
            });

        console.log(node);

        //Create Circles
        node.append("circle")
            .attr("r", 12)
            .style("fill", "#fff")
            .attr("id", (d) => d.id);


        //Add text to the circle
        node.append("text")
            .attr("y", function (d) {
                return d.children || d._children ? -18 : 18;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text((d) => {
                return d.name;
            })
            .style("fill-opacity", 1);


        //Declare lines
        let line = d3.svg.line().x((d) => {
            return d.x;
        }).y((d) => {
            return d.y
        });

        //Create links between nodes
        svgSelection.selectAll(".link")
            .data(links)
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                return line([d.source, d.target]);
            })
            .attr("id", () => `e${++lastEdgeId}`);

    }

    async function search(node, element) {
        console.log(node);
        let edge = node.id.charAt(1);
        await animateNodeEdge(node.id, edge);
        await sleep(1000);

        if (element === node.name) {
            pseudoCode(element, 0, "found");
            return node;
        }
        //if tree is empty
        if (!Array.isArray(node.children)) {
            pseudoCode(element, node.name, "notFound");
            return null;
        }

        //if element to be searched is less than node's element , move to the left
        else if (element < node.name) {
            console.log("move left");
            pseudoCode(element, node.name, "left");
            await sleep(1000);
            return search(node.children[0], element);
        }
        //if element to be searched is greater than node's element , move to the right
        else if (element > node.name) {
            console.log("move right");
            pseudoCode(element, node.name, "right");
            await sleep(1000);
            if (node.children.length > 1)
                return search(node.children[1], element);
            else
                return search(node.children[0], element);
        } else
            return node;
    }

    async function animateNodeEdge(nodeId, edgeId) {
        console.log(nodeId);
        console.log(edgeId);
        if (nodeId === "n0") {
            TweenMax.to(`#${nodeId}`, 0.5, {fill: "#ffa500", strokeWidth: 5});
        } else {
            TweenMax.to(`#e${edgeId}`, 0.5, {
                stroke: "#ffa500",
                strokeWidth: 6
            });
            TweenMax.to(`#${nodeId}`, 0.5, {fill: "#ffa500", strokeWidth: 5, delay: 0.5});
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function reset() {
        TweenMax.to("circle", 1, {fill: "#fff", strokeWidth: 3});
        TweenMax.to("path", 1, {
            fill: "none",
            stroke: "#4682B4",
            strokeWidth: 2
        });
    }

    function pseudoCode(searchElement, nodeElement, direction) {
        if (direction === "left")
            document.querySelector("#code").innerHTML = `${searchElement} is smaller than ${nodeElement}. Hence, move left`;
        if (direction === "right")
            document.querySelector("#code").innerHTML = `${searchElement} is greater than ${nodeElement}. Hence, move right`;
        if (direction === "notFound")
            document.querySelector("#code").innerHTML = `${searchElement} is not in BST`;
        if (direction === "found")
            document.querySelector("#code").innerHTML = `${searchElement} is in BST`;
        if (direction === "duplicate")
            document.querySelector("#code").innerHTML = `${searchElement} already exists`;
        if (direction === "added")
            document.querySelector("#code").innerHTML = `${searchElement} is added`;

    }

    async function insert(insertElement) {
        console.log(root);
        let newNode = {name: insertElement, parent: "", id: `n${++lastNodeId}`, children: []};
        let node = await insertNode(root, newNode);
        console.log(node);
        console.log("clear svg");
        removeSVGContainer();
        console.log("create new svg");
        lastEdgeId=0;
        createSVGContainer(node);
        pseudoCode(insertElement, 0, "added");
    }

    async function insertNode(node, newNode) {
        //if new node is less than the current node, move left
        console.log(node.name);
        let edge = node.id.charAt(1);
        //console.log(edge);
        await animateNodeEdge(node.id, edge);
        await sleep(1000);
        if (newNode.name < node.name) {
            console.log("moved left");
            pseudoCode(newNode.name, node.name, "left");

            if (!Array.isArray(node.children)) {
                newNode.parent = node;
                node.children = [newNode];
            }
            else
                await insertNode(node.children[0], newNode);
        }
        //if new node is greater than the current node, move right
        else {
            pseudoCode(newNode.name, node.name, "right");
            console.log("moved right");
            if (!Array.isArray(node.children)) {
                newNode.parent = node;
                node.children = [newNode];
            }
            else {
                if (node.children.length > 1) {
                    await insertNode(node.children[1], newNode);
                }
                else {
                    if (node.children[0].name > newNode.name) {
                        let tempChild = node.children[0];
                        console.log(node.children);
                        node.children = [];
                        node.children.push(newNode);
                        node.children.push(tempChild);
                    } else {
                        newNode.parent = node;
                        node.children.push(newNode);
                    }
                }
            }
        }
        console.log(node);
        return node;

    }

    document.querySelector("#searchSubmit").addEventListener("click", async () => {
        reset();
        console.log(root);
        let searchElement = document.querySelector("#search").value;
        let node = await search(root, Number(searchElement));
        console.log(node);
        document.querySelector("#search").value = "";

    });

    document.querySelector("#insertSubmit").addEventListener("click", async () => {
        reset();
        console.log("insert");
        let insertElement = document.querySelector("#insert").value;
        if (elements.has(Number(insertElement))) {
            console.log("duplicate value");
            pseudoCode(insertElement, 0, "duplicate");
        } else if (Number(insertElement) > 0) {
            document.querySelector("#insert").value = "";
            await insert(Number(insertElement));
        }
    });


}