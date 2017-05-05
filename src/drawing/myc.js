/**
 * Created by yangm11 on 4/27/2017.
 */
'use strict';

var myc = (function () {

  function setPoint(obj) {
    obj = obj || {center: [0, 0], r: 0, angle: 0};
    obj.angle = obj.angle / 180 * Math.PI;
    return {
      x: obj.center[0] + obj.r * Math.sin(obj.angle),
      y: obj.center[1] - obj.r * Math.cos(obj.angle)
    }
  }

  function drawCircle(params) {
    params = params || {};
    var center = params.center || [100, 100];
    var r = params.radius || 100;
    var fill = params.fill || 'transparent';
    var stroke = params.stroke || '#000';
    var id = params.id || '';
    var className = params.className || '';

    if (id || className) {
      return `<circle class="${className}" id="${id}" cx="${center[0]}" cy="${center[1]}" r="${r}" fill="${fill}" stroke="${stroke}"></circle>`;
    }

    return `<circle cx="${center[0]}" cy="${center[1]}" r="${r}" fill="${fill}" stroke="${stroke}"></circle>`;
  }

  function drawArc(params) {
    params = params || {};
    var center = params.center || [100, 100];
    var r = params.radius || 100;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI/2;
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;

    if (angle < 0) {
      startAngle += angle;
      angle = -angle;
    }

    var lineWidth = params.lineWidth || '2px';
    var lineColor = params.lineColor || '#000';
    var id = params.id || '';
    var className = params.className || '';

    var x1 = center[0] + r * Math.sin(startAngle);
    var y1 = center[1] - r * Math.cos(startAngle);
    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;
    var x2 = center[0] + r * Math.sin(angle + startAngle);
    var y2 = center[1] - r * Math.cos(angle + startAngle);

    if (className || id) {
      return `<g><path class="${className}" id="${id}" d="M ${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}" fill="transparent" stroke="${lineColor}" stroke-width="${lineWidth}"></path></g>`;
    }

    return `<g><path d="M ${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}" fill="transparent" stroke="${lineColor}" stroke-width="${lineWidth}"></path></g>`;
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

    if (angle < 0) {
      startAngle += angle;
      angle = -angle;
    }

    var fill = params.fill || 'transparent';
    var lineColor = params.lineColor || '#000';
    var lineWidth = params.lineWidth || '2px';
    var fillOpacity = params.fillOpacity || '1';
    var className = params.className || '';
    var id = params.id || '';

    var x1 = center[0] + r * Math.sin(startAngle);
    var y1 = center[1] - r * Math.cos(startAngle);
    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;
    var x2 = center[0] + r * Math.sin(angle + startAngle);
    var y2 = center[1] - r * Math.cos(angle + startAngle);

    if (className || id) {
      return `<g><path class="${className}" id="${id}" d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${center[0]} ${center[1]} Z" fill="${fill}" stroke="${lineColor}" stroke-width="${lineWidth}" fill-opacity="${fillOpacity}"></path></g>`;
    }

    return `<g><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${center[0]} ${center[1]} Z" fill="${fill}" stroke="${lineColor}" stroke-width="${lineWidth}" fill-opacity="${fillOpacity}"></path></g>`;
  }

// console.log(drawSector({
//   center: [200, 200],
//   radius: 150,
//   startAngle: 30,
//   angle: 240,
//
// }));

  /*
   * function for converting a style object to inline CSS style string.
   * e.g. {fill: 'blue', 'stroke-width': '5px', stroke: '#f66'}  =>
   * 'fill: blue; stroke-width: 5px; stroke: #f66; '
   *
   * To be noted, inline CSS for svg elements is different from normal html
   * elements.
   *
   * This function is not able to apply to svg inline CSS.
   *
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
    var iR = typeof params.innerRadius !== 'undefined' ? params.innerRadius : (params.outerRadius ? params.outerRadius * 0.8 : 80);
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI / 3;

    if (angle < 0) {
      throw new Error('angle should not be minus!');
    }

    var center = params.center || [100, 100];
    var endAngle = startAngle + angle;
    var fill = params.fill || 'transparent';
    var fillOpacity = params.fillOpacity || '1';
    var lineWidth = params.lineWidth || '2px';
    var lineColor = params.lineColor || '#000';
    var className = params.className || '';
    var id = params.id || '';

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

    if (className || id) {
      return `<g class="${className}" id="${id}"><path d="M ${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} L ${x1} ${y1} Z" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${lineColor}" stroke-width="${lineWidth}"></path></g>`;
    }

    return `<g><path d="M ${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} L ${x1} ${y1} Z" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${lineColor}" stroke-width="${lineWidth}"></path></g>`;

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
  function drawBar(params) {
    params = params || {};
    var x = params.x || 100;
    var y = params.y || 100;
    var r = params.r || 50;
    var ang = params.angle || 0;
    var len = params.len || 20;
    var lineWidth = params.lineWidth || '2px';
    var lineColor = params.lineColor || '#000';

    ang = ang / 180 * Math.PI;

    var x1 = x + r * Math.sin(ang);
    var y1 = y - r * Math.cos(ang);

    var x2 = x + (r + len) * Math.sin(ang);
    var y2 = y - (r + len) * Math.cos(ang);

    return {
      start: [x1, y1],
      end: [x2, y2],
      template: `<path d="M${x1} ${y1} L ${x2} ${y2}" stroke="${lineColor}" stroke-width="${lineWidth}"></path>`
    };
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
  function drawAngle(params) {
    params = params || {};
    var x = params.center ? params.center[0] : 100;
    var y = params.center ? params.center[1] : 100;
    var r = params.radius || 80;
    var len = params.size || 20;
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var endAngle = params.endAngle ? params.endAngle / 180 * Math.PI : startAngle + Math.PI / 18;
    var close = params.close || false;
    var lineWidth = params.lineWidth || '2px';
    var lineColor = params.lineColor || '#000';
    var fill = params.fill || 'transparent';
    var fillOpacity = params.fillOpacity || '1';

    var x1 = x + (r - len) * Math.sin(startAngle);
    var y1 = y - (r - len) * Math.cos(startAngle);

    var x2 = x + (r + len) * Math.sin(startAngle);
    var y2 = y - (r + len) * Math.cos(startAngle);

    var x3 = x + r * Math.sin(endAngle);
    var y3 = y - r * Math.cos(endAngle);

    if (close) {
      return `<path d="M ${x1} ${y1} L ${x3} ${y3} L ${x2} ${y2} Z" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${lineColor}" stroke-width="${lineWidth}"></path>`;
    } else {
      return `<path d="M ${x1} ${y1} L ${x3} ${y3} L ${x2} ${y2}" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${lineColor}" stroke-width="${lineWidth}"></path>`;
    }
  }

// var path = '';
// for (var i = 0; i < 24; i++) {
//   path += drawAngle({
//     startAngle: 15 * i
//   });
// }

// console.log(path);

  function drawAnnulusWithArrow(params) {
    params = params || {};
    var center = params.center || [100, 100];
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI / 3;

    if (angle < 0) {
      throw new Error('angle should not be minus!');
    }

    var iR = params.innerRadius || (params.outerRadius ? params.outerRadius * 0.8 : 80);
    var oR = params.outerRadius || (params.innerRadius ? params.innerRadius * 1.2 : 100);
    var forward = (params.forward === undefined) ?  true : params.forward;
    var endAngle;
    var d = (oR - iR) * 0.5;
    var id = params.id || '';
    var className = params.className || '';
    var lineWidth = params.lineWidth || '2px';
    var lineColor = params.lineColor || '#000';
    var fill = params.fill || 'transparent';
    var fillOpacity = params.fillOpacity || '1';

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

      if (className || id) {
        return `<g id="${id}" class="${className}" stroke="${lineColor}" stroke-width="${lineWidth}" fill="${fill}" fill-opacity="${fillOpacity}"><path d="M${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x5} ${y5} L ${x6} ${y6} L ${x7} ${y7} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} Z"></path></g>`;
      }

      return `<g stroke="${lineColor}" stroke-width="${lineWidth}" fill="${fill}" fill-opacity="${fillOpacity}"><path d="M${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x5} ${y5} L ${x6} ${y6} L ${x7} ${y7} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} Z"></path></g>`;

    } else {
      x5 = center[0] + (oR + d) * Math.sin(startAngle);
      y5 = center[1] - (oR + d) * Math.cos(startAngle);

      x6 = center[0] + ((oR + iR) / 2) * Math.sin(startAngle - Math.PI / 18);
      y6 = center[1] - ((oR + iR) / 2) * Math.cos(startAngle - Math.PI / 18);

      x7 = center[0] + (iR - d) * Math.sin(startAngle);
      y7 = center[1] - (iR - d) * Math.cos(startAngle);

      if (className || id) {
        return `<g id="${id}" class="${className}" stroke="${lineColor}" stroke-width="${lineWidth}" fill="${fill}" fill-opacity="${fillOpacity}"><path d="M${x7} ${y7} L ${x6} ${y6} L ${x5} ${y5} L ${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} Z"></path></g>`;
      }

      return `<g stroke="${lineColor}" stroke-width="${lineWidth}" fill="${fill}" fill-opacity="${fillOpacity}"><path d="M${x7} ${y7} L ${x6} ${y6} L ${x5} ${y5} L ${x1} ${y1} A ${oR} ${oR}, ${rot}, ${laf}, ${sf}, ${x2} ${y2} L ${x4} ${y4} A ${iR} ${iR}, ${rot}, ${laf}, ${sf ? 0 : 1}, ${x3} ${y3} Z"></path></g>`;
    }
  }

// console.log(drawAnnulusWithArrow({
//   // center: [180, 180],
//   forward: 1
// }));

  function drawArcWithArrow (params) {
    params = params || {};
    var center = params.center || [100, 100];
    var r = params.radius || 100;
    var startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    var angle = params.angle ? params.angle / 180 * Math.PI : Math.PI / 3;

    if (angle < 0) {
      throw new Error('angle should not be minus!');
    }

    var len = params.size || r * 0.1;
    var forward = (params.forward === undefined) ? true : params.forward;
    var close = params.close || false;
    var id = params.id || '';
    var lineWidth = params.lineWideth || '2px';
    var lineColor = params.lineColor || '#000';
    var arrowColor = params.arrowColor || '#000';

    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;

    var x1, y1, x2, y2, x3, y3, x4, y4;

    x1 = center[0] + r * Math.sin(startAngle);
    y1 = center[1] - r * Math.cos(startAngle);
    x2 = center[0] + r * Math.sin(startAngle + angle);
    y2 = center[1] - r * Math.cos(startAngle + angle);

    let arrowSpan = angle / 10;
    if (forward) {
      x3 = center[0] + (r + len) * Math.sin(startAngle + angle - arrowSpan);
      y3 = center[1] - (r + len) * Math.cos(startAngle + angle - arrowSpan);
      x4 = center[0] + (r - len) * Math.sin(startAngle + angle - arrowSpan);
      y4 = center[1] - (r - len) * Math.cos(startAngle + angle - arrowSpan);

      if (!close) {
        return `<g id="${id}" stroke="${lineColor}" stroke-width="${lineWidth}"><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}"></path><path d="M${x3} ${y3} L ${x2} ${y2} L ${x4} ${y4}"></path></g>`;
      } else {
        return `<g id="${id}" stroke="${lineColor}" stroke-width="${lineWidth}"><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}" fill="transparent"></path><path d="M${x3} ${y3} L ${x2} ${y2} L ${x4} ${y4} Z" fill="${arrowColor}"></path></g>`;
      }

    } else {

      x3 = center[0] + (r + len) * Math.sin(startAngle + arrowSpan);
      y3 = center[1] - (r + len) * Math.cos(startAngle + arrowSpan);
      x4 = center[0] + (r - len) * Math.sin(startAngle + arrowSpan);
      y4 = center[1] - (r - len) * Math.cos(startAngle + arrowSpan);

      if (!close) {
        return `<g id="${id}" stroke="${lineColor}" stroke-width="${lineWidth}"><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}"></path><path d="M${x3} ${y3} L ${x1} ${y1} L ${x4} ${y4}"></path></g>`;
      } else {
        return `<g id="${id}" stroke="${lineColor}" stroke-width="${lineWidth}"><path d="M${x1} ${y1} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${x2} ${y2}" fill="transparent"></path><path d="M${x3} ${y3} L ${x1} ${y1} L ${x4} ${y4} Z" fill="${arrowColor}"></path></g>`;
      }
    }
  }

// console.log(drawArcWithArrow({
//   center: [180, 180],
//   close: 1,
//   forward: 0,
// }));

  function drawArrow(params) {
    params = params || {};
    var start = params.start || [10, 10];
    var end = params.end || [50, 10];
    var angle = params.angle ? param.angle / 180 * Math.PI : Math.PI / 4;
    var len = params.len || 5;
    var close = params.close || false;
    var className = params.className || '';
    var id = params.id || '';
    var lineWidth = params.lineWidth || '2px';
    var lineColor = params.lineColor || '#000';

    var d = Math.sqrt((start[0] - end[0])*(start[0] - end[0]) + (start[1] - end[1])*(start[1] - end[1]));
    // take end point as center of a circle
    var alpha = Math.asin((start[0] - end[0]) / d);

    if (start[1] > end[1]) {
      alpha = Math.PI - alpha;
    }

    var x1 = end[0] + len * Math.sin(alpha - angle);
    var y1 = end[1] - len * Math.cos(alpha - angle);
    var x2 = end[0] + len * Math.sin(alpha + angle);
    var y2 = end[1] - len * Math.cos(alpha + angle);

    if (close) {
      return `<g class="${className}" id="${id}" stroke="${lineColor}" stroke-width="${lineWidth}"><path d="M${x1} ${y1} L ${end[0]} ${end[1]} L ${x2} ${y2} Z"></path><path d="M${start[0]} ${start[1]} L ${end[0]} ${end[1]}"></path></g>`;
    }
    return `<g class="${className}" id="${id}" stroke="${lineColor}" stroke-width="${lineWidth}"><path d="M${x1} ${y1} L ${end[0]} ${end[1]} L ${x2} ${y2}"></path><path d="M${start[0]} ${start[1]} L ${end[0]} ${end[1]}"></path></g>`;
  }

// console.log(drawArrow({
//   start: [300, 50],
//   end: [200, 50],
//   close: true
// }));

  function drawTextAlongArc(params) {
    params = params || {};
    let center = params.center || [0, 0];
    let txt = params.text || 'Hello World';
    let startAngle = params.startAngle ? params.startAngle / 180 * Math.PI : 0;
    let r = params.radius || 200;
    let angle = params.angle ? params.angle / 180 * Math.PI : Math.PI / 2;
    let id = params.id;
    let fontSize = params.fontSize || '24px';

    if (typeof id === 'undefined') {
      throw new Error('Id is required!');
    }

    if (angle < 0) {
      throw new Error('angle should not be minus!');
    }

    var rot = 0;
    var laf = angle > Math.PI ? 1 : 0;
    var sf = 1;

    var startPoint = setPoint({
      center: center,
      r: r,
      angle: startAngle
    });

    var endPoint = setPoint({
      center: center,
      r: r,
      angle: startAngle + angle
    });

    var defs = `<defs><path id="${id}" d="M${startPoint.x} ${startPoint.y} A ${r} ${r}, ${rot}, ${laf}, ${sf}, ${endPoint.x} ${endPoint.y}"></path></defs>`;
    var text = `<use xlink:href="#${id}" fill="none" stroke="#f66"></use><text font-size="${fontSize}"><textPath xlink:href="#${id}">${txt}</textPath></text>`;

    return '<g>' + defs + text + '</g>';
  }

  function randomColor() {
    let r = Math.floor(256 * Math.random());
    let g = Math.floor(256 * Math.random());
    let b = Math.floor(256 * Math.random());
    let a = Math.floor((0.2 + 0.8 * Math.random()) * 10) / 10;
    return `rgba(${r},${g},${b},${a})`;
  }


  function drawPieChart(data, config) {
    // data: [{name: n1, value: v1}, {name: n2, value: v3}, ...]
    config = config || {};
    let startAngle = config.startAngle || 0;
    let iR = config.innerRadius || 0;
    let oR = config.outerRadius || 200;
    let center = config.center || [250, 250];
    let strokeWidth = config.strokeWidth || 2;
    let strokeColor = config.strokeColor || 'none';
    let colorFunc = config.colorFunc;
    let takeOut = config.takeOut || [];
    let notationPos = config.notationPos || 'in';

    let sum = data.reduce(function (acc, d) {
      return acc + d.value;
    }, 0);

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        data[i].startAngle = startAngle;
        data[i].angle = data[i].value / sum * 360;
        continue;
      }
      data[i].startAngle = data[i - 1].startAngle + data[i - 1].angle;
      data[i].angle = data[i].value / sum * 360;
    }

    // console.log(data);

    let code = '';
    function toPercentage(v, sum) {
      return (v / sum * 100).toFixed(2) + '%';
    }

    for (let i = 0; i < data.length; i++) {
      let startAngle = data[i].startAngle;
      let angle = data[i].angle;
      if (angle !== 0) {
        let newCenter = undefined;
        if (takeOut.includes(data[i].name)) {
          let coor = setPoint({
            center: center,
            r: 50,
            angle: startAngle + angle / 2
          });
          newCenter = [coor.x, coor.y];
        }

        let fillColor = colorFunc ? colorFunc(data[i]) : randomColor();
        if (fillColor === 'random') {
          fillColor = randomColor();
        }

        code += drawAnnulus({
          center: newCenter ? newCenter : center,
          innerRadius: iR,
          outerRadius: oR,
          startAngle: startAngle,
          angle: angle,
          lineWidth: strokeWidth,
          lineColor: strokeColor,
          fill: fillColor
        });
        let point = setPoint({
          center: newCenter ? newCenter : center,
          r: notationPos === 'in' ? (iR + oR) / 2 : oR + 50,
          angle: (data[i].startAngle + data[i].angle / 2)
        });
        code += `<text x="${point.x}" y="${point.y}" text-anchor="middle" alignment-baseline="middle">${data[i].name}(${toPercentage(data[i].value, sum)})</text>`;
      }
    }

    return code;

  }



  return {
    arc: drawArc,
    arcWithArrow: drawArcWithArrow,
    annulus: drawAnnulus,
    annulusWithArrow: drawAnnulusWithArrow,
    circle: drawCircle,
    sector: drawSector,
    arrow: drawArrow,
    angle: drawAngle,
    bar: drawBar,
    point: setPoint,
    textAlongArc: drawTextAlongArc,
    randomColor: randomColor,
    pieChart: drawPieChart
  }

})();

// console.log(myc.point());

// if (module.parent) {
//   module.exports = myc;
// } else if (typeof window === 'undefined') {
//   // console.log('Running in browser!');
//   // console.log(myc.arc({
//   //   angle: -270
//   // }));
//   // console.log(myc.textAlongArc({
//   //   center: [0, 0],
//   //   radius: 250,
//   //   id: 'myPath',
//   //   startAngle: 30,
//   //   angle: 27
//   // }));
//   // console.log(myc.randomColor());
//
//   console.log(myc.pieChart([{
//     name: 'A',
//     value: 249
//   }, {
//     name: 'T',
//     value: 233
//   }, {
//     name: 'G',
//     value: 212
//   }, {
//     name: 'C',
//     value: 245
//   }, {
//     name: 'U',
//     value: 45
//   }], {
//     innerRadius: 100,
//     strokeColor: myc.randomColor(),
//     notationPos: 'out',
//     takeOut: ['A']
//   }));
//
// }