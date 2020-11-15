
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Human Trafficking in the US</title>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://unpkg.com/topojson@3"></script>
    <script src="vis-updated.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js"></script>


    <link rel="stylesheet" href="map.css">
<!--    <link rel="stylesheet" href="line-chart.css">-->

    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
</head>

<body>

<div id="mapdiv">
    <div class="heading">
        <h1>FBI Human Trafficking Cases in the United States</h1>
    </div>  
    <svg id="mapsvg_pr">
        <defs>
            <pattern id="hash" patternUnits="userSpaceOnUse" patternTransform="rotate(45)" width="8" height="8" x="0" y="0">
                <g id="hash-g">
                    <path d="M 0 0 L 0 10"></path>
                </g>
            </pattern>
          </defs>
    </svg>
</div>

<div class="State-Comparisons">
    <h2>How do different factors correlate with the number of human trafficking cases?</h2>



    <div id="state-graphs-container">
        <form name="radios" id="lineChart-radioInputs">
            <input type="radio" name="btn" id="Age-Group" value="Age Group" checked>
            <label for="Age-Group" style="padding-right: 15px;">Age Group</label>

            <input type="radio" name="btn" id="Gender" value="Gender">
            <label for="Gender" style="padding-right: 15px;">Gender</label>

            <input type="radio" name="btn" id="Race" value="Race">
            <label for="Race" style="padding-right: 15px;">Race</label>

            <input type="radio" name="btn" id="Ethnicity" value="Ethnicity">
            <label for="Ethnicity" style="padding-right: 15px;">Ethnicity</label>
        </form>
        <div id="state-graphs">
        </div>
    </div>
</div>

</body>
</html>

<!-- Line chart loading -->
<!--<script type="module" src="line-chart.js"></script>-->

<!-- Loading D3 v5 here -->
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-array.v2.js"></script>
<script src="https://d3js.org/d3.v5.js"></script>

