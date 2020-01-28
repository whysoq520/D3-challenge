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
    // Step 1: Parse Data/Cast as numbers  
    //proverty% vs lack of healthcare%, 
    //age vs smoking%, 
    //household income vs Obesse% 
    // ==============================
      // console.log(data)
  // formating data
  data.forEach(function (data) {
    data.poverty =+data.poverty;
    data.healthcare = + data.healthcare;
    //console.log(data.poverty);
    //console.log(data.healthcare);
  });
  // creating scale functions
  var xScalepoverty = d3.scaleLinear()
                        .domain(d3.extent(data, d=> d.poverty))
                        .range([0, width]);

  var yScalehealthcare = d3.scaleLinear()
                           .domain(d3.extent(data, d=> d.healthcare))
                           .range([height, 0]);

  // creating axis functions 
  var bottomAxispoverty = d3.axisBottom(xScalepoverty);
    //.tickFormat(d3.timeFormat("%d-%b-%Y"));
    
  var leftAxishealthcare = d3.axisLeft(yScalehealthcare);

  // set xscale to the bottom of the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxispoverty);

 // set yscale to the left of the chart
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("blue", true)
    .call(leftAxishealthcare);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScalepoverty(d.poverty))
    .attr("cy", d => yScalehealthcare(d.healthcare))
    .attr("r", "18")
    .attr("fill", "green")
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
                    .attr("fill", "red");

    // Step 6: Initialize tool tip
    // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.abbr}`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("click", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });

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
      .text("Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  }); 
};

makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
