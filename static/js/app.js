// store URL
const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// initialize functions
function init() {
    d3.json(URL).then(function(data) {

        // use d3 to create the dropdown menu feature
        let dropdownMenu = d3.select("#selDataset");

        // retrieve names in the json file
        let names = data.names;

        // getting dropdown
        names.forEach(function(id) {
            dropdownMenu.append("option").text(id).property("value", id);
        });

        // pass through subject and call functions
        chartvalues(names[0]);
        metadata(names[0]);
    });
}

// function when the subject id changes
function optionChanged(passedvalue) {
    chartvalues(passedvalue);
    metadata(passedvalue);
}

function chartvalues(passedvalue) {
    // json data
    d3.json(URL).then(function(data) {

        // retrieve sample data
        let samples = data.samples;

        // filter for each option and subject selected
        let id = samples.filter(take => take.id == passedvalue);

        // obtain data for all charts in the dashboard
        let sample_values = id[0].sample_values;
        let otu_ids = id[0].otu_ids;
        let otu_labels = id[0].otu_labels;

        // call function
        charts(sample_values, otu_ids, otu_labels);
    });
}

// create a function that displays the bar and bubble charts
function charts(sample_values, otu_ids, otu_labels) {
    // json data
    d3.json(URL).then(function(data) {

        // append data for bar chart
        let bar_chart = [{
            type: "bar",
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0, 10),
            orientation: "h"
        }];

        // append data for bubble chart
        let bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                colorscale: "Jet",
                size: sample_values
            }
        }];

        //set up layout of the dashboard
        //layout for barchart 
        let bar_layout = {
            title: "bar chart", 
            height: 500,
            width: 400
        };

        //layout for bubble chart 
        let bubble_layout = {
            title: "bubble chart",
            height: 550,
            width: 1000

        };

        // display bar chart using Plotly 
        Plotly.newPlot("bar", bar_chart, bar_layout);

        // display bubble chart using Plotly 
        Plotly.newPlot("bubble", bubble_data, bubble_layout);

        
    });   
};
function metadata(passedvalue) {
    //json data 
    d3.json(URL).then(function(data){
        
        //retrieve sample data 
        let samples = data.metadata;

        //filter data from the meta data
        let id = samples.filter(take=> take.id == passedvalue);

        let sample_metadata = d3.select("#sample-metadata").html('');

        //iterate through values
        Object.entries(id[0]).forEach(([key, value]) => {

            //display information 
            sample_metadata.append("h5").text(`${key}: ${value}`);

        });
    });
};

init();
