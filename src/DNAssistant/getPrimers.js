/**
 * Created by yangm11 on 3/2/2017.
 */

'use strict';

function getPrimers(inputId, outputId) {
  d3.select('#gcOutput').style('display', 'none');
  d3.select('#transformOutput').style('display', 'none');
  d3.select('#primersOutput').style('display', 'block');
  document.getElementById('translateOutput').style.display = 'none';
  document.getElementById(outputId).innerHTML = '';

  var inputSeq = document.getElementById(inputId).value;
  var seq = bioKit.prepSeq(inputSeq);

  for (var k = 0; k < seq.length; k++) {
    if (['A', 'T', 'G', 'C'].indexOf(seq[k]) === -1) {
      alert(`Illegal character ${seq[k]} found in the sequence!`);
      return;
    }
  }

  var sensePr = [];
  var antisensePr = [];
  for (var i = 18; i < 31; i++) {
    sensePr.push({
      length: i + ' bp',
      sequence: seq.slice(0, i),
      GC: gcPercent(seq.slice(0, i))
    });
    antisensePr.push({
      length: i + ' bp',
      sequence: reverse(complementary(seq.slice(-i))),
      GC: gcPercent(complementary(seq.slice(-i)))
    })
  }

  var tableHTML = '<tr><th rowspan="2">Length  </th><th colspan="2">Sense' +
    ' Primers</th> <th colspan="2">Anti-sense' +
    ' Primers</th></tr><tr><th>Sequence (5\' -->' +
    ' 3\')</th><th>GC%</th><th>Sequence (5\' --> 3\')</th><th>GC%</th></tr>';

  for (var j = 0; j < sensePr.length; j++) {
    var row = `<tr><td>${sensePr[j].length}</td><td>${sensePr[j].sequence}</td><td>${sensePr[j].GC}</td><td>${antisensePr[j].sequence}</td><td>${antisensePr[j].GC}</td></tr>`;
    tableHTML += row;
  }

  var hint = document.createElement('h4');
  document.getElementById(outputId).appendChild(hint);
  var tableElement = document.getElementById(outputId).appendChild(document.createElement('TABLE'));
  tableElement.innerHTML =tableHTML;


  function gcPercent(seq) {
    var bases = bioKit.countBase(seq);
    return ((bases['G'] + bases['C'])/seq.length * 100).toFixed(2) + '%';
  }
  function reverse(seq) {
    var result = '';
    for (var i = seq.length - 1; i >= 0; i--) {
      result += seq[i];
    }
    return result;
  }
  function complementary(seq) {
    var dict = {
      A: 'T',
      G: 'C',
      T: 'A',
      C: 'G'
    };
    var result = '';
    for (var i = 0; i < seq.length; i++) {
      result += dict[seq[i]];
    }
    return result;
  }
}