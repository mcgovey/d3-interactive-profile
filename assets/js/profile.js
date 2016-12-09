//spinner
var preloader = $('.preloader');
$(window).ready(function () {
    preloader.remove();
});


var data = d3.csv("profile.csv", function(d){
  console.log('d',d);
  var roleIDArr = [], jobLvlData = [];
  data = d.map(function (inner_d) {
    // Only get rows with experience data
    if (inner_d.Type=='Experience') {

      // Create an array of objects with only the length, experience, company, and role type
      // Check if the role ID does not exist in the array yet
      if ($.inArray(+inner_d.RoleID, roleIDArr) == -1) {
        //add the role to the array t
        roleIDArr.push(+inner_d.RoleID);
        var indivJob = {
          'Firm'      : inner_d.Firm,
          'Location'  : inner_d.Location,
          'Role'      : inner_d.Role,
          'RoleID'    : +inner_d.RoleID,
          'TimeStart' : moment(inner_d.TimeStart, "YY-MMM"),
          'TimeEnd'   : inner_d.TimeEnd ? moment(inner_d.TimeEnd, "YY-MMM") : moment()
        }

        jobLvlData.push(indivJob);
        // console.log('single data', inner_d, 'newroles', roleIDArr);
      }
    }
  });

  // experienceChart(jobLvlData);
  displayExperience(jobLvlData);
  // console.log('jobLvlData', jobLvlData);
});

function experienceChart( data ) {
  var xMin  = d3.min(data, function(c) { return c.TimeStart.toDate() });
  var xMax  = d3.max(data, function(c) { return c.TimeEnd.toDate() });
  var yMax  = d3.max(data, function(c) { return c.RoleID });

// -----------needs dynamic margins, width, and height
  var margin = {top: 20, right: 20, bottom: 50, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  //---------------------Replace this with a real color scale
  var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83'];
  var colorScale = d3.scaleOrdinal()
          .domain([0,data.length])
          .range(colors);

//--------------needs dynamic range
  var xscale = d3.scaleTime()
                .domain([xMin, xMax])
                .range([0, 960]);

//--------------needs dynamic range
  var yscale = d3.scaleBand()
                .domain(data.map(function (d) { return d.Role; }))
                .rangeRound([0, 300]);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("div#cvGannt").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xscale));
  // Add the y Axis
  svg.append("g")
      .attr("transform", "translate(40,0)")
      .call(d3.axisLeft(yscale))
    .selectAll(".tick text")
      .call(wrap, 100);//------------------replace with yscale ordinal range



      //--------needs update function on browser resize
}

//--------------wrapper for responsive chart creation
function displayExperience( data ) {
  // // Parse the date / time
  // var parseDate = d3.timeParse("%Y");

  // won't need to force into key-value, handled in csv load
  // // force types
  // function type(dataArray) {
  // 	dataArray.forEach(function(d) {
  // 		d.year = parseDate(d.year);
  // 		d.retention = +d.population;
  // 	});
  // 	return dataArray;
  // }
  // data = type(data);


  //////////////////////////////////////////////
  // Chart Config /////////////////////////////
  //////////////////////////////////////////////

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 30, left: 100},
  		width, // width gets defined below
      height = 250 - margin.top - margin.bottom;

  // Set the scales ranges
  var xScale = d3.scaleTime();
  var yScale = d3.scaleBand().rangeRound([height, 0]);//.range([height, 0]);

  // Define the axes
  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  // create a line
  // var line = d3.line();

  // Add the svg canvas
  var svg = d3.select("div#cvGannt")
      .append("svg")
  		.attr("height", height + margin.top + margin.bottom);

  var artboard = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set the domain range from the data
  xScale.domain([
		d3.min(data, function(d) { return d.TimeStart.toDate(); }),
		d3.max(data, function(d) { return d.TimeEnd.toDate(); })
	]);
  yScale.domain(data.map(function (d) { return d.Role; }));

  // // draw the line created above
  // var path = artboard.append("path").data([data])
  //   .style('fill', 'none')
  //   .style('stroke', 'steelblue')
  //   .style('stroke-width', '2px');

  // Add the X Axis
  var xAxisEl = artboard.append("g")
    .attr("transform", "translate(0," + height + ")");

  // Add the Y Axis
  // we aren't resizing height in this demo so the yAxis stays static, we don't need to call this every resize
  var yAxisEl = artboard.append("g")
    .call(yAxis);


  // call this once to draw the chart initially
  drawChart();

  //////////////////////////////////////////////
  // Drawing ///////////////////////////////////
  //////////////////////////////////////////////
  function drawChart() {
    console.log('calling all charts!');
    // reset the width
    width = parseInt(d3.select("div#cvGannt").style('width'), 10) - margin.left - margin.right;

    // set the svg dimensions
    svg.attr("width", width + margin.left + margin.right);

    // Set new range for xScale
    xScale.range([0, width]);

    // give the x axis the resized scale
    xAxis.scale(xScale);

    // draw the new xAxis
    xAxisEl.call(xAxis);

    yAxisEl.selectAll(".tick text")
          .call(wrap, 100);//------------------replace with yscale ordinal range

    // // specify new properties for the line
    // line.x(function(d) { return xScale(d.year); })
    //   .y(function(d) { return yScale(d.population); });

    // // draw the path based on the line created above
    // path.attr('d', line);
  }



  //////////////////////////////////////////////
  // Resizing //////////////////////////////////
  //////////////////////////////////////////////

  // redraw chart on resize
  APP.onResize(drawChart);
}


// Create APP container with debounce function so resize is not called excessively
var APP = (function () {

  // Debounce is a private function
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	}

  // onResize function is made public
	var me = {onResize : function(callback) {
		callback(); // optionally execute callback func imediatly

    window.addEventListener('resize', debounce(function() {
      callback();
    }, 60), false);
	}};

  // returns the me object that has all the public functions in it
	return me;
})();



// var bodyEl = document.getElementsByTagName('body')[0];
//
// // Call onResize like this
// APP.onResize(function() {
//   // this stuff will be debounced
//   bodyEl.innerHTML = 'The viewport width is: ' + window.innerWidth;
// });

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
