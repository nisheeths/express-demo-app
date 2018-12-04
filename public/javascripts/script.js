


var myJson, viewLevel = 0, viewString = 'जोन', xlabel = 'All', ylabel = "Pending case %", alertThreshold = 0.6, viewFlag = 0;
var formatPercent = d3.format(".0%");

var win = window, docm = document, em = docm.documentElement, gin = document.body;

var x_dim = win.innerWidth || em.clientWidth || gin.clientWidth;
var y_dim = win.innerHeight || em.clientHeight || gin.clientHeight;

var margin = {top: 0.2*y_dim, right: 0.25*x_dim, bottom: 0.3*y_dim, left: 0.4*x_dim},
    width = x_dim - margin.left - margin.right,
    height = y_dim - margin.top - margin.bottom;

function type(d) {
  d.frequency = +d.frequency;
  return d;
}

function depopulateDropDowns(level){
  var select = document.getElementById("s"+level);
  while(select.options.length>0){
    select.remove(0);
  }
  var el = document.createElement("option");
  el.textContent = 'All';
  el.value = 'All';
  select.appendChild(el);
}

function populateDropDowns(level, entityList){
  for(l = level; l <= 3; l++){
    depopulateDropDowns(l);                 // clean up old list before adding new list
  }
  var select = document.getElementById("s"+level);
  for(var i = 0; i < entityList.length; i++) {
      var opt = entityList[i]._id;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      el.onclick = function(d){
        console.log('Clicked');
      }
      select.appendChild(el);
      select.onchange = function(){
        console.log(this.value);        
        viewString = this.value;
        user_input.api = user_input.api + '/' + this.value;
      }
  }
}


function setViewString(level){
	switch(level){
	case 0:
    viewString = 'जोन';    
	  break;
	case 1:
	  viewString = 'परिक्षेत्र';
    	  break;
	case 2:
	  viewString = 'जनपद';
	  break;
	case 3:
	  viewString = 'थाना';
	  break;
	default:
	  viewString = 'जोन';
	}
}

function setAPIString(useCase){
  viewFlag = 0;
  switch(useCase){
    case 1:
      user_input.api = "cases";
      viewLevel = 0;
      setViewString(viewLevel);      
      ylabel = "Pending case %";
      formatPercent = d3.format(".0%");
      alertThreshold = 0.6;
      break;
    case 2:
      user_input.api = "absconders";
      viewLevel = 0;
      setViewString(viewLevel); 
      ylabel = "Arrest percentage";     
      formatPercent = d3.format(".0%");
      alertThreshold = 0.6;
      break;
    case 3:
      user_input.api = "property";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "Recovered property (Rs.)";
      formatPercent = d3.format("s");
      alertThreshold = 10000000;
      break;
    case 4:
      user_input.api = "casedelay";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "Case resolution time (days)";
      formatPercent = d3.format("s");
      alertThreshold = 90;
      break;
    case 5:
      user_input.api = "capturedelay";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "Delay in arrests (days)";
      formatPercent = d3.format("s");
      alertThreshold = 90;
      break;
    case 6:
      user_input.api = "complaints";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "Pending complaints %";
      formatPercent = d3.format(".0%");
      alertThreshold = 0.6;
      break;
    case 7:
      viewFlag = 1;                // development flag to avoid front-end errors
      user_input.api = "contribs";
      viewLevel = 0;
      viewString = 'All';
      ylabel = "Relative contribution";
      formatPercent = d3.format(".0%");
      alertThreshold = 1;
      break;
    default:
      user_input.api = "cases";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "Pending case %";
      formatPercent = d3.format(".0%");
      alertThreshold = 0.6;
    }
}

function load_data(clicked_id)
{
    setAPIString(parseInt(document.getElementById(clicked_id).value));
    console.log(parseInt(document.getElementById(clicked_id).value));
    svg.selectAll("*").remove();    
}


function drawGraph(data){

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

  x.domain(data.map(function(d) { return d._id; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("x", 260)
    .attr("y", 50)
    .style("text-anchor", "middle")
    .text(xlabel);


svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x",-250)
    .attr("y", -125)
    .attr("dy", "1.91em")
    .style("text-anchor", "middle")
    .text(ylabel);

svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d._id); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.count); })
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", function(d){
      if(d.count>alertThreshold){
        return "red";
      } else{
        return "white";
      }
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on('click', function(d){
	if(!event.detail || event.detail == 1){
          console.log(d._id);
          xlabel = d._id;
          user_input.api = user_input.api + '/' + d._id;
	  svg.selectAll("*").remove();
	}
	})
}

async function userAction (api) {
  var response = await fetch('http://srivalab.cse.iitk.ac.in:3000/'+api);
  if(response.ok){
	  myJson = await response.json(); //extract JSON from the http response
    console.log(myJson); 
    if(viewFlag==0){  
      document.getElementById('dropdown-panel').style.display = 'none' 
	    drawGraph(myJson[0]);
      setViewString(viewLevel++);
    } else if(viewFlag==1){
      svg.selectAll("*").remove();    
      document.getElementById('dropdown-panel').style.display = 'inline-table';
      drawGraph(myJson[0]);
      populateDropDowns(viewLevel, myJson[1]);
      viewLevel++;
    }
	} else{
    console.log('Resource not found');    
		setAPIString(1);
	}
}


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>"+ viewString + "</strong> <span style='color:red'>" + d._id + "</span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

var user_input = {
	apistring: "cases",
	get api() {
		return this.apistring;
	},
	set api(choice) {
		this.apistring = choice;
		userAction(choice);
	}
}


userAction(user_input.api);
