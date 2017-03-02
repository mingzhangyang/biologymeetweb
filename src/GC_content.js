'use strict';

var computeComposition = (function () {
  return function(input, output) {
    d3.select('#gcOutput').style('display', 'block');
    d3.select('#transformOutput').style('display', 'none');
    d3.select('#primersOutput').style('display', 'none');

    var GC;
    var inputSeq = document.getElementById(input).value;
    console.log(inputSeq);
    console.log(bioKit);
    var seq = bioKit.prepSeq(inputSeq);
    var bases = bioKit.countBase(seq);
    var length = "The length of your input sequence is " + (seq.length) + " bp, ";
    var stats = "including A: " + bases["A"] + ", T: " + bases["T"] + ", G: " + bases["G"] + ", C: " + bases["C"];
    d3.select("#OT1").text("Stats of the sequence").attr("size", "4");
    d3.select(output).text(length + stats);
    GC = ((bases["G"] + bases["C"]) / (seq.length) * 100).toFixed(2) + '%';
    d3.select("#GC-content").text("The GC content of your input sequence is " + GC + ".");
    var data = [
      {
        name: "A",
        count: bases["A"],
        percent: '(' + (bases['A'] / seq.length * 100).toFixed(2) + '%)'
      },
      {
        name: "T",
        count: bases["T"],
        percent: '(' + (bases['T'] / seq.length * 100).toFixed(2) + '%)'
      },
      {
        name: "G",
        count: bases["G"],
        percent: '(' + (bases['G'] / seq.length * 100).toFixed(2) + '%)'
      },
      {
        name: "C",
        count: bases["C"],
        percent: '(' + (bases['C'] / seq.length * 100).toFixed(2) + '%)'
      }
    ];
    var xScale = d3.scale.linear().domain([0, seq.length * 0.4]).range([0, 680]);
    var color = d3.scale.category10();
    var barChart = function() {
      var g = d3.select("#barChart").selectAll()
        .data(data)
        .enter()
        .append("g")
        .attr("transform", "translate(5, 0)");
      g.append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) {return i*32;})
        .attr("width", function(d) {return xScale(d.count);})
        .attr("height", 30)
        .style("fill", function(d, i) {return color(i);});
      g.append("text")
        .attr("x", function(d) { return xScale(d.count) * 0.8; })
        .attr("y", function(d, i) {return i*32 + 15;})
        .attr("dy", ".35em")
        .style("fill", "white")
        .attr("font-size", "18px")
        .attr("text-anchor", "middle")
        .text(function(d) { return (d.name + ' ' + d.percent); });
      d3.select("#barChart").append("g")
        .attr("transform", "translate(5, 142)")
        .attr('id', 'axisBottom')
        .call(d3.svg.axis('bottom').scale(xScale));
    };
    barChart();
    var pieChart = function() {
      var svg = d3.select("#pieChart");
      var A1 = data[0].count / (seq.length) * Math.PI * 2;
      var A2 = data[1].count / (seq.length) * Math.PI * 2;
      var A3 = data[2].count / (seq.length) * Math.PI * 2;
      var A4 = data[3].count / (seq.length) * Math.PI * 2;
      var Angles = [
        {name: data[0].name, start: 0, end: A1},
        {name: data[1].name, start: A1, end: A1 + A2},
        {name: data[2].name, start: A1+A2, end: A1 + A2 + A3},
        {name: data[3].name, start: A1+A2+A3, end: Math.PI * 2}
      ];
      var arc = d3.svg.arc()
        .outerRadius(250 - 10)
        .innerRadius(0)
        .startAngle(function(d) {return d.start})
        .endAngle(function(d) {return d.end});
      var labelArc = d3.svg.arc()
        .outerRadius(150)
        .innerRadius(150)
        .startAngle(function(d) {return d.start})
        .endAngle(function(d) {return d.end});

      var g = svg.selectAll("g")
        .data(Angles)
        .enter()
        .append("g")
        .attr("transform", "translate(250, 250)");

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); });

      g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return (d.name); })
        .style("fill", "white")
        .attr("font-size", "22px");

    };

    pieChart();
  };
})();