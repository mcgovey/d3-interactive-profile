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

  experienceChart(jobLvlData);
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
