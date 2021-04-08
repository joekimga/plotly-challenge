function buildData(sample) {
  d3.json("samples.json").then((data) => {
    // console.log(data);
    var metadata = data.metadata;
    var outputArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var output = outputArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(output).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildPlots(sample) {
  d3.json("samples.json").then((data) => {
    // console.log(data);
    var samples = data.samples;
    var outputArray = samples.filter(sampleObject => sampleObject.id == sample);
    var output = outputArray[0];
    var sample_values = output.sample_values;
    var otu_ids = output.otu_ids;
    var otu_labels = output.otu_labels;

    var trace = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation:"h"
    };
  
    // Create the data array for our plot
    var bar_data = [trace];
  
    // Define the plot layout
    var bar_layout = {
      title: "Top 10 Belly Button Bacteria",
      margin: {t:40,l:100}
    };
  
    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar", bar_data, bar_layout);

    
    // Bubble chart
    var trace1 = {
      y: sample_values,
      x: otu_ids,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: [[0, '#4b4ba9'], [.2, '#54d2b0'],[.2, '#7fe36b'],[.5, '#c0ea6e'],[.5, '#99752b'],[1, '#d7c7b9']]
      }
  };
  var data = [trace1];  
  var layout = {
      xaxis: {title: 'OTU ID'},
      showlegend: false,
  };
  Plotly.newPlot('bubble', data, layout);
  //////////// End of Bubble  /////////////////

  ///////// GAUGE  //////////////
  var gauge = [
    {
      domain: { x: otu_ids, y: sample_values },
      value: 940,
      title: { text: "Belly Button Washing Frequency" },
      subtitle: { text: "Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 380 },
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          { range: [0, 1], color: "lightgray"},
          { range: [1, 2], color: "gray" },
          { range: [2, 3], color: "lightgray" },
          { range: [3, 4], color: "gray" },
          { range: [4, 5], color: "lightgray" },
          { range: [5, 6], color: "gray" },
          { range: [6, 7], color: "lightgray" },
          { range: [7, 8], color: "gray" },
          { range: [8, 9], color: "lightgray" }
        
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }
      }
    }
  ];
  
  var gauge_layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', gauge, gauge_layout);











  }); 
}

function init() {
  var dropdown = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var names = data.names;

    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });
  var default_sample = names[0];
  buildPlots(default_sample); 
  buildData(default_sample);
  });
}

function optionChanged(other_sample) {
  console.log("in optionChanged");
  buildPlots(other_sample); 
  buildData(other_sample);
  
}


init();




