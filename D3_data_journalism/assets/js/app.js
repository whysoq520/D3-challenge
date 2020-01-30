// @TODO: YOUR CODE HERE!


function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
var svgArea = d3.select("body").select("svg");

if (!svgArea.empty()) {
  svgArea.remove();
}

  // svg params
var svgHeight = window.innerHeight;
var svgWidth = window.innerWidth;


var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
 var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
 var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Import Data
 d3.csv("./assets/data/data.csv").then(function(data) {
      // console.log(data)
  // formating data
  data.forEach(function (d) {
    d.poverty =+d.poverty;
    d.healthcare = + d.healthcare;
    d.abbr = + d.abbr;
    //console.log(d.poverty);
    //console.log(data.healthcare);
    //console.log(d.abbr);
  });
  // creating scale functions
  var xScalepoverty = d3.scaleLinear()
                        .domain(d3.extent(data, d=> d.poverty))
                        .range([0, width]);
  // var xScaleAge = d3.scaleLinear()
  //                       .domain(d3.extent(data, d=> d.age))
  //                       .range([0, width]);                      

  var yScalehealthcare = d3.scaleLinear()
                           .domain(d3.extent(data, d=> d.healthcare))
                           .range([height, 0]);
  // var yScaleSmoke = d3.scaleLinear()
  //                     .domain(d3.extent(data, d=> d.smoke))
  //                     .range([height, 0]);                         

  // creating axis functions 
  var bottomAxispoverty = d3.axisBottom(xScalepoverty);
  //var bottomAxisAge = d3.axisBottom(xScaleAge);
  var leftAxishealthcare = d3.axisLeft(yScalehealthcare);
  //var leftAxisSmoke = d3.axisLeft(yScaleSmoke);

  // set xscale to the bottom of the chart
  chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxispoverty);
  // chartGroup.append("g")
  //           .attr("transform", `translate(0, ${height})`)
  //           .call(bottomAxisAge);

 // set yscale to the left of the chart
  chartGroup.append("g")
    // Define the color of the axis text
            .classed("blue", true)
            .call(leftAxishealthcare);

  // chartGroup.append("g")
  //           .classed("blue", true)
  //           .call(leftAxisSmoke);          

 var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScalepoverty(d.poverty))
    .attr("cy", d => yScalehealthcare(d.healthcare))
    .attr("r", "18")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    //adding text element
    var text = chartGroup.selectAll("text")
                  .data(data)
                  .enter()
                  .append("text");
    // adding the text attributes
    var textLabels = text
                    .attr("x", d => xScalepoverty(d.poverty))
                    .attr("y", d => yScalehealthcare(d.healthcare))
                    .text(d => d.abbr)
                    .attr("font-family", "sans-serif")
                    .attr("text-anchor", "middle")
                    .attr("font-size", "15px")
                    .attr("fill", "blue");

    //Initialize tool tip
   // ==============================
   // Step 1: Append a div to the body to create tooltips, assign it a class
  // =======================================================
  var toolTip = d3.select("body").append("div")
  .attr("class", "tooltip");

// Step 2: Add an onmouseover event to display a tooltip
// ========================================================
circlesGroup.on("mouseover", function(d) {
  toolTip.style("display", "block");
  toolTip.html("hi")
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY + "px");
})
  // Step 3: Add an onmouseout event to make the tooltip invisible
  .on("mouseout", function() {
    toolTip.style("display", "none");
  });
    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Risk of Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("<strong> Poverty (%)</strong>");
  }).catch(function(error) {
    console.log(error);
  }); 
};

makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);