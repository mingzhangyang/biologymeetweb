/**
 * Created by yangm11 on 5/3/2017.
 */
'use strict';

var myc = require('../../commonUse/web/svgDrawing/myc');
// console.log(myc);

var pObj = {
  name: '',
  length: '',
  segments: [],
  notations: []
};

var segment = {
  name: '',
  start: '',
  end: '',
  direction: 'clockwise',
  fillColor: '',
  borderColor:'',
  borderWidth: ''
};

var notation = {
  name: '',
  position: ''
};

var pET28a = {
  name: 'pET28a',
  length: 5369,
  segments: [{
    name: 'T7 promoter',
    start: 370,
    end: 386
  }, {
    name: 'His Tag',
    start: 270,
    end: 287
  }, {
    name: 'T7 Tag',
    start: 207,
    end: 238
  }, {
    name: 'lacI',
    start: 773,
    end: 1852,
    direction: 'clockwise'
  }, {
    name: 'T7 terminator',
    start: 26,
    end: 72
  }, {
    name: 'Kan',
    start: 3995,
    end: 4807,
    direction: 'clockwise'
  }, {
    name: 'f1 origin',
    start: 4903,
    end: 5358,
    direction: 'counter clockwise'
  }],
  notations: [{
    name: 'T7 transcription start',
    position: 369
  }, {
    name: 'pBR322 origin',
    position: 3286
  }]
};

function draw(p) {
  let center = [0, 0];
  let r = 300;
  let d = 15;
  let c = myc.circle({
    center: center,
    radius: r,
    border: '#000'
  });
  let name = `<g text-anchor="middle" alignment-baseline="middle"><text x="0" y="-10" font-size="24px">${p.name}</text><text x="0" y="10" font-size="18px">(${p.length + 'bp'})</text></g>`;
  let segments = '<g>';
  for (let i = 0; i < p.segments.length; i++) {
    // console.log(p.segments[i]);
    let s = p.segments[i];
    let startAngle = s.start / p.length * 360;
    let angle = (s.end - s.start) / p.length * 360;
    // console.log(startAngle, angle);
    segments += myc.annulus({
      center: center,
      startAngle: startAngle,
      angle: angle,
      innerRadius: r - d,
      outerRadius: r + d,
      fill: '#fff'
    });
    if (s.direction) {
      segments += myc.arcWithArrow({
        center: center,
        radius: r,
        startAngle: startAngle + angle / 4,
        angle: angle / 2,
        size: d / 2,
        forward: s.direction === 'clockwise',
        close: true
      })
    }
  }
  segments += '</g>';


  return c + name + segments;
}

console.log(draw(pET28a));