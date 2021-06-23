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
    console.log(data);
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
  var trace_data = [trace1];  
  var layout = {
      xaxis: {title: 'OTU ID'},
      showlegend: false,
  };
  Plotly.newPlot('bubble', trace_data, layout);
  //////////// End of Bubble  /////////////////

  ///////// GAUGE  //////////////
  console.log(output);
  // var wfreq = output.metadata.wfreq;
  // var wfreq = output.metadata[6];
  var metadata = data.metadata;
  var outputArraywfreq = metadata.filter(wfreqObject => wfreqObject.id === parseInt(sample));
  var wfreq = outputArraywfreq[0].wfreq;
  console.log(outputArraywfreq, wfreq);
  // var outputWfreq = outputArraywfreq[0];
  // var wfreq_values = outputWfreq.wfreq_values;
  // var wfreq = outputWfreq.wfreq;
  console.log(wfreq);
  // var wfreqAvg = wfreq;
  // console.log(wfreqAvg);

  var gauge = [
    {
      // domain: { x: [0, 1], y: [0, 1] },
      domain: { x: otu_ids, y: sample_values },
      value: wfreq,
      // value: 490,
      title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 0 },
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          { range: [0, 1], color: "cyan"},
          { range: [1, 2], color: "lightblue" },
          { range: [2, 3], color: "cyan" },
          { range: [3, 4], color: "lightblue" },
          { range: [4, 5], color: "cyan" },
          { range: [5, 6], color: "lightblue" },
          { range: [6, 7], color: "cyan" },
          { range: [7, 8], color: "lightblue" },
          { range: [8, 9], color: "cyan" },

        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: wfreq
          // value: 490,          
        }
      }
    }
  ];
  
  var gauge_layout = { width: 460, height: 450, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', gauge, gauge_layout);

////////  GAUGE END  //////////






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




