


var myJson, viewLevel = 0, listIdx = [0], viewString = 'ज़ोन', xlabel = 'समस्त', ylabel = " लंबित विवेचनायें %", alertThreshold = 60, viewFlag = 0;
var formatPercent = d3.format("d");

var x_dim = document.getElementById("drawbox").offsetWidth;
var y_dim = document.getElementById("drawbox").offsetHeight;

var fromControl = document.querySelector('#from');
var toControl = document.querySelector('#to');
var thresholdControl = document.querySelector('#thresh-update');

var margin = { top: 0.1 * y_dim, right: 0.1 * x_dim, bottom: 0.3 * y_dim, left: 0.15 * x_dim },
  width = x_dim - margin.left - margin.right,
  height = y_dim - margin.top - margin.bottom;

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function logoutUser(){
  window.location.replace('http://srivalab.cse.iitk.ac.in:3000/logout');
}

function depopulateDropDowns(level) {
  var select = document.getElementById("s" + level);
  while (select.options.length > 0) {
    select.remove(0);
  }
  var el = document.createElement("option");
  el.textContent = 'All';
  el.value = 'All';
  select.appendChild(el);
}

function populateDropDowns(level, entityList) {
  level = level - 1;
  for (l = level; l <= 3; l++) {
    depopulateDropDowns(l);                 // clean up old list before adding new list
  }
  var select = document.getElementById("s" + level);
  for (var i = 0; i < entityList.length; i++) {
    var opt = entityList[i]._id;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    el.onclick = function (d) {
      console.log('Clicked');
    }
    select.appendChild(el);
  }
}

function depopulateCrimeHeadDropdown() {
  var select = document.getElementById("heads");
  while (select.options.length > 0) {
    select.remove(0);
  }
  var el = document.createElement("option");
  el.textContent = 'All';
  el.value = 'All';
  select.appendChild(el);
}


function populateCrimeHeadDropDown(data) {
  var select = document.getElementById("heads");
  var list = data.map(function (d) { return d._id });
  for (l in list) {
    var el = document.createElement("option");
    el.textContent = list[l];
    el.value = list[l];
    select.appendChild(el);
  }
}

function dropdownUI(level) {  
  var select = document.getElementById("s" + (level-1));
  select.onchange = function () {
    var val = this.value;
    viewString = val;
    xlabel = val;
    var newLevel = Number(this.id[1]);
    var apiSet = user_input.api.split('/');
    console.log(apiSet);
    apiSet = apiSet.slice(0, newLevel + 1);
    var tempApiString = [];
    for (a in apiSet) {
      tempApiString = tempApiString + apiSet[a] + '/';
    }
    console.log(tempApiString);
    user_input.api = tempApiString + val;
  }
}


function dropdownNonLinearUI(clicked_id) {
  console.log(clicked_id);
  var select = document.getElementById(clicked_id);
  select.onchange = function () {
    var val = this.value;
    viewString = val;
    xlabel = val;
    var newLevel = Number(this.id[1]);
    for (l = newLevel+1; l <= 3; l++) {
      depopulateDropDowns(l);                 // clean up old list before adding new list
    }
    var apiSet = user_input.api.split('/');
    console.log(apiSet);
    apiSet = apiSet.slice(0, newLevel + 1);
    var tempApiString = [];
    for (a in apiSet) {
      tempApiString = tempApiString + apiSet[a] + '/';
    }
    console.log(tempApiString);
    user_input.api = tempApiString + val;  
    //userAction(user_input.api);      
  }
}


function setViewString(level) {
  switch (level) {
    case 0:
      viewString = 'ज़ोन';
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
      viewString = 'ज़ोन';
  }
}

function setAPIString(useCase) {
  viewFlag = 0;
  xlabel = 'समस्त';
  var threshCases = [1, 2, 4, 5, 6];
  if (threshCases.includes(useCase)) {
    document.getElementById("threshUIdisplay").style.display = '';
    document.getElementById("threshUIbutton").style.display = '';
  } else {
    document.getElementById("threshUIdisplay").style.display = 'none';
    document.getElementById("threshUIbutton").style.display = 'none';
  }
  switch (useCase) {
    case 1:
      user_input.api = "cases";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "लंबित विवेचनाएं %";
      formatPercent = d3.format("d");
      alertThreshold = 60;
      document.getElementById("units").textContent = "%";
      break;
    case 2:
      user_input.api = "absconders";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "वांछित अपराधी %";
      formatPercent = d3.format("d");
      alertThreshold = 50;
      document.getElementById("units").textContent = "%";
      break;
    case 3:
      user_input.api = "property";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "संपत्ति बरामदगी (लाख रुपये)";
      formatPercent = d3.format("s");
      alertThreshold = 10000000;
      document.getElementById("units").textContent = "लाख रे";
      break;
    case 4:
      user_input.api = "casedelay";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "विवेचना निस्तारण औसत समय (दिन)";
      formatPercent = d3.format("d");
      alertThreshold = 90;
      document.getElementById("units").textContent = "दिन";
      break;
    case 5:
      user_input.api = "capturedelay";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "गिरफ़्तारी में औसत समय (दिन)";
      formatPercent = d3.format("d");
      alertThreshold = 30;
      document.getElementById("units").textContent = "दिन";
      break;
    case 6:
      user_input.api = "complaints";
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "लंबित शिकायतें %";
      formatPercent = d3.format("d");
      alertThreshold = 60;
      document.getElementById("units").textContent = "%";
      break;
    case 7:
      viewFlag = 1;                // development flag to avoid front-end errors
      user_input.api = "contribs";
      viewLevel = 0;
      viewString = 'समस्त';
      ylabel = "तुलनात्मक अंश %";
      formatPercent = d3.format("d");
      alertThreshold = 80;
      document.getElementById("units").textContent = "%";
      break;
    case 8:
      viewFlag = 2;                // development flag to avoid front-end errors
      user_input.api = "timeseries";
      viewLevel = 0;
      viewString = 'समस्त';
      ylabel = "दाखिल विवेचनाएं";
      formatPercent = d3.format("d");
      alertThreshold = 100;
      document.getElementById("units").textContent = "संख्या";
      break;
    default:
      user_input.api = "cases";
      viewFlag = -1;
      viewLevel = 0;
      setViewString(viewLevel);
      ylabel = "लंबित विवेचनाएं %";
      formatPercent = d3.format("d");
      alertThreshold = 60;
      document.getElementById("units").textContent = "%";
  }

  document.getElementById("thresh-update").value = alertThreshold;
}

function setNewDate() {
  svg.selectAll("*").remove();  
  userAction(user_input.api);
}

function setAlertThreshold() {
  alertThreshold = Number(thresholdControl.value);
  svg.selectAll("*").remove();  
  userAction(user_input.api);
}

function getSelectedHeads() {
  var select = document.querySelector("#heads");
  var list = [...select.options].filter(option => option.selected).map(option => option.value);
  // hacking the crime heads list for now
  var heads = ["Rioting", "Housebreaking", "Dacoity", "Loot", "Murder", "Dowry Murder", "Rape", "Kidnapping for ransom", "Robbery", "Molestation", "Gambling", "Corruption", "Narcotics", "Tax evasion", "Illegal arms", "Unlawful Activities", "Cow slaughter", "SC/ST atrocities", "Cybercrime", "POCSO", "Encounters", "Anti-social activity"];
  listIdx = [];
  for (l in list) {
    listIdx.push(heads.indexOf(list[l]));
  }  
}

function load_data(clicked_id) {
  viewLevel = 1;
  setAPIString(parseInt(document.getElementById(clicked_id).value));
  console.log(parseInt(document.getElementById(clicked_id).value));
  svg.selectAll("*").remove();
}
/*
var secret = prompt("Please enter the passcode", "passcode");

while (secret.hashCode() !==
  -2079557215) {
  prompt("Please enter the passcode");
}
*/

function setupLineAxes(data, list) {
  console.log('hello');
  svg.selectAll("*").remove();
  var arr = [];
  for (l in list) {
    arr.push(data[list[l]]);
  }
  temp = arr.map(function (d) { return d.count });
  tvals = [];
  for (t in temp) {
    tvals.push(Math.max(...temp[t]));
  }
  maxval = Math.max(...tvals);

  newdata = [];
  for (t in data[0].ticks) {
    newdata.push({ _id: data[0].ticks[t], count: data[0].count[t] });
  }

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

  x.domain(newdata.map(function (d) { return d._id; }));
  y.domain([0, maxval]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)")
    .append("text")
    .attr("x", 0.5 * width)
    .attr("y", 0.15 * height)
    .style("text-anchor", "middle")
    .text(xlabel);


  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -0.2 * width)
    .attr("y", -0.3 * height)
    .attr("dy", "1.91em")
    .style("text-anchor", "middle")
    .text(ylabel);


}


function drawGraph(data) {

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

  x.domain(data.map(function (d) { return d._id; }));
  y.domain([0, d3.max(data, function (d) { return d.count; })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)")
    .append("text")
    .attr("x", 0.5 * width)
    .attr("y", -0.8 * height)
    .style("text-anchor", "middle")
    .text(xlabel);


  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -0.2 * width)
    .attr("y", -0.3 * height)
    .attr("dy", "1.91em")
    .style("text-anchor", "middle")
    .text(ylabel);

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d._id); })
    .attr("width", x.rangeBand())
    .attr("y", function (d) { return y(d.count); })
    .attr("height", function (d) { return height - y(d.count); })
    .attr("fill", function (d) {
      if (d.count > alertThreshold) {
        return "red";
      } else {
        return "#0375B4";
      }
    })
    .on('mouseover', bartip.show)
    .on('mouseout', bartip.hide)
    .on('click', function (d) {
      if (!event.detail || event.detail == 1) {
        console.log(d._id);
        xlabel = d._id;
        if (viewFlag == 0) {
          if (viewLevel < 4) {
            user_input.api = user_input.api + '/' + d._id;
           // viewLevel++;
            svg.selectAll("*").remove();
          } else {
            console.log('nothing here');
            alert('Nothing deeper');
          }
        } else if (viewLevel < 4) {
          user_input.api = user_input.api + '/' + d._id;
          //viewLevel++;
          svg.selectAll("*").remove();
        } else {
          console.log('nothing here');
          alert('Nothing deeper');
        }
      }
    })
}


function drawLine(data) {

  // reformat data input to make it look like the others
  newdata = [];
  for (t in data.ticks) {
    newdata.push({ ticks: data.ticks[t], count: data.count[t], _id: data._id });
  }

  var yVals = newdata.map(function (d) { return y(d.count) });
  /*
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(0);
  
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);
  
    x.domain(newdata.map(function (d) { return d._id; }));
    y.domain([0, d3.max(newdata, function (d) { return d.count; })]);
  */
  var lineGen = d3.svg.line()
    .x(function (d) {
      return x(d.ticks);
    })
    .y(function (d) {
      return y(d.count);
    })
    .interpolate("basis");


  var line = svg.append("path")
    .attr('d', lineGen(newdata))
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  line.data(newdata).on('mouseover', linetip.show).on('mouseout', linetip.hide);

}

async function userAction(api) {
  var dateAPIString = '/' + fromControl.value.slice(0, 4) + '/' + fromControl.value.slice(5) + '/' + toControl.value.slice(0, 4) + '/' + toControl.value.slice(5);  
  var response = await fetch('http://srivalab.cse.iitk.ac.in:3000/' + api + dateAPIString);  
  viewLevel = api.split('/').length;
  if (response.ok) {
    myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);
    if (viewFlag == 0) {
      document.getElementById('dropdown-panel').style.display = 'none'
      drawGraph(myJson[0]);
      setViewString(viewLevel-1);
    } else if (viewFlag == 1) {
      svg.selectAll("*").remove();
      document.getElementById('dropdown-panel').style.display = 'inline-table';
      document.getElementById('headtab').style.display = 'none';
      drawGraph(myJson[0]);
      populateDropDowns(viewLevel, myJson[1]);
      dropdownUI(viewLevel);
      viewLevel++;
    } else if (viewFlag == 2) {
      svg.selectAll("*").remove();
      document.getElementById('dropdown-panel').style.display = 'inline-table';
      document.getElementById('headtab').style.display = 'inline-table';
      depopulateCrimeHeadDropdown();
      populateCrimeHeadDropDown(myJson[0]);
      setupLineAxes(myJson[0], listIdx);
      for (li in listIdx) {
        drawLine(myJson[0][listIdx[li]]);
      }
      populateDropDowns(viewLevel, myJson[1]);
      dropdownUI(viewLevel);
      viewLevel++;
    }
  } else {
    console.log(response);
    // svg.selectAll("*").remove();
    // setAPIString(1);
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

var bartip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>" + viewString + "</strong> <span style='color:black'>" + d._id + "</span> <br> <strong>" + "मूल्य" + "</strong> <span style='color:black'>" + d.count + "</span>";
  })

var linetip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-1, 0])
  .html(function (d) {
    return d._id;
  })


var svg = d3.select("#drawbox").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(bartip);
svg.call(linetip);

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
