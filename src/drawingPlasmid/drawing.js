/**
 * Created by yangm11 on 4/17/2017.
 */
'use strict';

var drawing = (function drawing() {
  function drawArc(params) {
    params = params || {};
    var center = params.center || [100, 100];
    var r = params.radius || 100;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI/2;
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var style = params.styleObj ? styleObjectToString(params.styleObj) : 'fill: transparent; stroke: #f66;';

    var x1 = center[0] + r * Math.sin(startAngle);
    var y1 = center[1] - r * Math.cos(startAngle);
    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;
    var x2 = center[0] + r * Math.sin(angle + startAngle);
    var y2 = center[1] - r * Math.cos(angle + startAngle);

    return {
      points: [[x1, y1], [x2, y2]],
      template: `<g style="${style}"><path d="M ${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}" style="fill: transparent;"></path></g>`
    };
  }

// console.log(drawArc({
//   center: [180, 180],
//   radius: 150,
//   angle: 200,
//   startAngle: -120
// }));

  function drawSector(params) {
    params = params || {};
    var center = params.center || [100, 100];
    var r = params.radius || 100;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI/2;
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var style = params.style ? styleObjectToString(params.style) : '';


    var x1 = center[0] + r * Math.sin(startAngle);
    var y1 = center[1] - r * Math.cos(startAngle);
    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;
    var x2 = center[0] + r * Math.sin(angle + startAngle);
    var y2 = center[1] - r * Math.cos(angle + startAngle);

    return {
      points: [center, [x1, y1], [x2, y2]],
      template: `<g><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${center[0]} ${center[1]} Z" style="${style}"></path></g>`
    };
  }

// console.log(drawSector({
//   center: [200, 200],
//   radius: 150,
//   startAngle: 30,
//   angle: 240,
//   style: {
//     fill: 'blue'
//   }
// }));

  /*
   * function for converting a style object to inline CSS style string.
   * e.g. {fill: 'blue', 'stroke-width': '5px', stroke: '#f66'}  =>
   * 'fill: blue; stroke-width: 5px; stroke: #f66; '
   */
  function styleObjectToString(obj) {
    var props = Object.keys(obj);
    var result = '';
    for (var prop of props) {
      result += (prop + ': ' + obj[prop] + ';');
    }
    return result;
  }

  /*
   * compute the distance between two points with the coordinates of the points
   * the parameters are arrays, e.g [x1, y1]
   */
  function distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
  }

  function drawAnnulus(params) {
    params = params || {};
    var oR = params.outerRadius || (params.innerRadius ? params.innerRadius * 1.2 : 100);
    var iR = params.innerRadius || (params.outerRadius ? params.outerRadius * 0.8 : 80);
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI / 3;
    var center = params.center || [100, 100];
    var style = params.style ? styleObjectToString(params.style) : '';
    var endAngle = startAngle + angle;

    var x1, y1, x2, y2, x3, y3, x4, y4;

    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;

    x1 = center[0] + oR * Math.sin(startAngle);
    y1 = center[1] - oR * Math.cos(startAngle);
    x2 = center[0] + oR * Math.sin(endAngle);
    y2 = center[1] - oR * Math.cos(endAngle);

    x3 = center[0] + iR * Math.sin(startAngle);
    y3 = center[1] - iR * Math.cos(startAngle);
    x4 = center[0] + iR * Math.sin(endAngle);
    y4 = center[1] - iR * Math.cos(endAngle);

    return `<g style="${style}"><path d="M ${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} L ${x1} ${y1} Z"></path></g>`;
  }

// console.log(drawAnnulus({
//   center: [300, 300],
//   outerRadius: 250,
//   innerRadius: 120,
//   startAngle: -30,
//   angle: 120,
//   style: {
//     fill: 'blue',
//     'stroke-width': '50px',
//     'stroke': '#f66',
//   }
// }));

  /*
   * To draw a line segment
   * x, y is the coordinates of the center
   * r is the radius of the radius of inner circle
   * len is the length of the bar spanning inner and outer circle
   * ang is the angle from vertical bar
   * extra is the tail of the bar, specified by h and v distance
   */
  function drawBar(x, y, r, ang, len, extra) {
    ang = ang / 180 * Math.PI;
    extra = extra || {h: 0, v: 0};

    var x1 = x + r * Math.sin(ang);
    var y1 = y - r * Math.cos(ang);

    var x2 = x + (r + len) * Math.sin(ang);
    var y2 = y - (r + len) * Math.cos(ang);

    var h = Math.sin(ang) >= 0 ? extra.h : -(extra.h);
    var v = Math.cos(ang) >= 0 ? -(extra.v) : extra.v;

    var x3 = x2 + h;
    var y3 = y2 + v;

    return `<path d="M${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}"></path>`
  }

// console.log(drawBar(300, 300, 150, 30, 10, {h: 20, v: 0}));
//
// var path = '';
// for (var i = 0; i < 24; i++) {
//   path += drawBar(300, 300, 150, 15 * i, 30, {h: 20, v: 0});
// }
//
// console.log(path);

  /*
   * draw arrows on a circle
   * startAngle and endAngle should be radian not degree.
   */
  function drawArrow(params) {
    params = params || {};
    var x = params.center[0] || 100;
    var y = params.center[1] || 100;
    var r = params.radius || 80;
    var len = params.size || 20;
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var endAngle = params.endAngle ? params.endAngle / 180 * Math.PI : startAngle + Math.PI / 18;
    var close = params.close || false;


    startAngle = startAngle / 180 * Math.PI;
    endAngle = endAngle ? endAngle / 180 * Math.PI : (startAngle + 15) / 180 * Math.PI;

    var x1 = x + (r - len) * Math.sin(startAngle);
    var y1 = y - (r - len) * Math.cos(startAngle);

    var x2 = x + (r + len) * Math.sin(startAngle);
    var y2 = y - (r + len) * Math.cos(startAngle);

    var x3 = x + r * Math.sin(endAngle);
    var y3 = y - r * Math.cos(endAngle);

    if (close) {
      return `<path d="M ${x1} ${y1} L ${x3} ${y3} L ${x2} ${y2} Z"></path>`;
    } else {
      return `<path d="M ${x1} ${y1} L ${x3} ${y3} L ${x2} ${y2}"></path>`;
    }
  }

// var path = '';
// for (var i = 0; i < 24; i++) {
//   path += drawArrow();
// }
//
// console.log(path);

  function drawAnnulusWithArrow(params) {
    params = params || {};
    var center = params.center || [100, 100];
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI / 3;
    var iR = params.innerRadius || (params.outerRadius ? params.outerRadius * 0.8 : 80);
    var oR = params.outerRadius || (params.innerRadius ? params.innerRadius * 1.2 : 100);
    var forward = (params.forward === undefined) ?  true : params.forward;
    var style = params.style ? styleObjectToString(params.style) : '';
    var endAngle;
    var d = (oR - iR) * 0.5;

    if (forward) {
      endAngle = startAngle + angle - Math.PI / 18;
    } else {
      endAngle = startAngle + angle;
      startAngle += Math.PI / 18;
    }

    var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7;

    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;

    x1 = center[0] + oR * Math.sin(startAngle);
    y1 = center[1] - oR * Math.cos(startAngle);
    x2 = center[0] + oR * Math.sin(endAngle);
    y2 = center[1] - oR * Math.cos(endAngle);

    x3 = center[0] + iR * Math.sin(startAngle);
    y3 = center[1] - iR * Math.cos(startAngle);
    x4 = center[0] + iR * Math.sin(endAngle);
    y4 = center[1] - iR * Math.cos(endAngle);

    if (forward) {
      x5 = center[0] + (oR + d) * Math.sin(endAngle);
      y5 = center[1] - (oR + d) * Math.cos(endAngle);

      x6 = center[0] + ((oR + iR) / 2) * Math.sin(startAngle + angle);
      y6 = center[1] - ((oR + iR) / 2) * Math.cos(startAngle + angle);

      x7 = center[0] + (iR - d) * Math.sin(endAngle);
      y7 = center[1] - (iR - d) * Math.cos(endAngle);

      return `<g style="${style}"><path d="M${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x5} ${y5} L ${x6} ${y6} L ${x7} ${y7} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} Z"></path></g>`;
    } else {
      x5 = center[0] + (oR + d) * Math.sin(startAngle);
      y5 = center[1] - (oR + d) * Math.cos(startAngle);

      x6 = center[0] + ((oR + iR) / 2) * Math.sin(startAngle - Math.PI / 18);
      y6 = center[1] - ((oR + iR) / 2) * Math.cos(startAngle - Math.PI / 18);

      x7 = center[0] + (iR - d) * Math.sin(startAngle);
      y7 = center[1] - (iR - d) * Math.cos(startAngle);

      return `<g style="${style}"><path d="M${x7} ${y7} L ${x6} ${y6} L ${x5} ${y5} L ${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} Z"></path></g>`;
    }
  }

// console.log(drawAnnulusWithArrow({
//   center: [180, 180],
//   forward: 1
// }));

  function drawArcWithArrow (params) {
    params = params || {};
    var center = params.center || [100, 100];
    var r = params.radius || 100;
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI / 3;
    var len = params.size || r * 0.1;
    var forward = params.forward === undefined ? true : params.forward;
    var style = params.style ? styleObjectToString(params.style) : '';
    var close = params.close || false;

    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;

    var x1, y1, x2, y2, x3, y3, x4, y4;

    x1 = center[0] + r * Math.sin(startAngle);
    y1 = center[1] - r * Math.cos(startAngle);
    x2 = center[0] + r * Math.sin(startAngle + angle);
    y2 = center[1] - r * Math.cos(startAngle + angle);

    if (forward) {
      x3 = center[0] + (r + len) * Math.sin(startAngle + angle - Math.PI/18);
      y3 = center[1] - (r + len) * Math.cos(startAngle + angle - Math.PI/18);
      x4 = center[0] + (r - len) * Math.sin(startAngle + angle - Math.PI/18);
      y4 = center[1] - (r - len) * Math.cos(startAngle + angle - Math.PI/18);

      if (!close) {
        return `<g><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}"></path><path d="M${x3} ${y3} L ${x2} ${y2} L ${x4} ${y4}"></path></g>`;
      } else {
        return `<g><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}" style="fill: transparent;"></path><path d="M${x3} ${y3} L ${x2} ${y2} L ${x4} ${y4} Z"></path></g>`;
      }
    } else {
      x3 = center[0] + (r + len) * Math.sin(startAngle + Math.PI/18);
      y3 = center[1] - (r + len) * Math.cos(startAngle + Math.PI/18);
      x4 = center[0] + (r - len) * Math.sin(startAngle + Math.PI/18);
      y4 = center[1] - (r - len) * Math.cos(startAngle + Math.PI/18);

      if (!close) {
        return `<g style="${style}"><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}"></path><path d="M${x3} ${y3} L ${x1} ${y1} L ${x4} ${y4}"></path></g>`;
      } else {
        return `<g style="${style}"><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}" style="fill: transparent;"></path><path d="M${x3} ${y3} L ${x1} ${y1} L ${x4} ${y4} Z"></path></g>`;
      }
    }
  }

// console.log(drawArcWithArrow({
//   center: [180, 180],
//   close: 1,
//   forward: 0,
//   style: {
//     fill: 'blue'
//   }
// }));
  return {
    arc: drawArc,
    arcWithArrow: drawArcWithArrow,
    sector: drawSector,
    annulus: drawAnnulus,
    annulusWithArrow: drawAnnulusWithArrow,
    bar: drawBar,
    arrow: drawArrow
  }
})();