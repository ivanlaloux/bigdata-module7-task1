// Let's start using ES6
// And let's organize the code following clean code concepts
// Later one we will complete a version using imports + webpack

// Isolated data array to a different file

let margin = null,
    width = null,
    height = null;

let svg = null;
let x, y = null; // scales

setupCanvasSize();
appendSvg("body");
setupXScale();
setupYScale();
appendXAxis();
appendYAxis();
appendChartBars();
appendLegend();

// 1. let's start by selecting the SVG Node
function setupCanvasSize() {
  margin = {top: 20, left: 80, bottom: 20, right: 100};
  width = 350 - margin.left - margin.right;
  height = 300 - margin.top - margin.bottom;
}

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);

}

// Mapping canvas width range to show product names on X axis
// (discrete range of values [product names])
function setupXScale() {
  x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }));
}

// Mapping canvas height range to show totalSales values on Y axis
// (linear range of values [0...maxSales])
function setupYScale() {
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });
  y = d3.scaleLinear()
    .range([0, height])
    .domain([maxSales, 0]);
}

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x));
}

function appendYAxis() {
  // Add the Y Axis
  svg.append("g")
  .call(d3.axisLeft(y));
}

function appendChartBars()
{
  // 2. Now let's select all the rectangles inside that svg
  // (right now is empty)
  var rects = svg.selectAll('rect')
    .data(totalSales);

    // Now it's time to append to the list of Rectangles we already have
    var newRects = rects.enter();

    // Let's append a new Rectangles
    // UpperCorner:
    //    Starting x position, the start from the axis
    //    Starting y position, where the product starts on the y scale
    // React width and height:
    //    width: the space assign for each entry (product) on the Y axis
    //    height: Now that we have the mapping previously done (linear)
    //           we just pass the sales and use the X axis conversion to
    //           get the right value
    newRects.append('rect')
      .attr('y', function(d, i) {
        return y(d.sales);
      })
      .attr('x', function(d, i) {
        return x(d.product) + 5;
      })
      .attr('height', function(d, i) {
        return height - y(d.sales);
      })
      .attr('width', x.bandwidth() - 5)
      .attr('style', function(d, i) {
        return 'fill:' + d.color;
      });

}

function appendLegend()
{
    var legend = svg.selectAll('.legend')
        .data(totalSales)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) { 
                return "translate(20," + i * 25 + ")"; 
            });
    legend.append('rect')
        .attr('x', width - 15)
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d, i) { return d.color;})
        .style('stroke', function(d, i) { return d.color;});

    legend.append('text')
        .attr('x', width)
        .attr('y', 7)
        .attr("dy", "0.32em")
        .text(function(d) { return d.product; });
}
