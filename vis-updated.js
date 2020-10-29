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
    renderMap(data, "#mapsvg_pr", [0, 0.01, 0.02, 0.37], "Cases_per10M");
}


// Helper function which, given the entire stats data structure, extracts the requested rate for the requested state
function getrate(stats, state_name, rate_type) {
    for (var i=0; i<stats.length; i++) {
        if (stats[i].State === state_name) {
            //console.log(state_name);
            return stats[i][rate_type];
        }
    }
}

// Renders a map within the DOM element specified by svg_id.
function renderMap(data, svg_id, val_range, rate_type) {
    //console.log(data);

    let us = data[0];
    let stats = data[1];
    let projection = d3.geoAlbersUsa()
        .translate([1000 / 2, 600 / 2]) // translate to center of screen
        .scale([1000]); // scale things down so see entire US

    // Define path generator
    let path = d3.geoPath().projection(projection);

    let svg = d3.select(svg_id);

    //https://www.w3schools.com/colors/colors_picker.asp
    //let colormap = d3.scaleLinear().domain(val_range).range(["lightblue", "linen", "maroon"]);
    //let colormapSelected = d3.scaleLinear().domain(val_range).range(["#ffe6e6", "#ff8080", "#800000", "#330000"]);
    let colormap = d3.scaleSequentialLog().domain([1, 400]).interpolator(d3.interpolateYlGnBu);
//https://codepen.io/tha-Sup3rN0va/full/jpYKKV

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(us.features)
        .enter().append("path")
        .attr("fill", function(d) { let rate=getrate(stats, d.properties.name, rate_type); return colormap(rate);})
        .attr("d", path)
        .on('click', selected);
    
        //create array for selected states
    let selectedStates=[];
    function selected(d) {
        if(!selectedStates.includes(d.properties.name)) {
            d3.select(this).classed('selected', true).raise();
            selectedStates.push(d.properties.name);
        }

        //to clear all: d3.select('.selected').classed('selected', false);
        //unselect states when clicked on again
        else {
            d3.select(this).classed('selected', false);
            var index=selectedStates.indexOf(d.properties.name);
            selectedStates.splice(index, 1);
        }
        updateGraphs(selectedStates);
    }
    //STATE DETAILS
    // var width = 350;
    // var height = 200;
    var margin_x = 20;
    var margin_y = 20;

    function updateGraphs(selectedStates) {
        //get the value of the correct radio button
        var button = document.getElementById("Age-Group");
        selectedCategory = button.getAttribute("value");
        //filter data based on category and selected states
        currentState = selectedStates[selectedStates.length - 1];
        statedata = data[2].filter(function(d) {return d.category == selectedCategory && d.locationdesc == currentState && d.category_value =="Adult";});   
        /*
            var height = 500;
            var width = 500;
            var margin = 40;

            var x = d3.scaleLinear()
                .domain([2014, 2019])
                .range([margin, width - margin]);

            var y = d3.scaleLinear()
                .domain([400, 0])
                .range([margin, height - margin]);

            let g = svgs.append('g')
            .attr("transform", "translate("+margin_x+", "+margin_y+")");

            // Build axes and labels

            svgs.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (margin) + ",0)")
                .call(d3.axisLeft(y));
    */

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 480 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
        
        // set the ranges
        var x = d3.scaleLinear().range([0, width]).domain([2014, 2019]);;
        var y = d3.scaleLinear().range([height, 0]).domain([0, 400]);;
        
        //the enter selection
        
        var svg = d3.select("#state-graphs")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .attr("id", currentState);
            console.log(currentState);
        //the exit selection
        d3.select("#state-graphs")
            .selectAll("svg")
            .data(selectedStates)
            .exit()
            .remove();

        statedata.forEach(function(d) {
            d.date = d.year;
            d.close = +d.avg_data_value;
        });

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

        // Add state name to each rectangle
        g.append("text")
            .attr("class", "label")
            .attr("x", 250 / 2)
            // .attr("y", height)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text(currentState);

        g.append("text")
            .attr("class", "axis-label")
            .attr("y", 210)
            .attr("x", 250 / 2)
            .style("text-anchor", "middle")
            .text("Year");
            
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("class", "axis-label")
            .attr("y", -60)
            .attr("x", 0)
            .style("text-anchor", "middle")
            .text("Number of Offenses Per 10 Million People");

        // define the line
        var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

        // Add the valueline path
        svg.append("path")
            .data([statedata])
            .attr("class", "line")
            .attr("d", valueline);  
    }
}
