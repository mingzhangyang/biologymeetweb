/**
 * Created by mingzhang on 4/29/17.
 */
'use strict';

var colors = {
  A: '#A0A0FF',
  G: '#FF7070',
  T: '#A0FFA0',
  C: '#FF8C4B',
  Asp: '#E60A0A',
  Glu: '#E60A0A',
  Cys: '#E6E600',
  Met: '#E6E600',
  Lys: '#145AFF',
  Arg: '#145AFF',
  Ser: '#FA9600',
  Thr: '#FA9600',
  Phe: '#3232AA',
  Tyr: '#3232AA',
  Asn: '#00DCDC',
  Gln: '#00DCDC',
  Gly: '#EBEBEB',
  Leu: '#0F820F',
  Val: '#0F820F',
  Ile: '#0F820F',
  Ala: '#C8C8C8',
  Trp: '#B45AB4',
  His: '#8282D2',
  Pro: '#DC9682',
  STOP: 'transparent'
};

function fillContent() {
  var cd = '';
  var props = Object.keys(colors);
  for (let i = 0; i < props.length; i++) {
    let prop = props[i];
    cd += `<div><div class="label"><lable for="input">${prop + ':'}</lable></div><input 
type="text" id="${prop}" placeholder="${colors[prop]}"></div>`;
  }
  // console.log(cd);
  document.getElementById('colorObj').innerHTML = cd;
  document.getElementById('chart').innerHTML = draw(60, 60);
}

fillContent();

function addColorsListener() {
  var cs = document.getElementsByTagName('input');
  for (let i = 0; i < cs.length; i++) {
    cs[i].addEventListener('change', function () {
      colors[this.id] = this.value;
      // console.log(this.id, this.value);
      try {
        document.getElementById('chart').innerHTML = draw(60, 60);
      } catch (err) {
        alert(err);
      }
    }) ;

  }
}

addColorsListener();

function draw(r, d) {
  // console.log(myc);
  var codon = {
    TTC: 'Phe',
    GTG: 'Val',
    GGT: 'Gly',
    AGA: 'Arg',
    CCG: 'Pro',
    CCA: 'Pro',
    TCC: 'Ser',
    GAG: 'Glu',
    AGG: 'Arg',
    GAC: 'Asp',
    TCG: 'Ser',
    AAA: 'Lys',
    CTA: 'Leu',
    GTT: 'Val',
    GCC: 'Ala',
    GCT: 'Ala',
    TTT: 'Phe',
    GAT: 'Asp',
    TAT: 'Tyr',
    GGG: 'Gly',
    CTG: 'Leu',
    GAA: 'Glu',
    CAA: 'Gln',
    CCT: 'Pro',
    GGC: 'Gly',
    TCT: 'Ser',
    ATG: 'Met',
    CGA: 'Arg',
    ATA: 'Ile',
    TTG: 'Leu',
    CAT: 'His',
    CAG: 'Gln',
    TGG: 'Trp',
    GTA: 'Val',
    AAG: 'Lys',
    TGT: 'Cys',
    CCC: 'Pro',
    AAT: 'Asn',
    ACC: 'Thr',
    CGG: 'Arg',
    TAC: 'Tyr',
    ACG: 'Thr',
    ACA: 'Thr',
    CAC: 'His',
    ATT: 'Ile',
    CGC: 'Arg',
    AAC: 'Asn',
    CGT: 'Arg',
    TTA: 'Leu',
    GCA: 'Ala',
    AGC: 'Ser',
    ACT: 'Thr',
    TGC: 'Cys',
    TCA: 'Ser',
    AGT: 'Ser',
    GCG: 'Ala',
    GGA: 'Gly',
    GTC: 'Val',
    ATC: 'Ile',
    CTC: 'Leu',
    CTT: 'Leu',
    TAA: 'STOP',
    TGA: 'STOP',
    TAG: 'STOP'
  };

  function setPoint(obj) {
    return {
      x: obj.center[0] + obj.r * Math.sin(obj.angle),
      y: obj.center[1] - obj.r * Math.cos(obj.angle)
    }
  }

  function grow(obj, arr, d) {
    var result = [];
    var angle = (obj.endAngle - obj.startAngle) / arr.length;
    for (let i = 0; i < arr.length; i++) {
      let t = {};
      t.name = obj.name + arr[i];
      t.innerR = obj.outerR  > r ? obj.outerR : 0;
      t.outerR = obj.outerR + d;
      t.startAngle = obj.startAngle + angle * i;
      t.endAngle = obj.startAngle + angle * (i + 1);
      t.center = obj.center;
      t.text = arr[i];
      t.textCoors = setPoint({
        center: obj.center,
        r: (t.innerR + t.outerR) / 2,
        angle: (t.startAngle + t.endAngle) / 2 / 180 * Math.PI
      });
      result.push(t);
    }
    return result;
  }

  var initial = {
    name: '',
    innerR: 0,
    outerR: r,
    center: [0, 0],
    startAngle: 0,
    endAngle: 360
  };

  var s = ['A', 'G', 'T', 'C'];
  // var d = 50;

  var oneC = grow(initial, s, d);
  // console.log(oneC);

  function extendArr(arr) {
    var result = [];
    for (let i = 0; i < arr.length; i++) {
      result = result.concat(grow(arr[i], s, d * 0.8));
    }
    return result;
  }

  var twoC = extendArr(oneC);
// console.log(twoC);
  var threeC = extendArr(twoC);
// console.log(threeC);


  var fourC = [];

  let k = 0;

  let len = threeC.length;
  let d1 = d * 1.2;

  while (k < len) {
    // console.log(k);
    let curr = threeC[k];
    let tmp = {
      name: codon[curr.name],
      center: curr.center,
      innerR: curr.outerR,
      outerR: curr.outerR + d1,
      startAngle: curr.startAngle,
      text: codon[curr.name],
      arr: [curr.name]
    };
    let endAngle = curr.endAngle;
    let j = 1;
    // console.log(tmp.name, codon[threeC[k + j].name]);
    // if (threeC[k + j]) {
    //
    // }

    while (threeC[k + j] && tmp.name === codon[threeC[k + j].name]) {
      tmp.arr.push(threeC[k + j].name);
      endAngle = threeC[k + j].endAngle;
      if (k + j < len) {
        j += 1;
      }
    }
    // console.log(j);
    tmp.endAngle = endAngle;
    tmp.textCoors = setPoint({
      center: tmp.center,
      r: tmp.innerR + d1 / 2,
      angle: (tmp.startAngle + tmp.endAngle) / 2 / 180 * Math.PI
    });

    let ang = (tmp.startAngle + tmp.endAngle) / 2 - 90;

    tmp.textRotation = ang > 90 ? ang - 180 : ang;

    fourC.push(tmp);

    k = k + j;
  }

  // console.log(fourC);

  var tt = [].concat(twoC, threeC);

  var code = '';

  for (let i = 0; i < oneC.length; i++) {
    code += myc.sector({
      center: oneC[i].center,
      radius: oneC[i].outerR,
      startAngle: oneC[i].startAngle,
      angle: oneC[i].endAngle - oneC[i].startAngle,
      fill: colors[oneC[i].name]
    });
    code += `<text x="${oneC[i].textCoors.x}" y="${oneC[i].textCoors.y}" text-anchor="middle" alignment-baseline="middle">${oneC[i].text}</text>`;
  }

  for (let i = 0; i < tt.length; i++) {
    code += myc.annulus({
      center: tt[i].center,
      innerRadius: tt[i].innerR,
      outerRadius: tt[i].outerR,
      startAngle: tt[i].startAngle,
      angle: tt[i].endAngle - tt[i].startAngle,
      fill: colors[tt[i].name.substr(-1)]
    });
    code += `<text x="${tt[i].textCoors.x}" y="${tt[i].textCoors.y}" text-anchor="middle" alignment-baseline="middle">${tt[i].text}</text>`
  }

  for (let i = 0; i < fourC.length; i++) {
    code += myc.annulus({
      center: fourC[i].center,
      innerRadius: fourC[i].innerR,
      outerRadius: fourC[i].outerR,
      startAngle: fourC[i].startAngle,
      angle: fourC[i].endAngle - fourC[i].startAngle,
      fill: colors[fourC[i].name]
    });
    code += `<text x="${fourC[i].textCoors.x}" y="${fourC[i].textCoors.y}" transform="rotate(${fourC[i].textRotation} ${fourC[i].textCoors.x} ${fourC[i].textCoors.y})" text-anchor="middle" alignment-baseline="middle">${fourC[i].text}</text>`
  }

  // console.log(oneC);

  // console.log(twoC);

  // console.log(threeC);

  // console.log(fourC);

  // console.log(code);

  return code;
}

// draw(90, 60);





