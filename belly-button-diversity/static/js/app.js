function buildMetadata(sample) {

  d3.json(`/metadata/${sample}`).then((data) => {
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");
    // $("#sample_metadata").empty();
    Object.entries(data).forEach(
      ([key,value]) => sample_metadata.append("p").text(`${key}: ${value}`));
  });
}

function buildCharts(sample) {
  var sample_url = "/samples/" + sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sample_url).then((data) => {
    var labels = data.otu_labels;
    var ids = data.otu_ids;
    var values = data.sample_values;
    
    // @TODO: Build a Pie Chart
    var pie_data = {
      values: values.slice(0,10),
      labels: ids.slice(0,10),
      hovertext: labels.slice(0,10),
      type: "pie"
    }
    Plotly.plot("pie", [pie_data])

    var bubble_data ={
      x: ids.slice(0,10),
      y: values.slice(0,10),
      text: labels.slice(0,10),
      mode: 'markers',
      marker: {
        size: values
      }
    }
    Plotly.plot("bubble", [bubble_data])
  })
}

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
