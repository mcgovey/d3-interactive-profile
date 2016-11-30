//spinner
var preloader = $('.preloader');
$(window).ready(function () {
    preloader.remove();
});


var data = d3.csv("resume.csv", function(d){
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

  var xscale = d3.scaleTime()
                .domain([xMin, xMax])
                .range([0, 960]);

  var canvas = d3.select('#wrapper')
					.append('svg')
					.attr({'width':900,'height':550});
}
