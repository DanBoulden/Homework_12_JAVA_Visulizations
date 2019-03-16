function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`


  var bburl =`/metadata/${sample}`;
  d3.json(bburl).then(function(response ) {
    console.log(`response : ${response }`)
    var data = response;
    var bbpanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    bbpanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value]) => {
      bbpanel.append("sample-metadata").text(`${key}: ${value}`).append("br")
    });
  })
}

function buildCharts(sample) {

  var bburl2 =`/samples/${sample}`;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(bburl2).then(function(response) {
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = [{
      x: response.otu_ids,
      y: response.sample_values,
      marker: {
        size: response.sample_values,
        color: response.otu_ids },
      mode: "markers",
      label: response.otu_labels,
      type: "scatter"
    }];
    var bplayout = {
      height: 600,
      width: 1200,
      title: 'The sample you picked as a scatter plot',
      xaxis: {title: 'OTU Identifier'},
      yaxis: {title: '# of samples found on the test subject'}
    };

    var bubbleplot1 = document.getElementById('bubble');
    Plotly.newPlot(bubbleplot1, trace1, bplayout)
    
    
    // @TODO: Build a Pie Chart
        // Sort the data for the pie chart
    var sortresponse = response.sample_values.sort((firstnum, secondnum) => secondnum - firstnum);
      // var sortresponse = response.sample_values.sort((a, b) => b.values - a.values);
      console.log(`sortresponse : ${sortresponse }`)
        // Slice the data for the pie chart
    var trace2 = [{
      values: sortresponse.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      hoverinfo: response.otu_labels.slice(0,10),
      type: "pie"
    }];

    var pielayout1 = {
      height: 450,
      width: 450,
      title: "Highest 10 OTU's found on the test subject"
    };
    var pieplot1 = document.getElementById('pie');
    Plotly.newPlot(pieplot1, trace2, pielayout1)
    });
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
