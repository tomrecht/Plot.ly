

d3.json("samples.json").then(function(data) {     // populate the dropdown menu

    names = data.names;
    d3.select("#selDataset")
      .selectAll('myOptions')
     	.data(names)
      .enter()
    	.append('option')
      .text(d => d) // text shown in the menu
      .attr("value", d => d) // corresponding value returned by the button
});


function optionChanged(value) {
  d3.json("samples.json").then(function(data) {

      data.metadata.forEach(m => {if (m.id == value) {myMetadata =  m}});  // find the metadata and samples for current selection
      data.samples.forEach(m => {if (m.id == value) {mySamples =  m}});

      metadataBox = d3.select("#sample-metadata");      // populate the metadata box
      metadataBox.html("");
      metadataBox.append("h6").text(`ID: ${myMetadata.id}`)
        .append("h6").text(`Ethnicity: ${myMetadata.ethnicity}`)
        .append("h6").text(`Gender: ${myMetadata.gender}`)
        .append("h6").text(`Age: ${myMetadata.age}`)
        .append("h6").text(`Location: ${myMetadata.location}`)
        .append("h6").text(`BB Type: ${myMetadata.bbtype}`)
        .append("h6").text(`Wash Freq: ${myMetadata.wfreq}`);

        otu_ids = mySamples.otu_ids.slice(0,10);        // data for the charts
        otu_labels = mySamples.otu_labels.slice(0,10);
        sample_values = mySamples.sample_values.slice(0,10);

        var data = [{             // bubble chart
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color:  ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf']
              }
        }];
        Plotly.newPlot("bubble",data)

        var data = [{
          x: sample_values.reverse(),   // for bar chart, reverse everything to show largest value topmost
          y: otu_ids.map(otu => "OTU "+otu).reverse(),  // add "OTU" to labels
          text: otu_labels.reverse(),
          type: "bar",
          orientation: "h"
        }]

        Plotly.newPlot("bar",data)

        var data = [                        // gauge chart
        	{
        		domain: { x: [0, 1], y: [0, 1] },
        		value: myMetadata.wfreq,
        		title: { text: "<em>Belly Button Washing Frequency</em> <br>  Scrubs per Week" },
        		type: "indicator",
        		mode: "gauge+number",
            gauge: { axis: { range: [null, 7] } }
        	}
        ];

        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data);


        if(myMetadata.wfreq==7) {           // just for fun, if freq = 7 days a week...
          d3.select(".medal").style("display", "initial");
          d3.select(".title").style("display", "none");
          confetti.start(5000)
        }
        else {
          d3.select(".medal").style("display", "none");
          d3.select(".title").style("display", "initial");
        }

    });
    }
