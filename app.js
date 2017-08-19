// Define the dimensions of the visualization. 
var width = window.innerWidth - 20,
height = window.innerHeight - 80;

// This will hold the nodes
var nodes = d3.select(".nodes")
.attr({
 width: width,
 height: height,
});

// Expand the wrapper that contains our graph to the full screen
document.getElementById("wrapper").style.width = width + "px";

// Create the SVG container for the lines of our graph.
var svg = d3.select("#lines")
.attr("width", width)
.attr("height", window.innerHeight - 40);  // keep my flags out of my header

// Load the data for the force directed graph. This requires two 
// data arrays. One array will contain the focal point (nodes), and
// one will contain all the links between the nodes.
function fetchJSON() {
fetch("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json")
.then(function(response) {
   return response.json();
 })
.then(function(json) {
   var data = json;

   // Create a force layout object and define its properties.
   var force = d3.layout.force()
     .size([width, height])
     .nodes(data.nodes)
     .links(data.links)
     .linkDistance([51])
     .charge([-60])
     .chargeDistance(height-150);

   // I had to replace adding nodes to the SVG to a div instead (took me forever to figure out)
   // I couldn't put the flags in a circle and I couldn't put a div in an SVG
   var node = d3.select(".nodes").selectAll("div")
     .data(data.nodes)
     .enter().append("div")
     .attr("class", (d) => "flag flag-" + d.code )
     .call(force.drag);

   // Create links between all the nodes.
   var link = svg.selectAll(".link")
     .data(data.links)  //this will be data.links
     .enter().append("line")
     .style("stroke", "#777");

   // Define a function that the Force graph calls once the calculations 
   // are done. We can now position links and nodes. (Replaced "end"
   // with "tick" -- much cooler and faster)
   force.on("tick", function() {
     var fudge = -10;
     node.style("top", function(d) { return (d.y + fudge) + "px"; })
         .style("left", function(d) { return (d.x + fudge) + "px"; });
     link.attr("x1", function(d) { return d.source.x; })
       .attr("y1", function(d) { return d.source.y; })
       .attr("x2", function(d) { return d.target.x; })
       .attr("y2", function(d) { return d.target.y; });
   });

   // Display the country name in a tooltip
   node.on("mouseover", function(d) {
     var mousePos = d3.mouse(document.body);
     document.getElementById("name").innerHTML = d.country;
     var tooltip = d3.select("#tooltip")
       .style("left", mousePos[0] + 5 + "px")
       .style("top", mousePos[1] - 75 + "px")
       .style("display", "block");
   });

   // Hide the tooltip
   node.on('mouseout', function(d) {
     d3.select("#tooltip").style("display", "none");
   });    

  // Everything is set up now so turn it over to force layout
  force.start();

});  
}

fetchJSON();