'use strict';

var drawAA = (function () {
  var drawSunburst = function(input, output) {

    d3.select("#treemap").style('display', 'none');
    d3.select("#sunBurst").style('display', 'block');

    var seq = bioKit.prepSeq(document.getElementById(input).value);
    var aas = bioKit.countAA(seq);
    var length = "The length of your input sequence is " + (seq.length) + " AA, ";
    var stats = JSON.stringify(aas);
    d3.select(output).text("Amino acides composition").attr("size", "4");
    d3.select(output).text(length + stats);

    var sunburstChart = function () {
      var data = bioKit.prepData(aas);
      var width = 800,
        height = 600,
        radius = (Math.min(width, height) / 2) - 10;
      var formatNumber = d3.format(",d");
      var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);
      var y = d3.scale.sqrt()
        .range([0, radius]);
      // var color = d3.scale.category20c();
      var categoryColor = {
        "Basic": "blue",
        "Acidic": "red",
        "Nonpolar (Hydrophobic)": "green",
        "Polar, uncharged": "purple",
        "All Amnio Acides": "wheat"
      };

      var partition = d3.layout.partition()
        .value(function (d) {
          return d.count;
        });
      var arc = d3.svg.arc()
        .startAngle(function (d) {
          return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        })
        .endAngle(function (d) {
          return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        })
        .innerRadius(function (d) {
          return Math.max(0, y(d.y) * 0.8);
        })
        .outerRadius(function (d) {
          return Math.max(0, y(d.y + d.dy));
        });
      var svg = d3.select("#sunBurst")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");
      svg.selectAll("path")
        .data(partition.nodes(data))
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function (d, i) {
          // console.log(d, i);
          if (d.children) {
            return categoryColor[d.name];
          } else {
            return (bioKit.aaColors[d.parent.name])(bioKit.aapI[d.name]);
          }
        })
        .on("click", click)
        .append("title")
        .text(function (d) {
          if (d.count) {
            return d.name + "\n" + "Count: " + formatNumber(d.count);
          } else {
            return d.name;
          }
        });

      function click(d) {
        svg.transition()
          .duration(750)
          .tween("scale", function () {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
              yd = d3.interpolate(y.domain(), [d.y, 1]),
              yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function (t) {
              x.domain(xd(t));
              y.domain(yd(t)).range(yr(t));
            };
          })
          .selectAll("path")
          .attrTween("d", function (d) {
            return function () {
              return arc(d);
            };
          });
      }

      d3.select(self.frameElement).style("height", height + "px");
    };

    sunburstChart();

  };


  var drawTreemap = function(input, output) {

    d3.select("#sunBurst").style('display', 'none');
    d3.select("#treemap").style('display', 'block');

    var seq = bioKit.prepSeq(document.getElementById(input).value);
    var aas = bioKit.countAA(seq);
    var length = "The length of your input sequence is " + (seq.length) + " AA, ";
    var stats = JSON.stringify(aas);
    d3.select(output).text("Amino acides composition").attr("size", "4");
    d3.select(output).text(length + stats);

    var treemapChart = function() {
      var data = bioKit.prepData(aas);
      var margin = {top: 40, right: 10, bottom: 10, left: 10},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var color = {
        "Basic": "blue",
        "Acidic": "red",
        "Nonpolar (Hydrophobic)": "green",
        "Polar, uncharged": "magenta"
      };

      var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.count; });

      var div = d3.select("#treemap")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

      var node = div.datum(data).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { return d.children ? color[d.name] : null; })
        .text(function(d) { return d.children ? null : d.name; });

      d3.selectAll("input").on("change", function change() {
        var value = this.value === "count"
          ? function() { return 1; }
          : function(d) { return d.count; };
        node
          .data(treemap.value(value).nodes)
          .transition()
          .duration(1500)
          .call(position);
      });
      function position() {
        this.style("left", function(d) { return d.x + "px"; })
          .style("top", function(d) { return d.y + "px"; })
          .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
          .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
      }

    };

    treemapChart();

  };

  return {
    sunburst: drawSunburst,
    treemap: drawTreemap
  }
})();
