// // @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Xscale Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]-2) ,
      d3.max(censusData, d => d[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;

}


// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}




// Initial Yscale Params
var chosenYAxis = "healthcare";

// function used for updating Y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]-2) ,
      d3.max(censusData, d => d[chosenYAxis])
    ])
    .range([height, 0]);

  return yLinearScale;

}
// function used for updating y-Axis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var LeftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(LeftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to new circles by xAxis
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
};




// // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "poverty:";
  }
  else {
    var label = "age";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;

};  

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.abbr = data.abbr;
    data.age = + data.age;
    data.smokes = + data.smokes;
    //console.log(data.abbr);
    //console.log(data.poverty);
    //console.log(data.smokes)
    //console.log(data.age)
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  

  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis);

//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(censusData, d => d.healthcare)])
//     .range([height, 0]);
    

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "orange")
    .attr("opacity", ".5");

  // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var PovertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var AgeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

  // create group for 2 y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel =ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Risk of Healthcare (%)");

  var smokesLabel = ylabelsGroup.append("text")
   .attr("y", 0 - margin.left)
   .attr("x", 0 - (height / 2))
   .attr("value", "smokes") // value to grab for event listener
   .attr("dy", "1em")
   .classed("axis-text", true)
   .text("Smoke");



  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  //var circlesGroupY = updateToolTip(chosenYAxis, circlesGroupY);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          AgeLabel
            .classed("active", true)
            .classed("inactive", false);
          PovertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          PovertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

         console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        //circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    
    });

}).catch(function(error) {
  console.log(error);
});





