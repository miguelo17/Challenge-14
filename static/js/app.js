// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(result).forEach(([key, value]) => {
      panel.append("par") // Append a paragraph tag for each key-value pair
           .text(`${key}: ${value}`);
           panel.append("br");
    });
    console.log(panel);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field

    const samples = data.samples;

    // Filter the samples for the object with the desired sample number

    const results = samples.filter(sampleObj => sampleObj.id == sample)[0];
    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = results.otu_ids;
    const otu_labels = results.otu_labels;
    const sample_values = results.sample_values;

    console.log(otu_ids,otu_labels,sample_values);

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    // Render the Bubble Chart

    const bubbleData = [bubbleTrace];
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU Id' },
      yaxis: { title: 'Sample Values' },
      hovermode: 'largest'
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const ylabel = otu_ids.slice(0, 10).map(id => `OTU ${id}`);

    // Render the Bar Chart
    const barTrace = {
      x: sample_values.slice(0, 10).reverse(), 
      y: ylabel.reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      color: "blue"

    };
    const barData = [barTrace];

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { title: 'OTU Id' },
      ticklabelposition: "inside",
      automargin: true,
      margin: {
        l: 120,
        r: 50,
        t: 50,
        b: 50
      }
    };
    
    Plotly.newPlot('bar', barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sNames[0];
    console.log(firstSample)
    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
