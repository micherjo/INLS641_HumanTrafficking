/* ========================================================================
 * INLS 641 - Human Trafficking FBI Data Visualization
 * Laura Haller
 * Michelle Erin Johnson
 * Stacy MacDonald
 * Mara Negrut
 * Copyright 2020
 * ======================================================================== */


/**
 * Takes an iterable of promises as input; returns a single Promise that is array of the inputs
 * @param none
 * @return Promise
 */
Promise.all([
    d3.json("data/us-states.json"),
    d3.csv("data/statesformap.csv"),
    d3.csv("data/human_trafficking.csv")
])
    .then(ready);

//Global variable for array of selected states
let selectedStates = [];



/**
 * Specifies the renderMap function to run after the document is loaded
 * @return {boolean} Ready to render
 */
function ready(data) {
    // Render the map.
    renderMap(data, "#mapsvg_pr", [0, 2500], "Cases_per10M");
}


/**
 * Extracts overall number of cases for the requested state
 * @param {array} stats array of data from us-states.json
 * @param {string} stateName name of the state
 * @param {string} rateType Name of rate variable you want to return
 * @return {number} Overall number of cases by state
 */
function getRate(stats, stateName, rateType) {
    for (var i = 0; i < stats.length; i++) {
        if (stats[i].State === stateName) {
            return stats[i][rateType]
        }
    }
}


/**
 * Renders the country map
 * @param {array} data array of data from us-states.json
 * @param {string} svgID SVG to place the map
 * @param {array} valueRange  Array of range of values
 * @param {string} rateType Attribute used to render map shading (i.e. Cases per 10M)
 */
function renderMap(data, svgID, valueRange, rateType) {
    let us = data[0];
    let stats = data[1];
    let projection = d3.geoAlbersUsa()
        .translate([1000 / 2, 600 / 2]) // Translate to center of screen
        .scale([1000]); // scale things down so see entire US

    // Define path generator
    let path = d3.geoPath().projection(projection);
    let svg = d3.select(svgID);
    let colorMap = d3.scaleSequentialLog().domain([1, 400]).interpolator(d3.interpolateYlGnBu);

    //Define legend colors
    var colorLegend = d3.legendColor()
        .shapeWidth(30)
        .orient('horizontal')
        .scale(colorMap)
        .cells([0, 5, 25, 125, 600])
        .labels(['0', '5', '25', '125', '600'])
        .shapePadding(5)
        .shapeWidth(50)
        .shapeHeight(20)
        .labelOffset(8);

    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(590, -5)");

    svg.select(".legendLinear")
        .call(colorLegend);

    // Define tool tip for mouseover info in country map
    let toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            if (getRate(stats, d.properties.name, rateType) === undefined) {
                let tooltipTable = "<table>" +
                    "<tr>State: </td>" + d.properties.name + "</td></tr>" +
                    "<tr><th>Total Offenses per 10M: </th><td>" + "No data available" + "</td></tr>"
                return tooltipTable
            } else {
                let tooltipTable = "<table>" +
                    "<tr>State: </td>" + d.properties.name + "</td></tr>" +
                    "<tr><th>Total Offenses per 10M: </th><td>" + getRate(stats, d.properties.name, rateType); + "</td></tr>"
                return tooltipTable
            }
        });

    svg.call(toolTip)

    //Append svg elements for each state ("g") to the map
    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(us.features)
        .enter().append("path")
        .attr("fill", function(d) {
            let rate = getRate(stats, d.properties.name, rateType);
            return colorMap(rate);
        })
        .attr("d", path)
        .on("click", selected)
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide)




    /**
     * Pushes selected states to selectedStates array and calls updateGraphs function
     * Removes selected states from selectedStates array and calls updateGraphs function
     * @param {array} Array of data
     * @return (string) rateType Attribute used to render map shading (i.e. Cases per 10M)
     */
    function selected(d) {

        //Set category
        var selectedCategory = d3.select('input[name="btn"]:checked').property("value");
        //selectedCategory = "Age Group";

        //Push state to selectedStates array and call updateGraphs
        if (!selectedStates.includes(d.properties.name)) {
            d3.select(this).classed("selected", true).raise();
            selectedStates.push(d.properties.name);
            console.log(selectedStates)
            updateGraphs(selectedStates, selectedCategory)
        }
        //Remove state from selectedStates array and call updateGraphs
        else {
            d3.select(this).classed("selected", false);
            var index = selectedStates.indexOf(d.properties.name);
            var stateRemoved = d.properties.name.replace(" ", "-")
            d3.selectAll("#" + stateRemoved).remove()
            selectedStates.splice(index, 1);
            updateGraphs(selectedStates, selectedCategory);
            console.log(selectedStates)
        }
    }

    // Set color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    /**
     * Updates line graphs after state selection/removal is made, or a radio button is clicked.
     * @param {array} selectedStates Array of states selected from the map
     * @param {string} selectedCategory Name of the category selected from the radio button
     */
    function updateGraphs(selectedStates, selectedCategory) {
        console.log(selectedStates)
        console.log(selectedCategory)
        //Set current state to the last state listed in the selectedStates array.
        currentState = selectedStates[selectedStates.length - 1];

        //Filter statesformap.csv to the selected category and the current state.
        stateData = data[2].filter(function(d) {
            return d.category == selectedCategory && d.locationdesc == currentState;
        });

        // Set X and Y axis label positions
        var marginX = 20;
        var marginY = 20;

        // Set margin for state divs
        var margin = {
                top: 60,
                right: 50,
                bottom: 30,
                left: 50
            },
            width = 480 - margin.left - margin.right,
            height = 290 - margin.top - margin.bottom;

        // Set X and Y axis ranges
        var x = d3.scaleLinear().range([0, width]).domain([2014, 2019]);
        var y = d3.scaleLinear().range([height, 0]).domain([0, 400]);

        //Enter Selection: Add svg element of id #state-graphs for each selected state.
        // If statement used to only apply these sections to svgs when array of selectedStates is > 0
        if (selectedStates.length > 0) {
            var svg = d3.select("#state-graphs")
                .append("svg")
                .attr("id", currentState.replace(" ", "-"))
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //}

            //Add X axis
            let g = svg.append("g")
                .attr("transform", "translate(" + marginX + ", " + marginY + ")");

            //Transform and translate the X Axis; add tick marks
            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(-20," + (180) + ")")
                .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(6));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add text label for the state name to the top-middle of the SVG
            g.append("text")
                .attr("class", "label")
                .attr("x", 170)
                .attr("y", -30)
                .style("text-anchor", "middle")
                .text(currentState);

            // Add text label "Year" to X-axis
            g.append("text")
                .attr("class", "axis-label")
                .attr("y", 205)
                .attr("x", 170)
                .style("text-anchor", "middle")
                .text("Year");

            // Add text label "Number of Cases per 10M" to Y-axis
            g.append("text")
                .attr("transform", "rotate(270)")
                .attr("class", "axis-label")
                .attr("y", -50)
                .attr("x", -80)
                .style("text-anchor", "middle")
                .text("Number of Cases Per 10M People");

            // Display "No data reported" message on graph if there is no data
            if (stateData.length == 0) {
                g.append("text")
                    .attr("class", "no-data")
                    .attr("y", 55)
                    .attr("x", 170)
                    .attr("text-anchor", "middle")
                    .text("No data reported for this category.");
            }

            // Define a D3 line called valueLine based on avg_data_values
            var valueLine = d3.line()
                .x(function (d) {
                    return x(d.year);
                })
                .y(function (d) {
                    return y(d.avg_data_value);
                });

            // Nest the entries by category value
            var dataNest = d3.nest()
                .key(function (d) {
                    return d.category_value;
                })
                .entries(stateData);

            // Loop through dataNest to add a new line for each category value
            dataNest.forEach(function (d) {
                svg.append("path")
                    .attr("class", "line")
                    .style("stroke", function () {
                        return d.color = color(d.key)
                    })
                    .attr("d", valueLine(d.values))
                    .attr("id", "currentFactor");

                // Add spacing for the legend
                legendSpace = width / dataNest.length;

                // Create array of category values for the state legends
                let arrayStateCategories = stateData.filter(function (d) {
                    return d.locationdesc === currentState;
                })
                    .map(function (d) {
                        return d.category_value
                    });

                // Make a unique list of category values to remove repeated values
                let uniqueCategorySet = new Set(arrayStateCategories);
                let uniqueCategoryArray = [...uniqueCategorySet]

                //Append legend to each state graph for specified category values
                var legend = d3.select("#" + currentState.replace(" ", "-")).select("g").selectAll("g.legend")
                    .data(uniqueCategoryArray)
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("id", "currentLegend");

                // Append legend text for each unique category in the array
                legend.append("text")
                    .attr("x", width + margin.right - 50 - 8)
                    .attr("y", function (d, i) {
                        return (i * 20) + 9;
                    })
                    .data(uniqueCategoryArray)
                    .text(function (d) {
                        return d
                    });

                // Add a rectangle with matching color to the lines for the legend
                var dataRect = d3.nest()
                    .key(function (d) {
                        return d.category_value;
                    })
                    .entries(uniqueCategoryArray);

                // Add legend rectangle for each category.
                dataRect.forEach(function (d) {
                    legend.append("rect")
                        .attr("x", width + margin.right - 15 - 20)
                        .attr("y", function (d, i) {
                            return i * 20;
                        })
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", function (d) {
                            return color(d);
                        })
                });

            });

            // Define tool tip table for state line charts
            let tooltipChart = d3.tip()
                .attr("class", "chart-tip")
                .offset([-8, 0])
                .html(function (d) {
                    let tooltipTable = "<table>" +
                        "<tr>Year: </td>" + d.year + "</td></tr>" +
                        "<tr><th> " + d.category_value + "</th><td>" + ": " + d.avg_data_value + " cases per 10M" + "</td></tr>"
                    return tooltipTable
                });
            svg.call(tooltipChart)

            // Define the div for the tooltip
            const div = d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // Add points to the line chart.
            svg
                .selectAll("dot")
                .data(stateData)
                .enter()
                .append("circle")
                .attr("r", 3)
                .attr("cx", d => x(d.year))
                .attr("cy", d => y(d.avg_data_value))
                .attr("stroke-width", "20px")
                .attr("stroke", "rgba(0,0,0,0)")
                .style("cursor", "pointer")
                .attr("id", "currentDots")
                .on("mouseover", tooltipChart.show)
                .on("mouseout", tooltipChart.hide);

        }
            //Exit Selection: Remove svg element of id #state-graphs for each de-selected state.
            d3.select("#state-graphs")
                .selectAll("svg")
                .data(selectedStates)
                .exit()
                .remove();

        d3.select("#lineChart-radioInputs").style("display", "block");

        d3.selectAll(("input[name='btn']")).on("change", function() {
            selectedCategory = this.value
            updateLines(selectedStates, selectedCategory)
        });

    /* ======================================================================== */
        /**
         * FUTURE WORK - UPDATE WET CODE BELOW TO DRY CODE USING MORE FUNCTIONS
         */
    /* ======================================================================== */


        /**
         * Updates line graphs after radio button selected.
         * @param {array} selectedStates Array of states selected from the map
         * @param {string} selectedCategory Name of the category selected from the radio button
         */
        function updateLines(selectedStates, selectedCategory) {

            d3.selectAll("#currentFactor").remove();
            d3.selectAll("#currentDots").remove();
            d3.selectAll("#currentLegend").remove();
            d3.selectAll(".no-data").remove();


            let j = 0;
            while (j < selectedStates.length) {

                currentState = selectedStates[j];
                stateData = data[2].filter(function(d) {
                    return d.category == selectedCategory && d.locationdesc == currentState;
                });

                if (stateData.length == 0) {
                    d3.select("#" + currentState.replace(" ", "-")).select("g").select("g")
                        .append("text")
                        .attr("class", "no-data")
                        .attr("x", 320 / 2)
                        .attr("dy", "5em")
                        .attr("text-anchor", "middle")
                        .text("No data reported for this category");
                }

                var valueLine = d3.line()
                    .x(function(d) {
                        return x(d.year);
                    })
                    .y(function(d) {
                        return y(d.avg_data_value);
                    });

                // WET code
                var dataNest = d3.nest()
                    .key(function(d) {
                        return d.category_value;
                    })
                    .entries(stateData);

                // WET code
                dataNest.forEach(function(d) {
                    d3.select("#" + currentState.replace(" ", "-"))
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                        .append("path")
                        .attr("class", "line")
                        .style("stroke", function() { // Add the colours dynamically
                            return d.color = color(d.key);
                        })
                        .attr("d", valueLine(d.values))
                        .attr("id", "currentFactor");

                    // WET code
                    legendSpace = width / dataNest.length; // spacing for the legend

                    //filter the category values for the legend
                    let arrayStateCategories = stateData.filter(function(d) {
                        return d.locationdesc === currentState;
                    })
                        .map(function(d) {
                            return d.category_value
                        });

                    //Make a unique list of the category values to remove repeated values
                    // WET Code
                    let uniqueCategorySet = new Set(arrayStateCategories);
                    let uniqueCategoryArray = [...uniqueCategorySet]

                    //Append legend to each state graph for specified category values
                    // WET code
                    var legend = d3.select("#" + currentState.replace(" ", "-")).select("g").selectAll("g.legend")
                        .data(uniqueCategoryArray)
                        .enter()
                        .append("g")
                        .attr("class", "legend")
                        .attr("id", "currentLegend");

                    // WET code
                    legend.append("text")
                        .attr("x", width + margin.right - 50 - 8)
                        .attr("y", function(d, i) {
                            return (i * 20) + 9;
                        })
                        .data(uniqueCategoryArray)
                        .text(function(d) {
                            return d
                        });

                    // Add a box with matching color to the lines for the legend
                    // WET code
                    var dataRect = d3.nest()
                        .key(function(d) {
                            return d.category_value;
                        })
                        .entries(uniqueCategoryArray);

                    // Add legend rectangle for each category.
                    // WET code
                    dataRect.forEach(function(d) {
                        legend.append("rect")
                            .attr("x", width + margin.right - 15 - 20)
                            .attr("y", function(d, i) {
                                return i * 20;
                            })
                            .attr("width", 10)
                            .attr("height", 10)
                            .style("fill", function(d) {
                                return color(d);
                            })
                    });
                });

                // Define tool tip table for charts
                // WET Code
                let tooltipChart = d3.tip()
                    .attr("class", "chart-tip")
                    .offset([-8, 0])
                    .html(function(d) {
                        let tooltipTable = "<table>" +
                            "<tr>Year : </td>" + d.year + "</td></tr>" +
                            "<tr><th> " + d.category_value + "</th><td>" + ": " + d.avg_data_value + " cases per 10M" + "</td></tr>"
                        return tooltipTable
                    });
                svg.call(tooltipChart)

                // Define the div for the tooltip
                // WET code
                const div = d3
                    .select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

                // Add the scatterplot
                // WET code
                d3.select("#" + currentState.replace(" ", "-"))
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .selectAll("dot")
                    .data(stateData)
                    .enter()
                    .append("circle")
                    .attr("r", 3)
                    .attr("cx", d => x(d.year))
                    .attr("cy", d => y(d.avg_data_value))
                    .attr("stroke-width", "20px")
                    .attr("stroke", "rgba(0,0,0,0)")
                    .style("cursor", "pointer")
                    .attr("id", "currentDots")
                    .on("mouseover", tooltipChart.show)
                    .on("mouseout", tooltipChart.hide);
                j++;
            }
        }
    }
}
