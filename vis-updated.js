// Start by loading the map data and the state statistics.  When those are done, call the "ready" function.
Promise.all([
    //d3.json("https://ils.unc.edu/~gotz/courses/data/us-states.json"),
    //d3.csv("https://ils.unc.edu/~gotz/courses/data/states.csv")
    d3.json("us-states.json"),
    d3.csv("statesformap.csv"),
    d3.csv("human_trafficking.csv")
])
.then(ready);


// The callback which renders the page after the data has been loaded.
function ready(data) {
    // Render the map.
    renderMap(data, "#mapsvg_pr", [0, 2500], "Cases_per10M");
}


// Helper function which, given the entire stats data structure, extracts the requested rate for the requested state
function getrate(stats, state_name, rate_type) {
    for (var i=0; i<stats.length; i++) {
        if (stats[i].State === state_name) {
            return stats[i][rate_type];
        }
    }
}

// Renders a map within the DOM element specified by svg_id.
function renderMap(data, svg_id, val_range, rate_type) {

    let us = data[0];
    let stats = data[1];
    let projection = d3.geoAlbersUsa()
        .translate([1000 / 2, 600 / 2]) // translate to center of screen
        .scale([1000]); // scale things down so see entire US

    // Define path generator
    let path = d3.geoPath().projection(projection);

    let svg = d3.select(svg_id);

    //https://codepen.io/tha-Sup3rN0va/full/jpYKKV
    let colormap = d3.scaleSequentialLog().domain([1, 400]).interpolator(d3.interpolateYlGnBu);

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(us.features)
        .enter().append("path")
        .attr("fill", function(d) { let rate=getrate(stats, d.properties.name, rate_type); return colormap(rate);})
        .attr("d", path)
        .on('click', selected)


    //Get data for tool tip from statesformap.csv
    var map_data = data[1].filter(function(d) {return d.State && d.SumOfTotal_offenses ;});
    //console.log (map_data)

    map_data.forEach(function(d) {
        d.State = d.State;
        d.SumOfTotal_offenses = +d.SumOfTotal_offenses;
    });
// Define the tool tip to use for mouseovers.
    let tool_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0])
        .html(function (d) {
            let html = "<table>"
                + "<tr>State Name: </td>" + d.State +"</td></tr>"
                + "<tr><th>2014-2019 Total Offenses:</th><td>" + d.SumOfTotal_offenses +"</td></tr>"
            return html
        });
    svg.call(tool_tip)


    // Add mouseover to the map
    d3.select("#mapdiv")
        // .append("path")
        .attr("class", "states")
        //.selectAll("path")
        .data(map_data)
        // .attr("d", path)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)



    //create array for selected states
    let selectedStates=[];


    function selected(d) {
        var selectedCategory = "Race"

    // console.log(selectedCategory)


        if (!selectedStates.includes(d.properties.name)) {

                d3.select(this).classed('selected', true).raise();
                selectedStates.push(d.properties.name);
                updateGraphs(selectedStates, selectedCategory)
                //console.log("Added state svg");

        }
            //to clear all: d3.select('.selected').classed('selected', false);
        //unselect states when clicked on again
        else {
            d3.select(this).classed('selected', false);
            var index = selectedStates.indexOf(d.properties.name);
            selectedStates.splice(index, 1);
            updateGraphs(selectedStates, selectedCategory);
            //console.log("Removed state svg");

        }
}

function updateGraphs(selectedStates, selectedCategory){

    //filter data based on category and selected states
    currentState = selectedStates[selectedStates.length - 1];
    //currentCategory = selectedCategory


    statedata = data[2].filter(function(d) {return d.category == selectedCategory && d.locationdesc == currentState ;},);
    //console.log ("state data for selected states: ")
    //console.log(statedata)

    var margin_x = 20;
    var margin_y = 20;

    var margin = {top: 20, right: 120, bottom: 30, left: 50},
    width = 480 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]).domain([2014, 2019]);
    var y = d3.scaleLinear().range([height, 0]).domain([0, 400]);

    //the enter selection

    var svg = d3.select("#state-graphs")
        .append("svg")
        .attr("id", currentState)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    //the exit selection

    d3.select("#state-graphs")
        .selectAll("svg")
        .data(selectedStates)
        .exit()
        .remove();

    let g = svg.append('g')
        .attr("transform", "translate("+margin_x+", "+margin_y+")");


    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //X Axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(-20," + (180) + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(6));

    g.append("text")
        .attr("class", "label")
        .attr("x", 250 / 2)
        // .attr("y", height)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(currentState);

    // define the line
    var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.avg_data_value); });


    // Add the valueline path
 //   svg.append("path")
 //       .data([statedata])
      //  .attr("class", "line")
    //    .attr("d", valueline)
  //      .attr("id","current_factor");

    // Adds the svg canvas
    d3.select("#state-graphs")
        .select('body')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.category_value;})
        .entries(statedata);

    // set the colour scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {
        console.log(d);
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("d", valueline(d.values))
            .attr("id","current_factor");

        var legend = svg.selectAll('g.legend')
            .data(statedata)
            .enter()
            .append('g')
            .attr('class', 'legend');

        legend.append('rect')
            .attr('x', width + margin.right - 20 - 10)
            .attr('y', function (d, i) {
                return i * 20;
            })
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function (d) {
                return color(d.category_value);
            });

        legend.append('text')
            .attr('x', width + margin.right - 50 - 8)
            .attr('y', function (d, i) {
                return (i * 20) + 9;
            })
            .text(function (d, i) {
                return d.category_value;
            });


    });


    // Define the div for the tooltip
    const div = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);


    // Add the scatterplot
    svg
        .selectAll('dot')
        .data(statedata)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.avg_data_value))
        .attr('stroke-width', '20px')
        .attr('stroke', 'rgba(0,0,0,0)')
        .style('cursor', 'pointer')
        .attr("id","current_dots")
        .on('mouseover', d => {
            div
                .transition()
                .duration(200)
                .style('opacity', 0.9);
            div
                .html(d.year + '<br/>' + d.avg_data_value)
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', () => {
            div
                .transition()
                .duration(500)
                .style('opacity', 0);
        });

    d3.select("#lineChart-radioInputs").style("display", "block");

    d3.selectAll(("input[name='btn']")).on("change", function() {
        //d3.selectAll("#current_factor").remove();
        //d3.selectAll("#current_dots").remove();
        selectedCategory = this.value
        updateLines(selectedStates, selectedCategory)
        //console.log("selectedCategory = " + selectedCategory)
        //console.log("selectedStates = " +selectedStates);
    });

    function updateLines(selectedStates, selectedCategory){

        d3.selectAll("#current_factor").remove();
        d3.selectAll("#current_dots").remove();
        let j = 0;
        while (j< selectedStates.length) {


        currentState = selectedStates[j];
        console.log(currentState);

        statedata = data[2].filter(function(d) {return d.category == selectedCategory && d.locationdesc == currentState;});

        var valueline = d3.line()
        .x(function(d) {return x(d.year); })
        .y(function(d) {return y(d.avg_data_value); });

        var dataNest = d3.nest()
        .key(function(d) { return d.category_value;})
        .entries(statedata);
            console.log(statedata); //is ok here

        legendSpace = width/dataNest.length; // spacing for the legend

        dataNest.forEach(function(d,i) { console.log(d);
            //svg=document.getElementById(currentState);
            d3.select("#"+ currentState)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
                .append("path")
                .attr("class", "line")
                .style("stroke", function() { // Add the colours dynamically
                    return d.color = color(d.key); })
                .attr("d", valueline(d.values))
                .attr("id","current_factor");

            // Add the Legend
            var legend = svg.selectAll('g.legend')
            .data(statedata)
            .enter()
            .append('g')
            .attr('class', 'legend');

            legend.append('rect')
                .attr('x', width + margin.right - 110 - 20)
                .attr('y', function (d, i) {
                    return i * 20;
                })
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', function (d) {
                    return color(d.category_value);
                });

            legend.append('text')
                .attr('x', width + margin.right - 50 - 8)
                .attr('y', function (d, i) {
                    return (i * 20) + 9;
                })
                .text(function (d, i) {
                    return d.category_value;
                });

        });

            // Define the div for the tooltip
            const div = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Add the scatterplot
        d3.select("#"+ currentState)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .selectAll('dot')
            .data(statedata)
            .enter()
            .append('circle')
            .attr('r', 3)
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d.avg_data_value))
            .attr('stroke-width', '20px')
            .attr('stroke', 'rgba(0,0,0,0)')
            .style('cursor', 'pointer')
            .attr("id","current_dots")
            .on('mouseover', d => {
                div
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);
                div
                    .html(d.year + '<br/>' + d.avg_data_value)
                    .style('left', d3.event.pageX + 'px')
                    .style('top', d3.event.pageY - 28 + 'px');
            })
            .on('mouseout', () => {
                div
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            });
            j++;
        }

    }
}

}

