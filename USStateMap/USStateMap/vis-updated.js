// Start by loading the map data and the state statistics.  When those are done, call the "ready" function.
Promise.all([
    //d3.json("https://ils.unc.edu/~gotz/courses/data/us-states.json"),
    //d3.csv("https://ils.unc.edu/~gotz/courses/data/states.csv")
    d3.json("us-states.json"),
    d3.csv("statesformap.csv")
])
.then(ready);

// The callback which renders the page after the data has been loaded.
function ready(data) {
    // Render the map.
    renderMap(data, "#mapsvg_pr", [0, 0.01, 0.02, 0.37], "Larger_Percentage");
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
    let colormap = d3.scaleLinear().domain(val_range).range(["#e6f0ff", "#80b3ff", "#0066ff", "#19194d"]);

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
        if(!selectedStates.includes(this)){
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
    function updateGraphs(selectedStates) {
        var width = 350;
        var height = 200;
        var margin_x = 20;
        var margin_y = 20;

        //add an svg for each selected state
        var svgs = d3.select("#stateGraphs")
            .selectAll("svg")
            .data(selectedStates)
            .enter()
            .append('svg')
            .attr("width", width)
            .attr("height", height);
            //remove svgs for unselected states
            d3.select("#stateGraphs")
                .selectAll("svg")
                .data(selectedStates)
                .exit()
                .remove();

        let g = svgs.append('g')
        .attr("transform", "translate("+margin_x+", "+margin_y+")");
        
        //add a rectangle as chart background
        g.append("rect")
            .attr("class", "plotbg")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height);
        //currently there is no text
        g.append("text")
            .attr("class", "label")
            .attr("x", 0.5*width)
            .attr("y", height)
            .attr("dy", "1em")
            .attr("text-anchor", "middle");
    }
    
}
